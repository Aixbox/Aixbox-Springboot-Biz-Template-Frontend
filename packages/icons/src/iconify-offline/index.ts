import { createIconifyOfflineIcon } from '@vben-core/icons';

import inboxIcon from '@iconify/icons-ant-design/inbox-outlined';
import folderIcon from '@iconify/icons-flat-color-icons/folder';
import menuIcon from '@iconify/icons-material-symbols/menu';
import okButtonIcon from '@iconify/icons-mdi/button-pointer';
import excelIcon from '@iconify/icons-vscode-icons/file-type-excel';

// 菜单类型 目录/按钮/菜单
export const FolderIcon = createIconifyOfflineIcon(
  'flat-color-icons:folder',
  folderIcon,
);
export const OkButtonIcon = createIconifyOfflineIcon(
  'mdi:button-pointer',
  okButtonIcon,
);
export const MenuIcon = createIconifyOfflineIcon(
  'material-symbols:menu',
  menuIcon,
);

// 拖拽上传图标
export const InBoxIcon = createIconifyOfflineIcon(
  'ant-design:inbox-outlined',
  inboxIcon,
);

// 用户管理 导入
// Excel图标
export const ExcelIcon = createIconifyOfflineIcon(
  'vscode-icons:file-type-excel',
  excelIcon,
);
