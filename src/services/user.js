import { stringify } from 'qs'
import request from '@/utils/request';

export async function loginByAccount(params) {
    return request('/api/user/login-account',{ 
        method: 'POST',
        data: params,
    });
}

export async function loginByMobile(params) {
    return request('/api/user/login-mobile',{ 
        method: 'POST',
        data: params,
    });
}

export async function checkNickname(params) {
    return request('/api/user/check-nickname',{ 
        method: 'POST',
        data: params,
    });
}

export async function register(params) {
    return request('/api/user/register',{ 
        method: 'POST',
        data: params,
    });
}

export async function fetchCurrent(){
    return request('/api/user/current');
}

export async function logout(){
    return request('/api/user/logout')
}

export async function getTag(){
    return request('/api/user/tag')
}

export async function setTag(params){
    return request('/api/user/tag-set',{ 
        method: 'POST',
        data: params,
    })
}

export async function delTag(params){
    return request('/api/user/tag-del',{ 
        method: 'POST',
        data:params
    })
}