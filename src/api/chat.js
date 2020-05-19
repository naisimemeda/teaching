import http from '../utils/http'

export const recent_users = (id = null) => http.get('/api/chat/logs', { params: { id }})

export const recent_messages = id => http.get('/api/chat/messages', { params: { id }})

export const recent_student_messages = () => http.get('/api/chat/student/messages', )

export const send = (student_id, message) => http.post('/api/send/messages', { student_id, message })

export const studentSendMessage = ( message ) => http.post('/api/student/send/messages', { message })
