import { defineComponent } from '@vue/composition-api';
import { Editor } from './components/Editor';
import { Parser } from './Parser';

export const App = defineComponent({
    setup(props, ctx) {
        return () => (
            <div class={["vh-100", "d-flex", "vw-100", "flex-row"]}>
                <div class={["w-50", "d-flex", "flex-column"]}>
                    <Editor />
                </div>
                <div class={["w-50", "d-flex", "flex-column", "border-left"]}>
                    <pre>{Parser.code.value}</pre>
                </div>
            </div>
        )
    }
})