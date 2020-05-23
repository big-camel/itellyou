import request from '@/utils/request';

export async function list(params) {
    return request(`/api/question/star`, {
        params,
    });
}

export async function follow({ id }) {
    return request(`/api/question/star`, {
        method: 'POST',
        data: {
            id,
        },
    });
}

export async function unfollow({ id }) {
    return request(`/api/question/star`, {
        method: 'DELETE',
        data: {
            id,
        },
    });
}
