/// <reference types="node" />
declare const getWindow: () => Window | null;
declare const readAsText: (svg: File | Buffer) => Promise<string | null>;
declare const isFile: (obj: File | Buffer) => obj is File;
declare const sanitizeSVG: (svg: File | Buffer, window?: Window | null) => Promise<File | Buffer | null>;
//# sourceMappingURL=sanitizeSVG.d.ts.map