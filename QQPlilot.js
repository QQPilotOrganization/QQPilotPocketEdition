auto.waitFor()
const CONFIGNAME = "/storage/emulated/0/Download/qqpilotconfig.json"
let Pname = getPackageName("QQ");
if (Pname == null) {
    toastLog("未找到QQ")
}
if (!requestScreenCapture()) {
    toastLog("请求截图失败");
    exit();
}
const IdentificationString = "⨋";
importPackage(Packages["okhttp3"]);

function getImagesBase64(max) {


    let collections1 = desc("图片").find()
    let collections2 = desc("表情[动画表情]").find()
    for (let f of collections2) {
        collections1.push(f)
    }
    let result = []
    for (let d of collections1) {
        try {
            let rect = d.bounds()
            log(d.bounds())
            let i = images.captureScreen();
            let clipped = images.clip(i, rect.left, rect.top, rect.width(), rect.height())
            let base64 = images.toBase64(clipped)
            // log(base64)
            result.push(base64);
            max--;
            if (max <= 0) {
                break;
            }
        } catch (e) {
            continue
        }

    }
    return result

}





// --- 配置 ---
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
    modeEnum: ["mnn", "other"]
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
log(CONFIG)

var client = new OkHttpClient.Builder()
    .retryOnConnectionFailure(true)
    .connectTimeout(CONFIG.timeout, java.util.concurrent.TimeUnit.MILLISECONDS)
    .readTimeout(CONFIG.timeout, java.util.concurrent.TimeUnit.MILLISECONDS)
    .writeTimeout(CONFIG.timeout, java.util.concurrent.TimeUnit.MILLISECONDS)
    .build();


function getAnswer(messages) {
    // === 处理图片（如果启用）===
    if (CONFIG.withImage) {
        let imagesBase64 = getImagesBase64(CONFIG.imageCount);
        // log(imagesBase64)
        if (imagesBase64 && imagesBase64.length > 0) {
            // 创建新的 messages：将第一张图插入到第一条消息的 content 开头（或根据需求调整位置）
            // 注意：OpenAI 格式要求 content 是数组，每个元素是 { type: "text" | "image_url", ... }
            let newMessages = [];
            for (let i = 0; i < messages.length; i++) {
                let msg = messages[i];
                if (i === 0) { // 只在第一条消息前加图（可自定义策略）
                    let contentArray = [];
                    // 添加所有图片
                    for (let img of imagesBase64) {
                        contentArray.push({
                            type: "image_url",
                            image_url: {
                                url: img // 如 "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAA..."
                            }
                        });
                    }
                    // 添加原始文本内容（如果存在）
                    if (msg.content && typeof msg.content === "string") {
                        contentArray.push({
                            type: "text",
                            text: msg.content
                        });
                    } else if (Array.isArray(msg.content)) {
                        // 如果原 content 已是数组，合并进去
                        contentArray = contentArray.concat(msg.content);
                    }
                    newMessages.push({
                        role: msg.role,
                        content: contentArray
                    });
                } else {
                    newMessages.push(msg);
                }
            }
            messages = newMessages;
        }
    }

    // === 构建 JSON 请求体 ===
    var jsonBody = JSON.stringify({
        model: CONFIG.modelName,
        messages: messages,
        max_tokens: CONFIG.maxTokens || 2048,
        temperature: 0.7,
        stream: false
    });
    toastLog(jsonBody)
    // === 发送 HTTP 请求 ===
    var MediaType_JSON = Packages.okhttp3.MediaType.parse("application/json; charset=utf-8");

    var requestBody = Packages.okhttp3.RequestBody.create(MediaType_JSON, jsonBody);

    var request = new Packages.okhttp3.Request.Builder()
        .url(CONFIG.httpUrl + "/chat/completions")
        .addHeader("Authorization", "Bearer " + CONFIG.apiKey)
        .post(requestBody)
        .build();

    try {
        toastLog("[HTTP] 正在发送原生 OkHttp 请求...");
        var response = client.newCall(request).execute(); // 同步执行

        toastLog("[HTTP] Status: " + response.code());
        var responseBodyStr = response.body().string();

        if (response.code() === 200) {
            toastLog("[HTTP] Success: " + responseBodyStr);
            return responseBodyStr;
        } else {
            toastLog("[HTTP] Error: " + responseBodyStr);
            return "";
        }
    } catch (e) {
        toastLog("[ERROR] 请求异常: " + e);
        return "";
    } finally {
        // 确保响应关闭（即使抛异常也尝试关闭）
        if (typeof response !== 'undefined' && response && response.body()) {
            response.body().close();
        }
    }
}

