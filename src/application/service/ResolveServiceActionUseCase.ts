import type { Service } from "../../domain/service/Service";
import {
  type ServiceAccessMode,
  ACCESS_MODE_LABELS,
} from "../../domain/service/ServiceAccessMode";
import {
  RISK_LABELS,
  RISK_DESCRIPTIONS,
} from "../../domain/service/ServiceRisk";
import { assertNever } from "../../shared/assertNever";

/**
 * 用例：根据服务的 accessMode 和 risk 决定 UI 行为。
 * 返回的结果可以直接被 presentation 层使用，无需再判断类型。
 */
export interface ResolvedAction {
  /** 按钮文案 */
  readonly label: string;
  /** 点击行为：'navigate' 直接跳转 / 'new-tab' 新标签页打开 / 'none' 不可用 */
  readonly behavior: "navigate" | "new-tab" | "none";
  /** 风险标签文案 */
  readonly riskLabel: string;
  /** 风险详细说明（可作 tooltip） */
  readonly riskDescription: string;
  /** 是否为反向代理模式（前端可据此决定是否用 SPA 内嵌跳转） */
  readonly isReverseProxy: boolean;
}

export class ResolveServiceActionUseCase {
  execute(service: Service): ResolvedAction {
    const label = ACCESS_MODE_LABELS[service.accessMode];
    const behavior = this.resolveBehavior(service.accessMode);
    const riskLabel = RISK_LABELS[service.risk];
    const riskDescription = RISK_DESCRIPTIONS[service.risk];
    const isReverseProxy = service.accessMode === "reverse-proxy";

    return { label, behavior, riskLabel, riskDescription, isReverseProxy };
  }

  private resolveBehavior(mode: ServiceAccessMode): ResolvedAction["behavior"] {
    switch (mode) {
      case "reverse-proxy":
        return "navigate";
      case "redirect":
        return "navigate";
      case "legacy-entry":
        return "new-tab";
      case "external-link":
        return "new-tab";
      case "not-integrated":
        return "none";
      default:
        assertNever(mode);
    }
  }
}
