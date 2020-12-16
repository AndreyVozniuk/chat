<template>
  <div class='chatting'>
    <div class='info' v-show='!dialogMember'>Select any chat member to start chating!</div>

    <div class='header' v-show='dialogMember'>
      <div class='image'>
        <img :src='imgLink' alt='user avatar'/>
      </div>
      <div class='description'>
        <div class='title'>{{dialogMember && dialogMember.name}}</div>
        <div class='subtitle'>{{dialogMember && dialogMember.description || 'User description....'}}</div>
      </div>
    </div>
    
    <div class='messages' v-show='dialogMember'>
      <Message v-for='(message, index) in messages' :key='message + index' 
      :name='message.type === "get" ? dialogMember.name : username'
      :date='message.date' 
      :text='message.text'
      :type='message.type'
      />
    </div>

    <form class='sending' v-show='dialogMember' @submit.prevent='sendMessage'>
      <input type='text' v-model='message' placeholder='start chating!'>
      <button type='submit'>Send message</button>
    </form>
  </div>
</template>

<script>
import Message from './Message.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Chatting',
  components: {Message},
  data() {
    return {
      message: ''
    }
  },

  methods: {
    sendMessage() {
      if(this.message){
        this.$socket.emit('userSendMessage', {
          userID: this.userID, 
          chatMember: {id: this.dialogMember.id, type: this.dialogMember.type}, 
          messageData: {message: this.message, date: new Date().toLocaleString(), type: 'send'}
        })

        this.message = ''
      }else{
        alert('Your message is empty, please input something ;)')
      }
    }
  },
  computed: {
    ...mapGetters({
      getDialogMember: 'members/getDialogMember', 
      getUserID: 'members/getUserID', 
      getMsgsByID: 'dialogs/getMsgsByID',
      getUsername: 'members/getUsername'
    }),

    dialogMember(){
      return this.getDialogMember
    },

    userID() {
      return this.getUserID
    },

    username() {
      return this.getUsername
    },

    imgLink(){
      return this.dialogMember ? require(`../../assets/img/${this.dialogMember.img}`) : null
    },

    messages() {
      return this.dialogMember ? this.getMsgsByID(this.dialogMember.id) : null
    }
  }
}
</script>

<style lang='scss' scoped>
.chatting{
  width: 75%;
  height: 100%;
  background-color: #d7dfe7;
}

.header{
  display: flex;
  height: 25%;
  width: 100%;
}

.image{
  // background-image: url(../assets/img/patrick_big.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 20%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
  }
}

.description{
  background-color: #BECBD9;
  width: 80%;
  height: 100%;
}

.title{
  color: #333333;
  padding: 20px 10px 3px 10px;
  font-size: 25px;
  font-weight: 600;
}

.subtitle{
  color: #354149;
  padding: 0px 10px 10px 10px;
  font-size: 18px;
}

.sending{
  margin: 15px auto;
  display: flex;
  width: 95%;
  height: 7%;

  input{
    padding:15px;
    border-radius: 8px;
    background: #fff;
    width: 70%;
    margin-right: 20px;
    outline: none;
    border: none;
    font-size: 14px;
    font-family: 'Open Sans';
  }

  button{
    border-radius: 8px;
    width: 30%;
    text-align: center;
    font-size: 16px;
    background-color: #428bca;
    outline: none;
    border: none;
    color: #fff;
    cursor: pointer;

    &:hover{
      opacity: 0.9;
    }
  }
}

.messages{
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 63%;
  background: transparent;

  &::-webkit-scrollbar {
    width: 10px;
    margin-right: 12px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #9daab9;
    border-radius: 10px;
  }
}

.info{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  font-weight: bold;
  font-family: 'Open Sans';
}
</style>