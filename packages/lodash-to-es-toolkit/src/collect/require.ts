import type { Collection, JSCodeshift } from 'jscodeshift';
import type { MappingTracker } from '../types';
import { addCompatibleImportIfAvailable, transformLodashMemberExpressions } from '../utils/common';

export function collectRequires(j: JSCodeshift, root: Collection, transformMapping: MappingTracker): void {
  const lodashIdentifiers = new Set<string>();

  root
    .find(j.VariableDeclarator, {
      init: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require',
        },
        arguments: [
          {
            type: (type: string) => type.includes('Literal'),
            value: (val: unknown) => typeof val === 'string' && /^lodash((-es)?$|[./])/.test(val),
          },
        ],
      },
    })
    .forEach(path => {
      const node = path.node;
      const init = node.init as any;
      const requirePath = init.arguments[0].value as string;

      if (/^lodash(-es)?$/.test(requirePath)) {
        if (node.id.type === 'Identifier') {
          const identifierName = node.id.name;
          lodashIdentifiers.add(identifierName);
        } else if (node.id.type === 'ObjectPattern') {
          node.id.properties.forEach(prop => {
            if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier' && prop.value.type === 'Identifier') {
              const importedName = prop.key.name;
              const localName = prop.value.name;
              addCompatibleImportIfAvailable(importedName, localName, transformMapping);
            }
          });
        }
      } else if (/^lodash[./]/.test(requirePath)) {
        if (node.id.type === 'Identifier') {
          const functionName = requirePath.replace(/^lodash\/|^lodash\.|\\.js$/g, '');
          const localName = node.id.name;
          addCompatibleImportIfAvailable(functionName, localName, transformMapping);
        }
      }
    });

  if (lodashIdentifiers.size > 0) {
    transformLodashMemberExpressions(j, root, lodashIdentifiers, transformMapping);
  }
}
