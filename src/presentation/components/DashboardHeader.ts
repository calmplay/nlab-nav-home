/**
 * 顶部标题栏 —— 标题 + 副标题 + 统计。
 */
export function createDashboardHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "dashboard-header";

  // 左侧
  const left = document.createElement("div");
  left.className = "header-left";

  const h1 = document.createElement("h1");
  h1.className = "header-title";
  h1.textContent = "NLab 服务导航";
  left.appendChild(h1);

  const p = document.createElement("p");
  p.className = "header-subtitle";
  p.textContent = "统一入口 · 内部服务 · 本地维护 · 1104 网关";
  left.appendChild(p);

  header.appendChild(left);

  // 右侧统计
  const right = document.createElement("div");
  right.className = "header-stats";
  right.innerHTML =
    '<span class="stat"><strong class="stat-num">10</strong> services</span>' +
    '<span class="stat-divider"></span>' +
    '<span class="stat stat--ready"><strong class="stat-num">6</strong> ready</span>' +
    '<span class="stat-divider"></span>' +
    '<span class="stat stat--planned"><strong class="stat-num">4</strong> planned</span>';
  header.appendChild(right);

  return header;
}
