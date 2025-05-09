# Shopping Mall - 商品購入サイト（Node.js + React）

## 概要  
本プロジェクトは、Node.js（Express）と React をベースに作成されたショッピングサイトです。  
JWT 認証、カート機能、商品登録・検索・決済・履歴閲覧といった基本的な購入機能を提供し、MongoDB を利用したデータ管理を行います。

## 主な機能  
- 会員登録・ログイン・ログアウト（JWTによる認証）  
- 商品アップロード（画像・タイトル・説明・価格・地域）  
- 商品リスト表示・検索（テキスト・フィルター）  
- カート追加・削除・決済処理  
- 購入履歴確認（購入日時、数量、金額、ID）  
- ロール制御ではなく、ログイン状態に基づいたルート保護実装（Protected Routes）

## 使用技術スタック  
- **バックエンド**  
  - Node.js (Express)  
  - MongoDB (Mongoose)  
  - JWT (jsonwebtoken)  
  - Multer (画像アップロード)  
- **フロントエンド**  
  - React (Vite + Tailwind CSS)  
  - Redux Toolkit + redux-persist  
  - React Router v6  
  - react-hook-form, react-toastify, react-image-gallery  
- **データベース**  
  - MongoDB  
- **その他**  
  - dayjs（日時フォーマット）  
  - qs（Axios クエリ文字列変換）

## プロジェクト構成  
project  
├── backend  
│   ├── models  
│   │   ├── User.js（ユーザースキーマ）  
│   │   ├── Product.js（商品スキーマ）  
│   │   └── Payment.js（決済履歴）  
│   ├── routes  
│   │   ├── users.js（会員認証・カート・決済）  
│   │   └── products.js（商品 CRUD・検索）  
│   ├── middleware  
│   │   └── auth.js（JWT検証）  
│   └── uploads（アップロード画像保存フォルダ）  
├── frontend  
│   ├── pages  
│   │   ├── LoginPage, RegisterPage（認証画面）  
│   │   ├── LandingPage（商品一覧）  
│   │   ├── UploadProductPage（商品アップロード）  
│   │   ├── DetailProductPage（商品詳細）  
│   │   ├── CartPage（カート）  
│   │   └── HistoryPage（購入履歴）  
│   ├── components  
│   │   ├── ProtectedRoutes / NotAuthRoutes（ルートガード）  
│   │   ├── FileUpload, ImageSlider, SearchInput, Filter関連  
│   │   └── 共通UIコンポーネント  
│   ├── layout  
│   │   ├── Navbar  
│   │   └── Footer  
│   ├── store  
│   │   ├── userSlice.js（状態管理）  
│   │   └── thunkFunctions.js（API連携）  
│   └── utils  
│       ├── axios.js（共通インスタンス）  
│       └── filterData.js（フィルター情報）

## 注意事項  
- POST、PUT、DELETEリクエストを送信する際には、JWTトークンをヘッダーに含める必要があります。  
- 購入・カート・アップロード機能などは、ログインユーザーのみが利用可能です（ProtectedRoutesにより保護）。  
- 商品検索機能は MongoDB の正規表現 `$regex` により部分一致検索を実現していますが、大規模データでは Elasticsearch 等の導入を検討してください。

---

# Shopping Mall - 상품 구매 사이트 (Node.js + React)

## 개요  
이 프로젝트는 Node.js(Express)와 React를 기반으로 한 쇼핑몰 웹 애플리케이션입니다.  
JWT 인증, 장바구니 기능, 상품 등록·검색·결제·내역 확인 등의 기본적인 쇼핑 기능을 제공하며, 데이터 관리는 MongoDB로 구성되어 있습니다.

## 주요 기능  
- 회원가입, 로그인, 로그아웃 (JWT 인증 방식)  
- 상품 업로드 (이미지, 제목, 설명, 가격, 대륙 선택)  
- 상품 목록 출력 및 검색 (텍스트 입력 및 필터 조합)  
- 장바구니 담기 및 삭제, 결제 처리 기능  
- 구매 이력 확인 (구매 시각, 수량, 가격, 고유 ID)  
- 역할(Role) 기반이 아닌 로그인 상태를 기반으로 한 접근 제한 구현 (ProtectedRoutes 사용)

## 사용 기술 스택  
- **백엔드**  
  - Node.js (Express)  
  - MongoDB (Mongoose ODM)  
  - JWT (jsonwebtoken을 통한 인증)  
  - Multer (이미지 업로드 처리)  
- **프론트엔드**  
  - React (Vite + Tailwind CSS 기반 구성)  
  - Redux Toolkit 및 redux-persist 상태 관리  
  - React Router v6 라우팅  
  - react-hook-form, react-toastify, react-image-gallery  
- **데이터베이스**  
  - MongoDB (로컬 혹은 Atlas 사용 가능)  
- **기타**  
  - dayjs (날짜 포맷 처리용)  
  - qs (Axios 쿼리 직렬화 처리)

## 프로젝트 구조  
project  
├── backend  
│   ├── models  
│   │   ├── User.js (유저 스키마 정의)  
│   │   ├── Product.js (상품 스키마 정의)  
│   │   └── Payment.js (결제 이력 스키마)  
│   ├── routes  
│   │   ├── users.js (회원가입, 로그인, 장바구니, 결제 API)  
│   │   └── products.js (상품 CRUD 및 검색 API)  
│   ├── middleware  
│   │   └── auth.js (JWT 인증 미들웨어)  
│   └── uploads (업로드된 이미지 저장 디렉토리)  
├── frontend  
│   ├── pages  
│   │   ├── 로그인, 회원가입, 상품 목록, 업로드, 상세보기, 장바구니, 주문 내역 페이지  
│   ├── components  
│   │   ├── 로그인 보호 라우트, 이미지 업로드, 상품카드, 필터박스  
│   ├── layout  
│   │   ├── Navbar (네비게이션 바)  
│   │   └── Footer (푸터 영역)  
│   ├── store  
│   │   ├── userSlice.js (유저 상태 슬라이스)  
│   │   └── thunkFunctions.js (비동기 요청 처리)  
│   └── utils  
│       ├── axios.js (공통 Axios 인스턴스 설정)  
│       └── filterData.js (필터 범위 데이터 정의)

## 참고  
- 모든 POST, PUT, DELETE 요청은 JWT 토큰을 Authorization 헤더에 포함하여 보내야 합니다.  
- 상품 업로드, 결제 등 민감 기능은 로그인한 사용자만 접근할 수 있으며, 해당 경로는 ProtectedRoutes로 보호되어 있습니다.  
- 상품 검색은 MongoDB의 `$regex` 기반 부분 검색으로 구현되어 있으며, 향후 성능 최적화를 위해 Elasticsearch나 N-gram 기반 검색으로 확장할 수 있습니다。
