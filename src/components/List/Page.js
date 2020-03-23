import React , { useState , useEffect } from 'react'
import { Pagination } from 'antd'
import List from './Default'
import Loading from '../Loading'

const Page = ({ dataSource , offset , limit , onChange , ...props }) => {

    offset = offset || 0
    limit = limit || 20

    const [ loading , setLoading ] = useState(false)

    onChange = onChange || function(){
        setLoading(false)
    }

    const [ page , setPage ] = useState(offset < limit ? 1 : Math.ceil(offset / limit))

    useEffect(() => {
        setLoading(false)
    },[dataSource])

    if(!dataSource) return <Loading />

    const renderPage = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>
        }
        if (type === 'next') {
            return <a>下一页</a>
        }
        return originalElement
    }

    const renderPageList = () => {
        return (
        <React.Fragment>
            <List 
            loading={loading}
            dataSource={dataSource.data} 
            {...props}
            />
            <Pagination 
            onChange={page => {
                if(!loading){
                    setLoading(true)
                    onChange((page - 1) * limit,limit)
                    setPage(page)
                }
            }}
            current={page}
            itemRender={renderPage}
            hideOnSinglePage={true}
            pageSize={limit}
            total={dataSource ? dataSource.total : 0}
            />
        </React.Fragment>
        )
    }
    return renderPageList()
}
Page.Item = List.Item
export default Page