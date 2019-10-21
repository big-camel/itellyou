import request from '@/utils/request'

export async function create(params) {
    return request('/api/question/create',{ 
        method: 'POST',
        data: params,
    })
}

export async function get(params) {
    return request(`/api/question/${params.doc_id}/draft`)
}

export async function setLock(params){
    return request(`/api/question/${params.doc_id}/lock`,{ 
        method: 'PUT'
    })
}

export async function delLock(params){
    return request(`/api/question/${params.doc_id}/lock`,{ 
        method: 'DELETE'
    })
}

export async function getLock(params){
    return request(`/api/question/${params.doc_id}/lock`)
}

export async function update(params){
    const { doc_id , ...other} = params
    return request(`/api/question/${doc_id}/content`,{ 
        method: 'PUT',
        data:other
    })
}

export async function rollback(params){
    const { doc_id , ...other} = params
    return request(`/api/question/${doc_id}/rollback`,{ 
        method: 'PUT',
        data:other
    })
}

export async function publish(params){
    const { doc_id , ...other} = params
    return request(`/api/question/${doc_id}/publish`,{ 
        method: 'PUT',
        data:other
    })
}