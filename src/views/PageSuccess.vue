<template>
  <v-card class="card-message">
    <v-card-title>
      <v-icon class="pa-2">mdi-file-document-box-check-outline</v-icon>{{$t('editor.post_success')}}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
    name: "success",
    index: -1,
}
</script>
