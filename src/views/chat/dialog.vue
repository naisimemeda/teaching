<template>
  <div class="session">
    <Spin fix v-if="loading"></Spin>

    <div class="message__viewer" ref="viewer">
      <Message
        :own="message.send_type === CHAT_SEND_TYPE_TEACHER"
        class="message__item"
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
      />
    </div>
    <div class="message__controller">
      <div class="message__textarea">
        <textarea placeholder="请输入聊天内容" v-model="message" />
      </div>
      <div class="message__send flex--ac flex--jc" @click="this.handleSendMessage">
        <Spin v-if="sending" class="spin"></Spin>
        发送
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "@/components"
import { recent_messages } from "@/api/chat"
import { CHAT_SEND_TYPE_STUDENT, CHAT_SEND_TYPE_TEACHER } from "@/enums/chat"
import { send } from "@/api/chat"
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'

export default {
  name: "dialog",
  components: { Message },
  props: {
    target: {
      type: [Number,String],
      required: true
    }
  },
  data() {
    return {
      CHAT_SEND_TYPE_STUDENT,
      CHAT_SEND_TYPE_TEACHER,

      loading: false,
      sending: false,
      message: ''
    }
  },
  computed: {
    ...mapState(['recent_chat_users', 'recent_chat_messages']),
    messages() {
      return this.recent_chat_messages[this.target] || []
    }
  },
  watch: {
    target: {
      immediate: true,
      deep: true,
      handler(target) {
        this.SET_CURRENT_CHAT_WITH(target)
        this.message = ''
        this.fetchRecentMessages()
      }
    },
    messages: {
      deep: true,
      immediate: true,
      handler() {
        this.$nextTick(this.scrollToBottom)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.SET_CURRENT_CHAT_WITH(null)
    next()
  },
  methods: {
    ...mapMutations(['SET_RECENT_CHAT_MESSAGES', 'SET_CURRENT_CHAT_WITH']),
    scrollToBottom() {
      this.$refs.viewer.scrollTop = this.$refs.viewer.scrollHeight
    },
    async fetchRecentMessages() {
      try {
        this.loading = true
        const { data } = await recent_messages(this.target)
        const messages = _.cloneDeep(this.recent_chat_messages)
        messages[this.target] = data
        this.SET_RECENT_CHAT_MESSAGES(messages)
      } catch (e) {
        console.error(e)
        this.$Message.error('请求消息记录失败')
      } finally {
        this.loading = false
      }
    },
    async handleSendMessage() {
      if (this.sending === true) return this.$Message.warning('消息发送中')

      try {
        if (this.message === '') return this.$Message.warning('请填写消息内容')
        this.sending = true

        const { data } = await send(this.target, this.message)
        this.message = ''

        const messages = _.cloneDeep(this.recent_chat_messages)
        messages[this.target] = messages[this.target] || []
        messages[this.target].push(data)
        this.SET_RECENT_CHAT_MESSAGES(messages)
      } catch (e) {
        console.error(e)
        this.$Message.error(_.get(e, 'response.data.message', '发送失败'))
      } finally {
        this.sending = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@borderColor: rgba(0,0,0,.07);
@import '@/assets/style/color.less';

.session {
  width: 100%;
  height: 100%;
  position: relative;
  .message__viewer {
    height: 80%;
    flex: 1;
    box-sizing: border-box;
    padding: 24px 32px;
    overflow-y: scroll;
    position: relative;
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
    .message__item {
      margin-bottom: 20px;
    }

    .loading {
      position: absolute;
      bottom: 5px;
      left: 5px;
      display: flex;
      align-items: center;
      font-size: .6rem;
      color: @themeColor;
    }
  }
  .message__controller {
    width: 100%;
    height: 20%;
    background: white;
    border: 1px solid @borderColor;
    border-left: none;
    border-right: none;
    box-sizing: border-box;
    display: -webkit-flex;
    .message__textarea {
      flex: 1;
      textarea {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 12px 14px;
        outline: none;
        border: none;
        resize: none;
        font-size: 14px;
      }
    }
    .message__send {
      width: 120px;
      position: relative;
      color: @themeColor;
      user-select: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      .spin {
        position: absolute;
        left: 20px;
      }
      &::before {
        content: '';
        width: 1px;
        height: 60px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        background: rgba(0,0,0,.15);
      }
    }
  }
}
</style>