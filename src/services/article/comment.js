import request from '@/utils/request';

export async function create({ articleId, ...other }) {
    return request(`/api/article/${articleId}/comment/create`, {
        method: 'PUT',
        data: other,
    });
}

export async function deleteComment({ articleId, id }) {
    return request(`/api/article/${articleId}/comment/${id}`, {
        method: 'DELETE',
    });
}

export async function getRoot({ articleId, ...params }) {
    return request(`/api/article/${articleId}/comment/root`, {
        params,
    });
}

export async function getChild({ articleId, id, ...params }) {
    return request(`/api/article/${articleId}/comment/${id}/child`, {
        params,
    });
}

export async function vote({ articleId, id, type }) {
    return request(`/api/article/${articleId}/comment/${id}/${type}`, {
        method: 'POST',
    });
}
