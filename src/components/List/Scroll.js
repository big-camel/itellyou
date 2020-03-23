import React , { useState , useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Loading from '../Loading'
import List from './Default'

const Scroll = ({ dataSource , offset , limit , onChange , ...props }) => {

    offset = offset || 0
    limit = limit || 20
    
    const [ loading , setLoading ] = useState(false)
    onChange = onChange || function(){
        setLoading(false)
    }

    useEffect(() => {
        setLoading(false)
    },[dataSource])

    if(!dataSource) return <Loading />
    
    const renderScrollList = () => {
        return (
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => {
                if(!loading){
                    setLoading(true)
                    onChange(offset + limit,limit)
                }
            }}
            hasMore={!loading && !dataSource.end}
            useWindow={false}
            >
                <List 
                dataSource={dataSource.data} 
                {...props}
                />
            </InfiniteScroll>
        )
    }

    return (
        <React.Fragment>
            {
                renderScrollList()
            }
            {
                loading && <Loading />
            }
        </React.Fragment>
    )
}
Scroll.Item = List.Item
export default Scroll