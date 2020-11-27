export class Diagnostic {
    public getText() {
        return `${this.line + 1}: ${this.text}`
    }

    constructor(
        public readonly line: number,
        public readonly text: string
    ) { }
}