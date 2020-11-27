import { ExpressionStatement } from "estree"
import { Entity } from './Entity'

export namespace EqualityEntity {
    export function parse(code: string, statement: ExpressionStatement): Entity {
        return {
            text: code.slice(statement.range![0], statement.range![1]).replace(/\*\*/g, "^")
        }
    }
}