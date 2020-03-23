import React, { useState } from 'react'
import { Row, Col } from 'antd'
import Recommends from './components/Recommends'
import Writer from './components/Writer'
import Answerer from './components/Answerer'


export default () => {

    return (
        <Row gutter={16}>
            <Col span={18}>
                <Recommends />
            </Col>
            <Col span={6}>
                <Writer />
                <Answerer />
            </Col>
        </Row>
    )
}