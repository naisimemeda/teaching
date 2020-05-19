import Vue from 'vue'
import Vuex from 'vuex'
import boot from './plugins/boot'
import webSocket from './plugins/webSocket'
import { me as teacherMe } from '../api/teacher'
import { me as studentMe} from '../api/student'
import { login as loginApi, register as registerApi } from '../api/auth'
import { recent_users } from "../api/chat"
import { AUTH_PROVIDER_CACHE_KEY, AUTH_PROVIDER_TEACHER } from "../enums/auth"
import localStorage from "../utils/localStorage";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    provider: '',
    teacher: {},
    student: {},
    current_chat_with: null,
    recent_chat_users: [],
    recent_chat_messages: {},
    student_messages: [],
  },
  mutations: {
    SET_TOKEN: (state, payload) => (state.token = payload),
    SET_TOKEN_AND_PROVIDER: (state, payload) => {
      state.token = payload.token
      state.provider = payload.provider
    },
    SET_TEACHER: (state, payload) => (state.teacher = payload),
    SET_STUDENT: (state, payload) => (state.student = payload),
    SET_CURRENT_CHAT_WITH: (state, payload) => (state.current_chat_with = Number(payload)),
    SET_RECENT_CHAT_USERS: (state, payload) => (state.recent_chat_users = payload),
    SET_RECENT_CHAT_MESSAGES: (state, payload) => (state.recent_chat_messages = payload),
    SET_STUDENT_MESSAGES: (state, payload) => (state.student_messages = payload),
  },
  actions: {
    async login(store, form) {
      try {
        const { access_token, token_type } = await loginApi(form)
        store.commit('SET_TOKEN_AND_PROVIDER', {
          token: `${token_type} ${access_token}`,
          provider: form.provider
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    logout({ commit }) {
      commit('SET_TOKEN_AND_PROVIDER', { token: '', provider: '' })
      commit('SET_TEACHER', {})
      commit('SET_STUDENT', {})
    },
    async register(store, form) {
      try {
        const { data: { access_token, token_type }} = await registerApi(form)
        store.commit('SET_TOKEN_AND_PROVIDER', {
          token: `${token_type} ${access_token}`,
          provider: form.provider
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async fetchAuth(store) {
      if (!localStorage.getItem(AUTH_PROVIDER_CACHE_KEY)) {
        return console.error('provider error')
      }

      const { data } = store.state.provider === AUTH_PROVIDER_TEACHER
        ? await teacherMe()
        : await studentMe()

      store.state.provider === AUTH_PROVIDER_TEACHER ? store.commit('SET_TEACHER', data) : store.commit('SET_STUDENT', data)
    },
    async fetchRecentChatUsers({ commit }, id = null) {
      const { data } = await recent_users(id)
      commit('SET_RECENT_CHAT_USERS', data)
    }
  },
  plugins: [boot, webSocket]
})
