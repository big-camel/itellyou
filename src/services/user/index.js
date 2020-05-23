import request from '@/utils/request';

export async function queryName(params) {
    return request('/api/user/query/name', {
        method: 'POST',
        data: params,
    });
}

export async function find({ id, ...params }) {
    return request(`/api/user/${id}`, {
        params,
    });
}

export async function profile(params) {
    return request('/api/user/profile', {
        method: 'PUT',
        data: params,
    });
}

export async function update({ action, ...params }) {
    return request(`/api/user/update/${action}`, {
        method: 'PUT',
        data: params,
    });
}

export async function fetchMe(params) {
    return request('/api/user/me', {
        params,
    });
}

export async function fetchAccount(params) {
    return request('/api/user/account', {
        params,
    });
}

export async function logout(params) {
    return request('/api/user/logout', {
        params,
    });
}
