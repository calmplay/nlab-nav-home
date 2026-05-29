import { createDashboardHeader } from "../components/DashboardHeader";
import { createDashboardGrid } from "../components/DashboardGrid";

/**
 * 首页 —— Bento Dashboard 布局。
 * 只负责渲染：顶部标题栏 + 6 个 tile 的网格。
 */
export function renderHomePage(): void {
  const app = document.getElementById("app");
  if (!app) {
    console.error(
      "Missing root element: #app. index.html 中缺少 <div id=\"app\"></div> 挂载点。",
    );
    const fb = document.createElement("div");
    fb.style.cssText =
      "max-width:600px;margin:60px auto;padding:24px;background:#fff3cd;color:#856404;border:1px solid #ffc107;border-radius:14px;font-family:system-ui;font-size:14px";
    fb.textContent = "页面挂载失败：index.html 缺少 #app 根节点。";
    document.body.prepend(fb);
    return;
  }

  app.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "dashboard-shell";

  const container = document.createElement("div");
  container.className = "dashboard-container";

  container.appendChild(createDashboardHeader());
  container.appendChild(createDashboardGrid());

  shell.appendChild(container);
  app.appendChild(shell);
}
