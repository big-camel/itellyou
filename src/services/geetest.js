import { stringify } from 'qs'
import request from '@/utils/request';

export async function init(params) {
    return request(`/api/geetest?${stringify(params)}`);
}