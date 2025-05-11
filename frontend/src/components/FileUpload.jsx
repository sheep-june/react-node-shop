import React from "react";
// React를 불러와서 JSX 문법 사용

import Dropzone from "react-dropzone";
// 파일 드래그 & 드롭 영역을 쉽게 구현할 수 있는 라이브러리

import axiosInstance from "../utils/axios";
// 프로젝트 전역에서 사용하는 axios 인스턴스 (토큰/URL 포함)

const FileUpload = ({ onImageChange, images }) => {
    // props로 이미지 변경 시 콜백 함수(onImageChange)와 현재 이미지 배열(images)을 받음

    const handleDrop = async (files) => {
        // 사용자가 드래그 or 클릭으로 파일을 올리면 호출됨

        let formData = new FormData();
        // multipart/form-data 방식으로 전송하기 위해 FormData 객체 생성

        const config = {
            header: { "content-type": "multipart/form-data" },
        };
        // axios 전송 시 multipart 설정을 명시

        formData.append("file", files[0]);
        // 드롭된 파일 중 첫 번째 파일을 'file'이라는 키로 추가

        try {
            const response = await axiosInstance.post(
                "/products/image", // 이미지 업로드용 백엔드 API 엔드포인트
                formData, // 파일 데이터
                config // 헤더 설정 포함
            );

            onImageChange([...images, response.data.fileName]);
            // 기존 이미지 배열에 업로드된 파일명 추가 → 부모 컴포넌트로 변경된 이미지 배열 전달
        } catch (error) {
            console.error(error); // 실패 시 에러 로그 출력
        }
    };

    const handleDelete = (image) => {
        // 이미지 미리보기를 클릭하면 해당 이미지를 삭제

        const currentIndex = images.indexOf(image);
        // 삭제할 이미지의 인덱스 찾기

        let newImages = [...images];
        // 이미지 배열 복사 (불변성 유지)

        newImages.splice(currentIndex, 1);
        // 해당 인덱스에서 이미지 제거

        onImageChange(newImages);
        // 변경된 배열을 부모 컴포넌트로 전달
    };

    return (
        <>
            {images.length === 0 ? (
                <div className="min-w-[300px] h-[300px] border flex items-center justify-center">
                    {/* 최소 300x300 크기의 영역. 가운데 정렬된 업로드 버튼만 있음 */}

                    <Dropzone onDrop={handleDrop}>
                        {/* Dropzone: 파일을 드래그하거나 클릭해 업로드 */}

                        {({ getRootProps, getInputProps }) => (
                            <div
                                {...getRootProps()}
                                className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                            >
                                <input {...getInputProps()} />
                                {/* 실제 파일 input 요소 */}
                                <p className="text-2xl text-gray-700">＋</p>
                                {/* + 모양 아이콘 */}
                            </div>
                        )}
                    </Dropzone>
                </div>
            ) : (
                <div className="flex h-[300px] border overflow-x-auto overflow-y-hidden space-x-2 px-2 items-center">
                    {/* 이미지가 있을 경우 가로 스크롤 형태의 슬라이드 리스트로 렌더링됨 */}

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

                    {images.map((image) => (
                        <div
                            key={image}
                            onClick={() => handleDelete(image)}
                            className="min-w-[300px] h-[300px] flex-shrink-0"
                        >
                            {/* 각 이미지 미리보기를 누르면 handleDelete 실행 */}

                            <img
                                className="w-full h-full object-cover"
                                src={`${
                                    import.meta.env.VITE_SERVER_URL
                                }/${image}`}
                                // 백엔드에서 제공하는 정적 이미지 URL 경로 구성
                                // .env 파일에서 VITE_SERVER_URL이 예: http://localhost:4000 인 경우

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
