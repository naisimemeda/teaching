import Pusher from 'pusher-js'
import { CHAT_CHANNEL_PREFIX, CHAT_SEND_TYPE_STUDENT, CHAT_SEND_TYPE_TEACHER, CHAT_SEND_TYPE_ADMIN } from "@/enums/chat";
import _ from 'lodash'
import { Notice } from "view-design";
import router from "@/router";
import ls from '@/utils/localStorage'

export default store => {
  store.subscribe(({ type, payload }) => {
    if (['SET_TEACHER', 'SET_STUDENT'].includes(type) && payload && payload.id) {
      Pusher.logToConsole = process.env.VUE_APP_PUSHER_DEBUG === 'true';

      const pusher = new Pusher(process.env.VUE_APP_PUSHER_APP_KEY, {
        cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
        authEndpoint: process.env.VUE_APP_PUSHER_AUTH_END_POINT,
        auth: {
          headers: {
            'Authorization': store.state.token
          }
        }
      })

      const private_channel = pusher.subscribe(ls.getItem('provider') === 'teacher' ? CHAT_CHANNEL_PREFIX + payload.id : `private-student.${payload.id}`)

      private_channel.bind('chat', (message) => {
        const { send_id, send_type, name } = message

        if (send_type === CHAT_SEND_TYPE_STUDENT) {
          const messages = _.cloneDeep(store.state.recent_chat_messages)

          messages[send_id] = messages[send_id] || []

          messages[send_id].push(message)

          store.commit('SET_RECENT_CHAT_MESSAGES', messages)

          store.state.current_chat_with !== send_id && Notice.open({
            title: `${name}:`,
            render: h => {
              return h('div', [
                h('div', {
                  style: {
                    padding: '8px 0'
                  }
                }, message.message),
                h('a', {
                  on: {
                    click: () => router.currentRoute.name === 'dialog'
                      ? router.push({ name: 'dialog', params: { target: send_id }})
                      : router.push({ name: 'chat', query: { id: send_id }})
                  }
                }, '立即回复')
              ])
            }
          })
        }

        if (send_type === CHAT_SEND_TYPE_TEACHER) {
          const messages = _.cloneDeep(store.state.student_messages)
          messages.push(message)
          store.commit('SET_STUDENT_MESSAGES', messages)
          router.currentRoute.name !== 'Message' && Notice.open({
            title: `${name}:`,
            render: h => {
              return h('div', [
                h('div', {
                  style: {
                    padding: '8px 0'
                  }
                }, message.message),
                h('a', {
                  on: {
                    click: () => {
                      if (router.currentRoute.name !== 'Message') {
                        router.push({ name: 'Message' })
                      }
                    }
                  }
                }, '立即回复')
              ])
            }
          })
        }

        if (send_type === CHAT_SEND_TYPE_ADMIN) {
          Notice.success({
            title: '系统通知',
            desc: message.message
          })
        }
      })
      const public_channel = pusher.subscribe('public')
      public_channel.bind('message', (channel_message) => {
        const { message } = channel_message
        Notice.success({
          title: '系统通知',
          desc: message
        })
      })
    }
  })
}
