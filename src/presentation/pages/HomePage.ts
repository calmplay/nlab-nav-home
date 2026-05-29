import type { ServiceGroup } from "../../application/service/GroupServicesUseCase";
import type { ResolvedAction } from "../../application/service/ResolveServiceActionUseCase";
import { createServiceSection } from "../components/ServiceSection";

/**
 * 首页 —— 组合页头、服务分组、页脚。
 * 这是整个 presentation 层的唯一入口，App.ts 只需调用 renderHomePage()。
 */
export function renderHomePage(
  groups: ServiceGroup[],
  actions: Map<string, ResolvedAction>,
): void {
  const app = document.getElementById("app");
  if (!app) {
    console.error("Missing root element: #app. index.html 中缺少 <div id=\"app\"></div> 挂载点。");
    const fallback = document.createElement("div");
    fallback.style.cssText =
      "max-width:600px;margin:60px auto;padding:24px;background:#24283b;color:#f7768e;border-radius:8px;font-family:system-ui";
    fallback.textContent = "页面挂载失败：index.html 缺少 #app 根节点。请检查 index.html 是否包含 <div id=\"app\"></div>。";
    document.body.prepend(fallback);
    return;
  }

  app.innerHTML = "";

  // ── 容器 ──
  const container = document.createElement("div");
  container.className = "app-container";

  // ── 页头 ──
  container.appendChild(createHeader());

  // ── 主体 ──
  const main = document.createElement("main");
  main.className = "app-main";

  for (const group of groups) {
    main.appendChild(createServiceSection(group, actions));
  }

  container.appendChild(main);

  // ── 页脚 ──
  container.appendChild(createFooter());

  app.appendChild(container);
}

function createHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "app-header";

  const h1 = document.createElement("h1");
  h1.textContent = "NLab 实验室服务总导航";
  header.appendChild(h1);

  const p = document.createElement("p");
  p.textContent = "统一入口 · 一站式访问所有课题组内部服务";
  header.appendChild(p);

  return header;
}

function createFooter(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "app-footer";

  const span = document.createElement("span");
  span.textContent = "NLab Lab Navigation · Built with Vite + TypeScript";
  footer.appendChild(span);

  return footer;
}
