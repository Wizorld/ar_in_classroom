# 8th Wall XR Engine (loading & optional self-host)

The AR lab uses the open-sourced 8th Wall XR Engine (image tracking) from
<https://8thwall.org/> / <https://github.com/8thwall/8thwall> (MIT-licensed engine + modules;
the engine binary / SLAM chunk ships under a binary-only license).

## Current setup: CDN (default)

`lab.html` loads the engine from the published npm package via jsDelivr — no files needed here:

```html
<script src="https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js"
        async crossorigin="anonymous" data-preload-chunks="slam"></script>
```

`data-preload-chunks="slam"` (or `await XR8.loadChunk('slam')`) is required for image targets.

## Optional: self-host instead of CDN

To remove the CDN dependency, copy the files from
`node_modules/@8thwall/engine-binary/dist` into this folder and point the script tag here:

```html
<script src="vendor/8thwall/xr.js" async crossorigin="anonymous" data-preload-chunks="slam"></script>
```

Both approaches are zero-build (Constitution Principle I — CDN or committed static assets).

Image targets are activated at runtime via:

```js
XR8.XrController.configure({ imageTargetData: /* processed targets from Assets/ImageTargets/processed */ })
```

and the A-Frame scene receives `xrimagefound` / `xrimageupdated` / `xrimagelost` events, which
`lab.html`'s `image-target` component translates into the existing experiment events.

## Verification

This runtime cannot be exercised until `xr.js` + the SLAM chunk are present and served over
HTTPS. Run the validation in `specs/001-image-tracking-migration/quickstart.md` on a real device
once the files are in place.
