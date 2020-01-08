import request from '@/utils/request';
import { stringify } from 'qs'

export async function create(params) {
    return request('/api/tag/create',{ 
        method: 'POST',
        data: params,
    })
}

export async function search(params) {
    return request(`/api/tag/search?${stringify(params)}`)
}

export async function query(params) {
    return request(`/api/tag/query?${stringify(params)}`)
}

export async function group() {
    return request('/api/tag/group')
}

export async function list(params) {
    return request(`/api/tag/list?${stringify(params)}`)
}

export async function auditList(params) {
    return request(`/api/tag/audit-list?${stringify(params)}`)
}

export async function find({ id }){
    return request(`/api/tag/${id}`)
}

export async function getState(params){
    const { tag_id } = params
    return request(`/api/tag/state/${tag_id}`)
}

export async function addVersion(params) {
    return request(`/api/tag-version/add`,{ 
        method: 'PUT',
        data:params
    });
}

export async function auditVersion(params) {
    return request(`/api/tag-version/audit`,{ 
        method: 'POST',
        data:params
    });
}

/**
 * 获取与基础版本的内容比较
 * @param {*} params 
 */
export async function getDiffBase(params){
    const { version_id } = params
    return request(`/api/tag-version/diff-${version_id}`)
}