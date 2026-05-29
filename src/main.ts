/**
 * 应用入口。
 *
 * 不做任何业务逻辑，只负责：
 * 1. 导入全局样式
 * 2. 调用 bootstrap() 启动应用
 */
import "./presentation/styles/global.css";
import "./presentation/styles/layout.css";
import "./presentation/styles/components.css";
import { bootstrap } from "./app/bootstrap";

bootstrap().start();
