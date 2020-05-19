<template>
  <div class="message__box">
    <div class="message__list">
      <Spin fix v-if="loadingList"></Spin>

      <router-link
        tag="div"
        v-for="user in recent_chat_users"
        :key="user.id"
        :to="{ name: 'dialog', params: { target: user.id }}"
        class="student__card"
      >
        <div class="active" v-if="selected === user.id"></div>

        <Avatar icon="ios-person" :size="40" :src="user.avatar_url" />

        <div class="info">
          {{ user.name }}
          <!--          <div>xx学校</div>-->
        </div>
      </router-link>
    </div>
    <div class="message__window">
      <router-view v-if="selected && !loadingList"></router-view>
      <div class="none" v-else>
        请选择会话对象...
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "Chat",
  data () {
    return {
      loadingList: false
    }
  },
  computed: {
    ...mapState(['recent_chat_users']),
    selected() {
      return this.$route.name === 'dialog'
        ? Number(this.$route.params.target)
        : null
    }
  },
  async created() {
    this.loadingList = true

    await this.fetchRecentChatUsers(this.$route.query.id || null)

    if (this.$route.name === 'chat' && this.recent_chat_users.length > 0) {
      this.$router.push({ name: 'dialog', params: { target: this.recent_chat_users[0].id }})
    }

    this.loadingList = false
  },
  methods: mapActions(['fetchRecentChatUsers'])
}
</script>

<style lang="less" scoped>
  @borderColor: rgba(0,0,0,.07);
  @import '@/assets/style/color.less';

  .message__box {
    width: 100%;
    height: 550px;
    display: -webkit-flex;
    border-radius: 3px;
    overflow: hidden;
    .message__list {
      position: relative;
      width: 200px;
      overflow-y: auto;
      border: 1px solid @borderColor;
      // border-right: none;
      // box-shadow: 0 0 32px rgba(0,0,0,.1);
      .message__item {
        width: 100%;
        border-radius: 0;
      }
      .student__card {
        height: 68px;
        width: 100%;
        box-sizing: border-box;
        padding: 14px 18px;
        border-radius: 4px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 10px 21px rgba(0, 0, 0, 0.1);
        display: -webkit-flex;
        align-items: center;
        user-select: none;
        cursor: pointer;
        position: relative;
        .active {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          background: @themeColor;
          box-shadow: 0 10px 10px @themeColor;
        }
        &:hover {
          background: #f9f9f9;
        }
        .avatar {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.1);
        }
        .info {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          box-sizing: border-box;
          padding: 0 14px;
          font-weight: bold;
          > div {
            font-weight: normal;
            font-size: 15px;
            color: rgba(0, 0, 0, 0.5);
          }
        }
        .controller {
          color: @themeColor;
          user-select: none;
          cursor: pointer;
        }
      }
      &::-webkit-scrollbar {
        width: 2px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #c6dbf4;
      }
      &::-webkit-scrollbar-track {
        border-radius: 10px;
      }
    }
    .message__window {
      flex: 1;
      min-height: 300px;
      box-shadow: 0 10px 21px rgba(0,0,0,.1) inset;
      display: -webkit-flex;
      flex-direction: column;
      border-right: 1px solid @borderColor;
      box-sizing: border-box;
      justify-content: center;
      align-items: center;
    }
  }
</style>