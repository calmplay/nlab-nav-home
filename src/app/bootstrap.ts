import { App } from "./App";

/** 应用启动引导（Composition Root）。 */
export function bootstrap(): App {
  return new App();
}
