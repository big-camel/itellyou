import request from '@/utils/request';

export async function list(params) {
    return request(`/api/column/star`, {
        params,
    });
}

export async function follow({ id }) {
    return request(`/api/column/star`, {
        method: 'POST',
        data: {
            id,
        },
    });
}

export async function unfollow({ id }) {
    return request(`/api/column/star`, {
        method: 'DELETE',
        data: {
            id,
        },
    });
}
