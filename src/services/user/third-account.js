import request from '@/utils/request';
import { stringify } from 'qs';

export async function find() {
    return request(`/api/third_account`);
}

export async function del(params) {
    return request(`/api/third_account?${stringify(params)}`, {
        method: 'DELETE',
    });
}
