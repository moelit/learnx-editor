<template>
    <v-list>
      <template v-for="p in pages">
        <template v-if="p.index >=0">
        <v-list-item v-if="!p.children" link :class="{'v-list-item--active': p.name === page.name}" @click="$route.go(p.name, 0)">
          <v-list-item-icon>
            <v-icon>{{p.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{$t('pages.'+p.name+'.name')}}</v-list-item-title>
        </v-list-item>
        <v-list-group v-else :prepend-icon="p.icon" value="true">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{$t('pages.'+p.name+'.name')}}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="(c, i) in p.children" link :class="{'v-list-item--active':  p.name === page.name && i+1 === page.pointer }" @click="$route.go(p.name, i+1)">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-title>{{$t('pages.'+p.name+'.children['+i+']')}}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        </template>
      </template>
    </v-list>
</template>

<script>
export default {
    data () {
        return {
            page : this.$route.current,
            pages : null
        }
    },
    created() {
        this.pages = Object.values(this.$route.pages).sort(function (a, b) {
            return a.index - b.index;
        });
    }
}
</script>
