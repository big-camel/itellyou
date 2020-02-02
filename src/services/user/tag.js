import request from '@/utils/request'

export async function get(){
    return request('/api/user/tag')
}

export async function follow({id}){
    return request(`/api/user/tag/follow?id=${id}`,{ 
        method: 'POST'
    })
}

export async function unfollow({id}){
    return request(`/api/user/tag/unfollow?id=${id}`,{ 
        method: 'DELETE'
    })
}