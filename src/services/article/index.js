import request from '@/utils/request'
import { stringify } from 'qs'

export async function list(params) {
    return request(`/api/article/list?${stringify(params)}`)
}

export async function find(params) {
    return request(`/api/article/${params.id}`)
}

export async function view({id}) {
    return request(`/api/article/${id}/view`)
}

export async function vote({ id , type }){
    return request(`/api/article/${id}/${type}`,{ 
        method: 'POST'
    })
}