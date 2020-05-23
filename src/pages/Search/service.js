import request from '@/utils/request';

export async function list(params) {
    return request(`/api/search`, {
        params,
    });
}
