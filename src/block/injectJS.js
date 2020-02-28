// 页面渲染的js片段
System.inject.js.render = function(){
/*
<script>
(function () {
    $('#lpBack').Tdrag({
        handle: '.lm-title'
    });
    $('.lm-tip').hide();
    window.sendMessageToSensorContent = function (msg) {
        msg = msg || {
            from: 'lm-message',
            method: '',
            args: {}
        };
        msg.from = 'lm-message';
        msg.method = msg.method || 'noop';
        msg.args = msg.args || [];
        window.postMessage({
            from: msg.from,
            method: msg.method,
            args: msg.args
        }, '*');
    };
    let imgs = $('.resume-basic-info img');
    let mobileSrc = ''
    let emailSrc = ''
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (img.className == 'email') {
            emailSrc = img.src;
        }
        if (img.className == 'telphone') {
            mobileSrc = img.src
        }
    }
    let userInfo = window.localStorage.getItem('lm-user-info');
    if (userInfo) {
        $(document).ready(function(){
            setTimeout(function () {
                // 进入匹配简历
                sendMessageToSensorContent({
                        method: 'matching-resume',
                        args: {
                            mobileSrc: mobileSrc,
                            emailSrc: emailSrc,
                            html: document.body.innerHTML,
                        }
                    }
                );
            },500);
        });
    }
    $('#lm-login').click(function () {
        let account = $('input[name=account]').val();
        let password = $('input[name=password]').val();
        let msg = {
            method: 'click-login',
            args: {
                account: account,
                password: password
            }
        }
        sendMessageToSensorContent(msg);
    });
    $('#lm-import').click(function () {
        let msg = {
            method: 'click-import',
            args: {
                mobileSrc: mobileSrc,
                emailSrc: emailSrc,
                html: document.body.innerHTML,
            }
        }
        sendMessageToSensorContent(msg);
    });
    $('#lm-update-all').click(function () {
        let msg = {
            method: 'click-update',
            args: {
                mobileSrc: mobileSrc,
                emailSrc: emailSrc,
                html: document.body.innerHTML,
            }
        }
        sendMessageToSensorContent(msg);
    });
    $('#lm-update-item').click(function (e) {
        let value = e.currentTarget.dataset.value;
        console.log('更新单个:',value);
        // let msg = {
        //     method: 'click-update',
        //     args: {
        //         mobileSrc: mobileSrc,
        //         emailSrc: emailSrc,
        //         html: document.body.innerHTML,
        //     }
        // }
        // sendMessageToSensorContent(msg)
    });
    $('#lm-visiable-control').click(function (e) {
        if ($(this).text() == '收起') {
            $('.lm-plugin-content').hide();
            $(this).html('展开')
        } else {
            $('.lm-plugin-content').show();
            $(this).html('收起');
        }
    });
    $('#lm-toggle').click(function (e) {
        $('#lpBack').hide();
    });
})();
</script>
*/
};