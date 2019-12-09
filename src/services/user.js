import { stringify } from 'qs'
import request from '@/utils/request';

export async function loginByAccount(params) {
    return request('/api/user/login/account',{ 
        method: 'POST',
        data: params,
    });
}

export async function loginByMobile(params) {
    return request('/api/user/login/mobile',{ 
        method: 'POST',
        data: params,
    });
}

export async function queryName(params) {
    return request('/api/user/query/name',{ 
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

export async function fetchMe(){
    return request('/api/user/me');
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