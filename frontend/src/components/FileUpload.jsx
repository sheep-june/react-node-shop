import React from "react";
import Dropzone from "react-dropzone";
import axiosInstance from "../utils/axios";

const FileUpload = ({ onImageChange, images }) => {
    const handleDrop = async (files) => {
        let formData = new FormData();

        const config = {
            header: { "content-type": "multipart/form-data" },
        };

        formData.append("file", files[0]);

        try {
            const response = await axiosInstance.post(
                "/products/image",
                formData,
                config
            );
            onImageChange([...images, response.data.fileName]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (image) => {
        const currentIndex = images.indexOf(image);
        let newImages = [...images];
        newImages.splice(currentIndex, 1);
        onImageChange(newImages);
    };

    return (
      <>
        {images.length === 0 ? (
          // 이미지 없을 때: + 버튼 중앙
          <div className="min-w-[300px] h-[300px] border flex items-center justify-center">
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <input {...getInputProps()} />
                  <p className="text-2xl text-gray-700">＋</p>
                </div>
              )}
            </Dropzone>
          </div>
        ) : (
          // 이미지 있을 때: +버튼 → 이미지들
          <div className="flex h-[300px] border overflow-x-auto overflow-y-hidden space-x-2 px-2 items-center">
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition flex-shrink-0"
                >
                  <input {...getInputProps()} />
                  <p className="text-2xl text-gray-700">＋</p>
                </div>
              )}
            </Dropzone>
    
            {images.map(image => (
              <div
                key={image}
                onClick={() => handleDelete(image)}
                className="min-w-[300px] h-[300px] flex-shrink-0"
              >
                <img
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                  alt={image}
                />
              </div>
            ))}
          </div>
        )}
      </>
    );
    
};

export default FileUpload;
