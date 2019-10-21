import { stringify } from 'qs'
import request from '@/utils/request'

export async function getDetail(params) {
    const { slug , ...otherParams } = params
    return request(`/api/docs/${slug}?${stringify(otherParams)}`)
}

export async function lockArea(params){
    const { doc_id , ...otherParams } = params
    return request(`/api/docs/${doc_id}/lock`,{ 
        method: 'PUT',
        data:otherParams
    });
}

export async function getEditStatus(params){
    const { doc_id , ...otherParams } = params
    return request(`/api/docs/${doc_id}/lock?${stringify(otherParams)}`)
}

export async function unLock(params){
    const { doc_id , ...otherParams } = params
    return request(`/api/docs/${doc_id}/lock?${stringify(otherParams)}`,{ 
        method: 'DELETE'
    })
}

export async function updateContent(params){
    const { doc_id , ...otherParams } = params
    return request(`/api/docs/${doc_id}/content`,{ 
        method: 'PUT',
        data:otherParams
    });
}

export async function updateMeta(params){
    const { doc_id , ...otherParams } = params
    return request(`/api/docs/${doc_id}/meta`,{ 
        method: 'PUT',
        data:otherParams
    });
}

export async function rollback(params){
    const { doc_id , ...otherParams } = params
    return request(`/api/docs/${doc_id}/rollback`,{ 
        method: 'PUT',
        data:otherParams
    });
}