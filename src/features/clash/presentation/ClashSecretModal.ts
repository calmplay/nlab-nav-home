/**
 * Clash Secret 密码悬浮框。
 * - 标题: "<machine> clash"
 * - 密码输入框（浏览器内置眼睛，不额外加自定义按钮）
 * - 进入 / 取消两个按钮
 * - Esc 关闭、点击遮罩关闭
 */
export function createClashSecretModal(
  machineLabel: string,
  onEnter: (secret: string) => void,
  onCancel: () => void,
): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = "clash-modal-overlay";

  const box = document.createElement("div");
  box.className = "clash-modal-box";

  const title = document.createElement("h3");
  title.className = "clash-modal-title";
  title.textContent = `${machineLabel} clash`;
  box.appendChild(title);

  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Clash API secret";
  input.className = "clash-modal-input";
  box.appendChild(input);

  const btnRow = document.createElement("div");
  btnRow.className = "clash-modal-btns";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "clash-modal-btn clash-modal-btn--cancel";
  cancelBtn.textContent = "取消";
  cancelBtn.addEventListener("click", onCancel);
  btnRow.appendChild(cancelBtn);

  const enterBtn = document.createElement("button");
  enterBtn.className = "clash-modal-btn clash-modal-btn--enter";
  enterBtn.textContent = "进入";
  enterBtn.addEventListener("click", () => {
    const s = input.value.trim();
    if (!s) {
      input.style.borderColor = "#cf222e";
      return;
    }
    onEnter(s);
  });
  btnRow.appendChild(enterBtn);
  box.appendChild(btnRow);

  overlay.appendChild(box);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) onCancel();
  });
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      onCancel();
      document.removeEventListener("keydown", escHandler);
    }
  });

  setTimeout(() => input.focus(), 100);

  return overlay;
}
