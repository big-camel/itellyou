import React, { useEffect, useState } from 'react';
import { Popover, Avatar } from 'antd';
import { useDispatch, useSelector, Link } from 'umi';
import Loading from '@/components/Loading';
import ColumnStar from '../Star';
import styles from './index.less';

export default ({ id, placement, children }) => {
    placement = placement || 'bottomLeft';
    const dispatch = useDispatch();
    const detail = useSelector((state) => state.column.detail[id]);
    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['column/detail'];
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible && !detail && id) {
            dispatch({
                type: 'column/detail',
                payload: {
                    id,
                },
            });
        }
    }, [id, visible, detail, dispatch]);

    const renderContent = () => {
        if (!detail || loading) {
            return <Loading />;
        }
        const { name, description, avatar, star_count, article_count, path } = detail;

        return (
            <div className={styles['column-card']}>
                <div className={styles['body']}>
                    <Avatar shape="circle" src={avatar} size={48} />
                    <div className={styles['info']}>
                        <h2>
                            <Link to={`/${path}`}>{name}</Link>
                        </h2>
                        {description && description !== '' && (
                            <div className={styles['desc']}>{description}</div>
                        )}
                    </div>
                </div>
                <div className={styles['footer']}>
                    <div className={styles['follow']}>
                        <div className={styles['item']}>
                            文章数<span className={styles['count']}>{article_count}</span>
                        </div>
                        <div className={styles['item']}>
                            关注者<span className={styles['count']}>{star_count}</span>
                        </div>
                    </div>
                    <ColumnStar id={id} use_star={detail.use_star} />
                </div>
            </div>
        );
    };

    return (
        <Popover
            target="hover"
            arrowPointAtCenter
            mouseEnterDelay={1}
            onVisibleChange={(visible) => setVisible(visible)}
            content={renderContent()}
            placement={placement}
        >
            {children}
        </Popover>
    );
};
