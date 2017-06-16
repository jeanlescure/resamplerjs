# Resampler.js

## A Plugin for resampling audio buffers

[Hosted in Github :octopus:](https://github.com/jeanlescure/resamplerjs)

---

## Bugs?

Submit issues to: [https://github.com/jeanlescure/resamplerjs/issues](https://github.com/jeanlescure/resamplerjs/issues)

## Development

This package can be used both as an ES6 Node.js module and a Browser library.

Node.js imports use the file `src/resampler.js`.

**NOTE:** Currently this package can only be used under Node.js apps compatible with ES6.

Webpack is used to build the browser-compatible `lib/resampler.js` file which is later uglified (using `uglify-js`) into `dist/resampler.min.js`.

### Scripts

The following scripts are defined within `package.json` for ease of development:

```
npm run lint
```

```
npm run build
```

For more info on how these work simply checkout the script definitions within `package.json`.

## TODO

- Add jasmine tests
- Make Node.js module version which is compatible with non ES6 apps.
