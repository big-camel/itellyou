import request from '@/utils/request';

export const oauthURL = async ({ type, action }) => {
    return request(`/api/oauth/${type}?action=${action}`);
};
