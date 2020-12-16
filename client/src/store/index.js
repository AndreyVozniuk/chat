import Vue from 'vue'
import Vuex from 'vuex'
import members from './modules/members/members'
import dialogs from './modules/dialogs/dialogs' 

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {members, dialogs}
})