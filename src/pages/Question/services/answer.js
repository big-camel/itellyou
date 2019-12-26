import request from '@/utils/request'

export async function list({questionId}) {
    return request(`/api/question/${questionId}/answer/list`)
}

export async function findDraft({questionId}) {
    return request(`/api/question/${questionId}/answer/draft`)
}

export async function find({questionId , id}) {
    return request(`/api/question/${questionId}/answer/${id}`)
}

export async function deleteDraft({ questionId , id }) {
    return request(`/api/question/${questionId}/answer/${id}/draft`,{ 
        method: 'DELETE'
    })
}

export async function deleteAnswer({ questionId , id }) {
    return request(`/api/question/${questionId}/answer/${id}`,{ 
        method: 'DELETE'
    })
}

export async function revokeDelete({ questionId , id }) {
    return request(`/api/question/${questionId}/answer/${id}/revoke`,{ 
        method: 'POST'
    })
}

export async function vote({ questionId , id , type }){
    return request(`/api/question/${questionId}/answer/${id}/${type}`,{ 
        method: 'POST'
    })
}