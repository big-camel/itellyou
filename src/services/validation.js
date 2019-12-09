import request from '@/utils/request';

export async function sendMobileCode(params) {
    const { action , ...other } = params
    return request(`/api/validation/${action}/code`,{ 
        method:'POST',
        data: other
    })
}