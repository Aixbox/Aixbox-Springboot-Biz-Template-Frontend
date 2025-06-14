export interface OssFile {
  id: string;
  fileName: string;
  originalName: string;
  fileSuffix: string;
  url: string;
  createTime: string;
  createBy: number;
  createByName: string;
  service: string;
}

export interface PartUploadList {
  /**
   * 分片编号（从1开始递增）
   */
  partNumber: number;

  /**
   * 从上传部分的内容生成的实体标签
   */
  entryTag: string;
}

export interface MultipartBo {
  /**
   * 分片类型（必传）
   */
  ossStatus: 'complete' | 'initiate' | 'query' | 'upload';

  /**
   * 文件原名（分片初始化的时候使用）
   */
  originalName?: string;

  /**
   * 用于分片上传任务的 Upload ID
   * 在初始化分片上传时获取，并在后续的分片上传和完成上传过程中使用
   */
  uploadId?: string;

  /**
   * 分片编号（从1开始递增）
   */
  partNumber?: number;

  /**
   * 内容的 MD5 摘要
   * initiate初始化需要第一片的md5值（或者直接计算整体的md5）用来判断断点续传，以及秒传
   */
  md5Digest?: string;

  /**
   * 最大返回的分片数（默认为1000，最大值1000）
   * 最多分片一万，一次性返回会造成前端性能问题，需要前端多次校验
   */
  maxParts?: number;

  /**
   * 分片编号的标记，用于分页查询（默认为0，表示从第一个分片开始查询）
   */
  partNumberMarker?: number;

  partUploadList?: PartUploadList[];
}

export interface Data {
  filename: string;
  originalName: string;
  md5Digest: string;
  uploadId: string;
  suffix: string;
}
