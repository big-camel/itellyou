import request from '@/utils/request';
import { stringify } from 'qs';

export async function getURL(params) {
    return request(`/api/preview?${stringify(params)}`);
}
