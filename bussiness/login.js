function userLogin()
{
    var _username=$("#user").val().trim();
    var _password=$("#password").val().trim();
    if(_username=="")
    {
        alert("请输入用户名！");
        $("#user").focus();
        return;
    }
    else if(_password=="")
    {
        alert("请输入密码！");
        $("#password").focus();
        return;
    }
    else{
        axios.post(serverUrl+'CustomerLogin', {
            username: _username,
            password: _password
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                  Cookies.set('userinfo', returnData.userInfo.userId, { expires: 1}); //记录登录信息cookie
                  Cookies.set('useraccount', returnData.userInfo.username, { expires: 1}); 
                  if($("#remember-me").prop("checked"))
                  {
                    Cookies.set('login_username', _username, { expires: 1});
                    Cookies.set('login_password', _password, { expires: 1});
                  }
                  alert("登录成功！");
                  this.location.href="../home/default.html";
                }
                else if(returnData.code=="10002")
                {
                  alert("登录用户不存在！");
                  $("#user").focus();
                }
                else if(returnData.code=="10004")
                {
                  alert("登录用户已注销！");
                  $("#user").focus();
                }
                else if(returnData.code=="10003")
                {
                  alert("登录密码错误！");
                  $("#password").focus();
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}

function initPage()
{
    var username=Cookies.get('login_username');
    if(!!username)
    {
        $("#user").val(username);
    }
    var password=Cookies.get('login_password');
    if(!!password)
    {
        $("#password").val(password);
    }
}

$(document).ready(function(){
    initPage();
});