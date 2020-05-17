import request from '@/utils/request';
import { stringify } from 'qs';

export async function list({ question_id, ...params }) {
    if (question_id)
        return request(`/api/question/${question_id}/answer/list?${stringify(params)}`);
    return request(`/api/answer/list?${stringify(params)}`);
}

export async function findDraft({ question_id }) {
    return request(`/api/question/${question_id}/answer/draft`);
}

export async function find({ question_id, id }) {
    return request(`/api/question/${question_id}/answer/${id}`);
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
