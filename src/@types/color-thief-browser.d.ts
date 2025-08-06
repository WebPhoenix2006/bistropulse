declare module 'color-thief-browser' {
  export default class ColorThief {
    getColor(imgEl: HTMLImageElement, quality?: number): number[];
    getPalette(
      imgEl: HTMLImageElement,
      colorCount?: number,
      quality?: number
    ): number[][];
  }
}
