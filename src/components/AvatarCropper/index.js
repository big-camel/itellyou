import React, { useState, useRef } from 'react';
import ImageCropper from './ImageCropper';
import { Upload, Button, Modal, message } from 'antd';
import styles from './index.less';
import { UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export default ({ url, onChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [uploadSrc, setUploadSrc] = useState();
    const [uploading, setUploading] = useState(false);

    const cropperRef = useRef();
    const uploadResolveRef = useRef();
    const uploadRejectRef = useRef();

    const getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const getUploadConfig = {
        action: '/api/upload/image?type=avatar',
        showUploadList: false,
        onChange: ({ file }) => {
            const { status, response } = file;
            if (status === 'done') {
                setModalVisible(false);
                setUploading(false);
                if (response && response.result === true) {
                    if (onChange) {
                        onChange(response.data.url);
                    }
                } else {
                    message.error(response ? response.message : '上传出错了');
                }
            }
        },
        beforeUpload: async file => {
            const base64 = await getBase64(file);
            setUploadSrc(base64);
            if (!modalVisible) {
                setModalVisible(true);
            }
            return new Promise((resolve, reject) => {
                if (uploadRejectRef.current) {
                    uploadRejectRef.current();
                }
                uploadRejectRef.current = reject;
                uploadResolveRef.current = blob => {
                    setUploading(true);
                    resolve(new File([blob], file.name, { ...file }));
                };
            });
        },
    };

    return (
        <div className={styles['profile-avatar']}>
            <div className={styles['upload-area']}>
                <img src={url} style={{ borderRadius: 28 }} />
                <Dragger {...getUploadConfig} />
            </div>
            <div className={styles['upload-btn']}>
                <Upload {...getUploadConfig}>
                    <Button>
                        <UploadOutlined />
                        上传头像
                    </Button>
                </Upload>
                <p>可以拖动图片到左边头像区域完成上传</p>
            </div>
            <Modal
                title="编辑头像"
                visible={modalVisible}
                destroyOnClose={true}
                centered={true}
                width={520}
                onCancel={() => {
                    setModalVisible(false);
                }}
                cancelText="取消"
                onOk={() => {
                    if (cropperRef.current) {
                        cropperRef.current
                            .getCanvas({
                                width: 320,
                                height: 320,
                                imageSmoothingQuality: 'high',
                            })
                            .toBlob(blob => {
                                if (uploadResolveRef.current) {
                                    uploadResolveRef.current(blob);
                                }
                            });
                    }
                }}
                okButtonProps={{
                    loading: uploading,
                }}
                okText={uploading ? '上传中' : '确定'}
            >
                <ImageCropper ref={cropperRef} src={uploadSrc} />
                <Upload {...getUploadConfig}>
                    <Button>
                        <UploadOutlined />
                        重新选择
                    </Button>
                </Upload>
            </Modal>
        </div>
    );
};
