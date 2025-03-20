import type { API, FileInfo } from 'jscodeshift';
import { collectImports, collectRequires, transformLodashToEsToolkit } from './transformers';
import type { MappingTracker } from './types';
import detectLineTerminator from './utils/line-terminator';
import detectQuoteStyle from './utils/quote-style';

/**
 * Transforms lodash imports and usage to es-toolkit equivalents
 * Main transformer function for the codemod
 */
export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const transformMapping: MappingTracker = {
    esToolkit: [],
    esToolkitCompat: [],
  };

  // Detect original code style preferences before making changes
  const quote = detectQuoteStyle(j, root) || 'single';
  const lineTerminator = detectLineTerminator(file.source);

  // Step 1: Collect and process import statements
  collectImports(j, root, transformMapping);
  collectRequires(j, root, transformMapping);

  // Step 2: Apply final transformations and add imports
  transformLodashToEsToolkit(j, root, transformMapping);

  // Generate modified source with original style preserved
  return root.toSource({
    quote: quote,
    lineTerminator: lineTerminator,
  });
}

export const parser = 'tsx';
