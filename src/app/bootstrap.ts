import { StaticServiceRepository } from "../infrastructure/service/StaticServiceRepository";
import { ListServicesUseCase } from "../application/service/ListServicesUseCase";
import { GroupServicesUseCase } from "../application/service/GroupServicesUseCase";
import { ResolveServiceActionUseCase } from "../application/service/ResolveServiceActionUseCase";
import { App } from "./App";

/**
 * 应用启动引导。
 *
 * 这里是整个应用的"组合根"（Composition Root）：
 * - 实例化基础设施（Repository）
 * - 实例化用例（Use Case）
 * - 把依赖注入 App
 *
 * main.ts 只需要调用这一个函数。
 */
export function bootstrap(): App {
  // ── 基础设施层：服务数据来源 ──
  const repo = new StaticServiceRepository();

  // ── 应用层：用例 ──
  const listServices = new ListServicesUseCase(repo);
  const groupServices = new GroupServicesUseCase();
  const resolveAction = new ResolveServiceActionUseCase();

  // ── 执行用例，准备数据 ──
  const services = listServices.execute();
  const groups = groupServices.execute(services);

  const actions = new Map();
  for (const svc of services) {
    actions.set(svc.id, resolveAction.execute(svc));
  }

  // ── 组装 App ──
  return new App(groups, actions);
}
