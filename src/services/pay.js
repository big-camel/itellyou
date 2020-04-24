import request from '@/utils/request';

export async function alipayPrecreate(params) {
    return request(`/api/pay/alipay`, {
        method: 'POST',
        data: params,
    });
}

export async function alipayQuery({ id }) {
    return request(`/api/pay/alipay?id=${id}`);
}
