import request from '@/utils/request'

export async function create(params) {
    const { question_id , doc_id , ...other } = params
    const id =  question_id || doc_id
    return request(`/api/question/${id}/comment`,{ 
        method: 'POST',
        data: other,
    })
}

export async function deleteComment(params) {
    return request(`/api/question/comment/${params.comment_id}/delete`,{ 
        method: 'DELETE'
    })
}

export async function editComment(params) {
    const { comment_id , ...other } = params
    return request(`/api/question/comment/${comment_id}/edit`,{ 
        method: 'POST',
        data: other
    })
}

export async function getRootList(params) {
    return request(`/api/question/${params.doc_id}/comment/root`)
}

export async function getChildList(params) {
    return request(`/api/question/comment/${params.comment_id}/child`)
}

export async function adopt(params) {
    const { doc_id , ...other } = params
    return request(`/api/question/${doc_id}/adopt`,{ 
        method: 'POST',
        data: other,
    })
}