import request from '@/utils/request';
import { stringify } from 'qs';

export async function info() {
    return request(`/api/bank`);
}

export async function log(params) {
    return request(`/api/bank/log?${stringify(params)}`);
}
