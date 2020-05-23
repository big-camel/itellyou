import request from '@/utils/request';

export async function find(params) {
    return request(`/api/third_account`, {
        params,
    });
}

export async function del(params) {
    return request(`/api/third_account`, {
        method: 'DELETE',
        params,
    });
}
