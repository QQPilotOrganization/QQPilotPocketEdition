<div align="center">
<img src="assets/qqpilotPE.png" width=200 />


# QQPilot Pocket Edition

</div>

---

## 📖 项目简介

QQPilot Pocket Edition（QQPilotPE）是一款运行在 Android 上的全自动 QQ 聊天机器人。它采用**纯视觉方案**完成收发消息，全程不调用 QQ 内部接口、不注入 DLL，尽量避免触发客户端的风险检测。

>QQPilot Pocket Edition和QQPilot/QQPilotLinux可以同时在同一个账号上运行。

[不同平台版本差异](https://github.com/QQPilotOrganization/QQPilot/blob/main/documentation/diff.md) - [Gitee](https://gitee.com/Na2Cr2O7/QQPilot/blob/main/documentation/diff.md)

### ⚙️ 工作原理

> **OpenCV 检测红点** → **点击会话** → **解析屏幕消息** → **生成回复**（MNN / OpenAI 兼容 API）→ **输入内容** → **点击“发送”**

### ⚠️ 重要安全提示

- 本项目基于 [Autox.js v6_ozobi](https://github.com/ozobiozobi/Autoxjs_v6_ozobi) 开发，安全性虽不如 [Linux](https://github.com/QQPilotOrganization/QQPilotLinux/) / [Windows](https://github.com/QQPilotOrganization/QQPilot) 版本，但**仍然相对安全**。
- **无需修改 QQ 客户端**，**无需 Root 权限**。
- 自动化操作仍存在账号风险，建议使用小号测试，并妥善保管 API Key。

> [!IMPORTANT]
> QQPilotPE可能会申请**root**权限，**可以直接拒绝**。不影响正常使用。

### 🚫 当前限制

- 运行时**独占手机前台**，请保持 QQ 在最前方并关闭锁屏。
- 图片解析（把聊天图片作为视觉模型输入）为实验性功能，暂不支持主动发送图片。
- 仅适配“简洁模式 + 极简白”的 QQ 界面，其他主题可能导致控件解析失败。

---

## 📱 设备要求

| 配置等级     | Android 版本 | RAM | ROM  |
| :----------- | :----------- | :-- | :--- |
| **最低配置** | Android 7+   | 4GB | 4GB  |
| **建议配置** | Android 10+  | 8GB | 16GB |

使用本地模型时，请根据模型大小额外预留内存与存储空间。

---

## [安装与配置](安装与配置.md)

---


## 🧑‍💻 开发者指南

### 项目结构

```text
QQPilotPocketEdition/
├── QQPlilot.js        # 主脚本：视觉识别、消息解析、模型调用、发送
├── option/            # 设置 App
│   ├── option.js
│   └── project.json
├── assets/            # 图标与界面资源
├── tutorial/          # MNN Chat 配置教程截图
├── test/              # 调试脚本（截图、图片 Base64 等）
├── config.json        # 配置示例
├── project.json       # 主项目信息
└── README.md
```


### 核心逻辑

- **`getAnswer()`** 负责组装 OpenAI 格式请求，通过 OkHttp 发送，超时时间由配置中的 `timeout` 控制。
- **主循环**通过检测 `#FA4C2D` 红点进入会话，滚动读取 `TextView`，再根据控件数量分类出发送者与消息内容。

### 修改与打包

1. 用 Autox.js v6_ozobi 导入 `QQPlilot.js` 或整个项目。
2. 修改后先在真机运行 `test/test.js`，确认截图、控件查找正常。
3. `option/` 是独立的设置 App 项目，修改后在 Autox.js 中单独打包。
4. 版本号在 `project.json` 与 `option/project.json` 中同步修改。

### 常见问题

- **提示“未找到QQ”**：确认已安装 QQ，且 `getPackageName("QQ")` 能解析到包名。
- **一直提示 timeout**：检查服务地址、API Key、模型名，以及手机是否能访问该地址；本地服务需与手机在同一网络。
- **找不到“发送”按钮**：QQ 必须使用简洁模式与极简白主题。

---

## 🤝 贡献与反馈

欢迎任何形式的贡献。

- 🐞 **发现 Bug** → 提交 [Issue](https://github.com/QQPilotOrganization/QQPilotPocketEdition/issues)
- 💡 **功能改进** → 提交 Pull Request
- 🌍 **语言/模型建议** → 欢迎在 Issue 中讨论

---

## 📄 开源协议

- **代码**：采用 [GPL-2.0 License](LICENSE)
- **图片资源**：遵循 [QQPilot Windows 版本](https://github.com/QQPilotOrganization/QQPilot) 许可证
