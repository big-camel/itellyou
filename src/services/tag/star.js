import request from '@/utils/request'
import { stringify } from 'qs'

export async function list(params){
    return request(`/api/tag/star?${stringify(params)}`)
}

export async function follow({ id }){
    return request(`/api/tag/star`,{ 
        method: 'POST',
        data:{
            id
        }
    })
}

export async function unfollow({ id }){
    return request(`/api/tag/star`,{ 
        method: 'DELETE',
        data:{
            id
        }
    })
}