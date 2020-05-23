import request from '@/utils/request';

export async function alipayPrecreate(params) {
    return request(`/api/pay/alipay`, {
        method: 'POST',
        data: params,
    });
}

export async function alipayQuery(params) {
    return request(`/api/pay/alipay`, {
        params,
    });
}

export async function log(params) {
    return request(`/api/pay/log`, {
        params,
    });
}
