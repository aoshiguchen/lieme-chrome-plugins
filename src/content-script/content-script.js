//监听消息
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === System.Constant.Action.Extension.COPY) {
        //收到copy信息，开始获取当前页面id为sb_form_q的值
        var html = document.body.innerHTML;
        if (html) {
            // 如果获取的值不为空则返回数据到popup.js的回调函数
            if (sendResponse) sendResponse(html);
        } else {
            alert("No data");
        }
    } else if (request.action === System.Constant.Action.Extension.URL) {
        let href = window.location;
        if (href) {
            // 如果获取的值不为空则返回数据到popup.js的回调函数
            if (sendResponse) sendResponse(href);
        } else {
            alert("No data");
        }

    } else if (request.action === System.Constant.Action.Extension.SHOW) {
        if ($('#lpBack')) {
            $('#lpBack').show();
            $('.lm-plugin-content').show();
            $('#lm-visiable-control').html("收起")
        } else {
            injectPlugin();
        }
    }
});

window.addEventListener('message', function (e) {
    if (e.data.from != 'lm-message') {
        return;
    }
    let params = e.data.args;
    let userInfo = System.util.getUserInfo();
    System.log.info('用户信息:', userInfo);

    switch (e.data.method) {
        case 'matching-resume':
            // showTip("您当前还不是会员，请前往官网升级")
            // return;

            Promise.all([loadImage(params.mobileSrc), loadImage(params.emailSrc)])
                .then(function (results) {
                    System.api.liepin.resumePaser({
                        text: params.html,
                        mobile: results[0],
                        email: results[1],
                        userId: userInfo.id
                    }, function(data){
                        if (data.code == 200) {
                            // showTip(data.message);

                            closeLoading();
                            if ((data.data.relationResume && data.data.relationResume.length > 0) || (data.data.relationOldResume && data.data.relationOldResume.length >0)) {
                                showData(data.data.relationResume, data.data.relationOldResume);
                            } else {
                                showEmpty();
                            }
                        } else {
                            showTip(data.message)
                        }
                    });
                })
            break;
        case 'click-login':
            if (!params.account) {
                showTip("未输入账号")
                return;
            }

            if (!params.password) {
                showTip("未输入密码")
                return;
            }


            System.api.base.login({
                account: params.account,
                password: params.password
            }, function(data){
                if (data.code != 200) {
                    showTip(data.message)
                } else {
                    window.localStorage.setItem('lm-user-info', JSON.stringify(data.data));
                    $('#lpBack').html(System.util.getHtmlContent());
                    window.location.reload();
                }
            });
            break;
        case 'click-update':
            showLoading("正在为您更新...");
            Promise.all([loadImage(params.mobileSrc), loadImage(params.emailSrc)])
                .then(function (results) {
                    System.api.liepin.resumeUpdate({
                        text: params.html,
                        mobile: results[0],
                        email: results[1],
                        resumeId: params.resumeId,
                        userId: userInfo.id,
                        updateType:params.type
                    }, function(data){
                        if (data != null && data.code == 200) {
                            closeLoading()
                            showTip("简历更新成功")
                            window.location.reload();
                        } else {
                            closeLoading()
                            showTip(res.data.message)
                        }
                        System.log.info("导入简历:", res.data);
                    });
                })
            break;
        case 'click-import':
            showLoading("正在为您导入...");
            Promise.all([loadImage(params.mobileSrc), loadImage(params.emailSrc)])
                .then(function (results) {
                    System.api.liepin.resumeImport({
                        text: params.html,
                        mobile: results[0],
                        email: results[1],
                        userId: userInfo.id
                    }, function(data){
                        if (res.data != null && res.data.code == 200) {
                            closeLoading()
                            showTip("成功导入一份简历")
                            window.location.reload();
                        } else {
                            closeLoading()
                           showTip(res.data.message)
                        }
                    });
                })
            break;
        default:
            break;
    }
})
function closeTip() {
    setTimeout(function () {
        $('.lm-tip').html = "";
        $('.lm-tip').hide();
    }, 2000)
}

function showTip(msg) {
    if (msg.indexOf('官网升级') >= 0) {
        $('.lm-tip').html(msg+'<br><a href="http://saas.yuujob.com/">http://saas.yuujob.com/</a>');
        $('.lm-tip').show();
    }else {
        $('.lm-tip').html(msg);
        $('.lm-tip').show();
        closeTip();
    }
}

function showLoading(msg) {
    $('.lm-loading').html(msg);
    $('.lm-loading').show();
}

function closeLoading() {
    $('.lm-loading').hide();
}

function showEmpty() {
    $('#lm-match-count').html(0);
    $("#lm-items").addClass('lm-hide');
    $("#lm-update-div").addClass('lm-hide');
    $("#lm-import-div").removeClass('lm-hide');

}

