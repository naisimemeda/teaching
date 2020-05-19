import http from '../utils/http'


export const me = params => http.post('/api/student/me', { params })

export const index = params => http.get('/api/students', { params })

export const studentFans = params => http.get('/api/teacher/fans', { params })

export const indexBySchool = (id, params) => http.get(`/api/schools/${id}/students`, { params })

export const store = data => http.post('/api/students', data)

export const teacher = params => http.get('api/teachers', { params })

export const starTeacher = params => http.get('api/followers/teacher', { params })

export const followers = params => http.post(`api/followers/${params}/teacher`)

export const cancelFollowers = params => http.delete(`api/followers/${params}/teacher`)
