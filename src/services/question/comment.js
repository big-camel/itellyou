import request from '@/utils/request'
import { stringify } from 'qs'

export async function create({ question_id , ...other}) {
    return request(`/api/question/${question_id}/comment/create`,{ 
        method: 'PUT',
        data: other,
    })
}

export async function deleteComment({ question_id , id }) {
    return request(`/api/question/${question_id}/comment/${id}`,{ 
        method: 'DELETE'
    })
}

export async function getRoot({ question_id , ...params}) {
    return request(`/api/question/${ question_id }/comment/root?${stringify(params)}`)
}

export async function getChild({ question_id , id , ...params}) {

    return request(`/api/question/${ question_id }/comment/${id}/child${params ? "?" + stringify(params) : ""}`)
}

export async function vote({ question_id , id , type }){
    return request(`/api/question/${question_id}/comment/${id}/${type}`,{ 
        method: 'POST'
    })
}