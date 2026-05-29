import { StaticServiceRepository } from "../infrastructure/service/StaticServiceRepository";
import { ListServicesUseCase } from "../application/service/ListServicesUseCase";
import { ResolveServiceActionUseCase } from "../application/service/ResolveServiceActionUseCase";
import { App } from "./App";

/**
 * 应用启动引导（Composition Root）。
 *
 * 依赖注入：
 *   repo → ListServicesUseCase / ResolveServiceActionUseCase → App
 */
export function bootstrap(): App {
  const repo = new StaticServiceRepository();
  const listServices = new ListServicesUseCase(repo);
  const resolveAction = new ResolveServiceActionUseCase();

  const services = listServices.execute();

  const actions = new Map();
  for (const svc of services) {
    actions.set(svc.id, resolveAction.execute(svc));
  }

  return new App(services, actions);
}
