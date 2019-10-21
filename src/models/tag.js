import { get , getState , create,search , query ,group,list , addVersion , auditList , auditVersion , getDiffBase} from '@/services/tag'

export default {
    namespace: 'tag',

    state: {
        list:null,
        groupList:null,
        auditList:null
    },

    effects: {
        *get({ payload }, { call , put }){
            const response = yield call(get,payload)
            yield put({
                type:'updateDetail',
                payload:response.data
            })
            return response
        },
        *getState({ payload }, { call }){
            const response = yield call( getState , payload)
            return response
        },
        *create({ payload }, { call }){
            const response = yield call(create,payload)
            return response
        },
        *query({ payload }, { call , put}){
            const response = yield call(query,payload)
            yield put({
                type:'updateDetail',
                payload:response.data
            })
            return response
        },
        *search({ payload }, { call }){
            const response = yield call(search,payload)
            return response
        },
        *groupList({ payload }, { call,put }){
            const response = yield call(group,payload)
            yield put({
                type:'updateGroupList',
                payload:response.data || []
            })
        },
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type:'updateList',
                payload:response.data || []
            })
        },
        *updateStar({ payload }, { select , put }){
            const tag = yield select(state => state.tag)
            const { data , ...other } = tag.list
            const listData = data.map(item => {
                const star = payload.find(id => id === item.id) ? true : false
                if(item.star !== star){
                    item.star = star
                    if(star)
                        item.starNumber += 1
                    else
                        item.starNumber -= 1
                }
                return item
            })
            const list = Object.assign(other,{data:listData})
            yield put({
                type:'updateList',
                payload:list
            })
        },
        *addVersion({ payload }, { call }){
            const response = yield call(addVersion,payload)
            return response
        },
        *auditList({ payload }, { call , put }){
            const response = yield call(auditList,payload)
            yield put({
                type:'updateAuditList',
                payload:response.data || []
            })
        },
        *auditVersion({ payload }, { call }){
            const response = yield call(auditVersion,payload)
            return response
        },
        *getDiffBase({ payload }, { call }){
            const response = yield call(getDiffBase,payload)
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
        updateAuditList(state,{ payload }){
            return {
                ...state,
                auditList:payload
            }
        },
        updateGroupList(state,{ payload }){
            return {
                ...state,
                groupList:payload
            }
        },
    }
}