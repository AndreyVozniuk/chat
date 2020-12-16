export default {
  SOCKET_setBotsData(state, payload) {
    state.bots = JSON.parse(payload)
  },

  SOCKET_setUserID(state, payload) {
    if(!state.userID || !localStorage.getItem('UserID')){
      localStorage.setItem('UserID', payload.id)
      state.userID = payload.id
    }
  },

  SOCKET_setUsername(state, payload){
    if(!state.username || localStorage.getItem('UserID') === payload.id){
      state.username = payload.username
    }
  },

  SOCKET_setUsers(state, payload) {
    state.users = payload.filter(el => el.id !== state.userID)
  },

  SOCKET_addUser(state, payload){
    state.users.push(payload)
  },

  SOCKET_updateUserStatus(state, payload){
    if(localStorage.getItem('UserID') !== payload.id){
      const user = state.users.filter(el => el.id === payload.id)[0]
      user.status = payload.status
    }
  },

  setDialogMember(state, payload){
    if(payload.type === 'bot'){
      const activeBot = state.bots.filter(el => el.id === payload.id)
      
      state.dialogMember = {...activeBot[0], type: payload.type}
    }

    if(payload.type === 'user'){
      const activeUser = state.users.filter(el => el.id === payload.id)

      state.dialogMember = {...activeUser[0], img: 'user.png', name: activeUser[0].username}
    }
  }
}