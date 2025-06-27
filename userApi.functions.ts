import { callUserApi } from "./callUserApi";

import { buildProxyUrl } from "@/lib/config/apiHost";

import { UserCreateParams, UserLoginParams, UserVerifyAuthNumParams, UserInfoUpdateParams, UserAuctionCreateParams, UserAuctionUpdateStatusParams, UserAuctionGetListParams, UserAuctionSelectBidParams } from "./userApi.types";




// 🔐 인증 (Auth)


// 🔐 인증 (Auth) / 회원가입

export async function userCreate(params: UserCreateParams) {
  return callUserApi({
    title: "회원가입",
    url: buildProxyUrl("user/create"),
    
    body: params,
    isCallPageLoader: true,
  });
}

// 🔐 인증 (Auth) / 로그인

export async function userLogin(params: UserLoginParams) {
  return callUserApi({
    title: "로그인",
    url: buildProxyUrl("user/login"),
    
    body: params,
    isCallPageLoader: true,
  });
}

// 🔐 인증 (Auth) / 회원가입 SMS 발송

export async function userSendJoinSms(cellphone: string) {
  return callUserApi({
    title: "회원가입 SMS 발송",
    url: buildProxyUrl("user/send-join-sms"),
    
    body: { cellphone: cellphone },
    isCallPageLoader: true,
  });
}

// 🔐 인증 (Auth) / 인증번호 발송

export async function userSendAuthNum(cellphone: string) {
  return callUserApi({
    title: "인증번호 발송",
    url: buildProxyUrl("user/send-auth-num"),
    
    body: { cellphone: cellphone },
    isCallPageLoader: true,
  });
}

// 🔐 인증 (Auth) / 인증번호 확인

export async function userVerifyAuthNum(params: UserVerifyAuthNumParams) {
  return callUserApi({
    title: "인증번호 확인",
    url: buildProxyUrl("user/verify-auth-num"),
    
    body: params,
    isCallPageLoader: true,
  });
}


// 👨‍💼 사용자 정보 (User Info)


// 👨‍💼 사용자 정보 (User Info) / 사용자 정보 조회

export async function userInfo() {
  return callUserApi({
    title: "사용자 정보 조회",
    url: buildProxyUrl("user/info"),
    withToken: true,
    
    isCallPageLoader: true,
  });
}

// 👨‍💼 사용자 정보 (User Info) / 사용자 정보 수정

export async function userInfoUpdate(params: UserInfoUpdateParams) {
  return callUserApi({
    title: "사용자 정보 수정",
    url: buildProxyUrl("user/info/update"),
    withToken: true,
    body: params,
    isCallPageLoader: true,
  });
}

// 👨‍💼 사용자 정보 (User Info) / 탈퇴

export async function userDelete() {
  return callUserApi({
    title: "탈퇴",
    url: buildProxyUrl("user/delete"),
    withToken: true,
    
    isCallPageLoader: true,
  });
}


// 🏺 경매 (Auction)


// 🏺 경매 (Auction) / 경매 생성

export async function userAuctionCreate(params: UserAuctionCreateParams) {
  return callUserApi({
    title: "경매 생성",
    url: buildProxyUrl("user/auction/create"),
    withToken: true,
    body: params,
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 경매 상태 업데이트

export async function userAuctionUpdateStatus(params: UserAuctionUpdateStatusParams) {
  return callUserApi({
    title: "경매 상태 업데이트",
    url: buildProxyUrl("user/auction/update-status"),
    withToken: true,
    body: params,
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 임시저장 경매 조회

export async function userAuctionCheckDraft() {
  return callUserApi({
    title: "임시저장 경매 조회",
    url: buildProxyUrl("user/auction/check-draft"),
    withToken: true,
    
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 내 경매 목록 조회

export async function userAuctionGetList(params: UserAuctionGetListParams) {
  return callUserApi({
    title: "내 경매 목록 조회",
    url: buildProxyUrl("user/auction/get-list"),
    withToken: true,
    body: params,
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 경매 상세 조회

export async function userAuctionGet(auctionIndex: number) {
  return callUserApi({
    title: "경매 상세 조회",
    url: buildProxyUrl("user/auction/get"),
    withToken: true,
    body: { auctionIndex: auctionIndex },
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 입찰 현황 조회

export async function userAuctionGetBids(auctionIndex: number) {
  return callUserApi({
    title: "입찰 현황 조회",
    url: buildProxyUrl("user/auction/get-bids"),
    withToken: true,
    body: { auctionIndex: auctionIndex },
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 입찰 선택

export async function userAuctionSelectBid(params: UserAuctionSelectBidParams) {
  return callUserApi({
    title: "입찰 선택",
    url: buildProxyUrl("user/auction/select-bid"),
    withToken: true,
    body: params,
    isCallPageLoader: true,
  });
}

// 🏺 경매 (Auction) / 경매 취소

export async function userAuctionCancel(auctionIndex: number) {
  return callUserApi({
    title: "경매 취소",
    url: buildProxyUrl("user/auction/cancel"),
    withToken: true,
    body: { auctionIndex: auctionIndex },
    isCallPageLoader: true,
  });
}


// ❓ FAQ 및 약관 (FAQ & Terms)


// ❓ FAQ 및 약관 (FAQ & Terms) / FAQ 목록 조회

export async function userFaq(category: string) {
  return callUserApi({
    title: "FAQ 목록 조회",
    url: buildProxyUrl("user/faq"),
    
    body: { category: category },
    isCallPageLoader: true,
  });
}

// ❓ FAQ 및 약관 (FAQ & Terms) / 약관 조회

export async function userTerms(type: string) {
  return callUserApi({
    title: "약관 조회",
    url: buildProxyUrl("user/terms"),
    
    body: { type: type },
    isCallPageLoader: true,
  });
}

// ❓ FAQ 및 약관 (FAQ & Terms) / 공지사항 조회

export async function userNotificationGetList() {
  return callUserApi({
    title: "공지사항 조회",
    url: buildProxyUrl("user/notification/get-list"),
    
    
    isCallPageLoader: true,
  });
}