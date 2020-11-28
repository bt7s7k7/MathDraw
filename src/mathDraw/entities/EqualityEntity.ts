import { Expression } from "estree"
import { Entity } from './Entity'

export namespace EqualityEntity {

    export function parse(code: string, variable: string, rootExpression: Expression): Entity {
        const ret: string[] = [
            `${variable} =`
        ]

        let retCode: string | undefined = undefined

        const parseExpression = (expression: Expression) => {
            if (expression.type == "BinaryExpression") {
                if (expression.operator == "*" && expression.left.type == "Literal" && expression.right.range![0] == expression.left.range![1] + expression.operator.length + 2 + 1) {
                    parseExpression(expression.left)
                    ret.push("(")
                    parseExpression(expression.right)
                    ret.push(")")
                } else if (expression.operator == "*" && (expression.left.type == "Literal" || expression.left.type == "Identifier") && (expression.right.type == "Identifier" || expression.right.type == "BinaryExpression" && expression.right.operator == "**")) {
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
                const value = expression.raw ?? JSON.stringify(expression.value)
                ret.push(value)
                if (expression == rootExpression) retCode = value
            } else if (expression.type == "CallExpression") {
                if (expression.callee.type != "Super") parseExpression(expression.callee)
                else ret.push(expression.callee.type)
                ret.push("(")
                for (const argument of expression.arguments) {
                    if (argument.type != "SpreadElement") parseExpression(argument)
                    else ret.push(argument.type)
                }
                ret.push(")")

            } else {
                ret.push(JSON.stringify(expression.type))
            }
        }

        parseExpression(rootExpression)

        return {
            text: ret.join(" "),
            ...(retCode ? { code: retCode } : {})
        }
    }
}