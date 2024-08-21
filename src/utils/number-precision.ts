// 源码来自https://github.com/nefe/number-precision
// 因长期不维护，在使用divide存在超出Number最大值的情况，故在此基础上做了修改
/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 *
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */

type NumberType = number | string

/**
 * 将给定的数字更正为指定有效数字。
 *
 * @param num输入数字
 * @param precision指定有效位数的整数
 * @example strip(0.09999999999999998) === 0.1 // true
 */
function strip(num: NumberType, precision = 15): number {
  return +parseFloat(Number(num).toPrecision(precision))
}

/**
 * 返回数字的位数长度。
 *
 * @param num输入数字
 */
function digitLength(num: NumberType): number {
  // Get digit length of e
  const eSplit = num.toString().split(/[eE]/)
  const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0)
  return len > 0 ? len : 0
}

/**
 * 将给定的数字转换为整数，支持科学记数法。
 * 如果数字是十进制的，则该数字将按比例放大。
 *
 * @param num输入数字
 */
function float2Fixed(num: NumberType): number {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''))
  }
  const dLen = digitLength(num)
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num)
}

/**
 * 如果给定的数字超出范围，则记录警告
 *
 * @param num The input number
 */
function checkBoundary(num: number) {
  if (_boundaryCheckingState) {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      console.warn(`${num} 当转换为整数时，结果可能不准确`)
    }
  }
}

/**
 * 创建一个操作以支持rest params。
 *
 * @param operation The original operation
 */
function createOperation(operation: (n1: NumberType, n2: NumberType) => number): (...nums: NumberType[]) => number {
  return (...nums: NumberType[]) => {
    const [first, ...others] = nums
    return others.reduce((prev, next) => operation(prev, next), first) as number
  }
}

/**
 *准确的乘法。
 *
 * @param nums The numbers to multiply
 */
const times = createOperation((num1, num2) => {
  const num1Changed = float2Fixed(num1)
  const num2Changed = float2Fixed(num2)
  const baseNum = digitLength(num1) + digitLength(num2)
  const leftValue = num1Changed * num2Changed

  checkBoundary(leftValue)

  return leftValue / Math.pow(10, baseNum)
})

/**
 * 准确的加法
 *
 * @param nums The numbers to add
 */
const plus = createOperation((num1, num2) => {
  // 取最大的小数位
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)))
  // 把小数都转为整数然后再计算
  return (times(num1, baseNum) + times(num2, baseNum)) / baseNum
})

/**
 * 准确的减法。
 *
 * @param nums The numbers to subtract
 */
const minus = createOperation((num1, num2) => {
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)))
  return (times(num1, baseNum) - times(num2, baseNum)) / baseNum
})

/**
 * 准确的除法
 *
 * @param nums The numbers to divide
 * @param precision 需要保留的有效位数
 */
const divide = (num1, num2, precision = 15) => {
  const fn = createOperation((num1, num2) => {
    const num1Changed = float2Fixed(num1)
    const num2Changed = float2Fixed(num2)

    checkBoundary(num1Changed)
    checkBoundary(num2Changed)

    // fix: 类似 10 ** -4 为 0.00009999999999999999，strip 修正
    return times(
      strip(num1Changed / num2Changed, precision),
      strip(Math.pow(10, digitLength(num2) - digitLength(num1)))
    )
  })
  return fn(num1, num2)
}

/**
 * 舍入方法.
 *
 * @param num 要舍入的数字
 * @param decimal decimal指定十进制数字的整数
 */
function round(num: NumberType, decimal: number): number {
  const base = Math.pow(10, decimal)
  let result = divide(Math.round(Math.abs(times(num, base))), base)

  if ((num as number) < 0 && result !== 0) {
    result = times(result, -1)
  }

  return result
}

/**
 * 关闭超出最大值警告问题
 */
let _boundaryCheckingState = false

/**
 * 是否检查number的边界，默认为启用。
 *
 * @param flag 标记指示是否启用的值
 */
function enableBoundaryChecking(flag = true) {
  _boundaryCheckingState = flag
}

export {strip, plus, minus, times, divide, round, digitLength, float2Fixed, enableBoundaryChecking}

export default {
  strip,
  plus,
  minus,
  times,
  divide,
  round,
  digitLength,
  float2Fixed,
  enableBoundaryChecking
}
