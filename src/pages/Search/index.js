import React, { useState, useEffect, useRef } from 'react';
import { Link, useSelector, useDispatch, Helmet } from 'umi';
import { Empty, Menu, Card, Avatar } from 'antd';
import Container, { Layout } from '@/components/Container';
import { MoreList } from '@/components/List';
import Loading from '@/components/Loading';
import { getPageQuery } from '@/utils';
import styles from './index.less';

import menus from './menus';
import { Question, Answer, Article } from '@/components/Content';
import { UserAuthor } from '@/components/User';

const fetch = (dispatch, offset, limit, type, word, append, parmas) => {
    return dispatch({
        type: 'search/list',
        payload: {
            t: type === 'all' ? null : type,
            q: word,
            append,
            offset,
            limit,
            ...parmas,
        },
    });
};

function Search({ location: { query } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const limit = parseInt(query.limit || 20);
    const type = query.t || 'all';
    const word = query.q || '';
    const wordRef = useRef(word);
    const typeRef = useRef(type);

    const dispatch = useDispatch();

    const search = useSelector((state) => state.search);
    const settings = useSelector((state) => state.settings);
    const list = search ? search.list : null;

    useEffect(() => {
        typeRef.current = type;
        wordRef.current = word;
    }, [type, word]);

    if (word === '') return <Empty />;

    const renderQuestion = ({ highlight: { title, content }, object }) => {
        return (
            <Question
                data={{
                    ...object,
                    title,
                    description: content,
                }}
            />
        );
    };

    const renderAnswer = ({ highlight: { title, content }, object }) => {
        return (
            <React.Fragment>
                <h4 className={styles['search-title']}>
                    <Link
                        to={`/question/${object.question_id}/answer/${object.id}`}
                        dangerouslySetInnerHTML={{ __html: title }}
                    ></Link>
                </h4>
                <Answer data={{ ...object, description: content }} desc={true} authorSize="small" />
            </React.Fragment>
        );
    };

    const renderArticle = ({ highlight: { title, content }, object }) => {
        return (
            <Article
                data={{ ...object, title, description: content }}
                desc={true}
                authorSize="small"
            />
        );
    };

    const renderColumn = ({ highlight: { name, description }, object: { avatar, path } }) => {
        return (
            <MoreList.Item.Meta
                avatar={<Avatar src={avatar} />}
                title={<Link to={`/${path}`} dangerouslySetInnerHTML={{ __html: name }}></Link>}
                description={
                    <div
                        className={styles['search-content']}
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                }
            />
        );
    };

    const renderTag = ({ highlight: { name, description }, object: { icon, id } }) => {
        return (
            <MoreList.Item.Meta
                avatar={icon ? <Avatar src={icon} /> : null}
                title={<Link to={`/tag/${id}`} dangerouslySetInnerHTML={{ __html: name }}></Link>}
                description={
                    <div
                        className={styles['search-content']}
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                }
            />
        );
    };

    const renderUser = ({ highlight: { name, description }, object }) => {
        return <UserAuthor info={{ ...object, name, description }} />;
    };

    const renderItem = (item) => {
        const { type } = item;
        let child = <div>Unknow type</div>;
        switch (type) {
            case 'question':
                child = renderQuestion(item);
                break;
            case 'answer':
                child = renderAnswer(item);
                break;
            case 'article':
                child = renderArticle(item);
                break;
            case 'column':
                child = renderColumn(item);
                break;
            case 'tag':
                child = renderTag(item);
                break;
            case 'user':
                child = renderUser(item);
                break;
        }
        return <MoreList.Item className={styles['search-item']}>{child}</MoreList.Item>;
    };

    const renderList = () => {
        if (!list) return <Loading />;

        return (
            <>
                <Helmet>
                    <title>
                        {word !== ''
                            ? `${word} - 搜索结果 - ${settings.title}`
                            : `搜索 - ${settings.title}`}
                    </title>
                    <meta name="keywords" content={`itellyou站内搜索,${word}`} />
                    <meta name="description" content={`itellyou站内搜索-${word}-的结果`} />
                </Helmet>
                <Container className={styles['search-list']}>
                    <Layout>
                        <div>
                            <Menu
                                className={styles['menu']}
                                mode="horizontal"
                                defaultSelectedKeys={[type]}
                            >
                                {menus.map(({ key, title }) => (
                                    <Menu.Item key={key}>
                                        <Link
                                            to={`/search?${
                                                key === 'all' ? '' : `t=${key}&`
                                            }q=${word}`}
                                        >
                                            {title}
                                        </Link>
                                    </Menu.Item>
                                ))}
                            </Menu>
                            <Card>
                                <Card.Meta title={<div>找到约 {list.hits} 条结果</div>} />
                                <MoreList
                                    itemLayout="vertical"
                                    dataSource={list}
                                    offset={offset}
                                    limit={limit}
                                    renderItem={renderItem}
                                    onChange={(offset) => {
                                        setOffset(offset);
                                        fetch(
                                            dispatch,
                                            offset,
                                            limit,
                                            type,
                                            word,
                                            wordRef.current === word && typeRef.current === type,
                                        );
                                    }}
                                />
                            </Card>
                        </div>
                        <Card>
                            <ul>
                                <li>
                                    <a
                                        target="_blank"
                                        href={`https://www.baidu.com/s?wd=site:yanmao.cc ${word}`}
                                    >
                                        在 百度 中搜索
                                    </a>
                                </li>
                                <li>
                                    <a
                                        target="_blank"
                                        href={`https://www.google.com/?gws_rd=ssl#newwindow=1&q=site:yanmao.cc+${word}`}
                                    >
                                        在 Google 中搜索
                                    </a>
                                </li>
                            </ul>
                        </Card>
                    </Layout>
                </Container>
            </>
        );
    };

    return renderList();
}

Search.getInitialProps = async ({ isServer, store, params, history }) => {
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }
    const type = query ? query.t : null;
    const word = query ? query.q : null;
    const { dispatch, getState } = store;
    await fetch(dispatch, 0, 20, type || 'all', word || '', false, params);

    if (isServer) return getState();
};

export default Search;
