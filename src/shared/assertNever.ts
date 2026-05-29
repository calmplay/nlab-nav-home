/**
 * 编译时穷尽性检查。
 * 当 TypeScript 联合类型新增成员但忘记在 switch 中处理时，编译报错。
 *
 * 用法：
 *   default:
 *     assertNever(mode); // 如果 mode 还有未处理的值，TS 报错
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
