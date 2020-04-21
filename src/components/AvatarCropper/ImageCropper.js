import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import styles from './ImageCropper.less';

function ImageCropper({ src, width, height, preview, cropWidth, cropHeight, ...props }, ref) {
    const imgRef = useRef();
    const previewRef = useRef();
    const cropperRef = useRef();
    height = height || 320;
    width = width || 320;
    useImperativeHandle(ref, () => ({
        getCanvas: options => {
            return cropperRef.current.getCroppedCanvas(options);
        },
    }));

    useEffect(() => {
        if (imgRef.current) {
            if (cropperRef.current) cropperRef.current.destroy();
            cropperRef.current = new Cropper(imgRef.current, {
                aspectRatio: 1,
                autoCropArea: 1,
                viewMode: 1,
                dragMode: 'move',
                containerHeight: height,
                containerWidth: width,
                preview: preview || previewRef.current,
                cropWidth,
                cropHeight,
                ...props,
            });
        }
        return () => {
            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }
        };
    }, [height, src, width, preview]);

    return (
        <div className={styles['image-cropper']}>
            <div className={styles['image-cropper-tool']} style={{ width, height }}>
                <img ref={imgRef} src={src} />
            </div>
            {!preview && (
                <div className={styles['image-cropper-preview']}>
                    <div ref={previewRef} className={styles['image-cropper-thumb']} />
                    <p>预览</p>
                </div>
            )}
        </div>
    );
}
export default forwardRef(ImageCropper);
