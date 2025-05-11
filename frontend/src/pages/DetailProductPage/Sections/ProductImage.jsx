// React의 기본 기능과 훅(useState, useEffect)을 불러옵니다
import React, { useEffect, useState } from "react";

// 썸네일 및 슬라이드 기능이 포함된 이미지 갤러리 컴포넌트를 import 합니다
import ImageGallery from "react-image-gallery";

// 단일 상품의 이미지 슬라이더를 렌더링하는 컴포넌트를 정의합니다
const ProductImage = ({ product }) => {
    // 갤러리에 사용할 이미지 배열을 상태로 관리합니다 (초기값은 빈 배열)
    const [images, setImages] = useState([]);

    // 상품 정보가 변경되거나 처음 로딩될 때 실행됩니다
    useEffect(() => {
        // product 객체에 images 속성이 존재하고, 길이가 0보다 큰 경우에만 실행
        if (product?.images?.length > 0) {
            // 변환된 이미지 객체들을 담을 임시 배열 선언
            let images = [];

            // product.images 배열에 있는 이미지 이름들을 순회하며 가공
            product.images.map((imageName) => {
                // 각 이미지 이름에 대해 서버의 절대 경로를 구성하고 original/thumbnail 필드를 만들어서 추가
                return images.push({
                    original: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
                    thumbnail: `${
                        import.meta.env.VITE_SERVER_URL
                    }/${imageName}`,
                });
            });

            // 완성된 이미지 배열을 상태에 저장하여 렌더링에 사용
            setImages(images);
        }
    }, [product]); // product가 변경될 때마다 이 effect가 다시 실행됨

    // 이미지 슬라이더를 렌더링합니다.
    // items: 이미지 배열 전달
    // showFullscreenButton / showPlayButton: 이미지가 있을 때만 전체화면/슬라이드 재생 버튼 표시
    return (
        <ImageGallery
            items={images}
            showFullscreenButton={images.length > 0}
            showPlayButton={images.length > 0}
        />
    );
};

export default ProductImage;
