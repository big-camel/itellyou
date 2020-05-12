import request from '@/utils/request';

export async function findConfig(params) {
    return request('/api/reward/config', {
        method: 'GET',
        data: params,
    });
}

export async function doReward(params) {
    return request('/api/reward/do', {
        method: 'POST',
        data: params,
    });
}

export async function list(params) {
    return request('/api/reward/list', {
        params,
    });
}
