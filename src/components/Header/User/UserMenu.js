import React from 'react'
import { Popover , Avatar , Menu , Icon } from 'antd'
import { Link } from 'umi'
import { useDispatch } from 'dva'
import styles from './index.less'

export default ({ avatar , name , path }) => {

    const dispatch = useDispatch()

    const onLogout = () => {
        dispatch({
            type:"user/logout"
        })
    }

    const menu = (
        <div className={styles['user-menu']}>
            <div className={styles['info']}>
                <span className={styles['name']}>{name}</span>
            </div>
            <Menu>
                <Menu.Divider />
                <Menu.Item key="userCenter"><Link to={`/${path}`}><Icon type="user" />个人主页</Link></Menu.Item>
                <Menu.Item key="userMain"><Link to="/dashboard"><Icon type="user" />个人中心</Link></Menu.Item>
                <Menu.Item key="userSetting"><Link to="/settings/profile"><Icon type="setting" />账户设置</Link></Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" onClick={onLogout}><Icon type="logout" />退出</Menu.Item>
            </Menu>
        </div>
    )
    return (
        <Popover 
        content={menu} 
        placement="bottomRight"
        >
            <div><Avatar src={avatar} size={24}/></div>
        </Popover>
    )
}