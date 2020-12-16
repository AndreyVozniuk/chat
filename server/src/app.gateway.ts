/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { botsData } from './../fake_db/db.bots'
import { users, Message } from './../fake_db/db.users'

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway log')
  private startSpamBot = false 

  @WebSocketServer() wss: Server

  afterInit(server: Server) {
    this.logger.log('Initialization!')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`User connected! Socket id: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User disconnected! Socket id: ${client.id}`)
  }

  @SubscribeMessage('addUserToServerDB')
  handleAddUser(client: Socket, payload: any): void {
    const newUser = {
      id: client.id,
      username: `User ${client.id.substring(0, 4)}`,
      dialogs: [],
      status: 'online'
    }
    
    users.addUser(newUser)
    
    this.wss.emit('setUserID', {id: client.id})
    this.wss.emit('setUsername', {userID: client.id, username: users.searchUserByID(client.id).username})

    this.logger.log('New user added!')
    this.logger.log(`Number of users: ${users.getUsers().length}`)
    this.logger.log(`Users: ${JSON.stringify(users.getUsers())}`)
  }

  @SubscribeMessage('userSendMessage')
  handleUserSendMessage(client: Socket, payload: any): void {
    const {userID, chatMember, messageData} = payload

    const message: Message = {
      text: messageData.message,
      date: messageData.date,
      type: messageData.type
    }

    const isMsgFromBot = Boolean(botsData.find(el => el.id === chatMember.id))
    
    //param of this object is bot id
    const botsActions = {
      '111': (): void => {
        const messageFromBot = {
          text: messageData.message,
          date: new Date().toLocaleString(),
          type: 'get'
        }

        users.addMsgToDialog(userID, chatMember.id, messageFromBot)
        this.wss.emit('addMsgToDialog', { userID, messageData: {chatMemberID: chatMember.id, message: messageFromBot} })
      },

      '222': (): void => {
        const messageFromBot = {
          text: messageData.message.split('').reverse().join(''),
          date: new Date().toLocaleString(),
          type: 'get'
        }

        users.addMsgToDialog(userID, chatMember.id, messageFromBot)
        this.wss.emit('addMsgToDialog', { userID, messageData: {chatMemberID: chatMember.id, message: messageFromBot} })
      },

      '333': ():void => {
        if(!this.startSpamBot){
          const minSpamTime = 10
          const maxSpamTime = 120

          const recursiveTimeout = () => {
            const randTime = minSpamTime - 0.5 + Math.random() * (maxSpamTime - minSpamTime + 1) * 1000
            setTimeout(() => {
              const messageFromBot = {
                text: 'It`s spam my bro, it was a mistake wrote me a message =)',
                date: new Date().toLocaleString(),
                type: 'get'
              }
              users.addMsgToDialog(userID, 333, messageFromBot)
              this.wss.emit('addMsgToDialog', { userID, messageData: {chatMemberID: 333, message: messageFromBot} })
              recursiveTimeout()
            }, randTime)
          }

          recursiveTimeout()

          this.startSpamBot = true
        }
      },

      // it is action for ignore bot because of this function is usless.
      '444': ():any => {
        return
      }
    }

    if( users.checkForNewDialog(userID, chatMember.id) ){
      users.createDialog(userID, chatMember.id, message)
      this.wss.emit('addDialog', { userID, dialogData: {chatMemberID: chatMember.id, messages: [message]} })

      if(isMsgFromBot){
        botsActions[chatMember.id]()
      }else{
        users.createDialog(chatMember.id, userID, {...message, type:'get'})
        this.wss.emit('addDialog', { userID: chatMember.id, dialogData: {chatMemberID: userID, messages: [{...message, type:'get'}]} })
      }

      this.logger.log(`Dialog created!`)
    }else{
      users.addMsgToDialog(userID, chatMember.id, message)
      this.wss.emit('addMsgToDialog', { userID, messageData: {chatMemberID: chatMember.id, message} })

      if(isMsgFromBot){
        botsActions[chatMember.id]()
      }else{
        users.addMsgToDialog(chatMember.id, userID, {...message, type:'get'})
        this.wss.emit('addMsgToDialog', { userID: chatMember.id, messageData: {chatMemberID: userID, message: {...message, type:'get'}} })
      }

      this.logger.log(`message added to dialog!`)
    }
  }

  @SubscribeMessage('loadDataForUser')
  handleLoadDataForUser(client: Socket, payload: any): void {
    const { userID } = payload

    const dialogs = Boolean(users.searchUserByID(userID)) ? users.searchUserByID(userID).dialogs : []
    const username = Boolean(users.searchUserByID(userID)) ? users.searchUserByID(userID).username : ''

    this.wss.emit('setBotsData', JSON.stringify(botsData))
    this.wss.emit('setUsers', users.getUsers())
    this.wss.emit('setDialogs', {userID, dialogs})
    this.wss.emit('setUsername', {userID, username})
  }

  @SubscribeMessage('updateUserStatus')
  handleUpdateUserStatus(client: Socket, payload: any): void {
    users.setUserStatus(payload.userID, payload.status)
    this.wss.emit('updateUserStatus', {id:payload.userID, status: payload.status})
  }
}

