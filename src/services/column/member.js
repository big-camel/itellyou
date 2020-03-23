import request from '@/utils/request';
import { stringify } from 'qs'

export async function list(params) {
    return request(`/api/column/member?${stringify(params)}`)
}