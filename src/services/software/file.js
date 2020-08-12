import request from '@/utils/request';

export async function recommend({ softwareId, fileId, ...params }) {
    return request(`/api/software/${softwareId}/file/${fileId}/recommend`, {
        data: params,
        method: 'POST',
    });
}
