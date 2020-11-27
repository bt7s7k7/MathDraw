import { Expression } from "estree"
import { Entity } from './Entity'

export namespace EqualityEntity {

    export function parse(code: string, variable: string, expression: Expression): Entity {
        const ret: string[] = [
            `${variable} =`
        ]

        const parseExpression = (expression: Expression) => {
            if (expression.type == "BinaryExpression") {
                if (expression.left.type == "Literal" && expression.right.range![0] == expression.left.range![1] + expression.operator.length + 2 + 1) {
                    parseExpression(expression.left)
                    ret.push("(")
                    parseExpression(expression.right)
                    ret.push(")")
                } else if (expression.left.type == "Literal" && (expression.right.type == "Identifier" || expression.right.type == "BinaryExpression" && expression.right.operator == "**")) {
                    parseExpression(expression.left)
                    parseExpression(expression.right)
                } else {
                    parseExpression(expression.left)

                    if (expression.operator == "**") ret.push("^")
                    else ret.push(expression.operator)

                    parseExpression(expression.right)
                }
            } else if (expression.type == "Identifier") {
                ret.push(expression.name)
            } else if (expression.type == "Literal") {
                ret.push(expression.raw ?? JSON.stringify(expression.value))
            } else {
                ret.push(JSON.stringify(expression.type))
            }
        }

        parseExpression(expression)

        return {
            text: ret.join(" ")
        }
    }
}