import type { Service } from "../../domain/service/Service";
import type { ResolvedAction } from "../../application/service/ResolveServiceActionUseCase";
import { createServiceBoard } from "../components/ServiceBoard";
import { createBoardSummary, computeStats } from "../components/BoardSummary";

/**
 * 首页 —— 轻量 header + 统计 + 4 列服务 board（一页展示，不滚动）。
 */
export function renderHomePage(
  services: Service[],
  actions: Map<string, ResolvedAction>,
): void {
  const app = document.getElementById("app");
  if (!app) {
    console.error(
      "Missing root element: #app. index.html 中缺少 <div id=\"app\"></div> 挂载点。",
    );
    const fallback = document.createElement("div");
    fallback.style.cssText =
      "max-width:600px;margin:60px auto;padding:24px;background:#fff3cd;color:#856404;border:1px solid #ffc107;border-radius:6px;font-family:system-ui;font-size:14px";
    fallback.textContent =
      "页面挂载失败：index.html 缺少 #app 根节点。";
    document.body.prepend(fallback);
    return;
  }

  app.innerHTML = "";

  // ── shell ──
  const shell = document.createElement("div");
  shell.className = "app-shell";

  // ── 页头 ──
  const header = document.createElement("header");
  header.className = "app-header";

  const left = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.textContent = "NLab 服务导航";
  left.appendChild(h1);
  const sub = document.createElement("p");
  sub.textContent = "统一入口 · 内部服务 · 跳转与规划接入";
  left.appendChild(sub);
  header.appendChild(left);

  const stats = computeStats(services);
  const right = document.createElement("div");
  right.className = "header-stats";
  right.innerHTML = `<span><strong>${stats.total}</strong> services</span><span><strong>${stats.available}</strong> available</span><span><strong>${stats.planned}</strong> planned</span>`;
  header.appendChild(right);

  shell.appendChild(header);

  // ── 容器 ──
  const container = document.createElement("div");
  container.className = "app-container";

  container.appendChild(createBoardSummary(stats));
  container.appendChild(createServiceBoard(services, actions));

  shell.appendChild(container);
  app.appendChild(shell);
}
