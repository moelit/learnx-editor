<template>
  <v-row no-gutters>
    <v-col v-show="posts.length > 0" cols="12" lg="6" style="padding: 4px">
      <v-row class="d-flex flex-wrap align-start justify-start pa-3 pr-0 pt-0 ma-0" color="grey lighten-2">
        <v-col class="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-4 pa-0 pr-3 pt-3"
               v-for="post in posts" :key="post.id">
          <EditPostCard :post="post" @refresh="onRefresh"/>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-show="posts.length === 0" cols="12" lg="6" style="padding: 4px">
    <v-card class="card-message">
      <v-card-title>
        <v-icon class="pa-2">mdi-emoticon-cry-outline</v-icon>{{$t('selecter.result_empty')}}
      </v-card-title>
    </v-card>
    </v-col>

    <v-col cols="12" lg="6" style="padding: 16px">
      <v-card tile>
        <v-card-title class="headline font-weight-regular blue-grey white--text">{{$site.name}}</v-card-title>

        <v-card-text>
          <v-row class="ma-6 mb-2">
            <v-switch v-model="types" class="ml-3" value="0" :label="$t('selecter.types[0]')"></v-switch>
            <v-switch v-model="types" class="ml-6" value="1" :label="$t('selecter.types[1]')"></v-switch>
            <v-switch v-model="types" class="ml-6" value="2" :label="$t('selecter.types[2]')"></v-switch>
            <v-switch v-model="types" class="ml-6" value="3" :label="$t('selecter.types[3]')"></v-switch>
            <v-switch v-model="types" class="ml-6" value="4" :label="$t('selecter.types[4]')"></v-switch>
          </v-row>

          <v-autocomplete class="ml-2 mr-6 mb-6"
            v-model="searchText"
            :items="searchItems"
            :loading="isLoading"
            :search-input.sync="search"
            :label="$t('selecter.search_hint')"
            :placeholder="$t('selecter.search_placeholder')"
            prepend-icon="mdi-magnify"
            hide-selected
            chips
            clearable
            hide-details
            item-text="text"
            item-value="text"
            autocomplete="off">
            <template v-slot:selection="{ attr, on, item, selected }">
                <span v-text="item.text" class="mr-1"></span>
                <v-chip color="accent" small dark v-show="item.type === 'title' || item.type === 'both'">{{$t('selecter.chip_title')}}</v-chip>
                <v-chip color="accent" small dark v-show="item.type === 'keyword' || item.type === 'both'">{{$t('selecter.chip_keyword')}}</v-chip>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-avatar color="accent" class="headline font-weight-light white--text">
                {{ item.text.charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-show="item.type === 'title' || item.type === 'both'">
                <v-chip color="accent" small dark>{{$t('selecter.chip_title')}}</v-chip>
              </v-list-item-action>
              <v-list-item-action v-show="item.type === 'keyword' || item.type === 'both'">
                <v-chip color="accent" small dark>{{$t('selecter.chip_keyword')}}</v-chip>
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
    import EditPostCard from "../components/EditPostCard"

    export default {
        components: {
            EditPostCard
        },
        data() {
            return {
                refreshSwitch : true,
                types: [],
                isLoading: false,
                search: null,
                searchText: null,
                searchItems: []
            }
        },
        computed: {
            posts() {
                const allTypes = this.refreshSwitch && this.types.length === 0;
                const list = [];

                for (let post of Object.values(this.$site.index.posts)) {

                    if (!allTypes && !this.types.includes(post.type + '')) continue;
                    if (this.searchText && this.searchText !== post.title
                        && !post.keys.includes(this.searchText)) continue;

                    post.filepath = "post/" + post.id + ".html";
                    post.date = '';
                    list.push(post);
                }

                return list;
            }
        },
        methods: {
            onRefresh() {
                this.refreshSwitch = false;
                this.$nextTick().then(() => {
                    this.refreshSwitch = true;
                });
            },
        },
        watch: {
            search(val) {
                if (this.searchItems.length > 0 || this.isLoading) return;
                this.isLoading = true;

                const items = {};

                for (let post of Object.values(this.posts)) {

                    const title = post.title;
                    if(items[title]) {
                        if(items[title].type === 'keyword')
                            items[title].type = 'both';
                    } else {
                        items[title] = ({text: title, type: 'title'});
                    }

                    for (let keyword of Object.values(post.keys)) {
                        if(items[keyword]) {
                            if(items[keyword].type === 'title')
                                items[keyword].type = 'both';
                        } else {
                            items[keyword] = ({text: keyword, type: 'keyword'});
                        }
                    }
                }

                this.searchItems = Object.values(items);
                setTimeout(() => (this.isLoading = false), 800);
            },
        }
    }
</script>
