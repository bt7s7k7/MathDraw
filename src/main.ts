import VueCompositionAPI from '@vue/composition-api'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import Vue from 'vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueCompositionAPI)

declare const mathJaxReady: Promise<void>

// Async import, so stuff gets executed after VueCompositionAPI is setup
import("./mathDraw/App").then(async ({ App }) => {
    await mathJaxReady

    Vue.config.productionTip = false

    new Vue({
        render: h => h(App)
    }).$mount('#app')
})