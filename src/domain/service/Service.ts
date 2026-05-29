import type { ServiceId } from "./ServiceId";
import type { ServiceCategory } from "./ServiceCategory";
import type { ServiceAccessMode } from "./ServiceAccessMode";
import type { ServiceRisk } from "./ServiceRisk";

/** 服务在线状态 */
export type ServiceStatus = "online" | "degraded" | "unknown";

/**
 * 实验室服务领域实体。
 * 描述一个可通过导航页访问的内部或外部服务。
 */
export interface Service {
  readonly id: ServiceId;
  /** 服务全称，例如 "HPE iLO 5 远程管理" */
  readonly name: string;
  /** 短名称，供卡片等紧凑场景使用 */
  readonly shortName: string;
  /** 一句话描述 */
  readonly description: string;
  /** 服务分类 */
  readonly category: ServiceCategory;
  /** 同分类下的排序权重（越小越靠前） */
  readonly priority: number;
  /** 访问方式 */
  readonly accessMode: ServiceAccessMode;
  /** 访问目标：相对路径（如 /svc/router/）或完整 URL */
  readonly href: string;
  /** 当前在线状态 */
  readonly status: ServiceStatus;
  /** 子路径反代风险等级 */
  readonly risk: ServiceRisk;
  /** 标签列表 */
  readonly tags: readonly string[];
  /** 补充说明 */
  readonly notes: string | null;
}
