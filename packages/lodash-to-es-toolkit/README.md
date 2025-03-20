# Lodash to es-toolkit

This codemod automates the migration from Lodash library to es-toolkit package.

- Converts imports from Lodash to their equivalent es-toolkit imports
- Changes package from lodash to es-toolkit and adjusts import statements accordingly
- Supports various import styles:
    - Named imports (e.g. `import { capitalize } from "lodash"`)
    - Namespace imports (e.g. `import * as _ from "lodash"`)
    - Default imports (e.g. `import _ from "lodash"`)
    - CommonJS require statements (e.g. `const { capitalize } = require("lodash")`)
    - Mixed import patterns
- Updates lodash dependencies to es-toolkit in package.json files
- Works with both TypeScript and JavaScript files
- Handles import transformations in JSX/TSX files

### Example

**Before:**
```ts
import { capitalize } from "lodash";
```

**After:**
```ts
import { capitalize } from "es-toolkit";
```
