import request from '@/utils/request'

export async function info() {
    return request(`/api/bank`)
}
