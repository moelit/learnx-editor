import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib';
import i18n from './plugins/i18n'
import routor from './plugins/routor'
import site from './plugins/site'

const vuetify = new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
});

Vue.use(Vuetify);
Vue.use(routor);
Vue.use(site);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app');
