import request from '@/utils/request';

export async function find(params) {
    return request('/api/path/find', {
        params,
    });
}
