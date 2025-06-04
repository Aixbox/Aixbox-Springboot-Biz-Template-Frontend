import { createIconifyOfflineIcon } from '@vben-core/icons';

import inboxIcon from '@iconify/icons-ant-design/inbox-outlined';
import defaultFileIcon from '@iconify/icons-bx/file';
import sqlIcon from '@iconify/icons-carbon/sql';
import folderIcon from '@iconify/icons-flat-color-icons/folder';
import vueIcon from '@iconify/icons-logos/vue';
import menuIcon from '@iconify/icons-material-symbols/menu';
import okButtonIcon from '@iconify/icons-mdi/button-pointer';
import javaIcon from '@iconify/icons-skill-icons/java-light';
import tsIcon from '@iconify/icons-skill-icons/typescript';
import xmlIcon from '@iconify/icons-tabler/file-type-xml';
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

export const JavaIcon = createIconifyOfflineIcon(
  'skill-icons:java-light',
  javaIcon,
);
export const XmlIcon = createIconifyOfflineIcon(
  'tabler:file-type-xml',
  xmlIcon,
);
export const SqlIcon = createIconifyOfflineIcon('carbon:sql', sqlIcon);
export const TsIcon = createIconifyOfflineIcon(
  'skill-icons:typescript',
  tsIcon,
);
export const VueIcon = createIconifyOfflineIcon('logos:vue', vueIcon);
export const DefaultFileIcon = createIconifyOfflineIcon(
  'flat-color-icons:folder',
  defaultFileIcon,
);
