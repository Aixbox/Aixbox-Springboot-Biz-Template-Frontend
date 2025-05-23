export type ID = number | string;
export type IDS = (number | string)[];

/**
 * 分页信息
 * @param rows 结果集
 * @param total 总数
 */
export interface PageResult<T = any> {
  list: T[];
  total: number;
}

/**
 * 分页查询参数
 *
 * 排序支持的用法如下:
 * {isAsc:"asc",orderByColumn:"id"} order by id asc
 * {isAsc:"asc",orderByColumn:"id,createTime"} order by id asc,create_time asc
 * {isAsc:"desc",orderByColumn:"id,createTime"} order by id desc,create_time desc
 * {isAsc:"asc,desc",orderByColumn:"id,createTime"} order by id asc,create_time desc
 *
 * @param pageNum 当前页
 * @param pageSize 每页大小
 */
export interface PageParam {
  pageNo?: number;
  pageSize?: number;
  [key: string]: any;
}
