// 工具类方法
/**
 * css样式变量切换
 * @param prop 需要切换的css变量名称
 * @param val 切换后的值
 * @param dom 指定dom元素切换，默认是html = :root
 */
export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}
