import request from '@/utils/request'

export async function list({question_id,doc_id}){
    const docUrl = doc_id ? `/${doc_id}` : ""
    return request(`/api/question/${question_id}/answer${docUrl}/version`)
}

export async function find({question_id,doc_id , version_id}){
    const docUrl = doc_id ? `/${doc_id}` : ""
    return request(`/api/question/${question_id}/answer${docUrl}/version/${version_id}`)
}

export async function diff({question_id,doc_id,str}){
    const docUrl = doc_id ? `/${doc_id}` : ""
    return request(`/api/question/${question_id}/answer${docUrl}/version/${str}`)
}