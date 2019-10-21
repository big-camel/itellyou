import React from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { List , Icon } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'

class Draft extends React.Component{

    state = {
        size:10,
        page:1,
    }

    componentWillMount(){
        const { location:{ query } } = this.props
        const { page } = query
        this.setState({
            page: parseInt(page || 1)
        })
    }

    componentDidMount(){
        this.getList()
    }

    getList = () => {
        const { dispatch } = this.props
        const { page , size } = this.state
        dispatch({
            type:'draft/list',
            payload:{
                page,
                size
            }
        })
    }

    onPageChange = page => {
        this.setState({
            page
        },
        ()=>{
            this.getList()
        })
    }

    onDeleteDraft = draft_id => {
        const { dispatch } = this.props
        dispatch({
            type:'draft/delete',
            payload:{
                draft_id
            }
        }).then(res => {
            if(res.result){
               this.getList()
            }
        })
    }

    renderList = () => {
        const { list,listLoading } = this.props
        const { size } = this.state
        if(!list || listLoading){
            return <Loading />
        }
        return <List 
        pagination={{
            onChange:this.onPageChange,
            current:list.page,
            pageSize:size,
            total:list.total,
            itemRender:(page,type) => {
                let pageText = page
                if(type === "prev")
                    pageText = "上一页"
                else if(type === "next")
                    pageText = "下一页"
                else if(type === "jump-prev" || type === "jump-next")
                    pageText = <Icon type="ellipsis" />
                return (
                    <Link to={`/user/draft?page=${page}`}>{pageText}</Link>
                )
            }
        }}
        dataSource={list.data}
        renderItem={draft => (
            <List.Item
            key={draft.draft_id}
            >
                <div>
                    <span>{draft.source_name}</span>
                    <Link target="_blank" to={draft.source_type === 'tag' ? `/tag/${encodeURIComponent(draft.draft_title)}/edit?draft=${draft.draft_id}` : '/'}>{draft.draft_title}</Link>
                    <span>{draft.created_time}</span>
                    <span><a onClick={()=>{
                        this.onDeleteDraft(draft.draft_id)
                    }}>删除</a></span>
                </div>
            </List.Item>
        )}
        />
    }

    render(){
        return (
            <DocumentTitle title={`草稿箱 \xB7 用户中心 \xB7 ITELLYOU`}>
                <div>
                    { this.renderList() }
                </div>
            </DocumentTitle>
        )
    }
}
export default connect(({ draft , loading }) => ({
    list:draft.list,
    listLoading:loading.effects['draft/list']
}))(Draft)