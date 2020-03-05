import React from 'react'
import Timer from '@/components/Timer'
import { Link } from 'umi'
import { Viewer } from '@/components/Editor'
import getVerb from './utils/getVerb'

export default ({ display , created_time , type , actors , merge_count , target }) => {

    const isSimple = display === "simple"

    const renderUser = () => {
        const components = actors.map(({ id , name },index) => {
            return <span key={id}><Link to="">{name}</Link>{index !== actors.length - 1 ? "、" : ""}</span>
        })
        if(merge_count > actors.length){
            components.push(` 等${merge_count}人`)
        }
        components.push(<span key="text">{ getVerb("comment",type) }</span>)
        if(!isSimple){
            components.push(<span> · <Timer time={new Date(created_time)} /></span>)
        }
        return components
    }

    const renderQuestion = () => {
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

    const renderAnswer = () => {
        const { content , answer: { id , question : { title , ...question }} } = target
        if(isSimple){
            return <Link target="_blank" to={`/question/${question.id}/answer/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                { title }
            </div>
        </div>
    }

    const renderArticle = () => {
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

    const renderQuestionComment = () => {
        const { content , reply } = target
        const { question : { id , title } } = reply
        if(isSimple){
            return <Link target="_blank" to={`/question/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                <span>{reply.author.name}</span>
                <Viewer content={reply.content} />
                <div>
                    { title }
                </div>
            </div>
        </div>
    }

    const renderAnswerComment = () => {
        const { content , reply } = target
        const { answer : { id , question : { title , ...question } } } = reply
        if(isSimple){
            return <Link target="_blank" to={`/question/${question.id}/answer/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                <span>{reply.author.name}</span>
                <Viewer content={reply.content} />
                <div>
                    { title }
                </div>
            </div>
        </div>
    }

    const renderArticleComment = () => {
        const { content , reply } = target
        const { article : { id , title } } = reply
        if(isSimple){
            return <Link target="_blank" to={`/article/${id}`}>{ title }</Link>
        }
        return <div>
            <Viewer content={content} />
            <div>
                <span>{reply.author.name}</span>
                <Viewer content={reply.content} />
                <div>
                    { title }
                </div>
            </div>
        </div>
    }

    const renderContent = () => {
        switch(type){
            case "question":return renderQuestion()
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