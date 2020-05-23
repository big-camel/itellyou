import request from '@/utils/request';

export async function recommends(params) {
    return request(`/api/explore/recommends`, {
        params,
    });
}

export async function writer(params) {
    return request(`/api/explore/writer`, {
        params,
    });
}

export async function answerer(params) {
    return request(`/api/explore/answerer`, {
        params,
    });
}
