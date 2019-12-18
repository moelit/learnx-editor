<template>
  <EditorLayout :type="type" :type_name="type_name" />
</template>

<script>
    import EditorLayout from "../components/EditorLayout"

    export default {
        name: "news",
        index: 0,
        icon: "mdi-new-box",
        components: {
            EditorLayout,
        },
        data() {
            return {
                type: 0,
                type_name: this.$t('pages.' + this.$route.current.name + '.title')
            }
        }
    }
</script>
