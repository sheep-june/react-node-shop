import React from "react";
// React 사용 선언

import "react-responsive-carousel/lib/styles/carousel.min.css";
// react-responsive-carousel 라이브러리에서 기본 스타일 불러옴
// CSS 불러오지 않으면 캐러셀(슬라이더) 레이아웃이 깨짐

import { Carousel } from "react-responsive-carousel";
// 캐러셀 컴포넌트 불러옴. 이미지 자동 슬라이드 UI를 쉽게 만들 수 있음


const ImageSlider = ({ images }) => {
    // props로 이미지 파일명 배열(images)을 받음
    // 각 파일명은 서버에 저장된 이미지 경로의 일부 (ex: /uploads/filename.jpg)

        return (
        <Carousel autoPlay showThumbs={false} infiniteLoop>
        {/* 자동재생 켜짐, 썸네일 숨김, 무한 반복 슬라이드 설정 */}

                        {images.map((image) => (
                <div key={image}>
                    {/* 각 이미지 요소의 고유 key로 파일명 사용 */}

                    <img
                        src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                        // 백엔드 서버 주소 + 이미지 파일명을 조합해서 src 경로 생성
                        // 예: http://localhost:4000/uploads/abc.jpg

                        alt={image}
                        // 이미지 파일명을 alt 텍스트로 설정 (접근성)

                        className="w-full max-h-[150px]"
                        // 가로는 꽉 차고, 세로는 최대 150px 제한
                    />
                </div>
            ))}
        </Carousel>
    );
};


export default ImageSlider;
