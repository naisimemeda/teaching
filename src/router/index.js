import Vue from 'vue'
import VueRouter from 'vue-router'
import {  AUTH_PROVIDER_TEACHER, AUTH_PROVIDER_STUDENT } from "@/enums/auth"
import _ from 'lodash'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/provider',
    name: 'provider',
    component: () => import('@/views/provider')
  },
  {
    path: '/',
    name: 'home',
    redirect: { name: 'schools' },
    meta: {
      provider: AUTH_PROVIDER_TEACHER
    },
    component: () => import('@/layouts/BasicLayout'),
    children: [
      {
        path: 'schools',
        name: 'schools',
        meta: {
          provider: AUTH_PROVIDER_TEACHER
        },
        component: () => import('@/views/schools/index'),
      },
      {
        path: 'schools/:id',
        name: 'school',
        props: true,
        meta: {
          provider: AUTH_PROVIDER_TEACHER
        },
        component: () => import('@/views/schools/detail')
      },
      {
        path: 'students',
        name: 'students',
        meta: {
          provider: AUTH_PROVIDER_TEACHER
        },
        component: () => import('@/views/students/index')
      },
      {
        path: 'chat',
        name: 'chat',
        meta: {
          provider: AUTH_PROVIDER_TEACHER
        },
        component: () => import('@/views/chat/index'),
        children: [
          {
            path: ':target',
            name: 'dialog',
            props: true,
            meta: {
              provider: AUTH_PROVIDER_TEACHER
            },
            component: () => import('@/views/chat/dialog')
          }
        ]
      },
      {
        path: '/invite',
        name: 'invite',
        meta: {
          provider: AUTH_PROVIDER_TEACHER
        },
        component: () => import('@/views/invite')
      },
    ]
  },
  {
    path: '/student_index',
    name: 'studentIndex',
    redirect: { name: 'TeacherList' },
    meta: {
      provider: AUTH_PROVIDER_STUDENT
    },
    component: () => import('@/layouts/BasicLayout'),
    children: [
      {
        path: 'teacher/list',
        name: 'TeacherList',
        meta: {
          provider: AUTH_PROVIDER_STUDENT
        },
        component: () => import('@/views/student/teacherList')
      },
      {
        path: 'message',
        name: 'Message',
        meta: {
          provider: AUTH_PROVIDER_STUDENT
        },
        component: () => import('@/views/message/index')
      },
    ]
  }
]


const router = new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  const toProvider = _.get(to, 'meta.provider')
  const currentProvider = store.state.provider

  if (toProvider && toProvider !== currentProvider) {
    switch (currentProvider) {
      case AUTH_PROVIDER_TEACHER :
        return next({ name: 'home' })
      case AUTH_PROVIDER_STUDENT :
        return next({ name: 'studentIndex' })
      default :
        return next({ name: 'login' })
    }
  }

  next()
})

export default router
