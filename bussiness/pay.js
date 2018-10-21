function getAddress()
{
    var userId=Cookies.get('userinfo');
    var url=serverUrl+'QueryAddress/'+userId;
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
            response.data.addressList.map(function(item,index){
                var liClass="";
                var defaulthtml="";
                if(item.isDefault)
                {
                    liClass="defaultAddr";
                    defaulthtml="<ins class='deftip'>默认地址</ins>";
                    bindAddress(item);
                }
                htmlcontent+="<div class='per-border'></div>"+
                "<li onclick='selAddress(this);' class='user-addresslist "+liClass+"'>"+
                "<div  class='address-left'>"+
                "<div class='user DefaultAddr'>"+
                "<span class='buy-address-detail'>"+ 
                "<span class='buy-user'>"+item.name+"</span>"+
                "<span class='buy-phone'>"+item.mobile+"</span>"+
                "</span></div>"+
                "<div class='default-address DefaultAddr'>"+
                "<span class='buy-line-title buy-line-title-type'>收货地址：</span>"+
                "<span class='buy--address-detail'>"+
                "<span class='province'>"+item.province+"</span>&nbsp;"+
                "<span class='city'>"+item.city+"</span>&nbsp;"+
                "<span class='dist'>"+item.district+"</span>&nbsp;"+
                "<span class='street'>"+item.address+"</span>"+
                "</span></span></div>"+defaulthtml+
                "</div><div class='address-right'>"+
                "<a href='../person/address.html'>"+
                "<span class='am-icon-angle-right am-icon-lg'></span></a>"+
                "</div><div class='clear'></div></li>";
            });
            $("#ulAddress").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });  
}

function selAddress(own)
{
    $(own).siblings("li").removeClass("defaultAddr");
    $(own).addClass("defaultAddr");
    $("#spanCity").html($(own).find(".city").html());
    $("#spanProvince").html($(own).find(".province").html());
    $("#spanDist").html($(own).find(".dist").html());
    $("#spanAddress").html($(own).find(".street").html());
    $("#spanShippingName").html($(own).find(".buy-user").html());
    $("#spanShippingMobile").html($(own).find(".buy-phone").html());
}

function bindAddress(item)
{
    $("#spanCity").html(item.city);
    $("#spanProvince").html(item.province);
    $("#spanDist").html(item.district);
    $("#spanAddress").html(item.address);
    $("#spanShippingName").html(item.name);
    $("#spanShippingMobile").html(item.mobile);
}

//绑定购买商品
function getBuyProducts(buyData)
{
    var buyDataModle=JSON.parse(buyData);
    var htmlcontent="";
    var allAmount=0.00;
    buyDataModle.map(function(item,index){
        htmlcontent+="<div class='item-list'>"+
        "<div class='bundle bundle-last'>"+
        "<div class='bundle-main'>"+
        "<ul class='item-content clearfix'>"+
        "<div class='pay-phone'>"+
        "<li class='td td-item'>"+
        "<div class='item-pic'>"+
        "<a href='javascript:void(0);' class='J_MakePoint'>"+
        "<img width='80px;' height='80px;' src='"+item.img+"' class='itempic J_ItemImg'></a>"+
        "</div>"+
        "<div class='item-info'>"+
        "<div class='item-basic-info'>"+
        "<a href='introduction.html?pid="+item.productId
        +"' class='item-title J_MakePoint' data-point='tbcart.8.11'>"+item.name+"</a>"+
        "</div></div></li>"+
        "<li class='td td-price'>"+
        "<div class='item-price price-promo-promo'>"+
        "<div class='price-content'>"+
        "<em class='J_Price price-now'>"+item.price+"</em>"+
        "</div></div></li>"+
        "</div>"+
        "<li class='td td-amount'>"+
        "<div class='amount-wrapper'>"+
        "<div class='item-amount'>"+
        "<span class='phone-title'>购买数量</span>"+
        "<div class='sl'>"+
        "<em tabindex='0' class='buycount'>"+item.buyCount+"</em>"+
        "</div></div></div></li>"+
        "<li class='td td-sum'><div class='td-inner'>"+
        "<em tabindex='0' class='J_ItemSum number'>"+item.amount+"</em>"+
        "</div></li></ul>"+
        "<div class='clear'></div>"+
        "</div>"+
        "</div>";
        allAmount+=parseFloat(item.amount);
    });
    $("#divProducts").html(htmlcontent);
    var freight=0.00; 
    if(allAmount<100)  //总金额小于100，运费10元。满100免运费
    {
        freight=10.00;
    }
    var actualFee=allAmount+freight;
    $("#txtFreight").val(freight);
    $("#allAmount").html(actualFee.toFixed(2));
    $("#J_ActualFee").html(actualFee.toFixed(2));
}

function selPayType(val)
{
    $("#txtPayType").val(val);
}

function submitOrder()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="login.html";
        return;
    }
    var buyData=Cookies.get('settleAccountData');
    if(buyData==null)
    {
        alert("没有需要结算的商品！");
        return;
    }
    var payType=$("#txtPayType").val();
    if(payType=="")
    {
        alert("请选择支付方式！");
        return;
    }
    if($("#ulAddress").find(".defaultAddr").length==0)
    {
        alert("请选择收货地址！");
        return;
    }
    var products=[];
    var productIds=[];
    var buyDataModle=JSON.parse(buyData);
    buyDataModle.map(function(item,index){
        products.push({
            productId:item.productId,
            name:item.name,
            img:item.img,
            price:item.price,
            buyCount:item.buyCount,
        });
        productIds.push(item.productId);
    });
    var userId=Cookies.get('userinfo');
    var username=Cookies.get('useraccount');
    axios.post(serverUrl+'CreateOrder', {
        customerId: userId,
        customerAccount:username,
        products:products,
        orderPrice:parseFloat($("#allAmount").html()),
        freight:parseFloat($("#txtFreight").val()),
        payType: payType,
        shippingAddress:{
            name: $("#spanShippingName").html(),
            province: $("#spanProvince").html(),
            city: $("#spanCity").html(),
            district:$("#spanDist").html(),
            address: $("#spanAddress").html(),
            mobile: $("#spanShippingMobile").html(),
        },
        memo:$("#txtMemo").val().trim()
      })
      .then(function (response) {
        if(!!response.data)
        {
            var returnData=response.data;
            if(returnData.success)
            {

                delForShopCart(userId,returnData.order._id);
   
            }  
            else
            {
                alert("提交订单失败！");
            }
        }
      })
      .catch(function (error) {
        console.log(error);
      });   
}

function delForShopCart(userId,oid)
{
    axios.post(serverUrl+'ClearShoppingCat', {
        customerId: userId,
      }).then(function (response) {
        if(!!response.data)
        {
            var returnData=response.data;
            if(returnData.success)
            {
              Cookies.remove('settleAccountData');
              location.href="success.html?oid="+oid;
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
    var buyData=Cookies.get('settleAccountData');
    if(!!buyData)
    {
        getAddress();
        getBuyProducts(buyData);
    }
    else
    {
        alert("没有需要结算的商品！");
        location.href="shopcart.html";
    }			
});