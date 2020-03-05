import request from '@/utils/request'

export async function list() {
    return request('/api/notifications/settings')
}

export async function set(params) {
    return request('/api/notifications/settings',{ 
        method: 'PUT',
        data:params
    })
}