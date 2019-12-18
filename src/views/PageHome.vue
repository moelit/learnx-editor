<template>
 <v-card class="card-message">
   <v-card-title>
   <v-icon class="pa-2">mdi-home</v-icon>{{$t('message')}}
   </v-card-title>
 </v-card>
</template>

<script>
export default {
    name: "home",
    index: -1,
    icon: "mdi-home",
    props: {
        msg: String
    }
}
</script>
