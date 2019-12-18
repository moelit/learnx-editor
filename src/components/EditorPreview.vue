<template>
  <v-row no-gutters>
    <v-col cols="12" lg="6">

      <v-card tile class="card-container">
        <v-toolbar class="card-toolbar elevation-0">
          <v-toolbar-title>👀 {{$t('editor.preview')}}</v-toolbar-title>
        </v-toolbar>

        <div class="card-main">
          <div class="ProseMirror" v-html="html"></div>
        </div>

        <v-btn style="position: absolute;right: 12px;bottom: 12px" class="ma-2 white--text grey" fab @click="$emit('preview', null)">{{$t('btn.back')}}</v-btn>
      </v-card>
    </v-col>
    <v-col cols="12" lg="6">

      <v-card class="float-left" style="margin: 16px;" width="350px" tile>

        <div style="position:relative;" class="grey">
          <v-img class="white--text align-end" height="210px" v-if="banner" :src="banner" contain>
            <v-card-title style="text-shadow:1px 1px 1px rgba(0,0,0,.6);">{{title}}</v-card-title>
            <v-checkbox style="position: absolute;top:-8px;right:12px;text-shadow:1px 1px 1px rgba(0,0,0,.6);"
              v-model="vip" dark
              color="orange lighten-2"
              :label="$t(vip ? 'editor.vip_only' : 'editor.public')"
            ></v-checkbox>
          </v-img>
        </div>

        <v-card-text v-show="keys" class="pb-0">
          <v-chip-group column>
            <v-chip small v-for="k in keys">{{k}}</v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-text v-show="summary" class="text--primary" style="font-size: 16px;padding:18px!important;">
          <blockquote>{{summary}}</blockquote>
        </v-card-text>

        <v-card-text v-if="errors" style="font-size: 16px;color: red;padding-top: 20px">
          <ul>
            <li v-for="e in errors" class="pb-1" :key="e">{{e}}</li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-btn v-show="!errors" :loading="uploading" :disabled="uploading" color="orange darken-1" class="ma-2 white--text"
            @click="uploader = 'uploading'" text  style="font-size: 16px">
            <v-icon right dark class="ml-0 mr-3">mdi-send</v-icon>{{$t('editor.check_and_upload')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
    import localforage from "localforage";
    export default {
        props: {
            banner: String,
            html: String,
            type: Number,
            edit_id: Number
        },
        data() {
            return {
                title: null,
                summary: null,
                keys: null,
                vip: false,
                errors: null,
                uploader: null,
                uploading: false,
            }
        },
        watch: {
            async uploader() {
                const l = this.uploader;
                this[l] = !this[l];

                try {
                    await this.upload();
                    this.$route.go("success");
                } catch (e) {
                    setTimeout(() => (this.errors = [this.$t("error.upload_exception")]), 800);
                }
            },
        },
        created() {
            if (this.edit_id) {
                const post = this.$index.get(this.edit_id);
                if (post && post.vip) {
                    this.vip = true;
                }
            }
            this.$nextTick(() => {
                this.title = document.getElementById("title").innerText;
                this.summary = document.getElementById("summary").innerText;

                const keys = document.getElementById("keys").innerText.trim().replace(/，/g, ",").split(',');
                const keys_obj = {};
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i].trim();
                    if (k) keys_obj[k] = "";
                }
                this.keys = Object.keys(keys_obj);
                if (this.keys.length === 0) this.keys = null;

                this.errors = [];
                if (!this.banner) this.errors.push(this.$t("error.no_banner"));
                if (!this.title) this.errors.push(this.$t("error.no_title"));
                if (!this.summary) this.errors.push(this.$t("error.no_summary"));
                if (!this.keys) this.errors.push(this.$t("error.no_keys"));
                if (!this.$site.ready) this.errors.push(this.$t("error.no_token"));

                if (this.errors.length === 0) this.errors = null;
            })
        },
        methods: {
            async upload() {
                const id = this.edit_id ? this.edit_id : Date.now();
                const upload = this.$site.platform.upload;
                await upload("post/" + id + ".html", new Buffer(this.html), this.vip);

                if (this.edit_id) {
                    this.$index.update(id, this.banner, this.title, this.summary, this.keys, this.vip);
                } else {
                    this.$index.add(id, this.type, this.banner, this.title, this.summary, this.keys, this.vip);
                }

                const index = JSON.stringify(this.$site.index);
                await upload("index.json", new Buffer(index));

                if(!this.edit_id) {
                    await localforage.removeItem("type_"+ this.type + "_head");
                    await localforage.removeItem("type_"+ this.type + "_body");
                    await localforage.removeItem("type_"+ this.type + "_randoms");
                    await localforage.removeItem("type_"+ this.type + "_locals");
                }
            }
        }
    }

</script>