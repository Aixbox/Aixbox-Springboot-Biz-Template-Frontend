export interface Menu {
  createBy?: any;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  id: number;
  menuName: string;
  parentName?: string;
  parentId: number;
  orderNum: number;
  path: string;
  component?: string;
  query: string;
  isFrame: string;
  isCache: string;
  menuType: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  children: Menu[];
}

/**
 * 菜单表单查询
 */
export interface MenuQuery {
  menuName?: string;
  visible?: string;
  status?: string;
}
