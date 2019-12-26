import request from '@/utils/request'
import { stringify } from 'qs'

export async function create({ questionId , answerId , ...other}) {
    return request(`/api/question/${questionId}/answer/${answerId}/comment/create`,{ 
        method: 'PUT',
        data: other,
    })
}

export async function deleteComment({ questionId , answerId , id }) {
    return request(`/api/question/${questionId}/answer/${answerId}/comment/${id}`,{ 
        method: 'DELETE'
    })
}

export async function getRoot({ questionId , answerId , ...params}) {
    return request(`/api/question/${ questionId }/answer/${answerId}/comment/root?${stringify(params)}`)
}

export async function getChild({ questionId , answerId , id , ...params}) {

    return request(`/api/question/${ questionId }/answer/${answerId}/comment/${id}/child${params ? "?" + stringify(params) : ""}`)
}

export async function vote({ questionId , answerId , id , type }){
    return request(`/api/question/${questionId}/answer/${answerId}/comment/${id}/${type}`,{ 
        method: 'POST'
    })
}