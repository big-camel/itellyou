import request from '@/utils/request'
import { stringify } from 'qs'

export async function count(){
    return request("/api/notifications/count")
}

export async function list(params){
    return request(`/api/notifications?${stringify(params)}`)
}

export async function readed(params){
    return request(`/api/notifications`,{ 
        method: 'PUT',
        data:params
    })
}

export async function deleted({ id }){
    return request(`/api/notifications`,{ 
        method: 'DELETE',
        data:{
            id
        }
    })
}