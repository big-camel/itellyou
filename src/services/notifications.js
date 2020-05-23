import request from '@/utils/request';

export async function count(params) {
    return request('/api/notifications/count', {
        params,
    });
}

export async function list(params) {
    return request('/api/notifications', {
        params,
    });
}

export async function readed(params) {
    return request(`/api/notifications`, {
        method: 'PUT',
        data: params,
    });
}

export async function deleted(params) {
    return request(`/api/notifications`, {
        method: 'DELETE',
        data: params,
    });
}
