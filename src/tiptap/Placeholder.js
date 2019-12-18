import { Extension, Plugin } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'

export default class Placeholder extends Extension {

    get name() {
        return 'placeholder'
    }

    get defaultOptions() {
        return {
            nodeClass: 'placeholder',
            nodeText(node, isEmpty){
                if (node.type.name === 'title') {
                    return isEmpty? 'Title: Give me a title  ' : 'Title:  ';
                } else if(node.type.name === 'summary') {
                    return isEmpty? 'summary  here  ': 'summary  ';
                } else if(node.type.name === 'keys') {
                    return isEmpty? 'keys:  like, me  ': 'keys:  ';
                } else if(node.type.tag === 'p') {
                    return isEmpty? 'Write something …  ': '';
                }
                return isEmpty? 'Write something …  ': '';
                //return 'Write something …'
            },
            showOnlyWhenEditable: true,
            showOnlyCurrent: false,
        }
    }

    get update() {
        return view => {
            view.updateState(view.state)
        }
    }

    get plugins() {
        return [
            new Plugin({
                props: {
                    decorations: ({doc, plugins, selection}) => {
                        const editablePlugin = plugins.find(plugin => plugin.key.startsWith('editable$'));
                        const editable = editablePlugin.props.editable();
                        const active = editable || !this.options.showOnlyWhenEditable;
                        const {anchor} = selection;
                        const decorations = [];

                        if (!active) {
                            return false
                        }

                        doc.descendants((node, pos) => {
                            const hasAnchor = anchor >= pos && anchor <= (pos + node.nodeSize);
                            const isEmpty = node.content.size === 0;
                            const text = this.options.nodeText(node, isEmpty);

                            if ((hasAnchor || !this.options.showOnlyCurrent) && text) {
                                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                                        class: this.options.nodeClass,
                                        'data-placeholder': text
                                    }
                                );
                                decorations.push(decoration)
                            }

                            return false
                        });

                        return DecorationSet.create(doc, decorations)
                    },
                },
            }),
        ]
    }

}