<template>
  <EditorLayout :type="type" :type_name="type_name" />
</template>

<script>
    import EditorLayout from "../components/EditorLayout"

    export default {
        name: "class",
        index: 1,
        icon: "mdi-lightbulb-on",
        children: 4,
        components: {
            EditorLayout
        },
        data() {
            return {
                type: this.$route.current.pointer,
                type_name: this.$t('pages.' + this.$route.current.name + '.children[' + (this.$route.current.pointer-1) + ']')
            }
        }
    }
</script>

