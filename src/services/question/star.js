import request from '@/utils/request'

export async function set(params) {
    return request(`/api/question/${params.question_id}/star`,{ 
        method: 'POST'
    })
}

export async function del(params) {
    return request(`/api/question/${params.question_id}/star`,{ 
        method: 'DELETE'
    })
}