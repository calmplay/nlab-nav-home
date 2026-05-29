import type { Service } from "../domain/service/Service";
import type { ResolvedAction } from "../application/service/ResolveServiceActionUseCase";
import { renderHomePage } from "../presentation/pages/HomePage";

export class App {
  constructor(
    private readonly services: Service[],
    private readonly actions: Map<string, ResolvedAction>,
  ) {}

  start(): void {
    renderHomePage(this.services, this.actions);
  }
}
