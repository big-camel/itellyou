import request from '@/utils/request';

export async function findConfig(params) {
    return request('/api/reward/config',{ 
        method: 'GET',
        data: params,
    })
}
