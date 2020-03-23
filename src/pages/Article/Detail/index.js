import React , { useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import { Row , Col } from 'antd'
import DocumentTitle from 'react-document-title'
import { CommentButton, ShareButton , ReportButton } from '@/components/Button'
import { Viewer } from '@/components/Editor'
import Timer from '@/components/Timer'
import Tag from '@/components/Tag'
import Loading from '@/components/Loading'
import { Comment , Vote, Favorite } from '@/components/Article/Action'
import styles from './index.less'
import Author from '@/components/User/Author'
import Related from './Related'

function Detail({ match:{ params }}){
    const id = parseInt(params.id || 0)

    const dispatch = useDispatch()
    const { detail } = useSelector(state => state.article)

    useEffect(() => {
        dispatch({
            type:'article/view',
            payload:{
                id
            }
        })
        dispatch({
            type:"article/find",
            payload:{
                id
            }
        })
    },[dispatch, id])

    if(!detail) return <Loading />

    const { title , column , author , tags , use_star , comment_count } = detail
    return (
        <DocumentTitle title={title}>
            <Row gutter={50}>
                <Col xs={24} sm={18}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {title}
                        </h2>
                        <div className={styles.tags}>
                            {
                                tags && (
                                    tags.map(tag => (
                                        <span  key={tag.id} className={styles.tag}><Tag href={`/tag/${encodeURIComponent(tag.name)}`} title={tag.name} /></span>
                                    ))
                                )
                            }
                            <span className={styles['view']}>{detail.view}次浏览</span>
                        </div>
                        <Author 
                        className={styles['author']}
                        info={author}  
                        />
                    </div>
                    <article>
                        <Viewer content={detail.content} />
                        <div>发布于<Timer time={detail.created_time} /></div>
                    </article>
                    <div className={styles.actions}>
                        <Vote id={id} {...detail} />
                        <CommentButton count={comment_count} />
                        <Favorite id={id} use_star={use_star} allow_star={detail.allow_star} />
                        <ShareButton>分享</ShareButton>
                        <ReportButton />
                        
                    </div>
                    <Comment id={id} />
                    <Related id={id} />
                </Col>
                <Col xs={24} sm={6}>dfdfsdf</Col>
            </Row>
        </DocumentTitle>
    )
}
export default Detail