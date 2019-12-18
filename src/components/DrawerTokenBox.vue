<template>
  <v-list>
    <v-list-item :href="site.url" target="_blank">
      <v-list-item-icon>
        <v-icon>{{site.url ? 'mdi-webhook' : ''}}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{site.name}}</v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-file-input v-model="file" :placeholder="$t('token.take_token')"  :prepend-icon="input_icon" @change = "onFile" :loading="loading" accept=".token">
        <template v-slot:selection="{ text }">
          <v-chip v-show="site.url" small label color="primary">{{ text }}</v-chip>
        </template>
      </v-file-input>
    </v-list-item>
  </v-list>
</template>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                input_icon: "mdi-paperclip",
                loading: false,
                file: null,
                site: {
                    name: this.$t('token.unbind'),
                    url: null,
                }
            }
        },
        methods: {
            onFile() {
                if (this.file) {
                    this.loading = true;
                    const reader = new FileReader();
                    reader.readAsText(this.file);

                    reader.onload = () => {

                        const text = reader.result;
                        const password = prompt(this.$t('token.input_password'));
                        const success = this.$token.bind(text, password);

                        if (success) {
                            this.downloadIndex();
                        } else {
                            this.file = null;
                        }
                    }
                } else {
                    this.$token.clear();

                    this.site.name = this.$t('token.bind_failed');
                    this.site.url = null;
                    this.input_icon = "mdi-paperclip";
                    this.loading = false;
                    this.$emit('refresh');
                }
            },

            downloadIndex() {
                const filePath = this.$site.url + "index.json?" + Date.now();

                axios.get(filePath)
                    .then(response => {

                        let posts = [];
                        if (response.data) {
                            posts = response.data.posts;
                        }

                        this.$index.init(this.$site.name, this.$site.language, posts);

                        this.site.name = this.$site.name;
                        this.site.url = this.$site.url;
                        this.input_icon = "mdi-shield-check-outline";
                        this.loading = false;
                        this.$emit('refresh');
                    })
                    .catch(error => {
                        this.file = null;
                        console.error(error)
                    })
            }
        }
    }
</script>
