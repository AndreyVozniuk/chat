/* eslint-disable prettier/prettier */
export type Message = {
  text: string,
  date: string,
  type: string
}

type Dialog = {
  chatMemberID: string | number,
  messages: Array<Message>
}

type User = {
  id: string,
  username: string,
  dialogs: Array<Dialog>,
  status: string
}

class Users {
  private users: Array<User> = []

  getUsers(): Array<User> {
    return this.users
  }

  addUser(user: User): void {
    this.users.push(user)
  }

  searchUserByID(id: string): User{
    return this.users.find(el => el.id === id)
  }

  setUserStatus(id:string, newStatus:string): void {
    if(this.users.length !== 0){
      this.searchUserByID(id).status = newStatus
    }
  }

  createDialog(userID:string, chatMemberID: string | number, message: Message): void {
    const newDialog: Dialog = {chatMemberID, messages: [message]}

    this.searchUserByID(userID).dialogs.push(newDialog)
  }

  checkForNewDialog(userID:string, chatMemberID: string | number): boolean {
    const user : User = this.searchUserByID(userID)
    
    return !Boolean(user.dialogs.find(el => el.chatMemberID === chatMemberID))
  }

  searchDialog(userID:string, chatMemberID: string | number): Dialog {
    return this.searchUserByID(userID).dialogs.find(el => el.chatMemberID === chatMemberID)
  }

  addMsgToDialog(userID:string, chatMemberID: string | number, message: Message): void {
    this.searchDialog(userID, chatMemberID).messages.push(message)
  }
}

export const users = new Users()
