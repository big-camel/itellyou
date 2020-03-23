import request from '@/utils/request'
import { stringify } from 'qs'

export async function recommends(params) {
    return request(`/api/explore/recommends?${stringify(params)}`)
}

export async function writer(params) {
    return request(`/api/explore/writer?${stringify(params)}`)
}

export async function answerer(params) {
    return request(`/api/explore/answerer?${stringify(params)}`)
}
