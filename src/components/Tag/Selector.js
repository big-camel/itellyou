import React from 'react'
import { Select , Modal } from 'antd'
import { connect } from 'dva'
import CreateForm from './CreateForm'

class Selector extends React.Component { 

    state = {
        searchData:[],
        searchValue:"",
        createVisible:false,
        createValue:""
    }

    onTagSearch = value => {
        const { onSearch , dispatch , create } = this.props
        this.setState({
            searchValue:value
        })
        if(onSearch){
            onSearch(value)
        }else{
            if(value.trim() === ""){
                this.setState({
                    searchData:[]
                })
                return
            }
            dispatch({
                type:'tag/search',
                payload:{
                    w:value
                }
            }).then(res => {
                let searchData = [];
                if(res.result){
                    if(create && res.data.length === 0 && value.trim() !== ""){
                        searchData.push({
                            id:"create",
                            name:value.trim()
                        })
                    }else{
                        searchData = res.data
                    }
                }
                this.setState({
                    searchData
                })
            })
        }
    }

    onTagChange = values => {
        if(values.length > 0 && values[values.length - 1].key === "create"){
            values.splice(values.length - 1 , 1)
        }
        this.setState({
            searchData:[]
        })
        const { onChange } = this.props
        if(onChange)
        {
            onChange(values)
        }
    }

    onTagSelect = value => {
        const { onSelect , create } = this.props
        if(create && value.key === "create"){
            this.setState({
                createVisible:true,
                createValue:value.name
            })
        }else if(onSelect)
        {
            onSelect(value)
        }
    }

    onTagCreateCallback = () => {
        this.setState({
            createVisible:false,
            createValue:""
        })
    }

    renderSearchOption = option => {
        let { searchValue } = this.state
        if(option.id === "create"){
            return (
                <Select.Option key={option.id} label={option.name} onClick={()=>{ this.onTagSelect({key:option.id,name:option.name}) }}>
                    创建标签 <strong>{option.name}</strong>
                </Select.Option>
            )
        }else if(searchValue){
            searchValue = searchValue.trim()
            let prefix = null
            let name = option.name
            if(searchValue !== "" && name.indexOf(searchValue) > -1){
                prefix = searchValue
                name = name.substring(searchValue.length)
            }
            return (
            <Select.Option key={option.id} label={option.name} onClick={()=>{ this.onTagSelect({key:option.id,name:option.name}) }}>
                {prefix ? <strong>{prefix}</strong> : null}{name}
            </Select.Option>
            )
        }
    }

    render(){
        const { values , placeholder , create , mode , searchLoading } = this.props
        const { searchData , createVisible , createValue } = this.state
        return (
            <React.Fragment>
                <Select
                value={values}
                loading={searchLoading}
                mode={mode}
                optionLabelProp="label"
                placeholder={placeholder}
                labelInValue={true}
                filterOption={false}
                notFoundContent={null}
                onSearch={this.onTagSearch}
                onChange={this.onTagChange}
                onBlur={() => {
                    this.setState({
                        searchData:[]
                    })
                }}
                style={{ width: '100%' }}
                >
                    {
                        searchData.map(data => (
                            this.renderSearchOption(data)
                        ))
                    }
                </Select>
                {
                    create && <Modal
                    title="创建标签"
                    visible={createVisible}
                    onCancel={this.onTagCreateCallback}
                    destroyOnClose={true}
                    footer={null}
                    >
                        <CreateForm 
                        defaultName={createValue}
                        onCallback={this.onTagCreateCallback}
                        />
                    </Modal>
                }
            </React.Fragment>
        )
    }
}

Selector.defaultProps = {
    create:true,
    mode:"multiple"
}

export default connect(({ loading }) => ({
    searchLoading:loading.effects['tag/search']
}))(Selector)