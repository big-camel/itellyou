import request from '@/utils/request'

export async function support(params) {
    return request(`/api/question/comment/${params.comment_id}/support`,{ 
        method: 'POST'
    })
}

export async function oppose(params) {
    return request(`/api/question/comment/${params.comment_id}/oppose`,{ 
        method: 'POST'
    })
}