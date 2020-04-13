import request from '@/utils/request';

export async function list({ type, id }) {
    return request(`/api/${type}/${id}/version`);
}

export async function find({ type, id, version_id }) {
    return request(`/api/${type}/${id}/version/${version_id}`);
}

export async function diff({ type, id, str }) {
    return request(`/api/${type}/${id}/version/${str}`);
}
