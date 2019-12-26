import React , { useEffect , useState , useMemo } from 'react'
import { List, Pagination } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import classnames from 'classnames'
import Edit from './Edit'
import Loading from '../Loading'
import Item from './Item'
import Detail from './Detail'
import styles from './index.less'
import { useRef } from 'react'

function Comment({ dataSource , className , loading , extra , title , exclude , hasScroll , hasEdit , onLoad , onChild , onCreate , onDelete , onVote , onDetail , ...props}){

    const [ page , setPage ] = useState(props.page || 1)
    const [ limit , setLimit ] = useState(props.size || 10)
    const [ offset , setOffset ] = useState((page - 1) * limit)
    const [ moreLoading , setMoreLoading ] = useState(false)
    const firstLoad = useRef(true)

    useEffect(() => {
        if(onLoad && (firstLoad.current === false || (firstLoad.current === true && !dataSource))){
            const result = onLoad(offset , limit)
            if(typeof result === "object"){
                result.then(() => {
                    setMoreLoading(false)
                })
            }
        }
        firstLoad.current = false
    },[offset, limit, onLoad, dataSource])
    const renderHeader = () => {
        if(title === false) return
        if(title) return <h2 className={styles["comment-title"]}>{title}</h2>
        return <h2 className={styles["comment-title"]}>{dataSource ? dataSource.comments : 0}个评论</h2>
    }

    const renderItem = item => {
        return <Item onDelete={onDelete} onCreate={onCreate} onVote={onVote} onChild={onChild} onDetail={onDetail} item={item} />
    }

    const renderPage = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>
        }
        if (type === 'next') {
            return <a>下一页</a>
        }
        return originalElement
    }

    if(!dataSource) return <Loading />
    let data = dataSource ? dataSource.data || [] : []
    const hots = []
    const comments = []
    data.forEach(item => {
        if(exclude && (Array.isArray(exclude) && exclude.indexOf(item.id) >= 0 || exclude === item.id)) return
        if(item.hot === true){
            hots.push(item)
        }else{
            comments.push(item)
        }
    })

    const renderList = () => {
        return <List 
        loading={loading && (firstLoad.current === true || !hasScroll)}
        header={renderHeader()}
        dataSource={comments}
        renderItem={renderItem}
        itemLayout="vertical"
        />
    }
    
    const renderScrollList = () => {
        return (
        <div className={styles["comment-scroll"]}>
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => {
                setMoreLoading(true)
                setOffset(offset + limit)
            }}
            hasMore={!moreLoading && !dataSource.end}
            useWindow={false}
            >
                {
                    extra
                }
                { 
                    renderList() 
                }
            </InfiniteScroll>
        </div>
        )
    }

    const renderPageList = () => {
        return <React.Fragment>
            { renderList()}
            <Pagination 
            className={styles["comment-page"]}
            onChange={page => {
                setPage(page)
                setOffset((page - 1) * limit)
            }}
            current={page}
            itemRender={renderPage}
            hideOnSinglePage={true}
            pageSize={limit}
            total={dataSource ? dataSource.total : 0}
            />
        </React.Fragment>
    }

    const renderFooter = () => {
        if(hasEdit) {
            return (
                <div className={styles["comment-footer"]}>
                    <Edit onSubmit={onCreate} />
                </div>
            )
        }
    }

    return (
        <div className={classnames(styles['comment-list'],className)}>
            {
                hots.length > 0 && (
                        <List 
                        header={<h2 className={styles["comment-title"]}>热门评论 ({dataSource ? dataSource.hots || 0 : 0})</h2>}
                        dataSource={hots}
                        renderItem={renderItem}
                        itemLayout="vertical"
                        />
                )
            }
            {
                comments.length > 0 && hasScroll ? renderScrollList() : renderPageList()
            }
            {
                hasScroll && loading && <Loading />
            }
            {
                renderFooter()
            }
            
        </div>
    )
}
export default Comment
export {
    Item,
    Detail
}