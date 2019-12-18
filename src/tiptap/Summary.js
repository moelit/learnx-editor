import { Node } from 'tiptap'

export default class Summary extends Node {

    get name() {
        return 'summary'
    }

    get schema() {
        return {
            content: 'inline*',
            parseDOM: [{
                tag: 'blockquote',
            }],
            toDOM: () => ['blockquote', {
                id: "summary",
            },0],
        }
    }
}