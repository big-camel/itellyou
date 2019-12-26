import request from '@/utils/request'

export async function list({questionId,doc_id}){
    const docUrl = doc_id ? `/${doc_id}` : ""
    return request(`/api/question/${questionId}/answer${docUrl}/version`)
}

export async function find({questionId,doc_id , version_id}){
    const docUrl = doc_id ? `/${doc_id}` : ""
    return request(`/api/question/${questionId}/answer${docUrl}/version/${version_id}`)
}

export async function diff({questionId,doc_id,str}){
    const docUrl = doc_id ? `/${doc_id}` : ""
    return request(`/api/question/${questionId}/answer${docUrl}/version/${str}`)
}