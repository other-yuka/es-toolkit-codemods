# es-toolkit-codemods

This repo provides codemods for migrating from lodash to es-toolkit and es-toolkit/compat.

See the README at [lodash-to-es-toolkit/README.md](./packages/lodash-to-es-toolkit/README.md) for details.

## Running

1. Install Codemod: https://docs.codemod.com/deploying-codemods/cli#installation
2. Run `codemod lodash/2/es-toolkit/migrate` on the path you want to modify.

## Publishing

```bash
cd packages/lodash-to-es-toolkit
codemod login
codemod publish
```

## License

This project is licensed under the [MIT License](LICENSE).
