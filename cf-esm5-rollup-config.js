/* eslint-disable */
'use strict';

const path = require('path');


const json = require('rollup-plugin-json');
const jst = require('rollup-plugin-jst');
const progress = require('rollup-plugin-progress');
const replace = require('rollup-plugin-replace');
const sourcemaps = require('rollup-plugin-sourcemaps');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const cleanup  = require('rollup-plugin-cleanup');
const filesize = require('rollup-plugin-filesize');

const projectRoot = path.join(__dirname,'../../');
const defaults = {
    root: projectRoot,
    src: path.join(projectRoot, "src"),
    dist: path.join(projectRoot, "dist")
};

const cfESM5Config = function(options) {

    options = options || {};

    const pkg = require(path.join(defaults.root, 'package.json'));


    const externals = _getDependencies(pkg, options);

    return {
        name : pkg.name,
        input: path.join(defaults.src, `${pkg.name}.js`),
        debug: true,
        external: id => matchExternal(id, externals),
        output: {
        file: `${defaults.dist}/${pkg.name}.es5.js`,
            format: 'es',
            sourcemap: true,
    },
    globals: options.globals,
        plugins: [
        sourcemaps(),
        json({
            exclude: [ 'node_modules/**' ]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV || 'production' )
        }),
        jst({
            include: 'src/templates/**'
        }),
        nodeResolve({
            jsnext: true,
            module: true,
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        commonjs({
            namedExports: {}
        }),
        babel({
            babelrc: false,
            comments: true,
            moduleId: options.name,
            presets: [
                ["es2015", {
                    modules: false,
                    loose: true,
                }],
            ],
            exclude: 'node_modules/**',
        }),
        // cleanup({comments: ['all']}),
        progress({clearLine: !options.debug}),
        filesize()
    ]
};
};

function _getDependencies(pkg, options) {
    let deps = [];
    options.excludeExternal = options.excludeExternal || []; //nulls
    const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : [];
    const peerDependencies = pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : [];
    const optionalDependencies = pkg.optionalDependencies ? Object.keys(pkg.optionalDependencies) : [];

    const allDependencies = [].concat(dependencies , peerDependencies , optionalDependencies);

    allDependencies.forEach((dep) => {
        if (!options.excludeExternal.includes(dep)) {
        deps.push(dep);
    }
});

    console.log('Treating external dependencies:\n\t'+JSON.stringify(deps));
    return deps;
}

function matchExternal(id, externals) {
    externals = externals || [];
    // starts-with: if id starts with any of the external
    // e.g. lodash-es/isObject
    const match = externals.find( external => new RegExp(`^${external}/?.*?$`).test(id));
    return match ? true : false;

}


export default cfESM5Config;

