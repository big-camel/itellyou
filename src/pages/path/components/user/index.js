import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Link, router } from 'umi'
import { Row, Col, Card, Avatar, Button, Menu } from 'antd'
import { useDispatch, useSelector } from 'dva'
import Loading from '@/components/Loading'
import styles  from './index.less'
import menus from './menu'
import { UserStar } from '@/components/User'

export default ({ id , paths }) => {
    const menuKey = paths && paths.length > 1 ? paths[1] : "activity"
    if(!menus.find(menu => menu.key === menuKey)) router.push("/404")
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:"user/find",
            payload:{
                id
            }
        })
    },[dispatch, id])

    const detail = useSelector(state => state.user.detail[id])
   
    if(!detail) return <Loading />

    const { avatar , name , description , use_star , star_count , follower_count , profession , address} = detail
    const menu = menus.find(item => item.key === menuKey)
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card
                bordered
                className={styles["info-card"]}
                >
                    <div className={styles["info-head"]}>
                        <Avatar src={avatar} size={96}  />
                        <h2>{ name }</h2>
                        <p className={styles["description"]}>{ description }</p>
                    </div>
                    <div className={styles["info-follow"]}>
                        <div>
                            <UserStar 
                            className={styles["btn"]}
                            id={id}
                            use_star={detail.use_star}
                            />
                        </div>
                        <div className={styles["info"]}>
                            <Link to="followings">
                                <p>关注了</p>
                                <p className={styles["count"]}>{ star_count }</p>
                            </Link>
                            <div className={styles["split"]}></div>
                            <Link to="follower">
                                <p>关注者</p>
                                <p className={styles["count"]}>{ follower_count }</p>
                            </Link>
                        </div>
                    </div>
                    <div className={styles["info-detail"]}>
                        <p>地址:{address || "未填写"}</p>
                        <p>行业:{profession || "未填写"}</p>
                    </div>
                </Card>
            </Col>
            <Col span={16}>
                <Card
                title={
                    <Menu
                    mode="horizontal"
                    defaultSelectedKeys={menuKey}
                    >
                    {
                        menus.map(({ key , title }) => <Menu.Item 
                        key={key} 
                        className={classNames({"active" : key === menuKey})}>
                            <Link to={`/${paths[0]}/${key}`}>{ title }</Link>
                        </Menu.Item>)
                    }
                    </Menu>
                }
                >
                    <menu.component id={id} />
                </Card>
            </Col>
        </Row>
    )
}