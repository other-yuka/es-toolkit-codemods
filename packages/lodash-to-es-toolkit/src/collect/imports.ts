import type { Collection, JSCodeshift } from 'jscodeshift';
import type { MappingTracker } from '../types';
import { addCompatibleImportIfAvailable, transformLodashMemberExpressions } from '../utils/common';

export function collectImports(j: JSCodeshift, root: Collection, transformMapping: MappingTracker): void {
  const lodashIdentifiers = new Set<string>();

  root
    .find(j.ImportDeclaration, {
      source: {
        value: (val: string) => /^lodash(-es)?(\/|$|\.)/.test(val),
      },
    })
    .forEach(path => {
      const node = path.node;
      const importPath = node.source.value as string;

      if (/^lodash(-es)?$/.test(importPath)) {
        node.specifiers?.forEach(specifier => {
          if (specifier.type === 'ImportDefaultSpecifier' && specifier.local) {
            const identifierName = specifier.local.name;
            lodashIdentifiers.add(identifierName);
          } else if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported?.type === 'Identifier' &&
            specifier.local
          ) {
            const importedName = specifier.imported.name;
            const localName = specifier.local.name;
            addCompatibleImportIfAvailable(importedName, localName, transformMapping);
          }
        });
      } else if (/^lodash(-es)?[/.]/.test(importPath)) {
        const functionName = importPath.replace(/^lodash(-es)?\/|\.js$/g, '');
        const defaultSpecifier = node.specifiers?.find(spec => spec.type === 'ImportDefaultSpecifier');
        if (defaultSpecifier?.local) {
          const localName = defaultSpecifier.local.name;
          addCompatibleImportIfAvailable(functionName, localName, transformMapping);
        }
      }
    });

  if (lodashIdentifiers.size > 0) {
    transformLodashMemberExpressions(j, root, lodashIdentifiers, transformMapping);
  }
}
