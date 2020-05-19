import http from '../utils/http'

export const index = (params) => http.get('api/schools', { params })

export const options = () => http.get('api/schools/option')

export const store = data => http.post('/api/schools', data)

export const invite = data => http.post('/api/schools/invite/teacher', data)

export const acceptInvite = data => http.post('/api/accept/invite', data)


