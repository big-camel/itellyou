import React, { useState, useEffect } from 'react'
import Link from 'umi/link'
import InfiniteScroll from 'react-infinite-scroller'
import { List, Avatar, Icon } from 'antd'
import Loading from '@/components/Loading'
import Timer from '@/components/Timer'
import styles from './List.less'

function ArticleList({ dataSource , offset , limit , ...props}){

    const [loading,setLoading] = useState(false)
    useEffect(() => {
        setLoading(false)
    },[dataSource])

    const onChange = props.onChange || function(){}

    const renderItem = ({ id , tags , title , author ,...item}) => {
        return (
            <List.Item
            key={id}
            >
                {
                    tags && tags.length > 0 && (
                        <div className={styles.tags}>
                            {
                                tags.map(tag => (
                                    <Link key={tag.id} target="_blank" to={`/tag/${tag.name}`}>{tag.name}</Link>
                                ))
                            }
                        </div>
                    )
                }
                <h4 className={styles.title}>
                    <Link target="_blank" to={`/article/${id}`}>{title}</Link>
                </h4>
                <div>
                    {item.description}
                </div>
                <div className={styles.actions}>
                    <div className={styles.author}>
                        <Link to=""><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Link>
                        <Link to="">{author.name}</Link>
                    </div>
                    <span>发布于 <Timer time={item.created_time} /></span>
                    <span><Icon type="eye" />{item.view}</span>
                    <span><Icon type="message" />{item.comment_count}</span>
                    <span><Icon type="heart" />{item.star_count}</span>
                </div>
            </List.Item>
        )
    }

    const renderList = () => {
        if(!dataSource) return <Loading />
        
        return (
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => {
                if(!loading){
                    onChange(offset + limit)
                    setLoading(true)
                }
            }}
            hasMore={!loading && !dataSource.end}
            useWindow={true}
            >
                <List 
                dataSource={dataSource.data}
                renderItem={renderItem}
                itemLayout="vertical"
                />
                {
                    loading && <Loading />
                }
            </InfiniteScroll>
        )
    }

    return renderList()
}
export default ArticleList