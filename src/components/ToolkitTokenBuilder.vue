<template>

  <v-card tile class="card-container">
    <v-toolbar class="card-toolbar elevation-0">
      <v-toolbar-title class="ml-3">🌞 {{$t('token.builder.title')}}
      </v-toolbar-title>
    </v-toolbar>

    <v-form v-show="!cipherToken" ref="form"  v-model="valid">

      <v-row class="pl-8 pr-8 pb-2">

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="site.name"
            :rules="[v => !!v || '']"
            :label="$t('token.builder.name')"
            :hint="$t('token.builder.name_hint')"
            autocomplete="off"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="site.url"
            :rules="[v => !!v || '']"
            :label="$t('token.builder.url')"
            :hint="$t('token.builder.url_hint')"
            persistent-hint
            autocomplete="off"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-autocomplete
            ref="site.language"
            v-model="site.language"
            :rules="[v => !!v || '']"
            :items="languages"
            :label="$t('token.builder.language')"
            :placeholder="$t('token.builder.language_hint')"
            required
            autocomplete="off"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6">
          <v-autocomplete
            ref="platform.name"
            v-model="platform.name"
            :rules="[v => !!v || '']"
            :items="platform.list"
            :label="$t('token.builder.platform')"
            :placeholder="$t('token.builder.platform_hint')"
            required
            autocomplete="off"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <template v-if="platform.name">
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title class="ml-3">{{$t('token.builder.'+platform.name+'.name')}}</v-toolbar-title>
          <v-spacer />
          <v-btn icon target="_blank" draggable="false" :href="platform.help">
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row class="pl-8 pr-8 pb-2">

          <template v-for="(value, name) in platform.require">

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="platform.require[name]"
                :rules="[v => !!v || '']"
                :label="$t('token.builder.'+platform.name+'.' + name)"
                autocomplete="off"
              ></v-text-field>
            </v-col>

          </template>
        </v-row>
      </template>

      <v-toolbar flat color="primary" dark>
        <v-toolbar-title class="ml-3">{{$t('token.builder.ready')}}</v-toolbar-title>
      </v-toolbar>
      <v-row class="pl-8 pr-8 pb-6">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="password"
            :rules="[v => !!v || '']"
            :label="$t('token.builder.password')"
            :hint="$t('token.builder.password_hint')"
            autocomplete="off"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-btn text color="primary" class="mr-4" @click="done">{{$t('btn.done')}}</v-btn>
          <v-btn text @click="reset">{{$t('btn.reset')}}</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <div v-show="cipherToken" class="pb-6">
      <v-toolbar flat color="success" dark>
        <v-toolbar-title class="ml-3">{{$t('token.builder.save')}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6" style="font-size: 16px">
        {{cipherToken}}
      </v-card-text>

      <v-btn text color="success" class="mr-3 ml-3" @click="download">{{$t('btn.download')}}</v-btn>
      <v-btn text @click="reset">{{$t('btn.clear')}}</v-btn>
    </div>

  </v-card>

</template>

<script>
    export default {
        data: () => ({
                valid: true,
                site: {
                    name:"",
                    url:"",
                    language:"",
                },
                platform: {
                    name: "",
                    list : [],
                    help: "",
                    require: {}
                },
                languages : ["中文简体", "English"],
                password:"",
                cipherToken: ""
            }
        ),
        created() {
            this.platform.list = Object.keys(this.$token.platforms);
            this.platform.name = this.platform.list[0];
            this.platform.help = this.$token.platforms[this.platform.name].help;
        },

        watch: {
            "platform.name": {
                handler(val, oldVal) {
                    if(!val) return;

                    this.platform.require = {};
                    Object.getOwnPropertyNames(this.$token.platforms[val].require).forEach((name) => {
                        this.platform.require[name] = "";
                    });
                }
            }
        },

        methods: {
            done () {
                if (this.$refs.form.validate()) {
                    this.cipherToken = this.$token.build(this.site.name, this.site.url, this.site.language,
                        this.platform.name, this.platform.require, this.password);
                }
            },
            reset () {
                this.cipherToken = "";
                this.$refs.form.reset();
            },
            download() {
                const el = document.createElement('a');
                el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.cipherToken));
                el.setAttribute("download", this.site.name + ".token");

                el.style.display = 'none';
                document.body.appendChild(el);
                el.click();
                document.body.removeChild(el);
            }
        }
    }
</script>

