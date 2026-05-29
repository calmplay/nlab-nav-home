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

export interface ResolvedAction {
  readonly label: string;
  /** 点击行为：'new-tab' 新标签页打开 / 'none' 不可点击 */
  readonly behavior: "new-tab" | "none";
  readonly riskLabel: string;
  readonly riskDescription: string;
}

export class ResolveServiceActionUseCase {
  execute(service: Service): ResolvedAction {
    const label = ACCESS_MODE_LABELS[service.accessMode];
    const behavior = this.resolveBehavior(service.accessMode);
    const riskLabel = RISK_LABELS[service.risk];
    const riskDescription = RISK_DESCRIPTIONS[service.risk];

    return { label, behavior, riskLabel, riskDescription };
  }

  private resolveBehavior(mode: ServiceAccessMode): ResolvedAction["behavior"] {
    switch (mode) {
      case "reverse-proxy":
      case "redirect":
      case "legacy-entry":
      case "external-link":
        return "new-tab";
      case "planned":
      case "not-integrated":
        return "none";
      default:
        assertNever(mode);
    }
  }
}
