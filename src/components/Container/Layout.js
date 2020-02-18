import React from 'react'
import { Row, Col } from 'antd'
import Sider from './Sider'

function Layout({ span , siderData , siderKey, children , contents }){
    contents = contents || []
    span = span || 7
    if(!Array.isArray(span)) span = [span]
    if(span.length === 1){
        span.push(24 - span)
    }
    const getSider = () => {
        if(contents.length > 0) return contents[0]
        return <Sider dataSource={siderData} defaultKey={siderKey} />
    }

    const getContents = () => {
        const contentArry = []
        for(let i = 2;i < span.length;i++){
            contentArry.push(
                <Col span={span[i]}>
                    {
                        contents[i - 2]
                    }
                </Col>
            )        
        }
        return contentArry
    }

    return (
        <Row gutter={16}>
            <Col span={span[0]}>
                { 
                    getSider() 
                }
            </Col>
            <Col span={span[1]}>
                {
                    contents.length > 1 ? contents[1] : children
                }
            </Col>
            {
                getContents()
            }
        </Row>
    )
}

export default Layout