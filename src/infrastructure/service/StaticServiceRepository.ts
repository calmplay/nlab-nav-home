import type { ServiceRepository } from "../../domain/service/ServiceRepository";
import type { Service } from "../../domain/service/Service";
import { SERVICE_CATALOG } from "./serviceCatalog";

/**
 * 基于静态数组的服务仓库实现。
 * 后续如果需要从 API / JSON 文件加载数据，只需替换此类即可。
 */
export class StaticServiceRepository implements ServiceRepository {
  private readonly services: Service[];

  constructor() {
    // 防御性拷贝：防止外部意外修改 CATALOG（虽然它已经是 readonly）
    this.services = [...SERVICE_CATALOG];
  }

  findAll(): Service[] {
    return [...this.services];
  }

  findByCategory(category: Service["category"]): Service[] {
    return this.services.filter((svc) => svc.category === category);
  }
}
