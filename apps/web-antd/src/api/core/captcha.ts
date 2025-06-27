import { requestClient } from '#/api/request';

export namespace CaptchaApi {
  export interface ImageCaptchaVO {
    /** 验证码类型 */
    type: string;
    /** 背景图 */
    backgroundImage: string;
    /** 移动图 */
    templateImage: string;
    /** 背景图片所属标签 */
    backgroundImageTag: string;
    /** 模板图片所属标签 */
    templateImageTag: string;
    /** 背景图片宽度 */
    backgroundImageWidth: number;
    /** 背景图片高度 */
    backgroundImageHeight: number;
    /** 滑动图片宽度 */
    templateImageWidth: number;
    /** 滑动图片高度 */
    templateImageHeight: number;
    /** data 扩展数据 */
    data: any;
  }

  /**
   * 验证码返回对象
   */
  export interface CaptchaResponse {
    id?: string;
    captcha: ImageCaptchaVO;
  }

  export interface CheckResponse {
    id?: string;
  }

  /**
   * 轨迹数据结构
   */
  export interface Track {
    /** x坐标 */
    x: number;
    /** y坐标 */
    y: number;
    /** 时间 */
    t: number;
    /** 类型 */
    type: string; // 默认值"move"需要在创建对象时设置
  }

  // 常量定义，对应Java中的TrackTypeConstant
  export enum TrackType {
    MOVE = 'MOVE',
  }

  /**
   * 图片验证码滑动轨迹
   */
  export interface ImageCaptchaTrack {
    /** 背景图片宽度 */
    bgImageWidth?: number;
    /** 背景图片高度 */
    bgImageHeight?: number;
    /** 模板图片宽度 */
    templateImageWidth?: number;
    /** 模板图片高度 */
    templateImageHeight?: number;
    /** 滑动开始时间 */
    startTime?: Date;
    /** 滑动结束时间 */
    stopTime?: Date;
    left?: number;
    top?: number;
    /** 滑动的轨迹 */
    trackList?: Track[];
    /** 扩展数据，用户传输加密数据等 */
    data?: any;
  }

  // 对应 CaptchaBo
  export interface CaptchaBo {
    id: string | undefined;
    data: ImageCaptchaTrack;
  }
}

/**
 * 获取验证码
 */
export async function getCaptcha() {
  return requestClient.get<CaptchaApi.CaptchaResponse>('/auth/captcha');
}

/**
 * 检验验证码
 */
export async function checkCaptcha(data: CaptchaApi.CaptchaBo) {
  return requestClient.post<CaptchaApi.CheckResponse>(
    '/auth/captcha/verify',
    data,
  );
}
