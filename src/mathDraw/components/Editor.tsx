import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { fromTextArea } from "codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/javascript/javascript"
import { Parser } from '../Parser'

export const Editor = defineComponent({
    name: "Editor",
    setup(props, ctx) {
        const editorTextArea = ref<HTMLTextAreaElement>(null!)

        onMounted(() => {
            const editor = fromTextArea(editorTextArea.value, {
                lineNumbers: true,
                indentWithTabs: true,
                mode: "javascript",
                lint: {}
            })
            editor.setValue(Parser.code.value)
            editor.getWrapperElement().classList.add("h-100")
            editor.on("change", () => {
                Parser.code.value = editor.getValue()
            })
        })


        return () => (
            <div class={["flex-fill", "d-flex", "flex-column"]}>
                <div class={["flex-fill"]} style={{ "contain": "strict" }}>
                    <textarea ref={editorTextArea}></textarea>
                </div>
                <div class={["border-top"]} style={{ "flex-basis": "200px", "max-height": "200px", "overflow-y": "scroll" }}>
                    {Parser.diagnostics.value.map((v, i) => (
                        <pre class={["border-bottom", "border-danger", "text-monospace", "p-1", "bg-danger", "text-white", "d-block", "m-0"]}>{v.getText()}</pre>
                    ))}
                </div>
            </div>
        )
    }
})