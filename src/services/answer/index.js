import request from '@/utils/request';

export async function list({ question_id, ...params }) {
    if (question_id)
        return request(`/api/question/${question_id}/answer/list`, {
            params,
        });
    return request(`/api/answer/list`, {
        params,
    });
}

export async function findDraft({ question_id, ...params }) {
    return request(`/api/question/${question_id}/answer/draft`, {
        params,
    });
}

export async function find({ question_id, id, ...params }) {
    return request(`/api/question/${question_id}/answer/${id}`, {
        params,
    });
}

export async function deleteDraft({ question_id, id }) {
    return request(`/api/question/${question_id}/answer/${id}/draft`, {
        method: 'DELETE',
    });
}

export async function deleteAnswer({ question_id, id }) {
    return request(`/api/question/${question_id}/answer/${id}`, {
        method: 'DELETE',
    });
}

export async function revokeDelete({ question_id, id }) {
    return request(`/api/question/${question_id}/answer/${id}/revoke`, {
        method: 'POST',
    });
}

export async function vote({ question_id, id, type }) {
    return request(`/api/question/${question_id}/answer/${id}/${type}`, {
        method: 'POST',
    });
}

export async function paidread({ question_id, id }) {
    return request(`/api/question/${question_id}/answer/${id}/paidread`, {
        method: 'POST',
    });
}
