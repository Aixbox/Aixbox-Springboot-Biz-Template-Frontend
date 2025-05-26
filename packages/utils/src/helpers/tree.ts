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
