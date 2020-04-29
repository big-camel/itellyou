import request from '@/utils/request';
import { stringify } from 'qs';

export async function config() {
    return request(`/api/withdraw/config`);
}

export async function post(params) {
    return request(`/api/withdraw`, {
        method: 'POST',
        data: params,
    });
}

export async function log(params) {
    return request(`/api/withdraw/log?${stringify(params)}`);
}
