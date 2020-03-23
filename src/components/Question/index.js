import React from 'react'
import { Link } from 'umi'
//import { CommentButton } from '@/components/Button'
//import { Vote , Favorite } from './Action'
import styles from './index.less'
import Answer from '../Answer'

export default ({ data : { id , title , description , answers , answer_list , tags, author , comment_count ,...item } , tag = true , number = true , authorSize } ) => {
    
    /**
     * 
     *  const getRewardTip = item => {
        if(item.reward_type === 0)
            return
        let type = "积分"
        if(item.reward_type === 2){
            type = "现金"
        }
        return <span>悬赏 {item.reward_value} {type}</span>
    }
     * {
                    tags && tags.length > 0 && (
                        <div className={styles.tags}>
                            {
                                tags.map(tag => (
                                    <Link key={tag.id} target="_blank" to={`/tag/${tag.name}`}>{tag.name}</Link>
                                ))
                            }
                            {
                                getRewardTip(item)
                            }
                        </div>
                    )
                }

                <div>
                <Vote id={id} {...item} />
                <CommentButton type="link" href={`/question/${id}`}>{comment_count === 0 ? "添加评论" : `${comment_count} 条评论`}</CommentButton>
                <Favorite id={id} use_star={item.use_star} allow_star={item.allow_star} />
            </div>
     */
    return (
        <div className={styles['item']}>
            <div className={styles['header']}>
                {
                    number && (
                        <div className={styles['data']}>
                            <Link to={`/question/${id}`}>
                                <span className={styles['count']}>{ answers }</span>
                                <span className={styles['name']}>回答</span>
                            </Link>
                        </div>
                    )
                }
                
                <div className={styles['info']}>
                    <h2 className={styles['title']}>
                        <Link to={`/question/${id}`}>{title}</Link>
                    </h2>
                    {
                        tag && tags && tags.length > 0 && (
                        <div className={styles['tags']}>
                            {
                                tags.map(tag => (
                                    <Link key={tag.id} target="_blank" to={`/tag/${tag.name}`}>{tag.name}</Link>
                                ))
                            }
                        </div>
                    )
                    }
                </div>
            </div>
            {
                answer_list.map(answer => <Answer key={answer.id} data={answer} desc={true} authorSize={authorSize}/>)
            }
        </div>
    )
}