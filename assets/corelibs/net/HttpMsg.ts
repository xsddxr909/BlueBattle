import {Gender} from "../sdk/SdkType";

export class HttpReqLogin
{
    code: string;
}

export class HttpRspLogin
{
    retCode: number;
    gateway_ip: string;
    gateway_port: number;
    openid: string;
    uid: string;
}

export class HttpSaveUserInfo
{
    uid: number;
    language: string;
    nickName: string;
    avatarUrl: string;
    gender: Gender;
    country: string;
    province: string;
    city: string;
}

export class HttpRspSaveUserInfo
{
    code: number;
}

export class HttpGetUserInfo
{
    uid: number;
}

export class HttpRspGetUserInfo
{
    uid: number;
    language: string;
    nickName: string;
    avatarUrl: string;
    gender: Gender;
    country: string;
    province: string;
    city: string;
}