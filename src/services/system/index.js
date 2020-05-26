import request from '@/utils/request';

export async function getSetting() {
    return request('/api/system/setting');
}

export async function getLink() {
    return request('/api/system/link');
}
