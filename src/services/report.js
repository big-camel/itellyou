import request from '@/utils/request'

export async function post(params) {
    return request(`/api/report/post`,{
        method:"POST",
        data:params
    })
}
