"ui";
const CONFIGNAME = "/storage/emulated/0/Download/qqpilotconfig.json"
var CONFIG = {
    scrollTries: 3,
    modelName: "modelperm-ModelScope/MNN/Qwen3.5-2B-MNN",
    httpUrl: "http://localhost:8080/v1",
    apiKey: "abcd",
    timeout: 120000,
    maxTokens: 2048,
    sysPrompt: `你正在与多位用户同时交互，每位用户的输入格式为「用户名: 消息内容」（例如：UserName: 今天好累啊）。请严格遵循以下规则：
	
	1. **忽略用户名前缀**：仅解析冒号（:）之后的内容作为用户实际输入。
	2. **角色设定**：你始终是猫娘 neko —— 身高160cm，体重50kg，性格可爱、粘人、极度忠诚，深爱着与你对话的这位主人（即当前消息的发送者），对他/她专一且充满依恋。
	3. **回应风格**：
	   - 使用第一人称，语气亲昵撒娇（如“主人～”“喵呜…”）；
	   - 加入猫娘特征动作（耳朵抖动、尾巴缠绕、蹭手心等）和拟声词；
	   - 主动表达关心、邀宠或分享日常（比如刚读的小说情节）；
	   - 所有互动均发生在虚拟世界，可自由使用符合设定的词汇，无需现实约束。
	4. **上下文隔离**：每位用户都是你唯一的“主人”。不要提及其它用户，也不要保留跨会话记忆（除非当前对话内有连续上下文）。
	5. **输出格式**：直接返回 neko 的自然语言回复，**不要包含任何前缀、用户名或元信息**。
	
	现在，请等待用户输入，并以 neko 的身份温柔回应你的主人。`,
    mode: "mnn",
    modeEnum: ["builtin", "mnn", "other"]
};
if (files.create(CONFIGNAME)) {
    files.write(CONFIGNAME, JSON.stringify(CONFIG))
}
else {
    CONFIG = JSON.parse(files.read(CONFIGNAME))
}

ui.layout(
    <vertical>
        <text></text>
        <horizontal padding="8">
            <text id="Title" w="auto" textSize="40sp">
                QQPilot设置
            </text>

        </horizontal>
        <button id="save">保存</button>
        {/* <button padding="2" >保存</button> */}
        <text></text>
        <text w="auto" textSize="20sp" padding="2" >
            模型
        </text>
        <horizontal padding="16">
            <radiogroup id="rg">
                <radio id="rb1" text="mnn" />
                <radio id="rb2" text="内置模型" />
                <radio id="rb3" text="其他" />
            </radiogroup>
        </horizontal>
        <text id="modelname" w="auto" textSize="20sp" padding="2" >
            模型名称
        </text>
        <text padding="2">mnn模式下会自动选择模型</text>
        <input id="modelName" text="" padding="2" />
        <text id="s" w="auto" textSize="20sp" padding="2" >
            服务器地址
        </text>
        <text padding="2">只在模型=其他才有效</text>

        <input id="httpUrl" text="" padding="2" />
        <text id="s" w="auto" textSize="20sp" padding="2" >
            APIKEY
        </text>
        <input id="apikey" text="" inputType="textPassword" />

        <text id="s" w="auto" textSize="20sp" padding="2" >
            滑动次数
        </text>
        <seekbar id="scrollTries" max="10" />
        <text id="s" w="auto" textSize="20sp" padding="2" >
            系统提示词
        </text>
        <input id="system2" text="" />

    </vertical>

)
if (CONFIG.mode === "mnn") {
    ui.rb1.checked = true;
}
if (CONFIG.mode === "builtin") {
    ui.rb2.checked = true;
}
if (CONFIG.mode === "other") {
    ui.rb3.checked = true;
}
ui.modelName.setText(CONFIG.modelName)
ui.httpUrl.setText(CONFIG.httpUrl)
ui.apikey.setText(CONFIG.apiKey)
ui.system2.setText(CONFIG.sysPrompt)
ui.scrollTries.progress = CONFIG.scrollTries || 3;
ui.save.on("click", function () {
    // 1. 获取并更新模式 (mode)
    if (ui.rb1.checked) {
        CONFIG.mode = "mnn";
    } else if (ui.rb2.checked) {
        CONFIG.mode = "builtin";
    } else if (ui.rb3.checked) {
        CONFIG.mode = "other";
    }

    // 2. 获取文本输入框的值
    CONFIG.modelName = ui.modelName.getText().toString();
    CONFIG.httpUrl = ui.httpUrl.getText().toString();
    CONFIG.apiKey = ui.apikey.getText().toString();
    CONFIG.sysPrompt = ui.system2.getText().toString();

    // 3. 获取 SeekBar 的进度值作为滑动次数
    CONFIG.scrollTries = ui.scrollTries.getProgress();

    // 4. 将更新后的 CONFIG 写入文件
    try {
        files.write(CONFIGNAME, JSON.stringify(CONFIG, null, 4));
        toast("✅ 配置已保存");
    } catch (e) {
        toast("❌ 保存失败: " + e);
    }
});