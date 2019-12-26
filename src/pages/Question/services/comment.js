import request from '@/utils/request'
import { stringify } from 'qs'

export async function create({ questionId , ...other}) {
    return request(`/api/question/${questionId}/comment/create`,{ 
        method: 'PUT',
        data: other,
    })
}

export async function deleteComment({ questionId , id }) {
    return request(`/api/question/${questionId}/comment/${id}`,{ 
        method: 'DELETE'
    })
}

export async function getRoot({ questionId , ...params}) {
    return request(`/api/question/${ questionId }/comment/root?${stringify(params)}`)
}

export async function getChild({ questionId , id , ...params}) {

    return request(`/api/question/${ questionId }/comment/${id}/child${params ? "?" + stringify(params) : ""}`)
}

export async function vote({ questionId , id , type }){
    return request(`/api/question/${questionId}/comment/${id}/${type}`,{ 
        method: 'POST'
    })
}