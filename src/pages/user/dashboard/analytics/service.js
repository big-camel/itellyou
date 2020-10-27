import request from '@/utils/request';

export async function searchByDate({ type, ...params }) {
    return request(`/api/statistics/search/${type}/group`, {
        params,
    });
}

export async function searchByContent({ type, ...params }) {
    return request(`/api/statistics/search/content/${type}`, {
        params,
    });
}

export async function searchByTotal({ type, ...params }) {
    return request(`/api/statistics/search/${type}/total`, {
        params,
    });
}
