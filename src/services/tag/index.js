import request from '@/utils/request';

export async function create(params) {
    return request('/api/tag/create', {
        method: 'POST',
        data: params,
    });
}

export async function search(params) {
    return request(`/api/tag/search`, {
        params,
    });
}

export async function query(params) {
    return request(`/api/tag/query`, {
        params,
    });
}

export async function group(params) {
    return request('/api/tag/group', {
        params,
    });
}

export async function list(params) {
    return request(`/api/tag/list`, {
        params,
    });
}

export async function find({ id, ...params }) {
    return request(`/api/tag/${id}`, {
        params,
    });
}

export async function auditList(params) {
    return request(`/api/tag/audit-list`, {
        params,
    });
}

export async function auditVersion(params) {
    return request(`/api/tag-version/audit`, {
        method: 'POST',
        data: params,
    });
}
