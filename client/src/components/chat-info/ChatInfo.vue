<template>
  <div class='chat-info'>
    <div class='filter'>
      <button :class='`button ${this.filterStatus === "online" && "button_active"}`' @click="changeFilterStatus('online')">Online</button>
      <button :class='`button ${this.filterStatus === "all" && "button_active"}`' @click="changeFilterStatus('all')">All</button>
    </div>

    <div class='chat-members'>
      <ChatMember 
      v-for='bot in foundBots' 
      :key='bot.id'
      :name='bot.name' 
      :imgLink='bot.img'
      :description="'Fusce dabibus, tellus ac cursur commodo, tort...'"
      :type='"bot"'
      :status='"online"'
      :id='bot.id'
      />

      <ChatMember 
      v-for='user in foundUsers' 
      :key='user.id'
      :name='user.username' 
      :imgLink='"user.png"'
      :description="'Fusce dabibus, tellus ac cursur commodo, tort...'"
      :type='"user"'
      :id='user.id'
      :status='user.status'
      />
    </div>

    <input class='search' placeholder='search...' v-model='search'/>
  </div>
</template>

<script>
import ChatMember from './ChatMember'
import { mapGetters } from 'vuex'
export default {
  name: 'ChatInfo',
  components: { ChatMember },
  data() {
    return {
      search: '',
      filterStatus: 'online'
    }
  },
  methods: {
    changeFilterStatus(status) {
      this.filterStatus = status
    }
  },

  computed: {
    ...mapGetters({getBots: 'members/getBots', getUsers: 'members/getUsers', getUserID: 'members/getUserID'}),

    userID() {
      return this.getUserID
    },
    
    foundUsers() {
      const users = this.getUsers.filter(el => el.id !== this.userID)

      if( !this.search.replace(' ', '') ){
        return this.filterStatus === 'online' ? users.filter(el => el.status === 'online') : users
      }else{
        if(this.filterStatus === 'online'){
          const onlineUser = users.filter(el => el.status === 'online')
          return onlineUser.filter(el => el.username.toLowerCase().startsWith(this.search.toLowerCase()))
        }else{
          return users.filter(el => el.username.toLowerCase().startsWith(this.search.toLowerCase()))
        }
      }
    },

    foundBots() {
      if( !this.search.replace(' ', '') ){
        return this.getBots
      }else{
        return this.getBots.filter(el => el.name.toLowerCase().startsWith(this.search.toLowerCase()))
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.chat-info{
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
  background-color: #fff;
}

.chat-members{
  height: 85%;
  overflow: auto;
}

.search{
  width: 80%;
  border: 1px solid #777777;
  margin: 0px auto 10px auto;
  border-radius: 8px;
  padding: 10px 10px;
  outline: none;
  font-family: 'Open Sans';
  font-size: 14px;
}


.button{
  color: #777777;
  width: 50%;
  height: 50px;
  font-size: 16px;
  border-left: 1px solid #777777;
  border-bottom: 1px solid #777777;
  border-right: none;
  border-top: none;
  outline: none;

  &:hover{
    opacity: 0.7;
  }

  &_active{
    background-color: transparent;
    border: none;
  }
}
</style>