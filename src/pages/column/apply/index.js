import React, { useState } from 'react';
import { history, useDispatch } from 'umi';
import { message, Card, Typography } from 'antd';
import Container from '@/components/Container';
import Form, { Submit } from '@/components/Form';
import formMap from './formMap';
import styles from './index.less';

const { Paragraph, Text } = Typography;
const { Name, Tags, Desc } = Form.createItem(formMap);

function Apply() {
    const [tags, setTags] = useState([]);
    const [nameErrors, setNameErrors] = useState();
    const [descErrors, setDescErrors] = useState();
    const [submiting, setSubmiting] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const queryName = (_, name) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: 'column/queryName',
                payload: {
                    name,
                },
            }).then(({ result, message }) => {
                if (result) return resolve();
                return reject(message);
            });
        });
    };

    const onTagsChange = values => {
        setTags(values);
    };

    const handleSubmit = values => {
        setSubmiting(true);
        const tags = values['tags'].map(v => {
            return v.id;
        });
        dispatch({
            type: 'column/create',
            payload: {
                ...values,
                tags,
            },
        }).then(({ result, status, ...res }) => {
            setSubmiting(false);
            if (result === true) {
                message.success('申请成功，请等待审核').then(() => {
                    history.push('/column');
                });
            } else {
                switch (status) {
                    case 1001:
                        setNameErrors(res.message);
                        break;
                    case 1002:
                        setDescErrors(res.message);
                        break;
                    default:
                        message.error(res.message);
                }
            }
        });
    };

    return (
        <Container
            className={styles['container']}
            metas={[
                { name: 'keywords', content: '专栏,专栏申请,itellyou' },
                {
                    name: 'description',
                    content:
                        'itellyou专栏申请，专栏旨在为信息安全主题下有持续创作及合作写作需求的用户提供媒介，打造独立内容品牌。创建专栏需要进行申请，通过审核后即可使用。',
                },
            ]}
        >
            <Card>
                <Card.Meta title={<h2>申请创建专栏</h2>} />
                <Typography className={styles['description']}>
                    <Text>
                        专栏旨在为信息安全主题下有持续创作及合作写作需求的用户提供媒介，打造独立内容品牌。创建专栏需要进行申请，通过审核后即可使用。
                    </Text>
                    <h4>申请人需满足以下要求</h4>
                    <Paragraph>
                        <ul>
                            <li>专栏须由本人申请，不可代为申请</li>
                            <li>
                                申请帐号的用户信息需符合《ITELLYOU用户信息管理规范》；https://www.itellyou.com/dis
                            </li>
                        </ul>
                    </Paragraph>
                    <h4>申请专栏的内容方向</h4>
                    <Paragraph>
                        <Text strong>
                            专栏绑定的话题即代表专栏的内容方向，请不要绑定过于宽泛的标签。
                        </Text>
                        <ul>
                            <li>
                                接受申请的方向：包括但不限于
                                企业安全、WEB安全、安全报告、安全管理、数据安全、新手科普、无线安全、系统安全、终端（手机、客户端等）安全、网络安全、安全工具、职场经历、人物报道、个人观点、会议活动记录
                                等专业方向的内容
                            </li>
                            <li>
                                不接受申请的方向：
                                包括但不限于与信息安全无关的涉及情感、两性、娱乐八卦、随笔、个人成长记录或成长心得、泛时政类（包括军事、政治、等话题）、可能影响他人利益或绑定过于宽泛的话题（如生活、趣味、脑洞等）。
                            </li>
                        </ul>
                    </Paragraph>
                </Typography>
                <Form layout="vertical" hideRequiredMark={true} onSubmit={handleSubmit} form={form}>
                    <Name
                        label="名称"
                        name="name"
                        autoComplete="off"
                        errors={nameErrors}
                        onBlur={e => {
                            if (e.change) setNameErrors(null);
                        }}
                        asyncValidator={queryName}
                    />
                    <Tags label="关联标签" name="tags" values={tags} onChange={onTagsChange} />
                    <Desc
                        label="简介"
                        name="description"
                        autoComplete="off"
                        errors={descErrors}
                        onBlur={e => {
                            if (e.change) setDescErrors(null);
                        }}
                    />
                    <Submit loading={submiting}>{submiting ? '提交中...' : '提交'}</Submit>
                </Form>
            </Card>
        </Container>
    );
}

export default Apply;
