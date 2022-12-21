#!/usr/bin/env node
import { build, BuildResult } from 'esbuild'
import fs from 'fs'
import { Argv } from "yargs";

// lazy import tsconfig.json if it exists
let tsconfig: any = null
try {
  tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
} catch (e) {
  // ignore
}

const runner = (result: BuildResult | null) => {
  if (!result) {
    console.error('No result')
    return
  }

  if (result.errors.length > 0) {
    console.error('Build failed:')
    return
  }
  
  if (!result.outputFiles) {
    console.error('No output files')
    return
  }

  if (result.warnings.length > 0) {
    console.warn(result.warnings)
  }

  const { outputFiles } = result
  const contents = outputFiles.map((file) => file.text).join('/n')
  const fn = new Function('require', 'exports', 'module', contents)
  fn(require, exports, module)
}

const esbuild = (args) => {
  build({
    entryPoints: [args?.entry || process.argv[2]],
    write: args.write,
    bundle: args.bundle,
    platform: args.platform,
    target: args.target,
    minify: args.minify,
    sourcemap: args.sourcemap,
    logLevel: args.logLevel,
    format: args.format,
  }).then((result) => {
    runner(result)
  }).catch((e) => {
    console.error(e)
  })
}

require('yargs')
  .command('$0', "Start the server.", (yargs: Argv) => {
      yargs.option('entry', { type: 'string', alias: 'e' })
      yargs.option('write', { type: 'boolean', alias: 'w', default: false })
      yargs.option('bundle', { type: 'boolean', alias: 'b', default: true })
      yargs.option('platform', { type: 'string', alias: 'p', default: 'node' })
      yargs.option('target', { type: 'string', alias: 't', default: tsconfig?.compilerOptions?.target || 'es2019' })
      yargs.option('minify', { type: 'boolean', alias: 'm', default: true })
      yargs.option('sourcemap', { type: 'boolean', alias: 's', default: false })
      yargs.option('logLevel', { type: 'string', alias: 'l', default: 'error' })
      yargs.option('format', { type: 'string', alias: 'f', default: 'cjs' })
      yargs.option('help', { type: 'boolean', alias: 'h' })
  }, (args: any) => {
    esbuild(args)
  }).argv;