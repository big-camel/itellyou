import request from '@/utils/request'

export async function create({question_id,...params}) {
    return request(`/api/question/${question_id}/answer/create`,{ 
        method: 'POST',
        data: params,
    })
}

export async function draft({question_id,id}) {
    return request(`/api/question/${question_id}/answer/${id}/draft`)
}

export async function update({ id , question_id, ...other}){
    return request(`/api/question/${question_id}/answer/${id}/content`,{ 
        method: 'PUT',
        data:other
    })
}

export async function rollback({ id , question_id,...other}){
    const docUrl = id ? `/${id}` : ""
    return request(`/api/question/${question_id}/answer${docUrl}/rollback`,{ 
        method: 'PUT',
        data:other
    })
}

export async function publish({ id , question_id ,...other}){
    return request(`/api/question/${question_id}/answer/${id}/publish`,{ 
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