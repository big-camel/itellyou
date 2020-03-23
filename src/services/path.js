import request from '@/utils/request'
import { stringify } from 'qs'

export async function find(params) {
    return request(`/api/path/find?${stringify(params)}`)
}
