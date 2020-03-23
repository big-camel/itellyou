import React from 'react'
import { List } from 'antd'

const Default = ({ loading , dataSource , renderHeader , ...props }) => {

    renderHeader = renderHeader || function(){}

    const renderList = () => {
        return <List 
        loading={loading}
        header={renderHeader()}
        dataSource={dataSource}
        {...props}
        />
    }

    return renderList()
}

Default.Item = List.Item
export default Default