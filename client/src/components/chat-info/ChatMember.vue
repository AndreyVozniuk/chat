<template>
  <div class='chat-member' @click='handlerMemberClick'>
    <div class='avatar'>
      <img :src='linkImg' alt='user avatar'>
      <div :class='`status ${this.status === "online" ? "status_online" : "status_offline"}`'></div>
    </div>

    <div class='text'>
      <div class='title'>{{name}}</div>
      <div class='description'>{{description}}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'chatMember',
  props: {
    name: String,
    description: String,
    imgLink: String,
    type: String,
    id: [Number, String],
    status: String
  },
  methods: {
    ...mapMutations({setDialogMember: 'members/setDialogMember'}),

    handlerMemberClick(){
      this.setDialogMember({type: this.type, id: this.id})
    }
  },
  computed: {
    linkImg(){
      return require(`../../assets/img/${this.imgLink}`)
    }
  }
}
</script>

<style lang='scss' scoped>
.chat-member{
  cursor: pointer;
  display: flex;
  width: 90%;
  margin: 15px auto 0px auto;

  &:hover{
    opacity: 0.9;
    background-color: lightgray;
  }
}

.title{
  color: #000;
  font-weight: bold;
  font-size: 20px;
}

.description{
  font-size: 15px;
  color: #777777;
}

.avatar{
  position: relative;
  margin-right: 15px;
  width: 125px;
  height: 80px;

  img{
    width: 100%;
    height: 100%;
  }
}

.status{
  position: absolute;
  bottom: -2px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.status_online{
  background-color: #20D63E;
}

.status_offline{
  background-color: lightgray;
}
</style>