<template>
  <div :class='type === "send" ? "send-message" : "get-message"'>
    <div :class='`title ${type === "send" ? "send-title" : "get-title"}`'>
      <span class='name'>{{name}}</span>
      <span class='date'>{{date}}</span>
    </div>
    <div class='text'>{{text}}</div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    date: String,
    text: String,
    type: String
  }
}
</script>

<style lang='scss' scoped>
.get-message{
  position: relative;
  padding: 15px 0px 15px 25px;
  width: 70%;
  
  &::before {
    content: '';
    position: absolute;
    right: 90.5%;
    top: 55%;
    transform-origin: 0% 50%;
    transform: rotate(180deg);
    border: 15px solid transparent;
    border-left: 20px solid #fff;
  }
}

.get-title{
  background-color: #BECBD9;
}

.send-message{
  align-self: flex-end;
  position: relative;
  padding: 15px 25px 15px 0px;
  width: 70%;

  &::after{
    content: '';
    position: absolute;
    right: -0.1%;
    top: 54%;
    border: 15px solid transparent;
    border-left: 20px solid #fff;
  }
}

.send-title{
  background-color: #F0CBB3;
}

.title{
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  height: 15px;
  border-radius: 8px 8px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.text{
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 0px 0px 8px 8px;
  padding: 10px 0px 10px 10px;
  background-color: #fff;
}

.date{
  opacity: 0.4;
}
</style>