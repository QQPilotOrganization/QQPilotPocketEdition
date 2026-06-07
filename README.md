# QQPilot Pocket Edition

![alt text](assets/qqpilotPE.png)

---

## 📖 项目简介

QQPilot Pocket Edition 是一款全自动 QQ 聊天机器人，专为 Android 平台设计。它通过纯视觉方案实现智能回复，**全程不调用 QQ 内部接口、不注入 DLL**，极大降低了账号封禁风险。

### ⚙️ 工作原理

> **OpenCV 检测红点** → **点击红点** → **解析消息** → **调用 LLM 生成回复** → **输入并发送**

### ⚠️ 重要安全提示

- 本项目基于 `autoXJS v6_ozobi` 开发，安全性虽不如 Linux/Windows 版本，但**仍然相对安全**。
- **无需修改 QQ 客户端**，**无需 Root 权限**。
- 请妥善保管您的 API Key，避免泄露。

### 🚫 当前限制

- 暂不支持图片解析和上传图片功能。
- 内置模型无法直接使用，需自行配置外部 API 或本地模型。

---

## 📱 设备要求

| 配置等级     | Android 版本 | RAM | ROM  |
| :----------- | :----------- | :-- | :--- |
| **最低配置** | Android 7+   | 4GB | 4GB  |
| **建议配置** | Android 10+  | 8GB | 16GB |

---

## 🛠️ 安装与配置指南

### 1. QQ 客户端设置（必须）

为确保视觉识别准确率，请务必按以下要求配置 QQ：

- **模式选择**：简洁模式
- **主题色**：极简白
- **特别关心**：关闭所有特别关心功能
- **色彩滤镜**：保持关闭状态

### 2. 配置 AI 模型

推荐使用 [MNN Chat](https://github.com/alibaba/MNN/blob/master/apps/Android/MnnLlmChat/README_CN.md#releases) 进行本地部署，也支持任意兼容 OpenAI API 的服务。

#### 以 MNN Chat + Qwen3.5-2B-MNN 为例：

1.  **下载模型**：在 MNN Chat 中下载 `Qwen3.5-2B-MNN`。
    ![alt text](tutorial/Screenshot_20260607-214755.jpg)

2.  **进入设置**：在“我的模型”选项卡中选择已下载的模型，点击左上角进入设置。
    ![alt text](tutorial/Screenshot_20260607-214907.jpg)

3.  **参数配置**：参照下图完成配置后，**务必重启模型服务**。
    ![alt text](tutorial/Screenshot_20260607-214945.jpg)

### 3. 安装与启动

1.  确保手机已安装 QQ 客户端。
2.  前往 [Releases](../../releases) 页面下载并安装 `QQPilot` 和 `QQPilot设置` APK。
3.  打开 `QQPilot设置` 按需调整参数。
4.  打开 `QQPilot` 主程序，授予**无障碍权限**，点击“立即开始”。

🎉 **配置完成！机器人将自动接管消息回复。**

---

## 🧑‍💻 开发者指南

本项目基于 [Autoxjs_v6_ozobi](https://github.com/ozobiozobi/Autoxjs_v6_ozobi?tab=readme-ov-file) 开发。

---

## 🤝 贡献与反馈

我们欢迎任何形式的贡献！

- 🐞 **发现 Bug** → 提交 [Issue](https://github.com/QQPilotOrganization/QQPilotLinux/issues)
- 💡 **功能改进** → 提交 Pull Request
- 🌍 **语言/模型建议** → 欢迎在 Issue 中讨论

> 让我们一起打造更安全、智能的视觉自动化工具！

---

## 📄 开源协议

- **代码**：采用 [GPL-2.0 License](LICENSE)
- **图片资源**：遵循 [QQPilot Windows 版本](https://github.com/QQPilotOrganization/QQPilot) 许可证
