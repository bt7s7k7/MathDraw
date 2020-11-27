import { ref, watch } from '@vue/composition-api'
import { parseScript, Program } from "esprima"
import { BaseNode } from 'estree'
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
                // @ts-ignore
                attachComment: true,
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
        const parseComment = (entity: Entity, expression: BaseNode) => {
            const comments = expression.trailingComments
            if (comments) {
                for (const comment of comments) {
                    if (comment.loc!.start.line > expression.loc!.end.line) {
                        output.value.push({ text: comment.value })
                    } else {
                        entity.text = entity.text ? entity.text + comment.value : comment.value
                    }
                }
            }
        }

        if (token.type == "ExpressionStatement") {
            if (token.expression.type == "AssignmentExpression") {
                const variable = token.expression.left
                if ("name" in variable) {
                    const entity = EqualityEntity.parse(code.value, variable.name, token.expression.right)
                    output.value.push(entity)
                    parseComment(entity, token)
                } else {
                    throw void 0
                }

            } else {
                diagnostics.value.push(new Diagnostic(token.loc!.start.line, `Cannon parse entity ${token.type}/${token.expression.type}`))
            }
        } else if (token.type == "VariableDeclaration") {
            for (const declaration of token.declarations) {
                if (!("name" in declaration.id)) throw void 0
                const entity = EqualityEntity.parse(code.value, declaration.id.name!, declaration.init!)

                output.value.push(entity)

                parseComment(entity, declaration)

                parseComment(entity, token)
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