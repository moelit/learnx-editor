<template>
  <v-card class="mx-auto" tile max-width="400">
    <v-img class="white--text align-end" height="200px"  :src="post.banner">
      <v-card-title style="text-shadow:1px 1px 1px rgba(0,0,0,.6);">
        <div class="title">{{post.title}}</div>
      </v-card-title>
      <v-chip style="position: absolute;right: 8px;top:8px;opacity: .8" color="red" small dark v-show="post.vip">{{$t('editor.vip_only')}}</v-chip>
    </v-img>

    <v-card-text class="pb-0">
      <v-chip-group column>
        <v-chip small v-for="key in post.keys">{{key}}</v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-text class="text--primary" >
      <div class="summary">{{post.summary}}</div>
    </v-card-text>

    <v-card-actions class="pb-3">

      <v-btn color="orange" text @click="$route.go('edit', post.id)">{{$t('btn.edit')}}</v-btn>
      <v-btn color="orange" text @click.stop="dialog = true">{{$t('btn.delete')}}</v-btn>
      <v-spacer/>
      <v-btn color="#ccc" text icon :href="$site.url + post.filepath" target="_blank"><v-icon style="transform: scale(.7)">mdi-target</v-icon></v-btn>
    </v-card-actions>

    <v-dialog v-model="dialog" persistent width="500">
      <v-card>
        <v-card-title class="headline red--text">{{$t('delete.title')}}</v-card-title>
        <br/>
        <v-card-text>{{$t('delete.msg1_start')}} <span class="accent px-2 py-1 white--text v-text-field--rounded">{{post.title}}</span> {{$t('delete.msg1_end')}}</v-card-text>
        <v-card-text v-show="!error">{{$t('delete.msg2_start')}} <span class="warning px-2 py-1 white--text v-text-field--rounded">{{$t('delete.msg2_highlight')}}</span> {{$t('delete.msg2_end')}}</v-card-text>
        <v-card-text v-show="error"><span class="error px-2 py-1 white--text v-text-field--rounded">{{$t('delete.msg_error')}}</span></v-card-text>
        <v-card-text>
        <v-text-field
          v-model="confirm"
          :placeholder="$t('delete.confirm')"
          single-line
          :loading="deleting"
          :disabled = "deleting"
        ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange darken-1" text @click="cancel" :disabled = "deleting">
            {{$t('btn.cancel')}}
          </v-btn>

          <v-btn color="orange darken-1" text @click="del" :disabled = "deleting || confirm!=='DELETE'">
            {{$t('btn.done')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
    props: {
        post: {
            id: Number
        }
    },
    data () {
        return {
            dialog: false,
            confirm: null,
            deleting: false,
            error: false
        }
    },
    methods: {
        cancel() {
            this.dialog = false;
        },

        async del() {
            this.deleting = true;
            try {
                const upload = this.$site.platform.upload;
                const del = this.$site.platform.del;
                await del(this.post.filepath);
                this.$index.del(this.post.id);
                const index = JSON.stringify(this.$site.index);
                await upload("index.json", new Buffer(index));
                this.$emit('refresh');
                this.dialog = false;
            } catch (e) {
                console.error(e);
                this.error = true;
            } finally {
                confirm = null;
                this.deleting = false;
            }
        }
    }
}
</script>

<style scoped>
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-shadow:1px 1px 1px rgba(0,0,0,.6);
  }

  .summary {
    line-height: 20px;
    height: 60px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis
  }


</style>
