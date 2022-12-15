// List of disallowed SVG elements
// Adjusted from https://github.com/cure53/DOMPurify/blob/f6fcdb9f1c13b3559697db0038744a0a327d46ab/src/tags.js#L201
const svgDisallowed = [
  'a',
  'animate',
  'color-profile',
  'cursor',
  'discard',
  'fedropshadow',
  'font-face',
  'font-face-format',
  'font-face-name',
  'font-face-src',
  'font-face-uri',
  'foreignobject',
  'hatch',
  'hatchpath',
  'mesh',
  'meshgradient',
  'meshpatch',
  'meshrow',
  'missing-glyph',
  'script',
  'set',
  'solidcolor',
  'unknown',
  'use'
]

const getWindow = () => (typeof window === 'undefined' ? null : window)
const readAsText = (svg: File | Buffer) =>
  new Promise<string | null>((resolve) => {
    if (!isFile(svg)) {
      resolve(svg.toString('utf-8'))
    } else {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        resolve(fileReader.result as string | null)
      }
      fileReader.readAsText(svg)
    }
  })

const isFile = (obj: File | Buffer): obj is File => {
  return (obj as File).size !== undefined
}

const sanitizeSVG = async (svg: File | Buffer, window = getWindow()) => {
  if (!window) throw new Error('DOM window required')
  if (isFile(svg) && svg.type !== 'image/svg+xml') return svg
  const svgText = await readAsText(svg)
  if (!svgText) throw new Error('Image corrupt')
  const playground = window.document.createElement('template')
  playground.innerHTML = svgText
  const svgEl = playground.content.firstElementChild!
  const attributes = Array.from(svgEl.attributes).map(({ name }) => name)
  const hasScriptAttr = !!attributes.find((attr) => attr.startsWith('on'))
  const disallowedSvgElements = svgEl.querySelectorAll(svgDisallowed.join(','))
  return disallowedSvgElements.length === 0 && !hasScriptAttr ? svg : null
}

export default sanitizeSVG
