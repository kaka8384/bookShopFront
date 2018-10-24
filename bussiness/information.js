function getCustomerInfo()
{
    var userId=Cookies.get('userinfo');
    if(!!userId)
    {
        axios.get(serverUrl+'CurrentCustomer/'+userId)
        .then(function(response) {
            if(!!response.data&&response.data.success)
            {
                var userinfo=response.data;    
                $("#username").html(userinfo.username);  
                if(!!userinfo.headImg)
                {
                    $("#headImg").attr("src",userinfo.headImg);
                }
                if(!!userinfo.nickname)
                {
                    $("#nickname").val(userinfo.nickname);
                }
                if(!!userinfo.gender)
                {
                    if(userinfo.gender=="M")
                    {
                        $("#chkgenderM").attr("checked",true);
                    }
                    else if(userinfo.gender=="F")
                    {
                        $("#chkgenderF").attr("checked",true);
                    }
                }
                if(!!userinfo.brithDay)
                {
                    $("#brithDay").val(moment(userinfo.brithDay).format('YYYY-MM-DD'));
                }
                if(!!userinfo.mobile)
                {
                    $("#user-phone").val(userinfo.mobile);
                }
                if(!!userinfo.mail)
                {
                    $("#user-email").val(userinfo.mail);
                }
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
}

function save()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    var userId=Cookies.get('userinfo');
    var headImg=$("#headImg").attr("src");
    var nickname=$("#nickname").val().trim();
    var gender="";
    if($("#chkgenderM").attr("checked"))
    {
        gender='M';
    }
    else if($("#chkgenderF").attr("checked"))
    {
        gender='F';
    }
    var brithDay=$("#brithDay").val().trim();
    var moblie=$("#user-phone").val().trim();
    var mail=$("#user-email").val().trim();
    if(moblie!=""&&!(/^1[34578]\d{9}$/.test(moblie))){ 
        alert("请填写正确的手机号码！");  
        $("#user-phone").focus();
        return false;
    } 
    if(mail!=""&&!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(mail))){ 
        alert("请填写正确的邮箱地址！");  
        $("#user-email").focus();
        return false;
    } 
    axios.put(serverUrl+'UpdateCustomer/'+userId, {
        mobile: moblie,
        nickname: nickname,
        gender:gender,
        brithDay:brithDay,
        mail:mail,
        headImg:headImg
      })
      .then(function (response) {
        if(!!response.data)
        {
            var returnData=response.data;
            if(returnData.success)
            {
              alert("保存修改成功！");
              getCustomerInfo();
            }
            else if(returnData.code=="10002")
            {
              alert("找不到要修改的用户，请重新登陆！");
            }
            else
            {
              alert("保存修改失败！");
            }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

//上传头像
function uploadHeadImg(own)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    if($(own).val()!="")
    {
        var file=$(own).context.files[0];
        var param = new FormData()  // 创建form对象
        param.append('file', file, file.name)  // 通过append向form对象添加数据
        param.append('chunk', '0') // 添加form表单中其他数据
        let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          axios.post(serverUrl+'UploadHeadImg', param, config)
          .then(response => {
            if (!!response.data) {
                var returnData=response.data;
         
                if(returnData.success)
                {
                    alert("头像上传成功,请保存修改！");
                    $("#headImg").attr("src",returnData.url);
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
}

//初始化日期控件
function initDatePicker()
{
    $("#brithDay").datetimepicker({
        format:'yyyy-mm-dd',  //格式  如果只有yyyy-mm-dd那就是0000-00-00
        autoclose:true,//选择后是否自动关闭 
        minView:2,//最精准的时间选择为日期  0-分 1-时 2-日 3-月
        language:  'zh-CN', //中文
        weekStart: 1, //一周从星期几开始
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
       // daysOfWeekDisabled:"1,2,3", //一周的周几不能选 格式为"1,2,3"  数组格式也行
        todayBtn : true,  //在底部是否显示今天
        todayHighlight :false, //今天是否高亮显示
        keyboardNavigation:true, //方向图标改变日期  必须要有img文件夹 里面存放图标
        showMeridian:false,  //是否出现 上下午
        initialDate:new Date()
        //startDate: "2017-01-01" //日期开始时间 也可以是new Date()只能选择以后的时间
    });  
}

$(document).ready(function(){
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    initDatePicker();
    getCustomerInfo();
});