function register()
{
    var _username=$("#username").val().trim();
    var _password=$("#password").val().trim();
    var _passwordRepeat=$("#passwordRepeat").val().trim();
    if(_username=="")
    {
        alert("请输入用户名！");
        $("#username").focus();
        return;
    }
    else if(_password=="")
    {
        alert("请输入密码！");
        $("#password").focus();
        return;
    }
    else if(_password.length<6)
    {
        alert("请输入6位数密码！");
        $("#password").focus();
        return;
    }
    else if(_passwordRepeat=="")
    {
        alert("请输入确认密码！");
        $("#passwordRepeat").focus();
        return;
    }
    else if(_passwordRepeat!==_password)
    {
        alert("密码和确认密码必须相同！");
        $("#passwordRepeat").focus();
        return;
    }
    else if(!$("#reader-me").prop("checked"))
    {
        alert("请勾选服务协议！");
        $("#reader-me").focus();
        return;
    }
    else{
        axios.post(serverUrl+'CustomerRegister', {
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
                  alert("注册成功！");
                  this.location.href="../home/default.html";
                }
                else if(returnData.code=="10001")
                {
                  alert("用户名已经存在！");
                  $("#username").focus();
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}
