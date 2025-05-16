import type { RouteRecordStringComponent } from '@vben/types';

import { $t } from '@vben/locales';

const {
  version,
  // vite inject-metadata 插件注入的全局变量
} = __VBEN_ADMIN_METADATA__ || {};

/**
 * 该文件放非后台返回的路由 比如个人中心 等需要跳转显示的页面
 */
const localRoutes: RouteRecordStringComponent[] = [
  {
    component: '/_core/profile/index',
    meta: {
      icon: 'mingcute:profile-line',
      title: $t('ui.widgets.profile'),
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'Profile',
    path: '/profile',
  },
  {
    component: '/system/oss-config/index',
    meta: {
      activePath: '/system/oss',
      icon: 'ant-design:setting-outlined',
      title: 'oss配置',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'OssConfig',
    path: '/system/oss-config',
  },
  {
    component: '/tool/gen/edit-gen',
    meta: {
      activePath: '/tool/gen',
      icon: 'tabler:code',
      title: '生成配置',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'GenConfig',
    path: '/code-gen/edit/:tableId',
  },
  {
    component: '/system/role-assign/index',
    meta: {
      activePath: '/system/role',
      icon: 'eos-icons:role-binding-outlined',
      title: '分配角色',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'RoleAssign',
    path: '/system/role-assign/:roleId',
  },
  {
    component: '/workflow/components/flow-designer',
    meta: {
      activePath: '/workflow/processDefinition',
      icon: 'fluent-mdl2:flow',
      title: '流程设计',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'WorkflowDesigner',
    path: '/workflow/designer',
  },
  /**
   * 需要添加iframe路由 同目录的./workflow-iframe.ts
   */
  {
    component: 'workflow/leave/leave-form',
    meta: {
      icon: 'flat-color-icons:leave',
      title: '请假申请',
      activePath: '/demo/leave',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'WorkflowLeaveIndex',
    path: '/workflow/leaveEdit/index',
  },
];

/**
 * 这里放本地路由
 */
export const localMenuList: RouteRecordStringComponent[] = [
  {
    component: 'BasicLayout',
    meta: {
      order: -1,
      title: 'page.dashboard.title',
      // 不使用基础布局（仅在顶级生效）
      noBasicLayout: true,
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
      {
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        meta: {
          icon: 'lucide:book-open-text',
          iframeSrc: 'https://dapdap.top',
          keepAlive: true,
          title: $t('demos.vben.document'),
        },
      },
      {
        name: 'V5UpdateLog',
        path: '/changelog',
        component: '/演示使用自行删除/changelog/index',
        meta: {
          icon: 'lucide:book-open-text',
          keepAlive: true,
          title: '更新记录',
          badge: `当前: ${version}`,
          badgeVariants: 'bg-primary',
        },
      },
    ],
  },
  {
    component: '/_core/about/index',
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: $t('demos.vben.about'),
    },
    name: 'About',
    path: '/vben-admin/about',
  },
  ...localRoutes,
];
