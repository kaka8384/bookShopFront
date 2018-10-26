function getMyAddressList()
{
    var userId=Cookies.get('userinfo');
    var url=serverUrl+'QueryAddress/'+userId;
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
            response.data.addressList.map(function(item,index){
                var defaultcss="";
                var setdefaulthtml="<span onclick='setDefault(this,\""+item._id+"\")'; class='new-option-r'><i class='am-icon-check-circle'></i>设为默认</span>";
                if(item.isDefault)
                {
                    setdefaulthtml="<span class='new-option-r'><i class='am-icon-check-circle'></i>默认地址</span>";
                    defaultcss="defaultAddr";
                }
                htmlcontent+="<li class='user-addresslist "+defaultcss+"'>"+
                setdefaulthtml+
               "<p class='new-tit new-p-re'>"+
               "<span class='new-txt name'>"+item.name+"</span>"+
               "<span class='new-txt-rd2 mobile'>"+item.mobile+"</span>"+
               "</p>"+
               "<div class='new-mu_l2a new-p-re'>"+
               "<p class='new-mu_l2cw'>"+
               "<span class='title'>地址：</span>"+
               "<span class='province'>"+item.province+"</span>&nbsp;"+
               "<span class='city'>"+item.city+"</span>&nbsp;"+
               "<span class='dist'>"+item.district+"</span>&nbsp;"+
               "<span class='street'>"+item.address+"</span></p>"+
               "</div>"+
               "<div class='new-addr-btn'>"+
               "<a onclick='bindUpdateData(this,\""+item._id+"\");' href='javascript:void(0);'><i class='am-icon-edit'></i>编辑</a>"+
               "<span class='new-addr-bar'>|</span>"+
               "<a href='javascript:delAddress(\""+item._id+"\");'><i class='am-icon-trash'></i>删除</a>"+
               "</div>"+
               "</li>";

            });
            $("#addressList").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });  
}

function initPageCss()
{
    $(".new-option-r").click(function() {
        $(this).parent('.user-addresslist').addClass("defaultAddr").siblings().removeClass("defaultAddr");
    });
    
    var $ww = $(window).width();
    if($ww>640) {
        $("#doc-modal-1").removeClass("am-modal am-modal-no-btn");
    }
}

function initProvince()
{
    var url=serverUrl+'QueryProvince';
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="<option value='0'>请选择</option>";
            response.data.list.map(function(item,index){
                htmlcontent+="<option code='"+item.item_code+"' value='"+item.item_name+"'>"+item.item_name+"</option>";
            });
            $("#selprovince").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    }); 
}

function changeCity(own)
{
    var url=serverUrl+'QueryCity/'+$(own).find(":checked").attr("code");
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="<option value='0'>请选择</option>";
            response.data.list.map(function(item,index){
                htmlcontent+="<option code='"+item.item_code+"' value='"+item.item_name+"'>"+item.item_name+"</option>";
            });
            $("#selcity").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    }); 
}

function changeDistrict(own)
{
    var url=serverUrl+'QueryDistrict/'+$(own).find(":checked").attr("code");
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="<option value='0'>请选择</option>";
            response.data.list.map(function(item,index){
                htmlcontent+="<option code='"+item.item_code+"' value='"+item.item_name+"'>"+item.item_name+"</option>";
            });
            $("#seldistrict").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    }); 
}

function saveAddress()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    var userId=Cookies.get('userinfo');
    var name=$("#user-name").val().trim();
    var mobile=$("#user-phone").val().trim();
    var province=$("#selprovince").val();
    var city=$("#selcity").val();
    var district=$("#seldistrict").val();
    var address=$("#txtAddress").val().trim();

    if(name==""){ 
        alert("请填写收货人！");  
        $("#user-name").focus();
        return false;
    } 
    if(!(/^1[34578]\d{9}$/.test(mobile))){ 
        alert("请填写正确的手机号码！");  
        $("#user-phone").focus();
        return false;
    } 
    if(province=="0"){ 
        alert("请选择省！");  
        $("#selprovince").focus();
        return false;
    } 
    if(city=="0"){ 
        alert("请选择市！");  
        $("#selcity").focus();
        return false;
    } 
    if(district=="0"){ 
        alert("请选择区！");  
        $("#seldistrict").focus();
        return false;
    } 
    if(address==""){ 
        alert("请填写详细地址！");  
        $("#txtAddress").focus();
        return false;
    } 
    var type=$("#txtEditType").val();
    if(type=="add")
    {
        axios.post(serverUrl+'AddAddress', {
            customerId:userId,
            name:name,
            mobile: mobile,
            province: province,
            city:city,
            district:district,
            address:address,
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                  alert("修改地址成功！");
                  getMyAddressList();
                  clearEdit();
                }
                else
                {
                  alert("修改地址失败！");
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    else if(tye=="update")
    {
        var addressId=$("#txtAddressId").val();
        axios.put(serverUrl+'UpdateAddress/'+addressId, {
            name:name,
            mobile: mobile,
            province: province,
            city:city,
            district:district,
            address:address,
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                  alert("新增地址成功！");
                  getMyAddressList();
                  clearEdit();
                }
                else
                {
                  alert("新增地址失败！");
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}

//绑定要编辑的地址
function bindUpdateData(own,aid)
{
    var parent=$(own).parent().parent();
    $("#user-name").val(parent.find(".name").html());
    $("#user-phone").val(parent.find(".mobile").html());
    $("#selprovince").val(parent.find(".province").html());
    changeCity($("#selprovince"));
    $("#selcity").val(parent.find(".city").html());
    changeDistrict($("#seldistrict"));
    $("#seldistrict").val(parent.find(".dist").html());
    $("#txtAddress").val(parent.find(".street").html());
    $("#txtEditType").val("update");
    $("#txtAddressId").val(aid);
    $("#editTitleCN").html("修改地址");
    $("#editTitleEN").html("Update&nbsp;address");
}

function delAddress(aid)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    axios.delete(serverUrl+'DeleteAddress/'+aid)
    .then(function (response) {
      if(!!response.data)
      {
          var returnData=response.data;
          if(returnData.success)
          {
              alert("删除地址成功！");
              getMyAddressList();
          }
          else if(returnData.code==10014)
          {
              alert("要删除的地址不存在！");
          }
          else
          {
              alert("删除地址失败！");
          }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function setDefault(own,aid)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    var userId=Cookies.get('userinfo');
    axios.put(serverUrl+'SetDefaultAddress/'+aid, {
        customerId:userId,
      })
      .then(function (response) {
        if(!!response.data)
        {
            var returnData=response.data;
            if(returnData.success)
            {
              alert("设置默认地址成功！");
              $(own).attr("onclick","").html("<i class='am-icon-check-circle'></i>默认地址");
              var parent=$(own).parents("li");
              parent.siblings("li").removeClass("defaultAddr");
            }
            else
            {
              alert("设置默认地址失败！");
            }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

function clearEdit()
{
    $("#user-name").val("");
    $("#user-phone").val("");
    $("#selprovince").val("0");
    $("#selcity").val("0");
    $("#seldistrict").val("0");
    $("#txtAddress").val("");
    $("#txtEditType").val("add");
    $("#txtAddressId").val("");
    $("#editTitleCN").html("新增地址");
    $("#editTitleEN").html("Add&nbsp;address");
}

$(document).ready(function(){
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    getMyAddressList();
    initPageCss();
    initProvince();
});