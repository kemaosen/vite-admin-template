import { useUserStore } from '@/store/modules/user'
// 拥有所有专题页面编辑权限 userType+ALL_EDIT_PERMISSION = admin_trace_dv_all_edit || gov_trace_dv_all_edit
export const ALL_EDIT_PERMISSION = '_trace_dv_all_edit'
export const ALL_MENU_PERMISSION = 'trace_dv'

/**
 * 根据用户权限，返回用户当前操作是否有权限
 * @param {Array<string>} permissionList 用户权限列表
 * @param {string} ALL_PERMISSION 拥有所有权限的权限名称
 * @param { Array<string> } pagePermission 当前页面的权限名称
 * @returns Boolean true有权限，false 无权限
 */
export function isPermission(userPermissionList, ALL_PERMISSION, pagePermission) {
  if (userPermissionList.includes(ALL_PERMISSION)) {
    return true
  }
  let status = false
  pagePermission.forEach((item) => {
    if (userPermissionList.includes(item)) {
      status = true
    }
  })
  return status
}
/**
 * 通过功能权限的定义规范, 来严格检查权限是否与用户类型匹配。
 * 本来应该用严格的逻辑定义来检查, 但由于历史设计/数据原因, 这里采用妥协的做法。
 *
 * @param {String} permission
 * @param {String} userType
 * @returns {Boolean}
 */
function isPermissionMatchingUserType(permission, userType) {
  if (userType != null) {
    userType = userType.toLowerCase()
    if (!permission.startsWith(userType + '_')) permission = userType + '_' + permission
    return permission
  }
  invalidUserType(userType)
}

function invalidUserType(userType) {
  throw new Error(`invalid userType ${userType}`)
}

/**
 * 用户是否有 permission 这个权限?
 * @param {String} permission
 * @param {Array} functions 用户拥有的权限
 * @param {String} userType
 * @returns {Boolean}
 */
function hasPermission(permission, functions, userType) {
  if (!isPermissionMatchingUserType(permission, userType)) {
    return false
  } else {
    permission = isPermissionMatchingUserType(permission, userType)
  }
  return functions.includes(permission) || functions.includes('ALL_PERMISSION')
}

/**
 * @param {Array} value
 * @returns {Boolean}
 */
export default function checkPermission(value) {
  const userStore = useUserStore()
  if (value) {
    const functions = userStore.getFunctions
    if (functions === undefined) {
      return false
    }
    const userType = userStore.getUserType
    if (value instanceof Array && value.length > 0) {
      return value.some((permission) => hasPermission(permission, functions, userType))
    } else {
      return hasPermission(value, functions, userType)
    }
  } else {
    console.error(`need functions! Like vAuth="['role_add','role_delete']"`)
    return false
  }
}
