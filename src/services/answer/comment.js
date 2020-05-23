import request from '@/utils/request';

export async function create({ question_id, answer_id, ...other }) {
    return request(`/api/question/${question_id}/answer/${answer_id}/comment/create`, {
        method: 'PUT',
        data: other,
    });
}

export async function deleteComment({ question_id, answer_id, id }) {
    return request(`/api/question/${question_id}/answer/${answer_id}/comment/${id}`, {
        method: 'DELETE',
    });
}

export async function getRoot({ question_id, answer_id, ...params }) {
    return request(`/api/question/${question_id}/answer/${answer_id}/comment/root`, {
        params,
    });
}

export async function getChild({ question_id, answer_id, id, ...params }) {
    return request(`/api/question/${question_id}/answer/${answer_id}/comment/${id}/child`, {
        params,
    });
}

export async function vote({ question_id, answer_id, id, type }) {
    return request(`/api/question/${question_id}/answer/${answer_id}/comment/${id}/${type}`, {
        method: 'POST',
    });
}
