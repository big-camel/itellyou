import React from 'react'
import Timer from '@/components/Timer'
import { Link } from 'umi'
import { Viewer } from '@/components/Editor'
import getVerb from './utils/getVerb'

export default ({ display , created_time , type , actors , merge_count , target }) => {

    const isSimple = display === "simple"

    const renderUser = () => {
        const components = actors.map(({ id , name },index) => {
            return <span key={id}><Link to={`/user/${id}`}>{name}</Link>{index !== actors.length - 1 ? "、" : ""}</span>
        })
        if(merge_count > actors.length){
            components.push(` 等${merge_count}人`)
        }
        components.push(<span key="text">{ getVerb("like",type) }</span>)
        if(!isSimple){
            components.push(<span> · <Timer time={new Date(created_time)} /></span>)
        }
        return components
    }

    const renderAnswer = () => {
        const { description , id , question : { title , ...question } } = target
        if(isSimple){
            return <Link target="_blank" to={`/question/${question.id}/answer/${id}`}>{ title }</Link>
        }
        return <div>
            { description }
            <div>
                { title }
            </div>
        </div>
    }

    const renderArticle = () => {
        const { id , title } = target
        if(isSimple){
            return <Link target="_blank" to={`/article/${id}`}>{ title }</Link>
        }
        return <div>
                { title }
        </div>
    }

    const renderQuestionComment = () => {
        const { content , question : { id , title } } = target
        if(isSimple){
            return <Link target="_blank" to={`/question/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                { title }
            </div>
        </div>
    }

    const renderAnswerComment = () => {
        const { content , answer:{ id , description , question : { title , ...question } } } = target
        if(isSimple){
            return <Link target="_blank" to={`/question/${question.id}/answer/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                <div>{description}</div>
                { title }
            </div>
        </div>
    }

    const renderArticleComment = () => {
        const { content , article : { id , title } } = target
        if(isSimple){
            return <Link target="_blank" to={`/article/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                { title }
            </div>
        </div>
    }

    const renderContent = () => {
        switch(type){
            case "answer":return renderAnswer()
            case "article":return renderArticle()
            case "question_comment":return renderQuestionComment()
            case "answer_comment":return renderAnswerComment()
            case "article_comment":return renderArticleComment()
        }
    }
    
    return <div>
        <div>{ renderUser() }</div>
        {
            renderContent()
        }
    </div>
}