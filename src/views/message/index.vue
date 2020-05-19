<template>
  <div class="message__box">
    <Spin fix v-if="loading" />
    <div class="message__window">
      <div class="message__viewer" ref="viewer">>
        <Message :own="message.send_type === CHAT_SEND_TYPE_STUDENT" class="message__item" v-for="(message, index) in messages" :key="index" :message="message"/>
      </div>
      <div class="message__controller">
        <div class="message__textarea">
          <div></div>
          <textarea placeholder="请输入聊天内容" v-model="message" />
        </div>
        <div class="message__send flex--ac flex--jc" @click="handleSendMessage">
          <Spin v-if="sending" class="spin" />
          发送
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "@/components";
import { recent_student_messages as recent_messages, studentSendMessage as send } from "@/api/chat";
import { CHAT_SEND_TYPE_STUDENT, CHAT_SEND_TYPE_TEACHER } from "@/enums/chat";
import _ from "lodash";
import { mapState, mapMutations } from 'vuex';

export default {
  name: "MessageBox",
  components: { Message },
  watch: {
    messages: {
      immediate: true,
      keep: true,
      handler() {
        this.$nextTick(this.scrollToBottom)
      }
    }
  },
  computed: {
    ...mapState(['student_messages']),
    messages() {
      return this.student_messages || []
    }
  },
  data () {
    return {
      CHAT_SEND_TYPE_STUDENT,
      CHAT_SEND_TYPE_TEACHER,
      message: '',
      loading: false,
      sending: false,
    }
  },
  created() {
    this.fetchRecentMessages()
  },
  methods: {
    ...mapMutations(['SET_STUDENT_MESSAGES']),
    scrollToBottom() {
      this.$refs.viewer.scrollTop = this.$refs.viewer.scrollHeight
    },
    async fetchRecentMessages() {
      try {
        this.loading = true
        const { data } = await recent_messages()
        this.SET_STUDENT_MESSAGES(data)
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
        this.sending = true
        const { data } = await send(this.message)
        this.messages.push(data)
        this.message = ''
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

  .message__box {
    width: 100%;
    height: 450px;
    display: -webkit-flex;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    .message__list {
      width: 200px;
      overflow-y: auto;
      border: 1px solid @borderColor;
      // border-right: none;
      // box-shadow: 0 0 32px rgba(0,0,0,.1);
      .message__item {
        width: 100%;
        border-radius: 0;
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
      .message__viewer {
        flex: 1;
        box-sizing: border-box;
        padding: 24px 32px;
        overflow-y: scroll;
        .message__item {
          margin-bottom: 20px;
        }
      }
      .message__controller {
        width: 100%;
        height: 110px;
        background: white;
        border: 1px solid @borderColor;
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
  }
</style>