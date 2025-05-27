/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface TreeHelperConfig {
  children: string;
  id: string;
  pid: string;
}
type Fn = (node: any, parentNode?: any) => any;

// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  pid: 'parentId',
  children: 'children',
};

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachTree(element.children, callBack, newNode);
    }
  });
}

// eslint-disable-next-line jsdoc/require-returns-check
/**
 *
 * 添加全名 如 祖先节点-父节点-子节点
 * @param treeData 已经是tree数据
 * @param labelName 标签的字段名称
 * @param splitStr 分隔符
 * @returns void 无返回值 会修改原始数据
 */
export function addFullName(
  treeData: any[],
  labelName = 'label',
  splitStr = '-',
) {
  function addFullNameProperty(node: any, parentNames: any[] = []) {
    const fullNameParts = [...parentNames, node[labelName]];
    node.fullName = fullNameParts.join(splitStr);
    if (node.children && node.children.length > 0) {
      node.children.forEach((childNode: any) => {
        addFullNameProperty(childNode, fullNameParts);
      });
    }
  }

  treeData.forEach((item: any) => {
    addFullNameProperty(item);
  });
}

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) =>
  Object.assign({}, DEFAULT_CONFIG, config);

// tree from list
// 列表中的树
export function listToTree<T = any>(
  list: any[],
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, pid, children } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

/**
 * 给出节点数组 找到所有父节点ID
 * @param treeList 树形结构list
 * @param nodeIds 要寻找的节点ID list
 * @param config config
 * @returns 父节点ID数组
 */
export function findGroupParentIds(
  treeList: any[],
  nodeIds: number[],
  config: Partial<TreeHelperConfig> = {},
) {
  // 用于存储所有父节点ID的Set 主要为了去重
  const parentIds = new Set<number>();

  nodeIds.forEach((nodeId) => {
    findParentsIds(treeList, nodeId, config).forEach((parentId) => {
      parentIds.add(parentId);
    });
  });

  return [...parentIds].sort();
}

/**
 * https://blog.csdn.net/Web_J/article/details/129281329
 * 给出节点nodeId 找到所有父节点ID
 * @param treeList 树形结构list
 * @param nodeId 要寻找的节点ID
 * @param config config
 * @returns 父节点ID数组
 */
export function findParentsIds(
  treeList: any[],
  nodeId: number,
  config: Partial<TreeHelperConfig> = {},
) {
  const conf = getConfig(config) as TreeHelperConfig;
  const { id, children } = conf;

  // 用于存储所有父节点ID的数组
  const parentIds: number[] = [];

  function traverse(node: any, nodeId: number) {
    if (node[id] === nodeId) {
      return true;
    }
    if (node[children]) {
      // 如果当前节点有子节点，则继续遍历子节点
      for (const childNode of node[children]) {
        if (traverse(childNode, nodeId)) {
          // 如果在子节点中找到了子节点的父节点，则将当前节点的ID添加到父节点ID数组中，并返回true表示已经找到了子节点
          parentIds.push(node[id]);
          return true;
        }
      }
    }
    return false;
  }

  for (const node of treeList) {
    if (traverse(node, nodeId)) {
      // 如果在当前节点的子树中找到了子节点的父节点，则直接退出循环
      break;
    }
  }

  return parentIds.sort();
}

export function treeToList<T = any>(
  tree: any,
  config: Partial<TreeHelperConfig> = {},
): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}
