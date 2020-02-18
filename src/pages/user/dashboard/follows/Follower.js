import React , { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import { Table, Button } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'
import Timer from '@/components/Timer'

export default () => {

    const [ page , setPage ] = useState(1)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.userStar ? state.userStar.followerList : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['userStar/followerList']

    useEffect(() => {
        dispatch({
            type:'userStar/followerList',
            payload:{
                offset:(page - 1) * limit,
                limit
            }
        })
    },[page, limit, dispatch])

    const renderPage = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>
        }
        if (type === 'next') {
            return <a>下一页</a>
        }
        return originalElement
    }

    const columns = [
        {
            title:"名称",
            dataIndex:"name",
            key:"name",
            ellipsis:true,
            width:100,
            render:(_,{ follower : { id , name} }) => {
                return <Link to={`/user/${id}`} target="_blank">{name}</Link>
            }
        },
        {
            title:"简介",
            dataIndex:"description",
            key:"description",
            width:250,
            render:(_,{ follower : { description } }) => {
                return description
            }
        },
        {
            title:"关注时间",
            dataIndex:"created_time",
            key:"created_time",
            render:(text) => {
                return <Timer time={new Date(text)} />
            }
        }
    ]

    const renderTable = () => {
        if(!dataSource) return <Loading />
        return (
            <Loading loading={loading} >
                <Table 
                rowKey={row => row.follower.id} 
                columns={columns}
                dataSource={dataSource.data}
                pagination={{
                    onChange:page => {
                        setPage(page)
                    },
                    current:page,
                    itemRender:renderPage,
                    hideOnSinglePage:true,
                    pageSize:limit,
                    total:dataSource ? dataSource.total : 0
                }}
                />
            </Loading>
        )
    }

    return  renderTable()
}