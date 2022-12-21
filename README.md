# ⚡️ ESBuild Runner

## Useage

```bash
esr [file] [args]
```

## Install

### Globally
```bash
npm i -g @nickgraffis/esbuild-runner
```

### Locally
```bash
npm i @nickgraffis/esbuild-runner
```
```json
{
  "scripts": {
    "start": "esr index.ts"
  }
}
```

### NPX
```bash
npx @nickgraffis/esbuild-runner index.ts
```

## Why?

Goal was to replace `ts-node` - noteably, this tool doesn't check types.

## Thanks

- [esbuild](https://esbuild.github.io)
- [esbuild-runner](https://github.com/folke/esbuild-runner)