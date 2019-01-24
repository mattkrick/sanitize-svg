# sanitize-svg

a small SVG sanitizer to prevent XSS attacks

## Installation

`yarn add @mattkrick/sanitize-svg`

## Why

Bad actors can put script tags in SVG files.
These script tags are not run when the svg is inside an `<img>`,
but if the SVG file is opened directly ("Open image in...") they will run under the image's domain,
which means that bad actor could steal domain-specific context (cookies, local storage, etc.)

## FAQ

### When should I use this?

Anytime someone tries to upload a svg. 
Optionally on the client, but definitely on the server.

### How do I detect if the SVG is malicious?

The output file will be null

### Why does your package start with @mattkrick? Ego much?

NPM's security model is broken by design & this is marginally safer because it prevents namespace & typo attacks.

## Usage on Client

```js
import sanitizeSVG from '@mattkrick/sanitize-svg'

// file input onSubmit handler
const onSubmit = async (e) => {
  const attachedImage = e.currentTarget.files[0]
  const cleanImage = await sanitizeSVG(attachedImage)
  if (!cleanImage) {
    alert('Howdy, hacker')
  }
}
```

```html
// in JSX
<input type='file' onSubmit={onSubmit}/>
```

## Usage on Server
```js
import JSDOM from 'jsdom'
import sanitizeSVG from '@mattkrick/sanitize-svg'

const {window} = new JSDOM()
const imageName = 'foo.svg'
const imageBuffer = await fetch(imageName).then(r => r.buffer())
// Buffers don't contain type info, so you should check that on your own
if (imageName.endsWith('.svg')) {
  const cleanImage = await sanitizeSVG(imageBuffer, window)  
}

```

## License

MIT
