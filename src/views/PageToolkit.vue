<template>
  <v-container fluid pa-0>
    <v-row no-gutters>
      <v-col cols="12" lg="6">
        <TokenBuilder />
      </v-col>
      <v-col cols="12" lg="6">

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import TokenBuilder from "../components/ToolkitTokenBuilder"

export default {
    name: "toolkit",
    index: -1,
    components: {
        TokenBuilder,
    }
}
</script>
