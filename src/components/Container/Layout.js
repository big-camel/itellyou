import React from 'react'
import { Row, Col } from 'antd'

function Layout({ children , sider }){

    return (
        <Row gutter={16}>
            <Col span={7}>
                { 
                    sider 
                }
            </Col>
            <Col span={17}>
                {
                    children
                }
            </Col>
        </Row>
    )
}

export default Layout