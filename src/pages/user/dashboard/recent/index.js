import React , { useEffect , useState } from "react"
import InfiniteScroll from 'react-infinite-scroller'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from "dva"
import Loading from "@/components/Loading"
import { List, Icon, Button, Tooltip, message } from "antd"
import { Link } from "umi"
import styles from './index.less'
import Timer from "@/components/Timer"

function Dashboard(){

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const [ loading , setLoading ] = useState(true)

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.draft ? state.draft.list : null)

    useEffect(() => {
        dispatch({
            type:'draft/list',
            payload:{
                append:true,
                offset,
                limit
            }
        }).then(() => {
            setLoading(false)
        })
    },[offset, limit, dispatch])

    const onDelete = (type,key) => {
        dispatch({
            type:'draft/delete',
            payload:{
                type,
                key
            }
        }).then(res => {
            if(res.result){
                message.success("删除成功")
            }else{
                message.error(res.message)
            }
        })
    }

    const getTypeText = type => {
        switch(type){
            case "article":
                return "文章"
            case "question":
                return "提问"
            case "question_answer":
            case "answer":
                return "回答"
            case "tag":
                return "标签"
        }
        return "未知"
    }

    const getEditUrl = (type , url) => {
        if(type === "question_answer" || type === "answer")
            return url
        return url += "/edit"
    }

    const renderContent = (type,content) => {
        if(type === "question_answer" || type === "answer")
            return <p className={styles['desc']}>{content}</p>
        return undefined
    }

    const renderItem = ({ url , title , content , author , created_time , data_type, data_key }) => {
        return (
            <List.Item className={styles["item"]}>
                <div className={styles["content"]}>
                    <div className={styles["icon"]}>
                        <Icon type="smile" theme="twoTone" />
                    </div>
                    <div className={styles["title"]}>
                        <div className={styles["body"]}>
                            <Link className={styles["link"]} to={url}>{ title }</Link>
                            {
                                renderContent(data_type,content)
                            }
                        </div>
                        <span className={styles['meta']}>
                            <span className={styles['author']}>{ author.name }</span>
                            <span className={styles['time']}>
                                <Timer time={created_time} />
                            </span>
                            <span className={styles['text']}>编辑了{ getTypeText(data_type) }</span>
                        </span>
                    </div>
                </div>
                <div className={styles['action']}>
                    <Tooltip title="编辑">
                        <Button type="link" href={getEditUrl(data_type,url)} icon="edit" />
                    </Tooltip>
                    <Tooltip title="移除记录">
                        <Button type="link" onClick={() => onDelete(data_type,data_key)} icon="delete" />
                    </Tooltip>
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
                    setOffset(offset + limit)
                    setLoading(true)
                }
            }}
            hasMore={!loading && !dataSource.end}
            useWindow={true}
            >
                <List 
                className={styles["recent-list"]}
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
    
    return (
        <Layout defaultKey="recent">
            {
                renderList()
            }
        </Layout>
    )
}

export default Dashboard