import type { Service } from "./Service";

/**
 * 服务仓库接口（领域层只定义契约，不依赖具体数据来源）。
 * 基础设施层负责实现。
 */
export interface ServiceRepository {
  /** 获取全部服务列表 */
  findAll(): Service[];

  /** 按分类查找 */
  findByCategory(category: Service["category"]): Service[];
}
