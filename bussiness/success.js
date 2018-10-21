function initPage()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="lofin.html";
    }
    var oid=querystring("oid");
    var url=serverUrl+'OrderQuery/'+oid;
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var order=response.data.order[0];
            $("#orderAmount").html("¥"+order.orderPrice.$numberDecimal);
            $("#ordershippingName").html("收货人："+order.shippingAddress.name);
            $("#ordershippingMoblie").html("联系电话："+order.shippingAddress.mobile);
            $("#ordershippingAddress").html("收货地址："+order.shippingAddress.province+" "
            +order.shippingAddress.city+" "
            +order.shippingAddress.district+" "
            +order.shippingAddress.address);
            $("#hrefOrderDetail").attr("href","../person/orderinfo.html?oid="+order._id)
        }      
    })
    .catch(function (error) {
        console.log(error);
    });  
}

$(document).ready(function(){
    initPage();
});