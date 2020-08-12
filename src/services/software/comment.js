import request from '@/utils/request';

export async function create({ softwareId, ...other }) {
    return request(`/api/software/${softwareId}/comment/create`, {
        method: 'PUT',
        data: other,
    });
}

export async function deleteComment({ softwareId, id }) {
    return request(`/api/software/${softwareId}/comment/${id}`, {
        method: 'DELETE',
    });
}

export async function getRoot({ softwareId, ...params }) {
    return request(`/api/software/${softwareId}/comment/root`, {
        params,
    });
}

export async function getChild({ softwareId, id, ...params }) {
    return request(`/api/software/${softwareId}/comment/${id}/child`, {
        params,
    });
}

export async function vote({ softwareId, id, type }) {
    return request(`/api/software/${softwareId}/comment/${id}/${type}`, {
        method: 'POST',
    });
}
