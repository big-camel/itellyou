import { star , follower ,follow,unfollow } from '@/services/user/star'

const setList = (name , state , { append , end , total , data , ...payload }) => {
    const key = name + "List"
    const list = state[key]
    if(!list || !append){
        return {
            ...state,
            [key]:{end , total , data , ...payload}
        }
    }
    const dataList = list.data.concat()
    data.forEach(item => {
        if(!dataList.find(child => child[name].id === item.id)){
            dataList.push(item)
        }
    })
    return {
        ...state,
        [key]:{...list,end,total,data:dataList}
    }
}

const removeItem = (name , state , payload ) => {
    const key = name + "List"
    const data = state[key] ? state[key].data || [] : [];
    const index = data.findIndex(item => item[name].id === payload.id)
    if(index >= 0){
        data.splice(index,1)
    }
    return {
        ...state,
        [key]:{...state[key],data}
    }
}

const replaceItem = ( name , state , { created_time , ...detail } ) => {
    const key = name + "List"
    const list = state[key]
    if(list){
        const data = list.data.concat()
        const index = data.findIndex(item => item[name].id === detail.id)
        if(index >= 0){
            const item = data[index]
            data.splice(index,1,{...item , [name]:{...item[name],...detail} , created_time})
        }
        
        return {
            ...state,
            [key]:{...list,data}
        }
    }
    return {
        ...state
    }
}

export default {
    namespace: 'userStar',

    state: {},

    effects: {
        *starList({ payload }, { call,put }){
            const response = yield call(star,payload)
            yield put({
                type: 'setStarList',
                payload: response.data
            })
        },
        *followerList({ payload }, { call,put }){
            const response = yield call(follower,payload)
            yield put({
                type: 'setFollowerList',
                payload: response.data
            })
        },
        *follow({ payload }, { call , put }){
            const response = yield call(follow,payload)
            if(response.result){
                yield put({
                    type:'replaceStarItem',
                    payload:{
                        id:payload.id,
                        use_star:true,
                        follower_count:response.data,
                        created_time:new Date()
                    }
                })
            }
            return response
        },
        *unfollow({payload:{ name , ...payload }}, { call , put }){
            const response = yield call(unfollow,payload)
            if(response.result){
                yield put({
                    type:'replaceStarItem',
                    payload:{
                        id:payload.id,
                        use_star:false,
                        follower_count:response.data
                    }
                })
            }
            return response
        }
    },

    reducers:{
        setStarList(state,{ payload }){
            return setList("star",state,payload)
        },
        removeStarItem(state,{ payload }){
            return removeItem("star",state,payload)
        },
        replaceStarItem(state,{ payload }){
            return replaceItem("star",state,payload)
        },
        setFollowerList(state,{ payload }){
            return setList("follower",state,payload)
        },
        removeFollowerItem(state,{ payload }){
            return removeItem("follower",state,payload)
        },
        replaceFollowerItem(state,{ payload }){
            return replaceItem("follower",state,payload)
        }
    }
}