import request from '@/utils/request';

export async function searchByList(params) {
    return request(`/api/statistics/income/search/list`, {
        params,
    });
}

export async function searchByTotal(params) {
    return request(`/api/statistics/income/search/total`, {
        params,
    });
}
