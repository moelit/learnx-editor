<template>
  <v-container fluid pa-0>
    <v-row no-gutters v-show="!preview_html">
      <v-col cols="12" lg="6">
        <EditorContainer :edit_id="edit_id" :type="type"  :title="type_name" @preview="onPreview"></EditorContainer>
      </v-col>
      <v-col cols="12" lg="6">
        <EditorAssets :edit_id="edit_id" :type="type" @set-banner="setBanner"></EditorAssets>
      </v-col>
    </v-row>

    <EditorPreview  v-if="preview_html" :edit_id="edit_id" :type="type" :banner="preview_banner" :html="preview_html" @preview="onPreview" />
  </v-container>
</template>

<script>
    import EditorContainer from "../components/EditorContainer"
    import EditorAssets from "../components/EditorAssets"
    import EditorPreview from "../components/EditorPreview"

    export default {
        props: {
            type: Number,
            type_name: String,
            edit_id: Number
        },
        components: {
            EditorContainer, EditorAssets, EditorPreview
        },
        data() {
            return {
                preview_banner: null,
                preview_html: null,
            }
        },
        methods: {
            setBanner(banner) {
                this.preview_banner = banner;
            },

            onPreview(html) {
                this.preview_html = html;
            }
        }
    }
</script>
