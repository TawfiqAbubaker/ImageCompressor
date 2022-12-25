import { ChangeEvent, useState } from "react";
import React from 'react'

export const MainPage = () => {
    const [file, setFile] = useState < File > ();
    const [fileTypeError, setFileTypeError] = useState(false);
    const [submitButton, setSubmitButton] = useState(false);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            console.log(e.target.files[0]);
            const nameArray = e.target.files[0].name.split('.');
            if(nameArray[nameArray.length-1] === 'jpeg'
                || nameArray[nameArray.length-1] === 'jpg'
                || nameArray[nameArray.length-1] === 'png')
            {
                setFile(e.target.files[0]);
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

        fetch('', {
            method: 'POST',
            body: file,
            headers: {
                'content-type': file.type,
                'content-length': `${file.size}`,
            },
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    };
    return (
        <div className="mt-20">
            <div className="text-xl text-center font-indie text-blou ">
                A very straight-forward
            </div>
            <div className="text-big text-center font-inria">
                Image Compressor
            </div>
            <div className="mt-16">
                <div className="text-center">
                    Compress {' '}
                    <u className="text-blou">JPG</u>
                    , <u className="text-blou">JPEG</u>{' '}
                    or <u className="text-blou">PNG</u> {' '}
                    with the best quality and compression.
                    <br />
                    Reduce the file size of your images with a few clicks.
                </div>
            </div>
            {!submitButton ? 
            <div className="flex justify-center mt-12">
                <label>
                    <input onChange={handleFileChange} type="file" className="text-sm text-grey-500
                        file:mr-8 file:py-2 file:px-8
                        file:rounded-lg file:border-0
                         file:font-medium
                        file:bg-blou file:text-white
                        hover:file:cursor-pointer hover:file:bg-blou_light
                    " 
                    />
                </label>
            </div>
            :""}
            {fileTypeError? 
            <div className="text-center text-red-600 mt-5">
                Unsupported file type, please upload a .jpg, .jpeg or .png
            </div>
             : ""}
            {submitButton ? 
            <div className = "flex justify-center mt-12">
                <button className="bg-blou hover:bg-blou_ligth text-white text-xl font-bold font-indie py-2 px-8 rounded" onClick={handleCompressClick}>Compress !</button>
            </div>
            :
            ""
            }
        </div>
    );
}