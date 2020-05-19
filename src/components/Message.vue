<template>
  <div class="message" :class="{ own }">
    <Avatar v-if="!own" shape="square" size="large" :src="message.avatar_url"></Avatar>
    <div class="content">
      {{ message.message }}
      <div class="time">{{ message.created_at }} 送达</div>
    </div>
    <Avatar v-if="own" shape="square" size="large" :src="message.avatar_url"></Avatar>
  </div>
</template>

<script>
export default {
  props: {
    own: {
      type: Boolean,
      default: true
    },
    message: {
      type: Object,
      required: true
    }
  },
  name: "Message",
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.message {
  display: -webkit-flex;
  &.own {
    justify-content: flex-end;
    .time {
      text-align: right;
    }
  }
  .avatar {
    width: 47px;
    height: 47px;
    border-radius: 3px;
    // border: 0px solid white;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url("https://hbimg.huabanimg.com/5974f40e0646d31fcfbc2d5eaecf94408976a5151020f-o5O8Ug_fw658/format/webp");
  }
  .content {
    background: rgba(0,0,0,.075);
    padding: 10px 14px;
    max-width: 30%;
    height: auto;
    margin: 12px 10px 0 10px;
    line-height: 1.2;
    border-radius: 3px;
    font-size: 15px;
    .time {
      width: 100%;
      font-size: 12px;
      color: rgba(0,0,0,.45);
      margin-top: 4px;
    }
  }
}
</style>