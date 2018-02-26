# cbp-rollup-build

Produces multi-platform npm package using [rollup.js](https://rollupjs.org)

More specifically to produce "module" in package.json which can be consumed by other projects/builds without requiring them to transpile library code.  

```json
{
  "module": "my-cool-lib.esm5.js"
}
```

i.e. my-cool-lib.esm5.js

```javascript
import {CoolExternalModule} from 'cool-external-library';

//es5 compiled/transpiled code for MyCoolModule that does not need further transpilation.

export MyCoolModule;
```
