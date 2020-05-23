import request from '@/utils/request';

export async function list(params) {
    return request(`/api/answer/group-user`, {
        params,
    });
}
