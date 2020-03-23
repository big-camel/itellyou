import React, { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import { Link } from 'umi'
import { MoreList } from '@/components/List'
import Article from '@/components/Article'
import getVerb from '@/utils/operational/getVerb'
import Timer from '@/components/Timer'
import Question from '@/components/Question'
import Answer from '@/components/Answer'
import Author from '@/components/User/Author'

export default ({ id }) => {
    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.userActivity.list)

    useEffect(() => {
        dispatch({
            type:'userActivity/list',
            payload:{
                offset,
                limit,
                id
            }
        })
    },[id,offset, limit, dispatch])

    /*const renderUser = (verb , target, { created_time }) => {
        return (
            <div>
                <div>{verb}<Timer time={created_time} /></div>
                <Author 
                info={target}
                />
            </div>
        )
    }*/

    const renderColumn = (verb , { id , name , path }, { created_time }) => {
        return (
            <div>
                <div>{verb}<Timer time={created_time} /></div>
                <div><Link to={`/${path}`}>{ name }</Link></div>
            </div>
        )
    }

    const renderTag = (verb , { id , name }, { created_time }) => {
        return (
            <div>
                <div>{verb}<Timer time={created_time} /></div>
                <div><Link to={`/tag/${id}`}>{ name }</Link></div>
            </div>
        )
    }

    const renderAnswer = (verb , { id , question : { question_id=id,title } , ...target }, { created_time }) => {
        return (
            <div>
                <div>{verb}<Timer time={created_time} /></div>
                <h2><Link to={`/question/${question_id}/answer/${id}`}>{ title }</Link></h2>
                <Answer data={{...target,id}} desc={true} />
            </div>
        )
    }

    const renderArticle = (verb , target , { created_time }) => {
        return (
            <div>
                <div>{verb}<Timer time={created_time} /></div>
                <div>
                    <Article 
                    data={target} 
                    />
                </div>
            </div>
        )
    }

    const renderQuestion = (verb , { id,title } , { created_time }) => {
        return (
            <div>
                <div>{verb}<Timer time={created_time} /></div>
                <h2><Link to={`/question/${id}`}>{ title }</Link></h2>
            </div>
        )
    }

    const renderOperational = ({ action , type , target , ...operational }) => {
        const verb = getVerb(action,type)
        switch(type){
            //case "user":
            //    return renderUser(verb,target,operational)
            case "column":
                return renderColumn(verb,target,operational)
            case "tag":
                return renderTag(verb,target,operational)
            case "answer":
                return renderAnswer(verb,target,operational)
            case "question":
                return renderQuestion(verb,target,operational)
            case "article":
                return renderArticle(verb,target,operational)
        }
    }

    const renderItem = ({ actors , merge_count , ...item }) => {
        return (
            <MoreList.Item key={item.id}>
            {
                renderOperational(item)
            }
            </MoreList.Item>
        )
    }
    return (
        <MoreList 
        offset={offset}
        limit={limit}
        renderItem={renderItem}
        dataSource={dataSource}
        onChange={offset => setOffset(offset)}
        />
    )
}