// --- 执行 ---
// 注意：这里必须判断 CONFIG.mode，而不是模型名称
if (CONFIG.mode === "mnn") {
    try {
        let models = http.get("http://localhost:8080/v1/models").body.string()
        log("http://localhost:8080/v1/models", models);
        models = JSON.parse(models).data[0].id
        CONFIG.modelName = models
    } catch (e) {
        toastLog("自动获取 MNN 模型失败，继续使用配置中的模型名: " + e)
    }
}

function getRequestsString(contents) {
    let result = []
    result.push({ role: "system", content: CONFIG.sysPrompt })

    for (content of contents) {
        if (content.ownByMyself) {
            result.push({ role: "assistant", content: content.content.replace(IdentificationString, "") })
        } else {
            result.push({ role: "user", content: content.name + ":" + content.content })
        }
    }
    if (result[result.length - 1].role == "assistant") {
        result.push({ role: "user", content: "_" })
    }
    return result
}


let width = device.getCurWidth();
let hieght = device.getCurHeight();
log(width, hieght)
setScreenMetrics(1080, 2280);
app.launch(Pname)



sleep(2000)
while (1) {


    let screenShot = null;


    let point = null
    while (!point) {
        sleep(100)
        screenShot = captureScreen();
        point = findColor(screenShot, "#FA4C2D");
    }
    print(point)
    click(point.x + 100, point.y + 100)




    sleep(1000)
    // log("z",z)

    let contents = []
    for (let x = 0; x < CONFIG.scrollTries; ++x) {
        scrollUp();
        sleep(1000)
    }
    for (let x = 0; x < CONFIG.scrollTries; ++x) {
        scrollDown();
        sleep(1000)
        let z = id("com.tencent.mobileqq:id/root").find()

        for (let f of z) {
            try {
                // contents.push(f.text())
                let texts = f.find(className("TextView"))
                // for (let text of texts) {
                //     log(text.text())
                // }
                //不明所以的分类器，但是正常使用
                switch (texts.length) {
                    case 1:
                        {
                            let c = texts[0].text();
                            let myself = false;
                            if (c.indexOf(IdentificationString) != -1) {
                                myself = true;
                            }
                            let content = { "Name": "", "content": c, "ownByMyself": myself }
                            contents.push(content)
                        }
                        break;
                    case 2:
                        if (texts[0].text() === "管理员" || texts[0].text() === "群主") {
                            continue;
                        }
                        else {
                            let c = texts[1].text();
                            let myself = false;
                            if (c.indexOf(IdentificationString) != -1) {
                                myself = true;
                            }
                            let name = texts[0].text();
                            if (name == null) {
                                name = ""
                            }
                            let content = { "Name": name, "content": c, "ownByMyself": myself }
                            contents.push(content)
                            break;
                        }
                    case 3:
                        let c = texts[2].text();
                        let myself = false;
                        if (c.indexOf(IdentificationString) != -1) {
                            myself = true;
                        }
                        let name = texts[1].text();
                        if (name == null) {
                            name = ""
                        }
                        let content = { "Name": name, "content": c, "ownByMyself": myself }
                        contents.push(content)
                        break;
                    default:
                        let c2 = texts[texts.length - 1].text();
                        let myself2 = false;
                        if (c2.indexOf(IdentificationString) != -1) {
                            myself2 = true;
                        }
                        let name2 = texts[1].text();
                        if (name2 == null) {
                            name2 = ""
                        }
                        let content2 = { "Name": name2, "content": c2, "ownByMyself": myself2 }
                        contents.push(content2)
                        break;
                }
            } catch (e) {
                log(e)
            }



            // let content

        }
    }

    let src = getRequestsString(contents)
    print(src)
    try {
        let answer = ""

        let answerJson = getAnswer(src)
        if (answerJson == "") {
            toastLog("timeout")

            back()
            sleep(1000)
            continue
        }
        answerJson = JSON.parse(answerJson)
        answer = answerJson.choices[0].message.content



        if (!answer) {
            toastLog("没有生成回复")
            back()
            sleep(1000)
            continue
        }

        answer = answer.slice(0, CONFIG.max_output)
        const answers = answer.split("[[NEXT]]")


        for (a of answers) {
            input(0, a + IdentificationString);
            click("发送")
            sleep(500)
        }
        sleep(500)
        back()
        sleep(1000)
        sleep(CONFIG.sleep * 1000)
    } catch (e) {
        log(e)
        back()
        sleep(1000)
        continue
    }

}