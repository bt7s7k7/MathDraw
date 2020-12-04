import { defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { Diagnostic } from '../Diagnostic'
import { MathJaxAbs } from '../MathJaxAbs'
import { Parser } from '../Parser'
import "./diagrams.scss"

export const Renderer = defineComponent({
    setup(props, ctx) {

        const outputElement = ref<HTMLElement>(null!)

        onMounted(() => {
            watch(() => Parser.output.value, (entities) => {
                const source = [
                    "var root = m => n => Math.pow(n, 1 / m)",
                    `var format = m => { let f = m.toFixed(4); if(f.includes(".0000")) return f.slice(0, f.length - 5); while (f[f.length - 1] == "0" | f[f.length - 1] == ".") { f = f.slice(0, f.length - 2) }; return f; }`,
                    `var format_a = n => {
                        const ret = []
                        let deg = n / Math.PI * 180

                        const [degF, degC] = format(deg).split(".")

                        ret.push(degF + "°")
                    
                        if (degC) {
                            let min = (deg - +degF) * 60
                            let [minF, minC] = format(min).split(".")
                            ret.push(minF + "\\"'\\"")
                    
                            if (minC) {
                                let sec = (min - +minF) * 60
                                let secF = format(sec).split(".")[0]
                                ret.push(secF + "\\"''\\"")
                            }
                        }
                    
                        return ret.join(" ")
                    }`,
                    ...["sin", "cos", "tan", "sqrt"].map(v => `var ${v} = Math.${v}`),
                    ...["sin", "cos", "tan"].map(v => `var arc${v} = Math.a${v}`),
                    "var TO_DEG = Math.PI / 180",
                    "var pi = Math.PI",
                    "var _ = v => v"
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
                    const compiled = new Function("write", "tri90", source.join("\n"))
                    compiled(
                        (text: string) => {
                            currOutput.push(MathJaxAbs.renderAsciiMath(text
                                .replace(/TO_DEG/g, "°")
                                .replace(/arc(.{3})/g, "$1^-1")
                                .replace(/_ \(/g, "(")
                                .replace(/_([^\s]+)/g, "_($1)")
                            ))
                        },
                        (input: Record<string, string>) => {
                            const triangle = document.createElement("div")
                            triangle.classList.add("tri90")

                            for (const className of [
                                "side-a",
                                "side-b",
                                "side-c",
                                "dot",
                                "arc",
                            ]) {
                                const element = document.createElement("div")
                                element.classList.add(className)
                                triangle.appendChild(element)
                            }

                            for (const [pos, text] of Object.entries(input)) {
                                const element = MathJaxAbs.renderAsciiMath(text)
                                element.classList.add(pos)
                                triangle.appendChild(element)
                            }

                            currOutput.push(triangle)
                        }
                    )
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
            <div style={{ "contain": "strict", "overflow-y": "scroll", "flex-grow": "1" }}>
                <div ref={outputElement} class={["p-2"]}></div>
                <b-btn variant="white" onClick={() => ctx.root.$emit('bv::toggle::collapse', 'json-collapse')}>
                    <b-icon-code />
                </b-btn>
                <b-collapse id="json-collapse">
                    <pre>{JSON.stringify(Parser.output.value, null, 2)}</pre>
                </b-collapse>
            </div>
        )
    }
})