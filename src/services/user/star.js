import request from '@/utils/request'
import { stringify } from 'qs'

export async function star(params){
    return request(`/api/user/star?${stringify(params)}`)
}

export async function follower(params){
    return request(`/api/user/follower?${stringify(params)}`)
}

export async function follow({ id }){
    return request(`/api/user/star`,{ 
        method: 'POST',
        data:{
            id
        }
    })
}

export async function unfollow({ id }){
    return request(`/api/user/star`,{ 
        method: 'DELETE',
        data:{
            id
        }
    })
}