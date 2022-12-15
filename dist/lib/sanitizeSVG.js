"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    'use',
];
const getWindow = () => (typeof window === 'undefined' ? null : window);
const readAsText = (svg) => new Promise((resolve) => {
    if (!isFile(svg)) {
        resolve(svg.toString('utf-8'));
    }
    else {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.readAsText(svg);
    }
});
const isFile = (obj) => {
    return obj.size !== undefined;
};
const sanitizeSVG = async (svg, window = getWindow()) => {
    if (!window)
        throw new Error('DOM window required');
    if (isFile(svg) && svg.type !== 'image/svg+xml')
        return svg;
    const svgText = await readAsText(svg);
    if (!svgText)
        throw new Error('Image corrupt');
    const playground = window.document.createElement('template');
    playground.innerHTML = svgText;
    const svgEl = playground.content.firstElementChild;
    const attributes = Array.from(svgEl.attributes).map(({ name }) => name);
    const hasScriptAttr = !!attributes.find((attr) => attr.startsWith('on'));
    const disallowedSvgElements = svgEl.querySelectorAll(svgDisallowed.join(','));
    return disallowedSvgElements.length === 0 && !hasScriptAttr ? svg : null;
};
exports.default = sanitizeSVG;
//# sourceMappingURL=sanitizeSVG.js.map