function showData(resumes, resumesOld) {
    if (!resumes && !resumesOld) {
        showEmpty();
        return;
    }
    let count = 0;
    if (resumes) {
        count += resumes.length
    }
    if (resumesOld) {
        count += resumesOld.length
    }
    $('#lm-match-count').html(count);
    $("#lm-items").removeClass('lm-hide');
    $("#lm-import-div").addClass('lm-hide');
    $("#lm-update-div").removeClass('lm-hide');
    let items = '';
    // ["id"=>"1","name"=>"大专"],
    // ["id"=>"2","name"=>"本科"],
    // ["id"=>"3","name"=>"硕士/MBA"],
    // ["id"=>"4","name"=>"博士及以上"]
    if (resumes) {
        let degree = {
            '': "未知",
            '0': "未知",
            '1': "大专",
            '2': "本科",
            '3': "硕士/MBA",
            '4': "博士及以上",
        }
        let sex = {
            "": "未知",
            "0": "未知",
            "1": "男",
            "2": "女",
        }
        for (let i = 0; i < resumes.length; i++) {
            let resume = resumes[i];
            items += "<div class=\"flex flex-horizontal flex-center-v item flex-pack-justify\">\n" +
                "<div class='flex flex-horizontal flex-center-v item flex-pack-justify flex-1'> " +
                "          <span>" + resume.name + "</span>\n" +
                "          <span>" + sex[resume.sex] + "</span>\n" +
                "          <span>" + resume.birthday + "</span>\n" +
                "          <span>100%</span>\n" +
                "          <span>" + degree[resume.last_edu] + "</span>\n" +
                "          <span style=\"color: #9c9c9c;\">" + resume.update_time + "</span>\n" +
                "</div>" +
                "          <button class=\"lm-look-item\"  style='margin-left: 6px' data-value='" + resume.id + "'>查看</button>\n" +
                "          <button class=\"lm-update-item\"  style='margin-left: 6px'  data-type='new'  data-value='" + resume.id + "'>更新</button>\n" +

                "        </div>\n"
        }
    }

    if (resumesOld) {

        let degree = {
            "0": "未检测出",
            "1": "高中",
            "2": "大专",
            "3": "本科",
            "4": "硕士",
            "5": "博士",
            "6": "EMBA",
            "7": "MBA",
        }
        let sex = {
            "": "未知",
            "0": "未知",
            "1": "男",
            "2": "女",
        }
        for (let i = 0; i < resumesOld.length; i++) {
            let resume = resumesOld[i];
            items += "<div class=\"flex flex-horizontal flex-center-v item flex-pack-justify\">\n" +
                "<div class='flex flex-horizontal flex-center-v item flex-pack-justify flex-1'> " +
                "          <span>" + resume.name_chi + "</span>\n" +
                "          <span>" + sex[resume.sex] + "</span>\n" +
                "          <span>" + resume.birthday2 + "</span>\n" +
                "          <span>" + resume.percent + "</span>\n" +
                "          <span>" + degree[resume.degree] + "</span>\n" +
                "          <span style=\"color: #9c9c9c; min-width: 70px;\" >" + resume.cv_update_time + "</span>\n" +
                "</div>" +
                " <button class=\"lm-look-item\"  style='margin-left: 6px;' data-type='old' data-value='" + resume.id + "'>查看</button>\n" +
                "          <button class=\"lm-update-item\"  style='margin-left: 6px' data-type='old'   data-value='" + resume.id + "'>更新</button>\n" +

                "        </div>\n"
            // "
        }
    }
    $('#lm-items').html(items)
    $(".lm-look-item").click(function (e) {
        let value = e.currentTarget.dataset.value;
        let type =e.currentTarget.dataset.type
        if (type && type == 'old'){
            window.open("http://saas.yuujob.com/index/candidate/detail/id/" + value + "/is_plugin/1.html", "_blank");
        } else {
            window.open("http://saas.yuujob.com/index/candidate/candidate/id/" + value + "/is_plugin/1.html", "_blank");
        }

    })
    $(".lm-update-item").click(function (e) {
        let value = e.currentTarget.dataset.value;
        let type = e.currentTarget.dataset.type;
        // window.open("http://resource4.com/index/candidate/candidate/id/"+value+".html","_blank");
        System.log.info("更新单个:", value, value)
        let imgs = $('.resume-basic-info img');
        let mobileSrc = ''
        let emailSrc = ''
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i];
            if (img.className == 'email') {
                emailSrc = img.src
            }

            if (img.className == 'telphone') {
                mobileSrc = img.src
            }
        }

        let msg = {
            method: 'click-update',
            args: {
                mobileSrc: mobileSrc,
                emailSrc: emailSrc,
                html: document.body.innerHTML,
                resumeId: value,
                type: type,
            }
        }
        sendMessageToSensorContent(msg)
    })

}

document.addEventListener('DOMContentLoaded', function () {
    try {
        System.log.debug('DOMContentLoaded...')
        chrome.runtime.sendMessage({
            action: System.Constant.Action.Runtime.DOMContentLoaded,
            greeting: location.href
        }, function (response) {
            // alert(response);
            // todo 调用api结束后根据返回结果给通知
            // 刷新登录信息 列表信息
        });
        var resumeType = System.util.getCurrentResumeType();
        System.log.info('resumeType:', resumeType);
        if(System.Constant.Lieme.RESUME_TYPE.LIE_PIN == resumeType){
            // 猎聘网
            setTimeout(function () {
                injectPlugin();
            }, 2500)
        }
    }
    catch (e) {
        System.log.error('DOMContentLoaded error:', e);
    }

});

function loadImage(url) {
    System.log.info('loadImage:', url);
    return new Promise(function (resolve, reject) {
        if (!url) {
            resolve("")
        } else {

            System.api.base.loadImage(url, function(data){
                System.log.info('loadImage:', data);
                let binary = '';
                const bytes = new Uint8Array(data);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i += 1) {
                    binary += String.fromCharCode(bytes[i]);
                }
                var img = window.btoa(binary)
                resolve("data:image/jpeg;base64," + img);
            });
        }
    })

}

function injectPlugin() {
    let style = System.util.getInjectCSS('render');
    let javaScript = System.util.getInjectJS('render');
    let content = System.util.getRenderHtml();
    $('body').append(style + content + javaScript);
}