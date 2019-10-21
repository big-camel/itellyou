import { stringify } from 'qs'
import request from '@/utils/request'

export async function getVersions(params){
    return request(`/api/version?${stringify(params)}`)
}

export async function getVersion(params){
    const { id } = params
    return request(`/api/version/${id}`)
}

export async function getVersionDiff(params){
    return request(`/api/version/${params['str']}`)
}