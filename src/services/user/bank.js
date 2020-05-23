import request from '@/utils/request';

export async function info(params) {
    return request(`/api/bank`, {
        params,
    });
}

export async function log(params) {
    return request(`/api/bank/log`, {
        params,
    });
}
