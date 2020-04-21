import React, { useState, useRef } from 'react';
import { useDispatch } from 'umi';
import { Upload, Modal, Button, Space, message } from 'antd';
import Form from '@/components/Form';
import formMap from './formMap';
import { ImageCropper } from '@/components/AvatarCropper';
import { FileImageOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { DeleteButton } from '@/components/Button';

const { Dragger } = Upload;
const { Cover, Desc } = Form.createItem(formMap);
export default ({ visible, id, custom_description, description, cover, onCancel }) => {
    custom_description = custom_description || '';
    cover = cover || '';
    onCancel = onCancel || function() {};
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [uploadSrc, setUploadSrc] = useState();
    const previewRef = useRef();
    const [loading, setLoading] = useState(false);

    const cropperRef = useRef();
    const uploadResolveRef = useRef();
    const uploadRejectRef = useRef();
    const uploadCallback = useRef();

    const getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const getUploadConfig = {
        action: '/api/upload/image?type=article',
        showUploadList: false,
        onChange: ({ file }) => {
            const { status, response } = file;
            if (status === 'done') {
                if (response && response.result === true) {
                    if (uploadCallback.current) {
                        cover = response.data.url;
                        form.setFieldsValue({ cover });
                        setUploadSrc(null);
                        uploadCallback.current();
                        uploadCallback.current = null;
                    }
                } else {
                    setLoading(false);
                    message.error(response ? response.message : '上传出错了');
                }
            }
        },
        beforeUpload: file => {
            return new Promise((resolve, reject) => {
                getBase64(file).then(base64 => {
                    setUploadSrc(base64);
                });

                if (uploadRejectRef.current) {
                    uploadRejectRef.current();
                }

                uploadRejectRef.current = reject;
                uploadResolveRef.current = blob => {
                    resolve(new File([blob], file.name, { ...file }));
                };
            });
        },
    };

    const renderCover = () => {
        if ((!cover || cover === '') && !uploadSrc) {
            return (
                <div>
                    <p>
                        <FileImageOutlined />
                    </p>
                    <p>添加封面有助于吸引读者</p>
                </div>
            );
        }

        if (uploadSrc)
            return (
                <ImageCropper
                    ref={cropperRef}
                    src={uploadSrc}
                    preview={`.${styles['preview']}`}
                    width={240}
                    height={150}
                    aspectRatio={1.6}
                    cropWidth={400}
                    guides={false}
                    viewMode={1}
                    autoCropArea={1}
                    dragMode="move"
                />
            );

        if (cover)
            return (
                <div className={styles['thumb']} style={{ backgroundImage: `url(${cover})` }}></div>
            );
    };

    const onSubmit = () => {
        form.validateFields()
            .then(values => {
                const updateValues = {};
                if (values.custom_description !== custom_description) {
                    updateValues.custom_description = values.custom_description;
                }
                if (values.cover !== cover) {
                    updateValues.cover = values.cover;
                }
                if (Object.keys(updateValues).length === 0) {
                    return onCancel();
                }

                dispatch({
                    type: 'doc/meta',
                    payload: {
                        data: { ...updateValues, id },
                    },
                }).then(res => {
                    setLoading(false);
                    if (!res.result) {
                        message.error(res.message);
                    } else {
                        onCancel();
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSubmit = () => {
        if (loading) return;
        setLoading(true);
        if (cropperRef.current && uploadResolveRef.current) {
            uploadCallback.current = onSubmit;
            cropperRef.current.getCanvas().toBlob(blob => {
                uploadResolveRef.current(blob);
            });
        } else {
            onSubmit();
        }
    };

    return (
        <Modal
            title="文章设置"
            visible={visible}
            cancelText="取消"
            okText="确定"
            onOk={handleSubmit}
            okButtonProps={{
                loading,
            }}
            onCancel={onCancel}
        >
            <Form
                layout="vertical"
                hideRequiredMark={true}
                form={form}
                initialValues={{
                    custom_description: custom_description || description,
                    cover,
                }}
            >
                <Desc label="摘要" name="custom_description" autoComplete="off" />
                <Cover
                    label="封面"
                    name="cover"
                    extra={
                        <div className={styles['cover']}>
                            <div className={styles['copper']}>
                                {
                                    <Dragger {...getUploadConfig} disabled={uploadSrc}>
                                        {renderCover()}
                                    </Dragger>
                                }
                            </div>
                            <div className={styles['wrapper']}>
                                {uploadSrc && (
                                    <div className={styles['preview']}>
                                        <div ref={previewRef} className={styles['thumb']} />
                                    </div>
                                )}
                                <Space>
                                    <Upload {...getUploadConfig}>
                                        <Button icon={uploadSrc ? null : <UploadOutlined />}>
                                            {uploadSrc || cover ? '重新上传' : '上传图片'}
                                        </Button>
                                    </Upload>
                                    {uploadSrc && (
                                        <DeleteButton
                                            type="link"
                                            className={styles['clear-img']}
                                            onClick={() => setUploadSrc(null)}
                                        >
                                            清除图片
                                        </DeleteButton>
                                    )}
                                </Space>
                            </div>
                        </div>
                    }
                />
            </Form>
        </Modal>
    );
};
