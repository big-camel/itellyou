import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import './index.less'

function ImageCropper({ src , width, height },ref){

    const imgRef  = useRef()    
    const previewRef = useRef()
    const cropperRef = useRef()

    useImperativeHandle(ref,() => ({
        getCanvas:(options) => {
            return cropperRef.current.getCroppedCanvas(options)
        }
    }))

    useEffect(() => {
        if(imgRef.current){
            if(cropperRef.current) cropperRef.current.destroy()
            cropperRef.current = new Cropper(imgRef.current, {
                aspectRatio:1,
                autoCropArea:1,
                viewMode:1,
                dragMode:'move',
                minContainerHeight:width||320,
                minContainerWidth:height||320,
                preview:previewRef.current
            })
            
        }
    },[height, src, width])

    return (
        <div className="image-cropper">
            <div className="image-cropper-tool">
                <img ref={imgRef} src={src} />
            </div>
            <div className="image-cropper-preview">
                <div ref={previewRef} className="image-cropper-thumb" />
                <p>预览</p>
            </div>
        </div>
    )
}
export default forwardRef(ImageCropper)