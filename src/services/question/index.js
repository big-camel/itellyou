import request from '@/utils/request'
import { stringify } from 'qs'

export async function create(params) {
    return request('/api/question/create',{ 
        method: 'POST',
        data: params,
    })
}

export async function getList(params) {
    return request(`/api/question/list?${stringify(params)}`)
}

export async function getDetail(params) {
    return request(`/api/question/${params.question_id}`)
}

export async function adopt(params) {
    const { question_id , ...other } = params
    return request(`/api/question/${question_id}/adopt`,{ 
        method: 'POST',
        data: other,
    })
}