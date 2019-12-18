import { Node } from 'tiptap'

export default class Keys extends Node {

    get name() {
        return 'keys'
    }

    get schema() {
        return {
            content: 'inline*',
            parseDOM: [{
                tag: 'blockquote',
            }],
            toDOM: () => ['blockquote', {
                id: "keys",
            },0],
        }
    }
}