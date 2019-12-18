<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <DrawerTokenBox @refresh="onRefresh"/>
      <v-divider></v-divider>
      <DrawerNavMenu />
    </v-navigation-drawer>

    <v-app-bar  app clipped-left>
      <v-app-bar-nav-icon  @click.stop="drawer = !drawer" />

      <v-img v-if="$vuetify.theme.dark" alt="LearnXLogo" class="shrink" style="cursor: pointer" @click="$route.go('home')"
             src="./assets/logo_dark.png" transition="scale-transition"/>
      <v-img v-else alt="LearnXLogo" class="shrink" style="cursor: pointer" @click="$route.go('home')"
             src="./assets/logo.png" transition="scale-transition"/>

      <v-spacer />
      <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon v-if="!$vuetify.theme.dark">mdi-weather-night</v-icon>
        <v-icon v-else>mdi-weather-sunny</v-icon>
      </v-btn>
      <v-btn icon @click="$route.go('toolkit')">
        <v-icon>mdi-tools</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
        <transition name="fade-transition slide-x-reverse-transition" mode="out-in">
          <app-routor :render="render" />
        </transition>
    </v-content>
  </v-app>
</template>

<script>
    import "./assets/app.css";
    import DrawerTokenBox from "./components/DrawerTokenBox"
    import DrawerNavMenu from "./components/DrawerNavMenu"

    export default {
        name: 'app',
        components : {
            DrawerTokenBox,
            DrawerNavMenu
        },
        data: () => ({
            drawer: null,
            render: true
        }),
        methods: {
            onRefresh() {
                this.render = false;
                this.$nextTick().then(() => {
                    this.render = true;
                });
            },
        },
    }
</script>

<style>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
</style>
