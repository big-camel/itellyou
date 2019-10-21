import { getVersions,getVersion,getVersionDiff } from '@/services/version'

export default {
    namespace: 'docVersion',

    state: Object.assign({},window.appData.docVersion),

    effects:{
        *getVersions({ payload }, { call }){
            const response = yield call(getVersions,payload)
            return response.data
        },
        *getVersion({ payload }, { call }){
            const response = yield call(getVersion,payload)
            return response.data
        },
        *getVersionDiff({ payload }, { call }){
            const response = yield call(getVersionDiff,payload)
            return response.data
        },
    },

    reducers:{
    }
}