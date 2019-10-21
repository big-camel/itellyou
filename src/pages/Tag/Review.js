import React from 'react'
import { PageHeader , List , Icon , Modal , Button, message } from 'antd'
import Loading from '@/components/Loading'
import nodeHtmldiff from 'node-htmldiff'
import { connect } from 'dva'
import { Link } from 'umi'
import styles from './Review.less'

class Review extends React.Component {

    state = {
        size:20,
        page:1,
        versionStatus:false,
        versionInfo:{},
    }

    componentWillMount(){
        const { location:{ query } } = this.props
        const { page } = query
        this.setState({
            page: parseInt(page || 1)
        })
    }

    componentDidMount(){
        this.getListData()
    }

    getDiffBase = version_id => {
        const { dispatch } = this.props
        dispatch({
            type:'tag/getDiffBase',
            payload:{
                version_id
            }
        }).then(res => {
            this.setState({
                versionInfo:{version_id,...res.data}
            })
        })
    }

    getListData = () => {
        const { dispatch } = this.props
        const { page , size } = this.state
        dispatch({
            type:'tag/auditList',
            payload:{
                page:page,
                size:size
            }
        })
    }

    onShowVersion = version_id => {
        this.setState({
            versionStatus:true
        })
        this.getDiffBase(version_id)
    }

    onPageChange = page => {
        this.setState({
            page
        },
        ()=>{
            this.getListData()
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
                    <Link to={`/tag/review?page=${page}`}>{pageText}</Link>
                )
            }
        }}
        dataSource={list.data}
        renderItem={item => (
            <List.Item
            key={item.version_id}
            >
                <div>
                    <h2>{item.tag_name}</h2>
                    <div>{item.modify_reason}</div>
                    <Button onClick={() => {
                        this.onShowVersion(item.version_id)
                    }}>审核</Button>
                </div>
            </List.Item>
        )}
        />
    }

    /**
     * 渲染 diff
     *
     * @param {string} current 当前内容
     * @param {string} base 历史内容
     */
    renderDiff(current, base) {
  
        const result = nodeHtmldiff(base, current, styles['html-diff'], null, 'iframe,video,em,strong,del')
        return <div 
        className={styles["doc-diff"]}
        dangerouslySetInnerHTML={{
            __html: result
        }}
        />
    }

    onReviewVersion = state => {
        const { versionInfo } = this.state
        const { dispatch } = this.props
        dispatch({
            type:"tag/auditVersion",
            payload:{
                version_id:versionInfo.version_id,
                state:state ? 1 : 2
            }
        }).then(res => {
            if(res.result){
                message.success("审核成功")
                this.onCloseVersion()
                this.getListData()
            }else{
                message.error(res.message)
            }
        })
    }

    onCloseVersion = () => {
        this.setState({
            versionStatus:false,
            versionInfo:{}
        })
    }

    render(){
        const { diffLoading } = this.props
        const { versionInfo , versionStatus } = this.state
        return (
            <PageHeader 
                title="标签审核"
                className={styles['tag-list']}
                >
                    {this.renderList()}
                    {
                        versionStatus && (
                        <Modal 
                        className={"doc-history-modal"}
                        width={1080}
                        style={{
                            top: 56
                        }}
                        title={null}
                        footer={null}
                        visible={true}
                        closable={false}
                        onCancel={this.onCloseVersion}
                        >
                            { 
                                diffLoading && (
                                    <Loading />
                                )
                            }
                            {
                                !diffLoading && (
                                    <div className={styles['doc-diff']}>
                                        <h2>内容</h2>
                                        {this.renderDiff(versionInfo.target,versionInfo.current)}
                                        <Button onClick={()=>{
                                            this.onReviewVersion(true)
                                        }}>通过</Button><Button
                                        onClick={()=>{
                                            this.onReviewVersion(false)
                                        }}
                                        >拒绝</Button>
                                    </div>
                                )
                            }
                        </Modal>
                        )
                    }
            </PageHeader>
        )
    }
}

export default connect(({ tag ,loading }) => ({
    list:tag.auditList,
    listLoading:loading.effects['tag/auditList'],
    diffLoading:loading.effects['tag/getDiffBase'],
}))(Review)