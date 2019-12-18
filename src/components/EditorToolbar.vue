<template>
  <v-toolbar class="elevation-0">
    <v-toolbar-title class="ml--3">{{emoji[Math.floor(Math.random() * (10000)) % emoji.length]}} {{title}}
    </v-toolbar-title>

    <v-spacer />
    <editor-menu-bar :editor="editor">
      <div>
        <v-tooltip top v-for="(item, i) in menu">
          <template v-slot:activator="{ on }">
            <v-btn text icon small class= "ma-2" v-on="on" :color="focus && item.isActive && item.isActive() ? 'primary' : ''"  @click="item.onClick">
              <v-icon>{{item.icon}}</v-icon>
            </v-btn>
          </template>
          <span>{{$t('editor_menu[' + i  + ']')}}</span>
        </v-tooltip>
      </div>
    </editor-menu-bar>
  </v-toolbar>
</template>

<script>
    import { EditorMenuBar } from 'tiptap'

    export default {
        props : {
            title: String,
            editor: Object,
            focus: Boolean,
        },
        components: {
            EditorMenuBar,
        },
        data() {
            return {
              emoji: ["😀","😁","😄","😊","😋","😝","🙃","😜"],
              menu: [
                  {
                      icon: "mdi-format-bold",
                      isActive: this.editor.isActive.bold,
                      onClick: this.editor.commands.bold
                  },
                  {
                      icon: "mdi-format-italic",
                      isActive: this.editor.isActive.italic,
                      onClick: this.editor.commands.italic
                  },
                  {
                      icon: "mdi-format-strikethrough",
                      isActive: this.editor.isActive.strike,
                      onClick: this.editor.commands.strike
                  },
                  {
                      icon: "mdi-format-underline",
                      isActive: this.editor.isActive.underline,
                      onClick: this.editor.commands.underline
                  },
                  {
                      icon: "mdi-code-tags",
                      isActive: this.editor.isActive.code_block,
                      onClick: this.editor.commands.code_block
                  },
                  {
                      icon: "mdi-format-header-1",
                      isActive: ()=> {return this.editor.isActive.heading({ level: 1 })},
                      onClick: ()=> {return this.editor.commands.heading({ level: 1 })}
                  },
                  {
                      icon: "mdi-format-header-2",
                      isActive: ()=> {return this.editor.isActive.heading({ level: 2 })},
                      onClick: ()=> {return this.editor.commands.heading({ level: 2 })}
                  },
                  {
                      icon: "mdi-format-header-3",
                      isActive: ()=> {return this.editor.isActive.heading({ level: 3 })},
                      onClick: ()=> {return this.editor.commands.heading({ level: 3 })}
                  },
                  {
                      icon: "mdi-format-paragraph",
                      isActive: this.editor.isActive.paragraph,
                      onClick: this.editor.commands.paragraph
                  },
                  {
                      icon: "mdi-format-quote-close",
                      isActive: this.editor.isActive.blockquote,
                      onClick: this.editor.commands.blockquote
                  },
                  {
                      icon: "mdi-format-list-bulleted",
                      isActive: this.editor.isActive.bullet_list,
                      onClick: this.editor.commands.bullet_list
                  },
                  {
                      icon: "mdi-format-list-numbered",
                      isActive: this.editor.isActive.ordered_list,
                      onClick: this.editor.commands.ordered_list
                  },
                  {
                      icon: "mdi-minus",
                      onClick: this.editor.commands.horizontal_rule
                  },
                  {
                      icon: "mdi-undo",
                      onClick: this.editor.commands.undo
                  },
                  {
                      icon: "mdi-redo",
                      onClick: this.editor.commands.redo
                  },
                  // {
                  //     icon: "mdi-link",
                  //     onClick: this.editor.commands.link
                  // },
              ]
            }
        },
    }
</script>
