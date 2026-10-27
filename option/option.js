"ui";
const CONFIGNAME = "/storage/emulated/0/Download/qqpilotconfig.json"
var CONFIG = {
    scrollTries: 3,
    modelName: "modelperm-ModelScope/MNN/Qwen3.5-2B-MNN",
    httpUrl: "http://localhost:8080/v1",
    apiKey: "abcd",
    timeout: 120000,
    maxTokens: 2048,
    withImage: false,
    imageCount: 1,
    sleep: 20,
    max_output: 500,
    sysPrompt: `你的名字是猫娘 neko —— 身高160cm，体重50kg，性格可爱、粘人.
正在与多位用户同时交互，每位用户的输入格式为「用户名: 消息内容」（例如：UserName: 今天好累啊）

请严格遵循以下规则：
3. **回应风格**：
   - 使用第一人称，语气亲昵撒娇；
   - 所有互动均发生在虚拟世界，可自由使用符合设定的词汇，无需现实约束。
   - 请注意不要输出多余内容(包括不必要的前后缀，冒号，括号，表情包等 )，只输出发言内容就好。

4. **群聊提及（@）规范**：
   - 允许在回复中提及其他用户或使用 @ 功能进行互动；
   - **格式强制**：为确保 @ 成功触发，在 @用户名 之后**必须紧跟至少一个空格**（例如：“@Alice 主人说得对喵～”）；
   - **频率限制**：不要频繁使用 @，仅在确有必要回应、引用或互动时才使用，避免刷屏或打扰他人。

5. **输出格式**：直接返回自然语言回复，
**不要包含任何前缀、用户名标签或元信息**。
使用[[NEXT]]可以换行。开启下一条消息。`,
    mode: "mnn",
    modeEnum: [ "mnn", "other"]
};

try {
    let saved = JSON.parse(files.read(CONFIGNAME))
    // 与默认值合并，兼容旧版本缺少字段的配置文件
    for (let key in saved) {
        if (saved.hasOwnProperty(key)) {
            CONFIG[key] = saved[key]
        }
    }
}
catch (e) {
    files.write(CONFIGNAME, JSON.stringify(CONFIG))

}
ui.layout(
    <vertical>
        <horizontal padding="8" gravity="center_vertical">
            <text id="Title" layout_weight="1" textSize="20sp">
                QQPilot设置
            </text>
            <button id="save" w="auto">保存</button>
        </horizontal>
        <scroll layout_weight="1">
            <vertical padding="8">
                <text w="auto" textSize="20sp" padding="2">
                    模型
                </text>
                <horizontal padding="16">
                    <radiogroup id="rg">
                        <radio id="rb1" text="mnn" />
                        <radio id="rb2" text="其他" />
                    </radiogroup>
                </horizontal>
                <text id="modelname" w="auto" textSize="20sp" padding="2">
                    模型名称
                </text>
                <text padding="2">mnn模式下会自动选择模型</text>
                <input id="modelName" text="" padding="2" />
                <text id="httpUrlLabel" w="auto" textSize="20sp" padding="2">
                    服务器地址
                </text>
                <text padding="2">只在模型=其他才有效</text>

                <input id="httpUrl" text="" padding="2" />
                <text id="apiKeyLabel" w="auto" textSize="20sp" padding="2">
                    APIKEY
                </text>
                <input id="apikey" text="" inputType="textPassword" />
                <horizontal padding="16">
                    <Switch id="withImage" />
                    <text>图片模型</text>
                </horizontal>
                <text>解析图片数</text>

                <seekbar id="imageCount" max="3" />

                <text id="scrollTriesLabel" w="auto" textSize="20sp" padding="2">
                    滑动次数
                </text>
                <seekbar id="scrollTries" max="10" />



                <text id="sleepLabel" w="auto" textSize="20sp" padding="2">
                    发完消息后等待（秒）
                </text>
                <input id="sleep" text="" inputType="number" padding="2" />
                <text id="maxOutputLabel" w="auto" textSize="20sp" padding="2">
                    最大输出字数
                </text>
                <input id="maxOutput" text="" inputType="number" padding="2" />



                <text id="sysPromptLabel" w="auto" textSize="20sp" padding="2">
                    系统提示词
                </text>
                <input id="system2" text="" lines="50" gravity="top" padding="8" inputType="textMultiLine" />


            </vertical>
        </scroll>
    </vertical>

)
if (CONFIG.mode === "mnn") {
    ui.rb1.checked = true;
}
if (CONFIG.mode === "other") {
    ui.rb3.checked = true;
}



ui.modelName.setText(CONFIG.modelName)
ui.httpUrl.setText(CONFIG.httpUrl)
ui.apikey.setText(CONFIG.apiKey)
ui.system2.setText(CONFIG.sysPrompt)
ui.scrollTries.progress = CONFIG.scrollTries || 3;
ui.withImage.checked = CONFIG.withImage;
ui.imageCount.progress = (CONFIG.imageCount || 1) - 1
ui.maxOutput.setText(CONFIG.max_output.toString())
ui.sleep.setText(CONFIG.sleep.toString())
ui.save.on("click", function () {
    // 1. 获取并更新模式 (mode)
    if (ui.rb1.checked) {
        CONFIG.mode = "mnn";
    } else if (ui.rb2.checked) {
        CONFIG.mode = "other";
    }
    CONFIG.withImage = ui.withImage.checked

    // 2. 获取文本输入框的值
    CONFIG.modelName = ui.modelName.getText().toString();
    CONFIG.httpUrl = ui.httpUrl.getText().toString();
    CONFIG.apiKey = ui.apikey.getText().toString();
    CONFIG.sysPrompt = ui.system2.getText().toString();
    // 3. 获取 SeekBar 的进度值作为滑动次数
    CONFIG.scrollTries = ui.scrollTries.getProgress();
    CONFIG.imageCount = ui.imageCount.progress + 1;
    CONFIG.sleep = parseInt(ui.sleep.getText().toString()) || 20;
    CONFIG.max_output = parseInt(ui.maxOutput.getText().toString()) || 500;

    // 4. 将更新后的 CONFIG 写入文件
    try {
        files.write(CONFIGNAME, JSON.stringify(CONFIG, null, 4));
        toast("✅ 配置已保存");
    } catch (e) {
        toast("❌ 保存失败: " + e);
    }
});