import React from 'react'
import { Avatar } from 'antd'
import { Link } from 'umi'
import classnames from 'classnames'

import styles from './index.less'
import UserBrand from '../Brand'

export default ({info : { id , path , name , avatar , description , use_author } , size , extra , className , onlyAvatar}) => {
    size = size || "default"
    let avatarShape = "square"
    let avatarSize = 40
    if(size === "small"){
        avatarShape = "circle"
        avatarSize = 24
        description = undefined
    }
    return (
        <div className={classnames(styles["author"],styles[size],className)}>
            <div className={styles['avatar']}>
                <UserBrand id={id}>
                    <Avatar shape={avatarShape} size={avatarSize} src={avatar} />
                </UserBrand>
            </div>
            {
                !onlyAvatar && (
                    <div className={styles["title"]}>
                        <div className={styles["name"]} >
                            <UserBrand id={id}>
                                <Link to={`/${path}`}>{name}{ use_author && <span>(作者)</span>}</Link>
                            </UserBrand>
                        </div>
                        {
                            description && <div className={styles["desc"]}>{description}</div>
                        }
                    </div>
                )
            }
            
            {
                extra
            }
        </div>
    )
}