import request from '@/utils/request'

export async function create(params) {
    return request('/api/tag/create',{ 
        method: 'POST',
        data: params,
    })
}

export async function draft({ id }) {
    return request(`/api/tag/${id}/draft`)
}

export async function update({ id , ...other}){
    return request(`/api/tag/${id}/content`,{ 
        method: 'PUT',
        data:other
    })
}

export async function rollback(params){
    const { id , ...other} = params
    return request(`/api/tag/${id}/rollback`,{ 
        method: 'PUT',
        data:other
    })
}

export async function publish({ id , ...other}){
    return request(`/api/tag/${id}/publish`,{ 
        method: 'PUT',
        data:other
    })
}