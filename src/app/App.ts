import type { ServiceGroup } from "../application/service/GroupServicesUseCase";
import type { ResolvedAction } from "../application/service/ResolveServiceActionUseCase";
import { renderHomePage } from "../presentation/pages/HomePage";

/**
 * 应用根组件。
 * 负责将"纯数据"（分组 + 动作）交给 presentation 层渲染。
 * 这一层不依赖任何具象基础设施，只依赖用例输出的数据结构。
 */
export class App {
  constructor(
    private readonly groups: ServiceGroup[],
    private readonly actions: Map<string, ResolvedAction>,
  ) {}

  /** 启动应用：渲染首页 */
  start(): void {
    renderHomePage(this.groups, this.actions);
  }
}
