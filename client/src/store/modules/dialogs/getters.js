export default {
  getMsgsByID: state => id => {
    const dialog = state.dialogs.find(el => el.chatMemberID === id)

    return dialog ? dialog.messages : null
  },
}