import cfESM5Config from './cf-esm5-rollup-config';
let debug = process.env.debug || false;
import common from '../../rollup.config';


const esm5Config = cfESM5Config({
    name: common.name,
    globals: common.globals,
    excludeExternal: ['date-format-lite'],
});

export default esm5Config;
