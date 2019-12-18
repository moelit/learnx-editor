<template>
  <v-card tile class="card-container">

    <v-toolbar class="card-toolbar elevation-0">
      <v-toolbar-title><v-icon class="mr-2 mb-1">mdi-folder-multiple-image</v-icon> {{$t('editor.assets_preview')}}</v-toolbar-title>
      <v-spacer />

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn text small icon class= "ma-2">
            <label for="file-input" v-on="on" style="cursor: pointer;">
              <v-icon>mdi-import</v-icon>
            </label>
            <input id="file-input" style="display: none" type="file" multiple accept="image/*" @change="inputImages($event)"/>
          </v-btn>
        </template>
        <span>{{$t('btn.import_files')}}</span>
      </v-tooltip>

      <v-tooltip v-for="item in btns" top>
        <template v-slot:activator="{ on }">
          <v-btn text small icon class= "ma-2" v-on="on" @click="item.onClick">
            <v-icon>{{item.icon}}</v-icon>
          </v-btn>
        </template>
        <span>{{item.text}}</span>
      </v-tooltip>

    </v-toolbar>
    <div class="card-main editor-assets">
      <v-item-group v-model="selected">
        <v-row no-gutters>
          <v-col v-for="(img, i) in assets" :key="i" cols="12" sm="6" md="4" lg="6" xl="4" style="padding: 1px">
            <v-item v-slot:default="{ active, toggle }">
              <div style="position:relative;" class="grey" @click="changeBanner(active, toggle, img)">
                <v-fade-transition>
                  <div v-if="active" class="overlay">
                    <div>{{$t('editor.i_am_banner')}}</div>
                  </div>
                </v-fade-transition>
                <!--Drag me to Tiptap(ProseMirror) editor-->
                <img :src="img" class="draggable_img"/>
                <v-img :src="img" contain aspect-ratio="1.666666"></v-img>
              </div>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </div>

    <v-snackbar v-model="snackbar" multi-line color="error" top right >
      {{error}}
      <v-btn text icon @click="snackbar = false" >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
    import CryptoJS from 'crypto-js';
    import SHA1 from 'crypto-js/sha1';
    import localforage from "localforage";

    function getImages(imageFiles, site) {
        const promises = imageFiles.map((file) => getImage(file, site)
            .then(image => (image)));
        return Promise.all(promises);
    }

    async function getImage(file, site) {
        const text = await readUploadedFileAsText(file);
        const filename = SHA1(text).toString(CryptoJS.enc.hex);
        const filepath = "post/img/" + filename;
        await site.platform.upload(filepath, file);

        return site.url + filepath;
    }

    const readUploadedFileAsText = (file) => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    };

    export default {
        props: {
            type: Number,
            edit_id: Number
        },
        data() {
            return {
                selected: null,
                snackbar: false,
                error: null,
                localImages: [],
                randomImages: [],
                randomCount: 6,
                btns: [
                    {
                        icon: "mdi-refresh",
                        text: this.$t('btn.random_pics'),
                        onClick: this.changeRandom
                    },
                    {
                        icon: "mdi-trash-can-outline",
                        text: this.$t('btn.clear_all'),
                        onClick: this.clear
                    }
                ]
            }
        },
        computed: {
            assets() {
                return this.randomImages.concat(this.localImages);
            }
        },
        methods: {
            async saveRandoms() {
                if(!this.edit_id) {
                    await localforage.setItem("type_"+ this.type + "_randoms", this.randomImages);
                }
            },
            async saveLocals() {
                if(!this.edit_id) {
                    await localforage.setItem("type_"+ this.type + "_locals", this.localImages);
                }
            },
            async delCaches() {
                if(!this.edit_id) {
                    await localforage.removeItem("type_"+ this.type + "_randoms");
                    await localforage.removeItem("type_"+ this.type + "_locals");
                }
            },
            inputImages(ev) {
                const files = ev.target.files;
                if (!files.length) return;

                const imageFiles = [];

                Array.from(Array(files.length).keys())
                    .map(key => {
                        const file = files[key];
                        if (file.type.startsWith("image/")) {
                            imageFiles.push(file);
                        }
                    });

                if(!this.$site.ready){
                    this.error = this.$t('error.no_token');
                    this.snackbar = true;
                    return;
                }

                getImages(imageFiles, this.$site)
                    .then(images => {
                        this.localImages = this.localImages.concat(images);
                        this.saveLocals();
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            changeRandom() {
                const seed = Math.floor(Math.random() * (1000));
                const list = [];
                for (let i = 0; i < this.randomCount; i++) {
                    list[i] = "https://picsum.photos/seed/" + (seed + i) + "/500/300";
                }

                if(!this.randomImages.length && this.selected != null) {
                    this.selected += this.randomCount;
                }

                this.randomImages = list;
                this.saveRandoms();
            },
            changeBanner(active, toggle, img) {
                if(!active){
                    this.$emit('set-banner', img);
                    toggle();
                }
            },
            clear() {
                this.localImages = [];
                this.randomImages = [];
                this.selected = null;
                this.$emit('set-banner', null);
                this.delCaches();
            }
        },
        async created() {
            if(this.edit_id) {
                const post = this.$index.get(this.edit_id);
                if(post) {
                    this.localImages.push(post.banner);
                    this.selected = 0;
                    this.$emit('set-banner', post.banner);
                }
            } else {

                const randomImages = await localforage.getItem("type_"+ this.type + "_randoms");
                const localImages = await localforage.getItem("type_"+ this.type + "_locals");

                if(randomImages) {
                    this.randomImages = randomImages;
                } else {
                    this.changeRandom();
                }

                if(localImages) {
                    this.localImages = localImages;
                }
            }
        }
    }
</script>

