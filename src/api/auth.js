import http from '../utils/http'

export const login = (data) => http.post('api/login', data)

export const register = (data) => http.post('api/teacher', data)

export const accounts = (params) => http.get('api/line/account', { params })

export const lineAuth = (data) => http.post('api/line/auth', data)