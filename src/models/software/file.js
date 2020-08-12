import { recommend } from '@/services/software/file';

export default {
    namespace: 'softwareFile',

    state: {},

    effects: {
        *recommend({ payload }, { call, put, select }) {
            const response = yield call(recommend, payload);

            if (response && response.result) {
                const doc = yield select((state) => state.doc);
                let detail = doc && doc.detail ? doc.detail : null;
                if (detail && detail.id === payload.softwareId) {
                    const releases = detail.releases.map(({ updaters, ...releases }) => {
                        updaters = updaters.map(({ files, ...updaters }) => {
                            files = files.map(({ id, ...file }) => {
                                if (id === payload.fileId) {
                                    file = { id, ...file, is_recommend: payload.recommend === 1 };
                                }
                                return { id, ...file };
                            });
                            return { ...updaters, files };
                        });
                        return { updaters, ...releases };
                    });
                    yield put({
                        type: 'doc/setDetail',
                        payload: { ...detail, releases },
                    });
                }
            }
            return response;
        },
    },
};
