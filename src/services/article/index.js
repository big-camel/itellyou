import request from '@/utils/request';

export async function list(params) {
    return request(`/api/article/list`, {
        params,
    });
}

export async function related(params) {
    return request(`/api/article/related`, {
        params,
    });
}

export async function find({ id, ...params }) {
    return request(`/api/article/${id}`, {
        params,
    });
}

export async function view({ id, ...params }) {
    return request(`/api/article/${id}/view`, {
        params,
    });
}

export async function vote({ id, type }) {
    return request(`/api/article/${id}/${type}`, {
        method: 'POST',
    });
}

export async function del({ id }) {
    return request(`/api/article/${id}`, {
        method: 'DELETE',
    });
}

export async function paidread({ id }) {
    return request(`/api/article/${id}/paidread`, {
        method: 'POST',
    });
}
