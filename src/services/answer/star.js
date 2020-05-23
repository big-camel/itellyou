import request from '@/utils/request';
export async function list(params) {
    return request(`/api/answer/star`, {
        params,
    });
}

export async function follow({ id }) {
    return request(`/api/answer/star`, {
        method: 'POST',
        data: {
            id,
        },
    });
}

export async function unfollow({ id }) {
    return request(`/api/answer/star`, {
        method: 'DELETE',
        data: {
            id,
        },
    });
}
