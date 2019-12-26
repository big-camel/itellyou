import request from '@/utils/request'

export async function create({questionId,...params}) {
    return request(`/api/question/${questionId}/answer/create`,{ 
        method: 'POST',
        data: params,
    })
}

export async function draft({questionId,id}) {
    return request(`/api/question/${questionId}/answer/${id}/draft`)
}

export async function update({ id , questionId, ...other}){
    return request(`/api/question/${questionId}/answer/${id}/content`,{ 
        method: 'PUT',
        data:other
    })
}

export async function rollback({ id , questionId,...other}){
    const docUrl = id ? `/${id}` : ""
    return request(`/api/question/${questionId}/answer${docUrl}/rollback`,{ 
        method: 'PUT',
        data:other
    })
}

export async function publish({ id , questionId ,...other}){
    return request(`/api/question/${questionId}/answer/${id}/publish`,{ 
        method: 'PUT',
        data:other
    })
}

export function* getQuestionId (select){
    const question = yield select(state => state.question)
    const detail = question ? question.detail : null
    if(!detail) return
    return detail.id
}