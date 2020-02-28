// 登陆之前的content内容
System.inject.html.loginBeforeContent = function(){
/*
<div class="flex flex-horizontal flex-center-v lm-title">
	<span >猎么插件 &nbsp;&nbsp;&nbsp;1.0.0 版</span>
	<div class="flex flex-horizontal flex-center-v " style='margin-left: 10px;cursor: pointer'>         
		<span id='lm-visiable-control'>收起</span>
    	<span id='lm-toggle'style='margin-left: 12px;'>关闭</span>
    </div>
</div>
<div id="login" class="lm-plugin-content ">
	<div class='flex flex-vertical flex-center-v'>
		<div class='flex flex-horizontal flex-center-v input-back'>   
			<span>账号</span>   
			<input class='flex flex-1' style='padding-left: 6px;border: 1px solid #eeeeee;'  type="text" placeholder="请输入账号" name="account">
		</div><div class='flex flex-horizontal flex-center-v input-back'>   
		<span>密码</span>      
		<input class='flex flex-1' style='padding-left: 6px;border: 1px solid #eeeeee;' type="password" placeholder="请输入密码" name="password">
	</div>      
	<button id="lm-login" style="margin: 12px 0;width: 50%;">登录</button>
	<span style='margin-bottom: 12px;'>微信扫码进入小程序</span>
	<img src="https://bbs.yuujob.com/static/img/qrcode.jpg" style='width: 35%;'>
	<div class="flex flex-horizontal flex-center-v" style='margin: 12px 0;'>
		<span style="color:#9c9c9c;">客服微信</span> 
		<span style='margin-left: 12px;'>liemekefu</span>
	</div>
	<span class='lm-tip'></span>
</div>
*/
};

// 登录之后的content内容
System.inject.html.loginAfterContent = function(){
/*
<div class="flex flex-horizontal flex-center-v lm-title">
	<span >猎么插件 &nbsp;&nbsp;&nbsp;1.0.0 版</span>
	<div class="flex flex-horizontal flex-center-v " style='margin-left: 10px;cursor: pointer'>         
		<span id='lm-visiable-control'>收起</span>
    	<span id='lm-toggle'style='margin-left: 12px;'>关闭</span>
    </div>
</div>
<div id="logined" class='lm-plugin-content' style='position: relative'>
	<div class='lm-loading' >
		<span>正在为您匹配...</span>
	</div>      
<div  class="  flex flex-vertical" style="border-bottom: 1px solid #9c9c9c;padding: 12px;">
	<img id='plugIMG' >               
	<div id='lm-import-div'class="flex flex-horizontal flex-center-v">
    	<span class="flex flex-1">您的库中无相同手机/邮箱的简历</span>
    	<button id='lm-import'>导入</button>
    </div>
    <div id='lm-update-div' class="flex flex-horizontal flex-center-v">
      <span class="flex flex-1">您的库中有相同手机/邮箱的简历</span>
    </div>
</div>
<div class="flex flex-vertical" style="padding: 12px;">
    <span class="sub-lm-title">您的库中有<span id='lm-match-count' style='color: #FA541C'></span>份相似简历</span>
		<div id='lm-items'></div>      
	</div>
<span class='lm-tip'></span>    
*/
};