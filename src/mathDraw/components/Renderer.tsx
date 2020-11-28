import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import { Diagnostic } from '../Diagnostic';
import { MathJaxAbs } from '../MathJaxAbs';
import { Parser } from '../Parser';

export const Renderer = defineComponent({
    setup(props, ctx) {

        const outputElement = ref<HTMLElement>(null!)

        onMounted(() => {
            watch(() => Parser.output.value, (entities) => {
                const source = [
                    "var root = m => n => Math.pow(n, 1 / m)",
                    `var format = m => { let f = m.toFixed(4); while (f[f.length - 1] == "0" | f[f.length - 1] == ".") { f = f.slice(0, f.length - 2) }; return f; }`
                ]

                for (const entity of entities) {
                    if ("text" in entity) {
                        source.push(`write(${JSON.stringify(entity.text)})`)
                    }
                    if ("code" in entity) {
                        source.push(entity.code!)
                    }
                }

                const currOutput: HTMLElement[] = []
                try {
                    const compiled = new Function("write", source.join("\n"))
                    compiled((text: string) => {
                        currOutput.push(MathJaxAbs.renderAsciiMath(text))
                    })
                } catch (err) {
                    Parser.diagnostics.value.push(new Diagnostic(-1, err.stack))
                    return
                }

                for (const child of [...outputElement.value.childNodes]) {
                    child.remove()
                }

                for (const element of currOutput) {
                    outputElement.value.appendChild(element)
                }
            }, {
                immediate: true
            })
        })

        return () => (
            <div>
                <div ref={outputElement} class={["p-1"]}></div>
                <pre>{JSON.stringify(Parser.output.value, null, 2)}</pre>
            </div>
        )
    }
})