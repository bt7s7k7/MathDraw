import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import { Diagnostic } from '../Diagnostic';
import { MathJaxAbs } from '../MathJaxAbs';
import { Parser } from '../Parser';

export const Renderer = defineComponent({
    setup(props, ctx) {

        const outputElement = ref<HTMLElement>(null!)

        onMounted(() => {
            watch(() => Parser.output.value, (entities) => {
                const source = []

                for (const entity of entities) {
                    if ("text" in entity) {
                        source.push(`write(${JSON.stringify(entity.text)})`)
                    }
                    if ("code" in entity) {
                        source.push(`code`)
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