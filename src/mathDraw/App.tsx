import { defineComponent } from '@vue/composition-api';
import { Editor } from './components/Editor';
import { Renderer } from './components/Renderer';

export const App = defineComponent({
    name: "App",
    setup(props, ctx) {
        return () => (
            <div class={["vh-100", "d-flex", "vw-100", "flex-row"]}>
                <div class={["w-50", "d-flex", "flex-column"]}>
                    <Editor />
                </div>
                <div class={["w-50", "d-flex", "flex-column", "border-left"]}>
                    <Renderer />
                </div>
            </div>
        )
    }
})