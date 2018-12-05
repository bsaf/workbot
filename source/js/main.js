import Vue from 'vue'
import App from 'components/App'
import VueRouter from 'vue-router'
import ScreenCamera from '../components/ScreenCamera'
import ScreenAlgorithm from '../components/ScreenAlgorithm'
import ScreenBrowser from '../components/ScreenBrowser'
import ScreenCombo from '../components/ScreenCombo'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import globalStyle from 'sass/main'

// -- Firebase --
var VueFire = require('vuefire')
Vue.use(VueFire)

// -- Vue Router --
Vue.use(VueRouter)

const routes = [
  { path: '/', component: ScreenCamera },
  { path: '/algorithm', component: ScreenAlgorithm },
  { path: '/browser', component: ScreenBrowser },
  { path: '/combo', component: ScreenCombo }
]

const router = new VueRouter({
  routes // short for routes: routes
})

// -- Vue components --
Vue.use(VueAwesomeSwiper)

// Event Bus
Object.defineProperty(Vue.prototype, '$bus', {
  get () {
    return this.$root.bus
  }
})

var bus = new Vue({})

// Set up Vue
var vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  data: { bus: bus },
  router: router
})
