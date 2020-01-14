import request from '@/utils/request'
import { stringify } from 'qs'

export async function list(params) {
    return request(`/api/question/list?${stringify(params)}`)
}

export async function find(params) {
    return request(`/api/question/${params.id}`)
}

export async function adopt({ id , ...other }) {
    return request(`/api/question/${id}/adopt`,{ 
        method: 'POST',
        data: other,
    })
}

export async function view({id}) {
    return request(`/api/question/${id}/view`)
}