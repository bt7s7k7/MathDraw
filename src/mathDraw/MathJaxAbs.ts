declare const MathJax: any

export namespace MathJaxAbs {
    export function renderAsciiMath(source: string) {
        const element: HTMLElement = MathJax.asciimath2chtml(source);
        const style: HTMLStyleElement = MathJax.chtmlStylesheet();

        const out = document.createElement("div")

        out.appendChild(style)
        out.appendChild(element)

        return out
    }
}