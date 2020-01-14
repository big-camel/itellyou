import React, { useState, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useSelector, useDispatch } from 'dva'
import { List, Empty , Row , Col } from 'antd'
import classnames from 'classnames'
import Timer from '@/components/Timer'
import Loading from '@/components/Loading'
import styles from './index.less'
import { Link } from 'umi'

function Search({ location:{ query } }){

    const [offset,setOffset] = useState(parseInt(query.offset || 0))
    const [loading,setLoading] = useState(false)
    const limit = parseInt(query.limit || 20)
    const type = query.t || ""
    const word = query.q || ""
    const wordRef = useRef(word)
    const typeRef = useRef(type)

    const dispatch = useDispatch()

    const search = useSelector(state => state.search)
    const list = search ? search.list : null

    useEffect(() => {
        dispatch({
            type:"search/list",
            payload:{
                t:type,
                q:word,
                append:wordRef.current === word && typeRef.current === type,
                offset,
                limit
            }
        })
        typeRef.current = type
        wordRef.current = word
    },[dispatch,offset,limit,type,word])

    if(word === "") return <Empty />

    const renderQuestion = ({ highlight , object }) => {
        return (
            <div className={styles["search-question-item"]}>
                <h4 className={styles['search-title']}>
                    <Link to={`/question/${object.id}`} dangerouslySetInnerHTML={{__html:highlight.title}}></Link>
                </h4>
                <div className={styles['search-content']} dangerouslySetInnerHTML={{__html:highlight.content}} />
                <div className={styles['search-footer']}>
                    <div>{object.support}赞同</div>
                    <div>{object.answers}回答</div>
                    <div>由 { object.user_name } 于 <Timer time={object.created_time} /> 提问</div>
                </div>
            </div>
        )
    }

    const renderAnswer = ({ highlight , object }) => {
        return (
            <div className={styles["search-answer-item"]}>
                <h4 className={styles['search-title']}>
                    <Link to={`/question/${object.question_id}/answer/${object.id}`} dangerouslySetInnerHTML={{__html:highlight.title}}></Link>
                </h4>
                <div className={styles['search-content']} dangerouslySetInnerHTML={{__html:highlight.content}} />
                <div className={styles['search-footer']}>
                    <div>{object.support}赞同</div>
                    <div>{object.comments}评论</div>
                    <div>由 { object.user_name } 于 <Timer time={object.created_time} /> 回答</div>
                </div>
            </div>
        )
    }

    const renderArticle = ({ highlight , object }) => {
        return (
            <div className={styles["search-article-item"]}>
                <h4 className={styles['search-title']}>
                    <Link to={`/article/${object.id}`} dangerouslySetInnerHTML={{__html:highlight.title}}></Link>
                </h4>
                <div className={styles['search-content']} dangerouslySetInnerHTML={{__html:highlight.content}} />
                <div className={styles['search-footer']}>
                    <div>{object.support}赞同</div>
                    <div>{object.answers}回答</div>
                    <div>由 { object.user_name } 于 <Timer time={object.created_time} /> 发布{object.column_name ? <span>在<Link to={`/column/${object.column_id}`}>{object.column_name}</Link></span> : ""}</div>
                </div>
            </div>
        )
    }

    const renderColumn = ({ highlight , object }) => {
        return (
            <div className={styles["search-column-item"]}>
                <h4 className={styles['search-title']}>
                    <Link to={`/column/${object.id}`} dangerouslySetInnerHTML={{__html:highlight.name}}></Link>
                </h4>
                <div className={styles['search-content']} dangerouslySetInnerHTML={{__html:highlight.description}} />
                <div className={styles['search-footer']}>This is Column</div>
            </div>
        )
    }

    const renderTag = ({ highlight , object }) => {
        return (
            <div className={styles["search-tag-item"]}>
                <h4 className={styles['search-title']}>
                    <Link to={`/tag/${object.id}`} dangerouslySetInnerHTML={{__html:highlight.name}}></Link>
                </h4>
                <div className={styles['search-content']} dangerouslySetInnerHTML={{__html:highlight.content}} />
                <div className={styles['search-footer']}>This is 标签</div>
            </div>
        )
    }

    const renderUser = ({ highlight , object }) => {
        return (
            <div className={styles["search-user-item"]}>
                <h4 className={styles['search-title']} dangerouslySetInnerHTML={{__html:highlight.name}} />
                <div className={styles['search-content']}>This is 用户</div>
            </div>
        )
    }

    const renderItem = item => {
        const { object } = item
        let child = <div>Unknow type</div>
        switch(object && object.type){
            case "question":
                child = renderQuestion(item)
                break
            case "answer":
                child = renderAnswer(item)
                break
            case "article":
                child = renderArticle(item)
                break
            case "column":
                child = renderColumn(item)
                break
            case "tag":
                child = renderTag(item)
                break
            case "user":
                child = renderUser(item)
                break
        }
        return <List.Item className={styles["search-item"]}>{child}</List.Item>
    }

    const renderList = () => {
        if(!list) return <Loading />
        
        return (
            <div className={styles["search-list"]}>
                <Row gutter={20}>
                    <Col span={18}>
                    <div className={styles['search-category']}>
                        <Link className={classnames({[styles['active']]:type === ""})} to={`/search?q=${word}`}>全部</Link>
                        <Link className={classnames({[styles['active']]:type === "question"})} to={`/search?t=question&q=${word}`}>提问</Link>
                        <Link className={classnames({[styles['active']]:type === "answer"})} to={`/search?t=answer&q=${word}`}>回答</Link>
                        <Link className={classnames({[styles['active']]:type === "article"})} to={`/search?t=article&q=${word}`}>文章</Link>
                        <Link className={classnames({[styles['active']]:type === "column"})} to={`/search?t=column&q=${word}`}>专栏</Link>
                        <Link className={classnames({[styles['active']]:type === "tag"})} to={`/search?t=tag&q=${word}`}>标签</Link>
                        <Link className={classnames({[styles['active']]:type === "user"})} to={`/search?t=user&q=${word}`}>用户</Link>
                    </div>
                        <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        loadMore={() => {
                            setLoading(true)
                            setOffset(offset + limit)
                        }}
                        hasMore={!loading && !list.end}
                        useWindow={true}
                        >
                            <List 
                            header={<div>找到约 {list.hits} 条记录</div>}
                            dataSource={list.data}
                            renderItem={renderItem}
                            itemLayout="vertical"
                            />
                            {
                                loading && <Loading />
                            }
                        </InfiniteScroll>
                    </Col>
                    <Col span={6}>dfdfsdf</Col>
                </Row>
            </div>
        )
    }

    return renderList()
}

export default Search