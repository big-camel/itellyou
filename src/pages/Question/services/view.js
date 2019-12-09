import request from '@/utils/request'

export async function view(params) {
    return request(`/api/question/${params.id}/view`)
}