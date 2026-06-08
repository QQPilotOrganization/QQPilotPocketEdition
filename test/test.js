
auto.waitFor()
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
toast("SB!!!")
function getImagesBase64(max) {


    let collections1 = desc("图片").find()
    let collections2 = desc("表情[动画表情]").find()
    for (let f of collections2) {
        collections1.push(f)
    }
    let result=[]
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
            if(max<=0)
            {
                break;
            }
        } catch (e) {
            continue
        }

    }
    return result

}
let o=getImagesBase64(1)
log(o)