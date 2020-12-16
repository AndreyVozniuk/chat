export default {
  SOCKET_addDialog(state, payload) {
    if(localStorage.getItem('UserID') === payload.userID){
      state.dialogs.push(payload.dialogData)
    }
  },
  
  SOCKET_addMsgToDialog(state, payload) {
    const {userID, messageData} = payload

    if(localStorage.getItem('UserID') === userID){
      state.dialogs.find(el => el.chatMemberID === messageData.chatMemberID).messages.push(messageData.message)
    }
  },

  SOCKET_setDialogs(state, payload){
    if(localStorage.getItem('UserID') === payload.userID){
      state.dialogs = payload.dialogs
    }
  }
}