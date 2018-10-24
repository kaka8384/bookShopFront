function savePassword()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    var userId=Cookies.get('userinfo');
    var oldpassword=$("#user-old-password").val().trim();
    var newpassword=$("#user-new-password").val().trim();
    var confirmpassword=$("#user-confirm-password").val().trim();
    if(oldpassword=="")
    {
        alert("请输入原密码！");
        $("#oldpassword").focus();
        return;
    }
    else if(newpassword=="")
    {
        alert("请输入新密码！");
        $("#newpassword").focus();
        return;
    }
    else if(newpassword.length<6)
    {
        alert("请设置6位数密码！");
        $("#newpassword").focus();
        return;
    }
    else if(confirmpassword=="")
    {
        alert("请输入确认密码！");
        $("#confirmpassword").focus();
        return;
    }
    else if(newpassword!==confirmpassword)
    {
        alert("新密码和确认密码必须相同！");
        $("#confirmpassword").focus();
        return;
    }
    else{
        axios.post(serverUrl+'UpdatePassword/'+userId, {
            newpassword: newpassword,
            oldpassword: oldpassword
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                  alert("修改密码成功！");
                }
                else if(returnData.code=="10013")
                {
                  alert("原密码不匹配，请重新输入！");
                  $("#oldpassword").focus();
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}

$(document).ready(function(){
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
});