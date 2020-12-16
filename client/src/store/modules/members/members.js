import mutations from './mutations'
import getters from './getters'

const state = {
  username: null,
  userID: localStorage.getItem('UserID'),
  bots: [],
  users: [],
  dialogMember: null
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}