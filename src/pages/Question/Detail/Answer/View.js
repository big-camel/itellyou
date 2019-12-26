import React, { useEffect } from 'react'
import { connect } from 'dva'
import { List, Button } from 'antd'
import Item from './Item'
import styles from './Answer.less'
import Loading from '@/components/Loading'

function AnswerView({questionId , answerId ,dispatch, detail , loading , title}){
    useEffect(() => {
        if(questionId && answerId){
            dispatch({
                type:"answer/find",
                payload:{
                    questionId,
                    id:answerId
                }
            })
        }
    },[questionId, answerId, dispatch])

    const renderItem = item => {
        return <Item questionId={questionId} dispatch={dispatch} item={item} />
    }
    if(loading) return <Loading />
    const data = detail ? [detail] : []
    return (
        <div className={styles['answer-list']}>
            <List 
            header={title && <h2 className={styles["answer-title"]}>{title}</h2>}
            dataSource={data}
            renderItem={renderItem}
            itemLayout="vertical"
            />
        </div>
    )
}
export default connect(({ answer , loading}) => ({
    detail:answer ? answer.detail : null,
    loading:loading.effects["answer/find"]
}))(AnswerView)