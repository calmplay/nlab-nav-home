import type { ServiceRepository } from "../../domain/service/ServiceRepository";
import type { Service } from "../../domain/service/Service";

/**
 * 用例：获取全部服务列表。
 * 这是最简单的"透传"用例——目前不需要额外处理，
 * 但保留这一层可以容纳未来的过滤、排序、分页等逻辑。
 */
export class ListServicesUseCase {
  constructor(private readonly repo: ServiceRepository) {}

  execute(): Service[] {
    return this.repo.findAll();
  }
}
