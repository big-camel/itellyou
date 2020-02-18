import request from '@/utils/request';
import { stringify } from 'qs'

export async function create(params) {
    return request('/api/column/create',{ 
        method: 'PUT',
        data: params,
    })
}

export async function list(params) {
    return request(`/api/column/list?${stringify(params)}`)
}

export async function detail(params) {
    return request(`/api/column/detail?${stringify(params)}`)
}

export async function userList(params) {
    return request(`/api/column/list/user?${stringify(params)}`)
}

export async function queryName(params) {
    return request('/api/column/query/name',{ 
        method: 'POST',
        data: params,
    })
}