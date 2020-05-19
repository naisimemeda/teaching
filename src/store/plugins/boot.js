import { TEACHER_TOKEN_STORAGE_KEY } from '../../enums/index'
import localStorage from '../../utils/localStorage'
import { AUTH_PROVIDER_CACHE_KEY } from "@/enums/auth"

function boot(store) {
  registerWatchers(store)

  importStorageData(store)
}

function registerWatchers(store) {
  store.subscribe(async({ type, payload }) => {
    switch (type) {
      case 'SET_TOKEN_AND_PROVIDER' :
        payload.token
          ? localStorage.setItem(TEACHER_TOKEN_STORAGE_KEY, payload.token)
          : localStorage.removeItem(TEACHER_TOKEN_STORAGE_KEY)

        payload.provider
          ? localStorage.setItem(AUTH_PROVIDER_CACHE_KEY, payload.provider)
          : localStorage.removeItem(AUTH_PROVIDER_CACHE_KEY)

        if (!payload.token || !payload.provider) return

        await store.dispatch('fetchAuth')
    }
  })
}

// 导入本地存贮数组
function importStorageData(store) {
  // 获取token数据
  store.commit('SET_TOKEN_AND_PROVIDER', {
    token: localStorage.getItem(TEACHER_TOKEN_STORAGE_KEY) || '',
    provider: localStorage.getItem(AUTH_PROVIDER_CACHE_KEY) || '',
  })
}

export default store => boot(store)
