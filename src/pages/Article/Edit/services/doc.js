import request from '@/utils/request'

export async function create(params) {
    return request('/api/article/create',{ 
        method: 'POST',
        data: params,
    })
}

export async function draft(params) {
    return request(`/api/article/${params.id}/draft`)
}

export async function update(params){
    const { id , ...other} = params
    return request(`/api/article/${id}/content`,{ 
        method: 'PUT',
        data:other
    })
}

export async function rollback(params){
    const { id , ...other} = params
    return request(`/api/article/${id}/rollback`,{ 
        method: 'PUT',
        data:other
    })
}

export async function publish(params){
    const { id , ...other} = params
    return request(`/api/article/${id}/publish`,{ 
        method: 'PUT',
        data:other
    })
}