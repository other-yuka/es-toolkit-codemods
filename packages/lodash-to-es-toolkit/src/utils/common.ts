import type { Collection, JSCodeshift } from 'jscodeshift';
import { compatibilityMap } from '../constant/es-toolkit.mapping';
import type { ImportMapping, MappingTracker } from '../types';

export function tryAddCompatibleImport(
  originalName: string,
  localName: string,
  transformMapping: MappingTracker
): boolean {
  const compatInfo = getCompatibleImport(originalName);
  if (compatInfo) {
    const mapping: ImportMapping = {
      originalName,
      importName: localName,
    };

    registerImportMapping(transformMapping, mapping, compatInfo.module);
    return true;
  }

  transformMapping.failed.push(originalName);
  return false;
}

export function registerImportMapping(
  transformMapping: MappingTracker,
  mapping: ImportMapping,
  moduleType: string
): void {
  if (moduleType === 'es-toolkit') {
    if (!transformMapping.esToolkit.some(m => m.importName === mapping.importName)) {
      transformMapping.esToolkit.push(mapping);
    }
  } else {
    if (!transformMapping.esToolkitCompat.some(m => m.importName === mapping.importName)) {
      transformMapping.esToolkitCompat.push(mapping);
    }
  }
}

export function getCompatibleImport(functionName: string): { module: string; name: string } | null {
  const mapping = compatibilityMap[functionName];
  if (!mapping) return null;
  return mapping;
}

export function transformLodashMemberExpressions(
  j: JSCodeshift,
  root: Collection,
  lodashIdentifiers: Set<string>,
  transformMapping: MappingTracker
): void {
  root.find(j.MemberExpression).forEach(path => {
    const { node } = path;
    if (node.object.type === 'Identifier' && lodashIdentifiers.has(node.object.name)) {
      if (node.property.type === 'Identifier') {
        const functionName = node.property.name;

        if (tryAddCompatibleImport(functionName, functionName, transformMapping)) {
          j(path).replaceWith(j.identifier(functionName));
        }
      }
    }
  });
}
