import { ref, watch } from '@vue/composition-api';

export namespace Parser {
    const LS_KEY = "mathDraw-code"
    export const code = ref(localStorage.getItem(LS_KEY) ?? "")

    watch(() => code.value, () => {
        localStorage.setItem(LS_KEY, code.value)
    })
}