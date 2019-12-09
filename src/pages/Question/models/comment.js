import { create , deleteComment , editComment , getRootList , getChildList , adopt } from '@/pages/Question/services/comment'

const getItem = (comment_list,comment_id , parent_id) => {
    if(comment_list){
        let item = null
        if(parent_id !== 0){
            const rootItem = comment_list.data.find(item => item.comment_id === parent_id)
            item = rootItem ? rootItem.child.find(item => item.comment_id === comment_id) : null
        }else{
            item = comment_list.data.find(item => item.comment_id === comment_id)
        }
        return item
    }
}

export default {
    namespace: 'comment',

    state: {
        list:null
    },

    effects: {
        *create({ payload }, { call , put , select }){
            const response = yield call( create , payload )
            if(response.result){
                const rootList = yield select(state => state.comment.list)
                if(response.data.parent_id !== 0){
                    const item = rootList.data.find(item => item.comment_id === response.data.parent_id);
                    if(item){
                        item.child.push(response.data)
                        item.child_count += 1
                    }
                }else if(rootList){
                    rootList.data.push(response.data)
                }
                yield put({
                    type:'setList',
                    payload:rootList
                })
            }
            return response
        },
        *edit({ payload }, { call , put }){
            const response = yield call( editComment , payload )
            if(response.result){
                yield put({
                    type:'setItem',
                    payload:response.data
                })
            }
            return response
        },
        *delete({ payload }, { call , put , select }){
            const response = yield call( deleteComment , payload )
            if(response.result){
                yield put({
                    type:'setItem',
                    payload:response.data
                })
            }
            return response
        },
        *getRootList({ payload }, { call,put }){
            const response = yield call(getRootList,payload)
            yield put({
                type:'setList',
                payload:response.data || []
            })
        },
        *getChildList({ payload }, { call , put , select }){
            const response = yield call(getChildList,payload)
            if(response.result){
                const commentList = yield select(state => state.comment.list)
                if(commentList){
                    const item = commentList.data.find(item => item.comment_id === payload.comment_id);
                    if(item){
                        item.child = response.data.data
                        item.child_count = response.data.total
                        yield put({
                            type:'setList',
                            payload:commentList
                        })
                    }
                }
            }
            return response
        },
        *adopt({ payload }, { call , put }){
            const response = yield call(adopt,payload)
            return response
        }
    },
    reducers:{
        setList(state,{ payload }){
            return {
                ...state,
                list:payload
            }
        },
        setItem(state,{ payload }){
            let commentList = state.list
            if(commentList){
                const { comment_id , parent_id } = payload
                let item = getItem(commentList,comment_id , parent_id)
                if(item){
                    item = Object.assign(item,payload)
                }
            }
            return {
                ...state,
                list:commentList
            }
        },
    }
}