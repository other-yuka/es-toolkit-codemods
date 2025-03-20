import type { CommentKind } from 'ast-types/gen/kinds';
import type { Collection, ImportDeclaration, JSCodeshift, VariableDeclaration } from 'jscodeshift';
import type { ImportMapping, MappingTracker } from '../types';

export function transformLodashToEsToolkit(j: JSCodeshift, root: Collection, transformMapping: MappingTracker) {
  const lodashImports = findLodashImports(j, root);
  const lodashRequires = findLodashRequires(j, root);

  const programBody = root.get().value.program.body;
  const hasRequireStyle = lodashRequires.length > 0;

  const { insertPosition, commentsToPreserve } = determineInsertPositionAndComments(
    programBody,
    lodashImports,
    lodashRequires
  );

  lodashImports.remove();
  lodashRequires.remove();

  const esToolkitImport = createModuleImports(
    j,
    transformMapping.esToolkit,
    'es-toolkit',
    hasRequireStyle,
    commentsToPreserve
  );

  const compatCommentsToUse = esToolkitImport ? [] : commentsToPreserve;
  const esToolkitCompatImport = createModuleImports(
    j,
    transformMapping.esToolkitCompat,
    'es-toolkit/compat',
    hasRequireStyle,
    compatCommentsToUse
  );

  const importsToInsert = [esToolkitImport, esToolkitCompatImport].filter(Boolean);
  if (importsToInsert.length > 0) {
    programBody.splice(insertPosition, 0, ...importsToInsert);
  }
}

function findLodashImports(j: JSCodeshift, root: Collection): Collection {
  return root.find(j.ImportDeclaration, {
    source: {
      value: (val: string) => /^lodash(-es)?(\/|$|\.)/.test(val),
    },
  });
}

function findLodashRequires(j: JSCodeshift, root: Collection): Collection {
  return root.find(j.VariableDeclaration).filter(path => {
    return path.node.declarations.some(decl => {
      if (
        decl.type === 'VariableDeclarator' &&
        decl.init?.type === 'CallExpression' &&
        decl.init.callee.type === 'Identifier' &&
        decl.init.callee.name === 'require'
      ) {
        const args = decl.init.arguments;
        //@ts-ignore
        if (args.length === 1 && (args[0].type === 'StringLiteral' || args[0].type === 'Literal')) {
          const value = String(args[0].value);
          return value === 'lodash' || value.startsWith('lodash.') || value.startsWith('lodash/');
        }
      }
      return false;
    });
  });
}

function determineInsertPositionAndComments(body: any[], lodashImports: Collection, lodashRequires: Collection) {
  let insertPosition = -1;
  let commentsToPreserve: CommentKind[] = [];

  if (lodashImports.length > 0) {
    const firstImportPath = lodashImports.at(0).get();
    insertPosition = body.indexOf(firstImportPath.node);
    commentsToPreserve = extractComments(firstImportPath.node);
  } else if (lodashRequires.length > 0) {
    const firstRequire = lodashRequires.at(0).get();
    insertPosition = body.indexOf(firstRequire.node);
    commentsToPreserve = extractComments(firstRequire.node);
  }

  return { insertPosition, commentsToPreserve };
}

function extractComments(node: { comments?: CommentKind[] }): CommentKind[] {
  return node.comments ? [...node.comments] : [];
}

function createModuleImports(
  j: JSCodeshift,
  mappings: ImportMapping[],
  modulePath: string,
  hasRequireStyle: boolean,
  commentsToPreserve: CommentKind[]
): ImportDeclaration | VariableDeclaration | null {
  if (mappings.length === 0) return null;

  const sortedMappings = sortMappingsByImportName(mappings);
  const node = hasRequireStyle
    ? createRequireDeclaration(j, sortedMappings, modulePath)
    : createImportDeclaration(j, sortedMappings, modulePath);

  if (commentsToPreserve.length > 0) {
    node.comments = convertComments(j, commentsToPreserve);
  }

  return node;
}

function sortMappingsByImportName(mappings: ImportMapping[]): ImportMapping[] {
  return [...mappings].sort((a, b) => a.importName.localeCompare(b.importName));
}

function convertComments(j: JSCodeshift, comments: CommentKind[]): CommentKind[] {
  return comments.map(comment => {
    if (comment.type === 'CommentBlock' || comment.type === 'Block') {
      return j.commentBlock(comment.value, comment.leading ?? false, comment.trailing ?? false);
    }
    return j.commentLine(comment.value, comment.leading ?? false, comment.trailing ?? false);
  });
}

function createImportDeclaration(j: JSCodeshift, mappings: ImportMapping[], source: string) {
  return j.importDeclaration(
    mappings.map(mapping => {
      if (mapping.originalName === mapping.importName) {
        return j.importSpecifier(j.identifier(mapping.originalName));
      }
      return j.importSpecifier(j.identifier(mapping.originalName), j.identifier(mapping.importName));
    }),
    j.literal(source)
  );
}

function createRequireDeclaration(j: JSCodeshift, mappings: ImportMapping[], source: string) {
  return j.variableDeclaration('const', [
    j.variableDeclarator(
      j.objectPattern(
        mappings.map(mapping => {
          const prop = j.objectProperty(j.identifier(mapping.originalName), j.identifier(mapping.importName));
          if (mapping.originalName === mapping.importName) {
            prop.shorthand = true;
          }
          return prop;
        })
      ),
      j.callExpression(j.identifier('require'), [j.literal(source)])
    ),
  ]);
}
