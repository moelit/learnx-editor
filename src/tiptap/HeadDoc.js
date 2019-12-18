import { Doc } from 'tiptap'

export default class CustomDoc extends Doc {

    get schema() {
        return {
            content: 'title summary keys horizontal_rule',
        }
    }

}