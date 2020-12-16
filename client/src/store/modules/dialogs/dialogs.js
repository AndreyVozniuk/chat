import mutations from './mutations'
import getters from './getters'

const state = {
  dialogs: []
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}