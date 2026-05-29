# nlab-nav-home

NLab 实验室课题组服务总导航主页 —— 统一入口，一站式访问所有内部服务。

## 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 构建 | Vite 6 | 轻量前端构建工具，开发秒级热更新 |
| 语言 | TypeScript 5.7 | 严格模式，无 `any` |
| 样式 | 纯 CSS | CSS 变量 + 组件化命名，无 UI 框架 |

**不引入任何 UI 框架**（React、Vue、Tailwind 等均不使用），所有 DOM 操作使用原生 `document.createElement`。

## 项目结构（后端工程师视角）

```
src/
├── main.ts                          # 入口：加载样式 → 调用 bootstrap()
├── app/
│   ├── bootstrap.ts                 # 组合根：实例化仓库 + 用例 → 组装 App
│   └── App.ts                       # 应用根：持有数据，触发渲染
├── domain/service/                  # 领域层 —— 只表达"实验室服务导航"本身
│   ├── Service.ts                   # Service 实体接口
│   ├── ServiceId.ts                 # 品牌类型（防与普通 string 混用）
│   ├── ServiceCategory.ts           # 分类联合类型 + 中文标签
│   ├── ServiceAccessMode.ts         # 访问方式联合类型（反代/跳转/旧入口/外链）
│   ├── ServiceRisk.ts               # 风险等级联合类型
│   └── ServiceRepository.ts         # 仓库接口（领域层不关心数据从哪来）
├── application/service/             # 应用层 —— 用例
│   ├── ListServicesUseCase.ts       # 获取服务列表
│   ├── GroupServicesUseCase.ts      # 按分类分组 + priority 排序
│   └── ResolveServiceActionUseCase.ts # 解析按钮文案、跳转行为、风险提示
├── infrastructure/service/          # 基础设施层 —— 数据来源
│   ├── serviceCatalog.ts            # 服务清单（集中维护，可提交 GitHub）
│   └── StaticServiceRepository.ts   # 仓库实现（从静态数组读取）
├── presentation/                    # 表现层 —— DOM 渲染
│   ├── components/
│   │   ├── ServiceCard.ts           # 服务卡片组件
│   │   ├── ServiceSection.ts        # 分类区域组件
│   │   └── StatusBadge.ts           # 在线状态圆点
│   ├── pages/
│   │   └── HomePage.ts              # 首页（页头 + 分组 + 页脚）
│   └── styles/
│       ├── global.css               # CSS 变量、重置、排版
│       ├── layout.css               # 页面布局（容器、页头、页脚）
│       └── components.css           # 组件样式（卡片、标签、按钮）
└── shared/                          # 共享工具
    ├── url.ts                       # URL 路径拼接
    └── assertNever.ts               # 联合类型穷尽检查
```

### 依赖方向

```
presentation → application → domain
infrastructure → domain
app → presentation / infrastructure / application
```

**禁止**：domain 依赖 presentation / infrastructure / DOM。

### 为什么这个结构适合后端工程师

1. **分层熟悉**：`domain → application → infrastructure → presentation` 的分层方式与你熟悉的 Spring Boot `Controller → Service → Repository → Entity` 结构高度对应。
2. **依赖倒置**：`domain` 定义接口（`ServiceRepository`），`infrastructure` 实现接口 —— 这正是 DIP（依赖倒置原则）。
3. **用例驱动**：`application` 层每个文件对应一个明确用例，相当于后端的 `XxxService`。
4. **数据集中**：所有服务信息集中在 `serviceCatalog.ts` 一个文件中，修改时不需要跨文件查找。
5. **类型安全**：`ServiceAccessMode`、`ServiceRisk`、`ServiceCategory` 都是联合类型，TS 编译器会检查穷尽性，防止遗漏分支。
6. **组合根**：`bootstrap.ts` 是唯一的依赖注入点（类似 Spring 的 `@Configuration`），依赖关系一目了然。

### 新增/修改服务

只需编辑 `src/infrastructure/service/serviceCatalog.ts`，在 `SERVICE_CATALOG` 数组中追加/修改条目即可。不需要修改任何组件代码。

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（热更新，默认 http://localhost:5173）
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 部署

```bash
# 构建
npm run build

# 产物在 dist/ 目录，复制到 nginx 静态目录即可
# scp -r dist/* <server>:/home/cy/docker_vol/nginx/html/lab-nav/
```

## 安全

- 服务配置只包含公开的服务名称、描述、标签、URL 路径
- 不包含任何 secret、token、密码、内网 IP 拓扑
- 可安全提交到 public GitHub 仓库

## License

MIT
