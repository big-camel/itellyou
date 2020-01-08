import React, { useState, useEffect } from 'react'
import { Select , Modal } from 'antd'

import CreateForm from './CreateForm'
import { useDispatch , useSelector } from 'dva'

function Selector({ values , placeholder , mode , enableCreate , ...props }){ 
    enableCreate = enableCreate === undefined ? "create" : enableCreate
    mode = mode || "multiple"
    const [ value , setValue ] = useState("")
    const [ createVisible , setCreateVisible ] = useState(false)
    const [ createValue , setCreateValue ] = useState("")

    const dispatch = useDispatch()
    const tag = useSelector(state => state.tag)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['tag/search']
    const dataSource = tag.search || []

    const clearData = () => {
        dispatch({
            type:'tag/setSearch',
            payload:[]
        })
    }

    const onSearch = val => {
        val = val.trim()
        setValue(val)
        if(val === ""){
            if(loading){
                setTimeout(() => {
                    clearData()
                }, 200)
            }else{
                clearData()
            }
            return
        }
        dispatch({
            type:'tag/search',
            payload:{
                w:val,
                enableCreate:enableCreate
            }
        })
    }

    const onChange = values => {
        if(enableCreate && values.length > 0 && values[values.length - 1].key === enableCreate){
            values.splice(values.length - 1 , 1)
        }
        if(props.onChange)
        {
            props.onChange(values)
        }
    }

    const onSelect = value => {
        if(enableCreate && value.key === enableCreate){
            setCreateVisible(true)
            setCreateValue(value.name)
        }else if(props.onSelect)
        {
            props.onSelect(value)
        }
        dispatch({
            type:"tag/setSearch",
            payload:[]
        })
    }

    const onCreateCallback = () => {
        setCreateVisible(false)
        setCreateValue("")
    }

    const renderOption = option => {
        if(enableCreate && option.id === enableCreate){
            return (
                <Select.Option 
                key={option.id} 
                label={option.name} 
                onClick={()=>{ 
                    onSelect({key:option.id,name:option.name}) 
                }}>
                    创建标签 <strong>{option.name}</strong>
                </Select.Option>
            )
        }else if(value){
            let prefix = null
            let name = option.name
            if(value !== "" && name.indexOf(value) > -1){
                prefix = value
                name = name.substring(value.length)
            }
            return (
            <Select.Option 
            key={option.id} 
            label={option.name} 
            onClick={()=>{ 
                onSelect({key:option.id,name:option.name}) 
            }}>
                {prefix ? <strong>{prefix}</strong> : null}{name}
            </Select.Option>
            )
        }
    }

    return (
        <React.Fragment>
            <Select
            value={values}
            loading={loading}
            mode={mode}
            optionLabelProp="label"
            placeholder={placeholder}
            labelInValue={true}
            filterOption={false}
            notFoundContent={null}
            onSearch={onSearch}
            onChange={onChange}
            onBlur={() => clearData()}
            style={{ width: '100%' }}
            >
                {
                    dataSource && dataSource.map(data => (
                        renderOption(data)
                    ))
                }
            </Select>
            {
                enableCreate && <Modal
                title="创建标签"
                visible={createVisible}
                onCancel={onCreateCallback}
                destroyOnClose={true}
                footer={null}
                width={800}
                >
                    <CreateForm 
                    defaultName={createValue}
                    onCallback={onCreateCallback}
                    />
                </Modal>
            }
        </React.Fragment>
    )
}

export default Selector