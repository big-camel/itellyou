import request from '@/utils/request'

export async function getVersions(params){
    const { doc_id } = params
    return request(`/api/question/${doc_id}/version`)
}

export async function getVersion(params){
    const { doc_id , version_id } = params
    return request(`/api/question/${doc_id}/version/${version_id}`)
}

export async function getVersionDiff(params){
    return request(`/api/question/${params['doc_id']}/version/${params['str']}`)
}