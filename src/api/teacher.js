import http from '../utils/http'

export const me = () => http.get('api/teachers/me')

export const indexBySchool = (id, params) => http.get(`/api/schools/${id}/teachers`, { params })
