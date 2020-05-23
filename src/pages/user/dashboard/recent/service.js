import request from '@/utils/request';

export async function draft(params) {
    return request(`/api/user/draft`, {
        params,
    });
}

export async function del(params) {
    return request(`/api/user/draft`, {
        method: 'DELETE',
        data: params,
    });
}
