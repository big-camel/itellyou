import React , { useState , useEffect } from 'react'
import { useDispatch , useSelector} from 'dva'
import { Link } from 'umi'
import getVerb from '@/utils/operational/getVerb'
import mergeUser from '@/utils/operational/mergeUser'
import { ScrollList } from '@/components/List'

export default ({ action , type , force }) => {
    action = action || "default"
    type = type || "default"
    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.notifications.list[action])
    
    useEffect(() => {
        dispatch({
            type:'notifications/list',
            payload:{
                append:!force,
                action,
                type,
                offset,
                limit
            }
        })
    },[ action , type , force , offset , limit , dispatch])

    const renderColumn = (verb , { id , name }) => {
        return <span>{verb}<Link to={`/column/${id}`}>{ name }</Link></span>
    }

    const renderAnswer = (verb , { id , question : { question_id=id,title } }) => {
        return <span >{verb}<Link to={`/question/${question_id}/answer/${id}`}>{ title }</Link></span>
    }

    const renderCommon = (type,verb , { id , title }) => {
        return <span>{verb}<Link to={`/${type}/${id}`}>{ title }</Link></span>
    }

    const renderAnswerComment = (verb , { content , reply }) => {
        const { answer : { id , question : { title , question_id=id } } } = reply
        return <span>{verb}<Link to={`/question/${question_id}/answer/${id}`}>{ title }</Link></span>
    }

    const renderCommentCommon = (type , verb , { content , reply , ...target }) => {
        const { [type] : { id , title } } = reply ? reply : target
        return <span>{verb}<Link to={`/${type}/${id}`}>{ title }</Link></span>
    }
    
    const renderOperational = ({ action , type , target }) => {
        const verb = getVerb(action,type,"你的")
        switch(type){
            case "user":
                return verb
            case "column":
                return renderColumn(verb,target)
            case "answer":
                if(action === "comment") renderAnswerComment(verb,target)
                return renderAnswer(verb,target)
            case "question":
            case "article":
                if(action === "comment") return renderCommentCommon(type,verb,target)
                return renderCommon(type,verb,target)
            case "answer_comment":
                return renderAnswerComment(verb,target)
            case "question_comment":
            case "article_comment":
                return renderCommentCommon(type,verb,target)
        }
    }

    const renderItem = ({ actors , merge_count , ...item }) => {
        return (
            <ScrollList.Item>
                {
                    mergeUser(actors,merge_count)
                }
                {
                    renderOperational(item)
                }
            </ScrollList.Item>
        )
    }

    return (
        <ScrollList 
        offset={offset}
        limit={limit}
        dataSource={dataSource}
        renderItem={renderItem}
        onChange={offset => setOffset(offset)}
        />
    )
}