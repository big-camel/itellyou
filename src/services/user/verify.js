import request from '@/utils/request';

export async function mobile(params) {
    return request('/api/user/verify/mobile', {
        method: 'POST',
        data: params,
    });
}

export async function email(params) {
    return request('/api/user/verify/email', {
        method: 'POST',
        data: params,
    });
}
