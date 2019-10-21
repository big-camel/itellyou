import request from '@/utils/request';

export async function sendMobileCode(params) {
    const { type , ...other } = params
    return request(`/api/verification/mobile/${type}`,{ 
        method:'POST',
        data: other
    })
}