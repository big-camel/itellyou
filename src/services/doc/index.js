import request from '@/utils/request';
import { stringify } from 'qs';

export async function create({ type, ...params }) {
    return request(`/api/${type}/create`, {
        method: 'POST',
        data: params,
    });
}

export async function find({ id, type, ...params }) {
    return request(`/api/${type}/${id}/edit?${stringify(params)}`);
}

export async function update({ id, type, ...params }) {
    return request(`/api/${type}/${id}/content`, {
        method: 'PUT',
        data: params,
    });
}

export async function revert({ id, type, ...params }) {
    return request(`/api/${type}/${id}/rollback`, {
        method: 'PUT',
        data: params,
    });
}

export async function publish({ id, type, ...params }) {
    return request(`/api/${type}/${id}/publish`, {
        method: 'PUT',
        data: params,
    });
}
