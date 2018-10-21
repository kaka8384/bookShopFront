function getOrderInfo()
{
    var oid=querystring("oid");
    // var pid=querystring("pid");
    if(!!oid)
    {
        var url=serverUrl+'OrderQuery/'+oid;
        axios.get(url)
        .then(function(response) {
            if(!!response.data&&response.data.success)
            {
                var order=response.data.order[0];  
              
                $("#spanShippingName").html(order.shippingAddress.name);
                $("#spanShippingMoblie").html(order.shippingAddress.mobile);
                $("#spanShippingProvince").html(order.shippingAddress.province);
                $("#spanShippingCity").html(order.shippingAddress.city);
                $("#spanShippingDistrict").html(order.shippingAddress.district);
                $("#spanShippingAddress").html(order.shippingAddress.address);
                order.orderStatus.map(function(item,index){
                    switch(item.status)
                    {
                        case 1:
                        $("#status1").addClass("step-2");
                        break;
                        case 2:
                        $("#status2").addClass("step-2");
                        break;
                        case 3:
                        $("#status3").addClass("step-2");
                        break;
                        case 4:
                        $("#status4").addClass("step-2");
                        break;
                    }
                });
                var statusstr="";
                switch(order.lastStatus)
                {
                    case 1:
                    statusstr="订单已提交，等待商城确认。";
                    break;
                    case 2:
                    statusstr="订单已确认，正在准备商品。";
                    break;
                    case 3:
                    statusstr="订单已发货，请等待查收。";
                    break;
                    case 4:
                    statusstr="订单已完成，感谢您的购买。";
                    break;
                }
                $("#pOrderStatusStr").html(statusstr);
                $("#pOrderupdated").html(moment(order.updated).format("YYYY-MM-DD HH:mm:ss"));
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

$(document).ready(function(){
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    getOrderInfo();	
});