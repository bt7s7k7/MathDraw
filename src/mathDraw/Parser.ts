import { ref, watch } from '@vue/composition-api'
import { parseScript, Program } from "esprima"
import { Diagnostic } from './Diagnostic'
import { Entity } from './entities/Entity'
import { EqualityEntity } from './entities/EqualityEntity'

export namespace Parser {
    const LS_KEY = "mathDraw-code"
    export const code = ref(localStorage.getItem(LS_KEY) ?? "")
    export const diagnostics = ref<Diagnostic[]>([])
    export const output = ref<Entity[]>([])

    export function parseCode() {
        diagnostics.value = []
        let AST: Program
        try {
            AST = parseScript(code.value, {
                comment: true,
                loc: true,
                range: true
            })
        } catch (err) {
            diagnostics.value.push(new Diagnostic(err.lineNumber, err.description))

            return
        }

        output.value = []
        for (const entity of AST.body) {
            parseEntity(entity)
        }
    }

    export function parseEntity(token: Program["body"][number]) {
        if (token.type == "ExpressionStatement") {
            if (token.expression.type == "AssignmentExpression") {
                const entity = EqualityEntity.parse(code.value, token)
                output.value.push(entity)
            } else {
                diagnostics.value.push(new Diagnostic(token.loc!.start.line, `Cannon parse entity ${token.type}/${token.expression.type}`))
            }
        } else {
            diagnostics.value.push(new Diagnostic(token.loc!.start.line, `Cannon parse entity ${token.type}`))
        }
    }

    watch(() => code.value, () => {
        localStorage.setItem(LS_KEY, code.value)

        parseCode()
    })

    parseCode()
}

Object.assign(window, { Parser })