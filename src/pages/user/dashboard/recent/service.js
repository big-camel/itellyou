import request from '@/utils/request'
import { stringify } from 'qs'

export async function draft(params) {
    return request(`/api/user/draft?${stringify(params)}`);
}

export async function del(params) {
    return request(`/api/user/draft`,{
        method:"DELETE",
        data:params
    });
}