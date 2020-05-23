import request from '@/utils/request';

export async function getURL(params) {
    return request(`/api/preview`, {
        params,
    });
}
