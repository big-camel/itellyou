import { create , delDeraft , list , getDetail , updateContent , getState , updateDesc , getVersions , getVersion , getVersionDiff , rollback} from '@/services/draft'

export default {
    namespace: 'draft',
    state: {
        list:null,
        versions:[]
    },
    effects: {
        *create({ payload }, { call , put }){
            const response = yield call(create,payload)
            yield put({
                type: 'updateDetail',
                payload: response.data
            })
            return response
        },
        *delete({ payload }, { call }){
            const response = yield call(delDeraft,payload)
            return response
        },
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type: 'updateList',
                payload: response.data || []
            })
            return response
        },
        *getDetail({ payload }, { call,put }){
            const response = yield call(getDetail,payload)
            yield put({
                type: 'updateDetail',
                payload: response.data
            })
            return response
        },
        *getState({ payload }, { call }){
            const response = yield call(getState,payload)
            return response
        },
        *updateContent({ payload }, { call,put }){
            const response = yield call(updateContent,payload)
            yield put({
                type: 'updateDetail',
                payload: response.data
            })
            return response
        },
        *updateDesc({ payload }, { call }){
            const response = yield call(updateDesc,payload)
            return response
        },
        *getVersions({ payload }, { call , put }){
            const response = yield call(getVersions,payload)
            yield put({
                type: 'updateVersions',
                payload: response.data
            })
            return response
        },
        *getVersion({ payload }, { call }){
            const response = yield call(getVersion,payload)
            return response.data
        },
        *getVersionDiff({ payload }, { call }){
            const response = yield call(getVersionDiff,payload)
            return response.data
        },
        *rollback({ payload }, { call }){
            const response = yield call(rollback,payload)
            return response
        }
    },
    reducers:{
        updateDetail(state,{ payload }){
            return {
                ...state,
                detail:payload
            }
        },
        updateList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        updateVersions(state,{ payload }){
            return {
                ...state,
                versions:payload
            }
        }
    }
}