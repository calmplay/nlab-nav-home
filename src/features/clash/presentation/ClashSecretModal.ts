/**
 * Clash Secret 密码悬浮框。
 *
 * - 标题: "<machine> clash"
 * - 密码输入框 + 错误提示
 * - "进入" 按钮（验证中显示 loading）、"取消" 按钮
 * - Enter 提交、Esc 关闭、点击遮罩关闭
 * - 错误信息不包含密码原文
 */
export interface ClashSecretModalHandle {
  showError(msg: string): void;
  setLoading(loading: boolean): void;
  remove(): void;
}

export function createClashSecretModal(
  machineLabel: string,
  onEnter: (secret: string) => Promise<void>,
  onCancel: () => void,
  initialError?: string,
): ClashSecretModalHandle {
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

  const errorEl = document.createElement("p");
  errorEl.className = "clash-modal-error";
  if (initialError) {
    errorEl.textContent = initialError;
    errorEl.style.display = "block";
  }
  box.appendChild(errorEl);

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

  let loading = false;
  const submit = async () => {
    if (loading) return;
    const s = input.value.trim();
    if (!s) {
      errorEl.textContent = "请输入 secret";
      errorEl.style.display = "block";
      input.style.borderColor = "#cf222e";
      return;
    }
    errorEl.style.display = "none";
    input.style.borderColor = "";
    setLoading(true);
    await onEnter(s);
  };

  enterBtn.addEventListener("click", submit);
  btnRow.appendChild(enterBtn);
  box.appendChild(btnRow);

  overlay.appendChild(box);

  // 关闭
  const close = () => {
    if (!loading) onCancel();
  };
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
  });

  document.body.appendChild(overlay);
  setTimeout(() => input.focus(), 100);

  function setLoading(v: boolean): void {
    loading = v;
    enterBtn.disabled = v;
    enterBtn.textContent = v ? "验证中..." : "进入";
    input.disabled = v;
  }

  return {
    showError(msg: string) {
      errorEl.textContent = msg;
      errorEl.style.display = "block";
    },
    setLoading,
    remove() {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
    },
  };
}
