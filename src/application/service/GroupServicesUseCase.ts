import type { Service } from "../../domain/service/Service";
import type { ServiceCategory } from "../../domain/service/ServiceCategory";

/** 一个分类及其下的服务列表 */
export interface ServiceGroup {
  readonly category: ServiceCategory;
  readonly services: Service[];
}

/**
 * 用例：将服务列表按分类分组，每组内按 priority 升序排列。
 */
export class GroupServicesUseCase {
  execute(services: Service[]): ServiceGroup[] {
    const map = new Map<ServiceCategory, Service[]>();

    for (const svc of services) {
      const list = map.get(svc.category);
      if (list) {
        list.push(svc);
      } else {
        map.set(svc.category, [svc]);
      }
    }

    const groups: ServiceGroup[] = [];
    for (const [category, list] of map) {
      list.sort((a, b) => a.priority - b.priority);
      groups.push({ category, services: list });
    }

    // 按分类字典序排列分组
    groups.sort((a, b) => a.category.localeCompare(b.category));

    return groups;
  }
}
