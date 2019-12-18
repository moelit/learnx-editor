<template>
  <v-card tile class="card-container" :class="{'card-error':error}">
    <EditorToolbar class="card-toolbar" :title="title" :editor="editor" :focus="focus" />
    <div class="card-main">
    <EditorContent :editor="head_editor" />
    <EditorContent :editor="editor" />
    </div>
    <v-btn :loading="loading" style="position: absolute;right: 12px;bottom: 12px" class="ma-2 white--text accent"
           fab @click="error? load() : $emit('preview', head_editor.getHTML()+editor.getHTML())">{{$t(error? 'btn.retry' : 'btn.preview')}}</v-btn>
  </v-card>
</template>

<script>
    import axios from "axios";
    import localforage from "localforage";
    import debounce from "lodash/debounce"
    import EditorToolbar from '../components/EditorToolbar'
    import { Editor, EditorContent} from 'tiptap'
    import { Blockquote, CodeBlock, Heading, OrderedList, BulletList, ListItem, TodoItem,
        TodoList, Bold, Code, Italic, Link, Strike, Underline, HorizontalRule, Image, HardBreak, History,
    } from 'tiptap-extensions'
    import HeadDoc from '../tiptap/HeadDoc'
    import Title from '../tiptap/Title'
    import Summary from '../tiptap/Summary'
    import Keys from '../tiptap/Keys'
    import Placeholder from '../tiptap/Placeholder'

    export default {
        props: {
            type: Number,
            title: String,
            edit_id: Number
        },
        components: {
            EditorToolbar,
            EditorContent,
        },
        data() {
            const self = this;
            return {
                loading: false,
                error: false,
                focus: false,
                update: 0,
                head_editor: new Editor({
                    extensions: [
                        new HeadDoc(),
                        new Title(),
                        new Summary(),
                        new Keys(),
                        new Placeholder(),
                        new HorizontalRule(),
                    ],
                    onUpdate() {
                        self.update++;
                    },
                }),
                editor: new Editor({
                    extensions: [
                        new Placeholder(),
                        new Blockquote(),
                        new CodeBlock(),
                        new Heading({levels: [1, 2, 3]}),
                        new BulletList(),
                        new OrderedList(),
                        new ListItem(),
                        new TodoItem(),
                        new TodoList(),
                        new Bold(),
                        new Code(),
                        new Italic(),
                        new Link(),
                        new Strike(),
                        new Underline(),
                        new HorizontalRule(),
                        new Image(),
                        new HardBreak(),
                        new History(),
                    ],
                    onFocus() {
                        self.focus = true;
                    },
                    onBlur() {
                        self.focus = false;
                    },
                    onUpdate() {
                        self.update++;
                    },
                }),
            }
        },
        watch: {
            update: function () {
                this.debouncedSave()
            }
        },
        methods: {
            async save(beforeDestroy) {
                if (this.edit_id) return; //暂不支持修改文章的本地缓存
                await localforage.setItem("type_"+ this.type + "_head", this.head_editor.getHTML());
                await localforage.setItem("type_"+ this.type + "_body", this.editor.getHTML());
            },
            async load() {
                if (this.edit_id) {
                    this.loading = true;
                    const filePath = this.$site.url + "post/" + this.edit_id + ".html?" + Date.now();

                    axios.get(filePath)
                        .then(response => {
                            if (response.data) {
                                const hr = response.data.indexOf("<hr>");
                                const head = response.data.substring(0, hr);
                                const body = response.data.substring(hr + 4);
                                this.head_editor.setContent(head);
                                this.editor.setContent(body);
                            }
                            this.loading = false;
                            this.error = false;
                        })
                        .catch(error => {
                                this.error = true;
                                this.head_editor.setContent(this.$t('error.download_file'));
                                this.editor.setContent(this.$t('error.download_file_desc'));
                                this.loading = false;
                            }
                        )
                } else {
                    const head = await localforage.getItem("type_"+ this.type + "_head");
                    const body = await localforage.getItem("type_"+ this.type + "_body");
                    this.head_editor.setContent(head);
                    this.editor.setContent(body);
                }
            }
        },
        created() {
            this.load();
            this.debouncedSave = debounce(this.save, 500)
        },

        beforeDestroy() {
            this.editor.destroy()
        },
    }
</script>