import request from '@/utils/request'

export async function list(params){
    const { doc_id } = params
    return request(`/api/tag/${doc_id}/version`)
}

export async function find(params){
    const { doc_id , version_id } = params
    return request(`/api/tag/${doc_id}/version/${version_id}`)
}

export async function diff(params){
    return request(`/api/tag/${params['doc_id']}/version/${params['str']}`)
}