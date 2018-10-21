function getOrderInfo()
{
    var oid=querystring("oid");
    var pid=querystring("pid");
    if(!!oid&&!!pid)
    {
        var url=serverUrl+'OrderQuery/'+oid;
        axios.get(url)
        .then(function(response) {
            if(!!response.data&&response.data.success)
            {
                var order=response.data.order[0];  
              
                $("#orderNumber").val(order.orderNumber);
                var product=order.products.filter(function(item){
                    return item.productId==pid;
                });
                if(!!product)
                {
                    $("#imgProduct").attr("src",product[0].img);
                    $("#imgProduct").parent("href","../home/introduction.html?pid="+pid);
                    $("#productName").html(product[0].name);
                    $("#productName").parent("href","../home/introduction.html?pid="+pid);
                    $("#productPrice").html(parseFloat(product[0].price.$numberDecimal).toFixed(2)
                    +"元");
                }
            }

        }).catch(function (error) {
            console.log(error);
        });
    }
    else
    {
        alert("请求参数错误！");
    }
}

function getUserInfo()
{
    var userId=Cookies.get('userinfo');
    if(!!userId)
    {
        axios.get(serverUrl+'CurrentCustomer/'+userId)
        .then(function(response) {
            if(!!response.data&&response.data.success)
            {
                var userinfo=response.data;             
                $("#userNickName").val(!!userinfo.nickname?userinfo.nickname:"新用户");
                if(!!userinfo.headImg)
                {
                    $("#userHead").val(userinfo.headImg);
                } 
            }

        }).catch(function (error) {
            console.log(error);
        });
    }
}

function addComment()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    var userId=Cookies.get('userinfo');
    var commentContent=$("#txtcommentCotent").val().trim();
    if(commentContent=="")
    {
        alert("请填写评价内容！");
        $("#txtcommentCotent").focus();
        return;
    }
    else if(commentContent.length>200)
    {
        alert("评价内容不能超过200字！");
        $("#txtcommentCotent").focus();
        return;
    }
    var oid=querystring("oid");
    var pid=querystring("pid");
    var url=serverUrl+'AddProductComment';
    axios.post(url, {
        productId: pid,
        productName: $("#productName").html(),
        customerId:userId,
        customerName:$("#userNickName").val(),
        customerHeadImg:$("#userHead").val(),
        orderId:oid,
        orderNumber: $("#orderNumber").val(),
        commentCotent:commentContent,
        commentStar:$("#selcommentStar").val()
      })
      .then(function (response) {
        if(!!response.data)
        {
            var returnData=response.data;
            if(returnData.success)
            {
                alert("发表评论货成功！");
                location.href="order.html";
            }
            else
            {
                alert("发表评论失败！");
            }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

$(document).ready(function(){
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    getUserInfo();
    getOrderInfo();	
});