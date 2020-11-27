import { defineComponent } from '@vue/composition-api';

export const App = defineComponent({
    setup(props, ctx) {
        return () => (
            <div class={["vh-100", "d-flex", "vw-100", "flex-row"]}>
                <div class="flex-fill">
                    Editor
                </div>
                <div class="flex-fill">
                    Output
                </div>
            </div>
        )
    }
})