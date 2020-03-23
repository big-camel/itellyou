import request from '@/utils/request'
import { stringify } from 'qs'

export async function queryName(params) {
    return request('/api/user/query/name',{ 
        method: 'POST',
        data: params,
    });
}

export async function find({ id }) {
    return request(`/api/user/${ id }`)
}

export async function profile(params){
    return request('/api/user/profile',{ 
        method: 'PUT',
        data: params,
    })
}

export async function update({ action , ...params }){
    return request(`/api/user/update/${ action }`,{ 
        method: 'PUT',
        data: params,
    })
}

export async function fetchMe(params){
    const param = params ? `?${stringify(params)}` : ""
    return request(`/api/user/me${param}`)
}

export async function fetchAccount(params){
    const param = params ? `?${stringify(params)}` : ""
    return request(`/api/user/account${param}`)
}

export async function logout(){
    return request('/api/user/logout')
}