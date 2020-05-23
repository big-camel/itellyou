import request from '@/utils/request';

export async function config(params) {
    return request(`/api/withdraw/config`, {
        params,
    });
}

export async function post(params) {
    return request(`/api/withdraw`, {
        method: 'POST',
        data: params,
    });
}

export async function log(params) {
    return request(`/api/withdraw/log`, {
        params,
    });
}
