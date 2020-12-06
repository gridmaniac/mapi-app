import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import term from './modules/term'
import area from './modules/area'
import search from './modules/search'
import service from './modules/service'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    term,
    area,
    search,
    service
  }
})
