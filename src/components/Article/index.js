import React from 'react'
import { Link } from 'umi'
import Author from '@/components/User/Author'
import { CommentButton, ReportButton } from '@/components/Button'
import { Vote , Favorite } from './Action'
import styles from './index.less'

export default ({ data : { id , title , description , author , column , comment_count ,...item } , authorSize }) => {
    return (
        <div>
            <h2 className={styles['title']}>
                <Link to={`/article/${id}`}>{title}</Link>
            </h2>
            <Author 
            className={styles['author']}
            info={author} 
            size={authorSize} 
            />
            <div className={styles['description']}>
                {
                    description
                }
            </div>
            <div>
                <Vote id={id} {...item} />
                <CommentButton type="link" href={`/article/${id}`}>{comment_count === 0 ? "添加评论" : `${comment_count} 条评论`}</CommentButton>
                <Favorite id={id} use_star={item.use_star} allow_star={item.allow_star} />
                <ReportButton id={id} type="article" />
            </div>
        </div>
    )
}