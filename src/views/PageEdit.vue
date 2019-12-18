<template>
  <div style=" height: 100%;">
    <v-card v-if="!$site.ready" class="card-message">
      <v-card-title>
        <v-icon class="pa-2">mdi-close-octagon</v-icon>{{$t('error.no_token')}}
      </v-card-title>
    </v-card>

    <EditSelecter v-else-if="!edit_id" />
    <EditorLayout v-else :edit_id="edit_id" />
  </div>
</template>

<script>
    import EditSelecter from "../components/EditSelecter"
    import EditorLayout from "../components/EditorLayout"

    export default {
        name: "edit",
        index: 200,
        icon: "mdi-file-document-edit",
        components: {
            EditSelecter, EditorLayout
        },
        data() {
            return {
                edit_id : this.$route.current.pointer,
            }
        },
    }
</script>
