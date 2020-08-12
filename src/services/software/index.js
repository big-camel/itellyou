import request from '@/utils/request';

export async function list(params) {
    return request(`/api/software/list`, {
        params,
    });
}

export async function find({ id, ...params }) {
    return request(`/api/software/${id}`, {
        params,
    });
}

export async function view({ id, ...params }) {
    return request(`/api/software/${id}/view`, {
        params,
    });
}

export async function vote({ id, type }) {
    return request(`/api/software/${id}/${type}`, {
        method: 'POST',
    });
}

export async function del({ id }) {
    return request(`/api/software/${id}`, {
        method: 'DELETE',
    });
}
