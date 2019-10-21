import React from 'react'
import TagForm from '@/components/Form/Tag'
import { connect } from 'dva'
import { Form , Row , Col , Button , message } from 'antd'
const { TagName , TagDesc , Submit } = TagForm;

class CreateForm extends React.Component {

    state = {
        tagNameStatus:{
            status:null,
            message:null,
        },
        tagDescStatus:{
            status:null,
            message:null,
        }
    }

    handleSubmit = (err, values) => {
        if(!err){
            values['tag_name'] = values['tag_name'].toLowerCase()
            const { onCallback , dispatch } = this.props
            
            dispatch({
                type:'tag/create',
                payload:{
                    ...values
                }
            }).then(res => {
                if(res.result === true){
                    this.tagForm.resetFields()
                    if(onCallback)
                        onCallback()
                    else{
                        message.success("创建成功")
                    }
                }else if(res.code === 1001){
                    this.setState({
                        tagNameStatus:{
                            status:false,
                            message: res.message
                        }
                    })
                }else if(res.code === 1002){
                    this.setState({
                        tagDescStatus:{
                            status:false,
                            message: res.message
                        }
                    })
                }
            })
        }
    }

    onTagQuery = value => {
        value = value.toLowerCase()
        const { dispatch } = this.props 
        dispatch({
            type:'tag/query',
            payload:{
                tag_name:value
            }
        }).then(res => {
            if(res.result === true){
                this.setState({
                    tagNameStatus:{
                        status:false,
                        message: res.data.status !== 2 ? "标签已被创建" : "标签已被创建并且已删除"
                    }
                })
            }else{
                this.setState({
                    tagNameStatus:{
                        status:true,
                        message:null
                    }
                })
            }
        })
    }

    onCancel = () => {
        this.tagForm.resetFields()
        const { onCallback } = this.props
        if(onCallback)
            onCallback()
    }

    render(){
        const { tagNameStatus , tagDescStatus } = this.state
        const { defaultName , tagCreateLoading } = this.props
        return(
            <TagForm
            onSubmit={this.handleSubmit}
            wrappedComponentRef ={wrappedComponent => {
                this.tagForm = wrappedComponent ? wrappedComponent.props.form : null;
            }}
            >
                <TagName 
                defaultValue={defaultName}
                autoComplete='off'
                name="tag_name"
                itemStatus={tagNameStatus} 
                ansyVaildate={this.onTagQuery} 
                />
                <TagDesc 
                defaultValue=""
                autoComplete='off'
                name="tag_desc"
                itemStatus={tagDescStatus}
                />
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Button style={{width:'100%'}} onClick={this.onCancel} >取消</Button>
                        </Col>
                        <Col span={12}>
                            <Submit size={null} loading={tagCreateLoading}>{ tagCreateLoading ? '创建中...' : '提交'}</Submit>
                        </Col>
                    </Row>
                </Form.Item>
            </TagForm>
        )
    }
}
export default connect(({ tag ,loading }) => ({
    tagDetail:tag.detail,
    tagDetailLoading:loading.effects['tag/query'],
    tagCreateLoading:loading.effects['tag/create'],
}))(CreateForm)