import { ChangeEvent, useState } from "react";
import React from 'react'
import axios from "axios";
import { saveAs } from 'file-saver';
import { stringify } from "querystring";
export const MainPage = () => {
    const [photoBlob, setPhotoBlob] = useState<Blob>();
    const [sizes, setSizes] = useState(["",""]);
    const [file, setFile] = useState < File > ();
    const [fileType, setFileType] = useState <string>();
    const [fileTypeError, setFileTypeError] = useState(false);
    const [compressionValue, setCompressionValue] = useState(3);
    const [submitButton, setSubmitButton] = useState(false);

    const handleCompressionSlider = (event : any) => {
        setCompressionValue(event.target.value);
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log(e.target.files[0]);
            const nameArray = e.target.files[0].name.split('.');
            let name = nameArray[nameArray.length-1].toLowerCase();
            if(name === 'jpeg'
                || name === 'jpg'
                || name === 'png')
            {
                if (name === 'jpeg') setFileType("true");
                if (name === 'jpg') setFileType("true");
                if (name === 'png') setFileType("false");
                setFile(e.target.files[0]);
                let temp = sizes;
                temp[0] = formatBytes(e.target.files[0].size); 
                console.log('TempSize', temp);
                console.log(fileTypeError)
                setSizes(temp)
                setFileTypeError(false);
                setSubmitButton(true);
            }
            else{
                setSubmitButton(false);
                setFileTypeError(true);
            }
            console.log(file?.name);
        }
    };

    const handleCompressClick = () => {
        if (!file) {
            return;
        }
        let data = new FormData();
        let temp = compressionValue;
        let compressionValueFloat = "0."+temp.toString();
        if(temp == 1) compressionValueFloat = "0.7";
        if(temp == 2) compressionValueFloat = "0.5";
        if(temp == 3) compressionValueFloat = "0.3";
        if(temp == 4) compressionValueFloat = "0.1";
        if(temp == 5) compressionValueFloat = "0.05";
        if(temp == 6) compressionValueFloat = "0.01";
        data.append('file', file, file.name);
        data.append('type', fileType as string);
        data.append('force', compressionValueFloat)

        axios.post('http://64.227.9.210/compress', data, {
            headers: { 'content-type': 'multipart/form-data' }
           }
        )
        .then((response) => {
            getCompressedImage();
        }).catch((error) => {
        });
    };
    const getCompressedImage = () => {
        fetch("http://64.227.9.210/get-image?jpg="+fileType)
        .then(data => data.blob().then(blobResponse => {
            setPhotoBlob(blobResponse);
            let temp: string[] = sizes;
            temp[1] = formatBytes(blobResponse.size); 
            console.log('TempSize', temp);
            setSizes(temp)
        }))
    }

    function formatBytes(bytes : number, decimals = 2) {
        if (!+bytes) return '0 Bytes'
    
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
    
    return (
        <div className="mt-20">
            <div className="text-xl text-center font-indie text-blou ">
                A very straight-forward
            </div>
            <div className="text-big text-center font-inria">
                Image Compressor
            </div>
            <div className="mt-6">
                <div className="text-center text-sm">
                    <p className="inline text-red-500">Note :</p> This website
                    sends the image to my containerized Spring boot compressor API that I deployed to a linux server. 
                </div>
            </div>
            <div className="mt-6">
                <div className="text-center">
                    Compress <u className="text-blou">JPG</u>,{" "}
                    <u className="text-blou">JPEG</u>{" "}
                    with the best quality and compression.
                    <br />
                    Reduce the file size of your images with a few clicks.
                </div>
            </div>
            {!submitButton ? (
                <div className="flex justify-center mt-12">
                    <label>
                        <input
                            onChange={handleFileChange}
                            type="file"
                            className="text-sm text-grey-500
                        file:mr-8 file:py-2 file:px-8
                        file:rounded-lg file:border-0
                         file:font-medium
                        file:bg-blou file:text-white
                        hover:file:cursor-pointer hover:file:bg-blou_light
                    "
                        />
                    </label>
                </div>
            ) : (
                ""
            )}
            {fileTypeError ? (
                <div className="text-center text-red-600 mt-5">
                    Unsupported file type, please upload a .jpg or .jpeg
                </div>
            ) : (
                ""
            )}
            {submitButton ? (
                <div className="flex-col mt-12">
                    <div className="flex-col mb-5">
                        <div className="flex justify-center mb-2">
                            <p>Compression amount : {compressionValue}</p>
                        </div>
                        <div className="flex justify-center">
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={compressionValue}
                                onChange={handleCompressionSlider}
                                className="range range-xs w-56"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-blou hover:bg-blou_ligth text-white text-xl font-bold font-indie py-2 px-8 rounded"
                            onClick={handleCompressClick}
                        >
                            Compress !
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="imageComparor flex flex-col justify-center mt-10">
                {photoBlob ? (
                    <div className="flex flex-col">
                        <div className="flex justify-center mb-2">
                            <p>
                                {sizes[0]} {" ?????? "} {sizes[1]}
                            </p>
                        </div>
                        <div className="flex justify-center mb-2">
                            <p>Right click ?????? and download!</p>
                        </div>
                        <div className="h-56 flex justify-center">
                            <img
                                src={webkitURL.createObjectURL(photoBlob)}
                                className="h-56 w-auto"
                                alt=""
                            />
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}