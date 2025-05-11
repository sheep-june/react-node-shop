import React from 'react'

const SearchInput = ({ onSearch, searchTerm }) => {
  // props로 2가지 값을 받음:
  // - onSearch: 검색어가 입력될 때 실행되는 함수 (상위 컴포넌트에서 전달)
  // - searchTerm: 현재 입력창에 표시할 값 (입력 상태)

    return (
    <input 
      className='p-2 border border-gray-300 rounded-md'
      // Tailwind CSS 클래스로 padding, 테두리, 테두리 색, 둥근 모서리 설정

      type='text'
      // 입력 타입은 텍스트

      placeholder='검색하세요.'
      // 입력창에 회색 글씨로 표시되는 안내 문구

      onChange={onSearch}
      // 사용자가 글자를 입력할 때마다 onSearch 함수 호출 (setSearchTerm + fetchProducts 수행)

      value={searchTerm}
      // 입력창의 값은 searchTerm 상태로 유지 (제어 컴포넌트 controlled component)
    />
  )
}


export default SearchInput