import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import jscodeshift, { type API } from 'jscodeshift';
import { describe, it } from 'vitest';
import transform from '../src/index.js';

function buildApi(parser: string | undefined): API {
  return {
    j: parser ? jscodeshift.withParser(parser) : jscodeshift,
    jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
    stats: () => {
      console.error('The stats function was called, which is not supported on purpose');
    },
    report: () => {
      console.error('The report function was called, which is not supported on purpose');
    },
  };
}

async function readTestFile(filePath: string): Promise<string> {
  return await readFile(join(__dirname, '..', '__testfixtures__', filePath), 'utf-8');
}

async function testTransformation(inputFile: string, outputFile: string | undefined, filePath = 'test.tsx') {
  const INPUT = await readTestFile(inputFile);
  const OUTPUT = outputFile ? await readTestFile(outputFile) : undefined;

  const actualOutput = transform(
    {
      path: filePath,
      source: INPUT,
    },
    buildApi('tsx')
  );

  assert.deepEqual(actualOutput, OUTPUT);
}

describe('es-toolkit-codemods transformations', () => {
  describe('ES6 module import transformations', () => {
    it('should transform default imports correctly', async () => {
      await testTransformation('es6.default-import.input.js', 'es6.default-import.output.js', 'es6.default-import.ts');
    });

    it('should transform named imports correctly', async () => {
      await testTransformation('es6.named-import.input.js', 'es6.named-import.output.js', 'es6.named-import.ts');
    });

    it('should transform individual module imports correctly', async () => {
      await testTransformation(
        'es6.individual-module-import.input.js',
        'es6.individual-module-import.output.js',
        'es6.individual-module-import.ts'
      );
    });

    it('should handle mixed import styles properly', async () => {
      await testTransformation('es6.mixed-import.input.js', 'es6.mixed-import.output.ts', 'es6.mixed-import.ts');
    });

    it('should preserve code structure and comments during transformation', async () => {
      await testTransformation(
        'es6.structure-and-comments.input.js',
        'es6.structure-and-comments.output.js',
        'es6.structure-and-comments.ts'
      );
    });

    it('should handle aliases across multiple files correctly', async () => {
      await testTransformation('es6.alias-usage.input.js', 'es6.alias-usage.output.js', 'es6.alias-usage.output.ts');
    });

    it('should transform nested method calls properly', async () => {
      await testTransformation(
        'es6.nested-method-calls.input.js',
        'es6.nested-method-calls.output.js',
        'es6.nested-method-calls.ts'
      );
    });
  });

  describe('CommonJS require transformations', () => {
    it('should transform require calls to imports correctly', async () => {
      await testTransformation('require.default.input.js', 'require.default.output.js', 'require.default.ts');
    });

    it('should transform require destructuring assignments correctly', async () => {
      await testTransformation(
        'require.destructuring-assignment.input.js',
        'require.destructuring-assignment.output.js',
        'require.destructuring-assignment.ts'
      );
    });

    it('should transform individual module requires correctly', async () => {
      await testTransformation(
        'require.individual-module.input.js',
        'require.individual-module.output.js',
        'require.individual-module-require.ts'
      );
    });
  });

  describe('JSX and TSX transformations', () => {
    it('should handle lodash transformations in JSX correctly', async () => {
      await testTransformation('jsx.default.input.jsx', 'jsx.default.output.jsx', 'jsx.default.tsx');
    });

    it('should handle lodash transformations in TypeScript and TSX environments', async () => {
      await testTransformation('tsx.default.input.tsx', 'tsx.default.output.tsx', 'tsx.default.tsx');
    });

    it('should handle lodash with custom hooks in JSX properly', async () => {
      await testTransformation('jsx.custom-hook.input.jsx', 'jsx.custom-hook.output.jsx', 'jsx.custom-hook.tsx');
    });
  });
});
