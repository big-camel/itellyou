import request from '@/utils/request';

export async function list(params) {
    return request(`/api/question/list`, {
        params,
    });
}

export async function related(params) {
    return request(`/api/question/related`, {
        params,
    });
}

export async function find({ id, ...params }) {
    return request(`/api/question/${id}`, {
        params,
    });
}

export async function adopt({ id, ...other }) {
    return request(`/api/question/${id}/adopt`, {
        method: 'POST',
        data: other,
    });
}

export async function view({ id, ...params }) {
    return request(`/api/question/${id}/view`, {
        params,
    });
}

export async function del({ id }) {
    return request(`/api/question/${id}`, {
        method: 'DELETE',
    });
}
