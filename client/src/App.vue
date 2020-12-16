<template>
  <div class='app'>
    <Header />
    <div class='app-body'>
      <div class='container'>
        <div class='app-content'>
         <Chatting />
         <ChatInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import Chatting from './components/chatting/Chatting'
import ChatInfo from './components/chat-info/ChatInfo'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: { Header, Chatting, ChatInfo },
  sockets: {
    connect: function () {
      if( !localStorage.getItem('UserID') ){
        this.$socket.emit('addUserToServerDB') 
      }else{
        this.$socket.emit('updateUserStatus', {userID: this.userID, status: 'online'})
      }

      this.$socket.emit('loadDataForUser', {userID: this.userID})
    }
  },
  computed: {
    ...mapGetters({userID: 'members/getUserID'}),
  },
  created() {
    window.onunload = () => { 
      if(localStorage.getItem('UserID')){
        this.$socket.emit('updateUserStatus', {userID: this.userID, status: 'offline'})
      }
    }
  },
}
</script>

<style scoped lang='scss'>
.app{
  width: 100vw;
  height: 100vh;
}

.app-content{
  display: flex;
  position: absolute;
  margin: 25px auto;
  height: 90%;
  width: 100%;
}

.app-body{
  height: 90%;
  width: 100%;
  background-color: #586670;
}
</style>
