import request from '@/utils/request';
import { stringify } from 'qs'

export async function create(params) {
    const { source_type , ...other } = params
    return request(`/api/draft-${source_type}/create`,{ 
        method: 'POST',
        data: other,
    })
}

export async function delDeraft(params) {
    return request(`/api/draft/delete/${params.draft_id}`,{ 
        method: 'DELETE',
    })
}

export async function list(params){
    return request(`/api/draft/list?${stringify(params)}`)
}

export async function getState(params){
    const { source_type , ...other } = params
    return request(`/api/draft-${source_type}/state?${stringify(other)}`)
}

export async function updateContent(params){
    return request(`/api/draft/content`,{ 
        method: 'PUT',
        data:params
    });
}

export async function updateDesc(params){
    return request(`/api/draft/desc`,{ 
        method: 'PUT',
        data:params
    });
}

export async function getDetail(params) {
    const { draft_id } = params
    return request(`/api/draft/${draft_id}`)
}

export async function getVersions(params){
    return request(`/api/draft-version?${stringify(params)}`)
}

export async function getVersion(params){
    const { version_id } = params
    return request(`/api/draft-version/${version_id}`)
}

export async function getVersionDiff(params){
    return request(`/api/draft-version/${params['str']}`)
}

export async function rollback(params){
    return request(`/api/draft/rollback`,{ 
        method: 'PUT',
        data:params
    });
}