function getShopcart()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        var userId=Cookies.get('userinfo');
        var url=serverUrl+'QueryShoppingCat/'+userId;
        axios.get(url)
        .then(function (response) {
            if(!!response.data)
            {
                var htmlcontent="";
                response.data.shoppingCat.products.map(function(item,index){
                    htmlcontent+="<ul class='item-content clearfix'>"+
                   "<li class='td td-chk'>"+
                   "<div class='cart-checkbox'>"+
                   "<input onclick='checkedProduct(this);' class='check' id='check_"+index+"'  value='"+item.productId+"' type='checkbox'>"+
                   "<label for='check_'"+index+"'></label>"+
                   "</div></li>"+
                   "<li class='td td-item'>"+
                   "<div class='item-pic'>"+
                   "<a href='javascript:void(0);' target='_blank' data-title='"+item.name+"' class='J_MakePoint' data-point='tbcart.8.12'>"+
                   "<img width='80px;' height='80px;' src='"+item.img+"' class='itempic J_ItemImg'></a>"+
                   "</div>"+
                   "<div class='item-info'>"+
                   "<div class='item-basic-info'>"+
                   "<a href='introduction.html?pid="+item.productId+"' target='_blank' title='"+
                   item.name+"' class='item-title J_MakePoint' data-point='tbcart.8.11'>"+item.name+"</a>"+
                   "</div></div></li>"+
                   "<li class='td td-info'>"+
                   "<div class='item-props'></div></li>"+
                   "<li class='td td-price'>"+
                   "<div class='item-price price-promo-promo'>"+
                   "<div class='price-content'>"+
                   "<div class='price-line'>"+
                   "<em class='J_Price price-now' id='em_price"+index+"' tabindex='0'>"+parseFloat(item.price.$numberDecimal).toFixed(2)+"</em>"+
                   "</div></div></div></li>"+
                   "<li class='td td-amount'>"+
                   "<div class='amount-wrapper'>"+
                   "<div class='item-amount'>"+
                   "<div class='sl'>"+
                   "<input class='min am-btn' onclick='reduceBuyCount(this,"+index+");' type='button' value='-' />"+
                   "<input class='text_box buyCount' onchange='calcAmount(this,"+index+");' type='text' value='"+item.buyCount+"' style='width:30px;' />"+
                   "<input class='add am-btn'  onclick='addBuyCount(this,"+index+");' type='button' value='+' />"+
                   "</div></div></div></li>"+
                   "<li class='td td-sum'>"+
                   "<div class='td-inner'>"+
                   "<em tabindex='0' class='J_ItemSum number' id='em_amount"+index+"'>"
                   +(parseFloat(item.price.$numberDecimal).toFixed(2)*item.buyCount).toFixed(2)+"</em>"+
                   "</div></li>"+
                   "<li class='td td-op'>"+
                   "<div class='td-inner'>"+
                   "<a href='javascript:void(0);' onclick='delShopcart(this,"+index+");' data-point-url='#' class='delete'>删除</a>"+
                   "</div></li></ul>";
                });
                $("#divShopCart").html(htmlcontent);
         
            }      
        })
        .catch(function (error) {
            console.log(error);
        });  
    }
}

function reduceBuyCount(own,index)
{
    var buycount=$(own).next().val().trim();
    if(buycount!="")
    {
        var buycountNum=parseInt(buycount);
        $(own).next().val(buycountNum>1?(buycountNum-1):1);
        calcAmount($(own).next(),index);
    }
}

function addBuyCount(own,index)
{
    var buycount=$(own).prev().val().trim();
    if(buycount!="")
    {
        var buycountNum=parseInt(buycount);
        $(own).prev().val(buycountNum<100?(buycountNum+1):100);
        calcAmount($(own).prev(),index);
    }
}

//计算金额（单价*购买数量）
function calcAmount(own,index)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        var buycount=$(own).val().trim();
        if(buycount!="")
        {
            var price=parseFloat($("#em_price"+index).html()).toFixed(2);
            var amount=(buycount*price).toFixed(2);
            $("#em_amount"+index).html(amount);
            var userId=Cookies.get('userinfo');
            var pid= $("#check_"+index).val();
            axios.post(serverUrl+'UpdateBuyCount', {
                customerId: userId,
                productId:pid,
                buyCount:parseInt(buycount)
              })
              .then(function (response) {
                if(!!response.data)
                {
                    var returnData=response.data;
               
                    if(returnData.code=="10005")
                    {
                        alert("您的购物车不存在！");
                    }
                    else if(returnData.code=="10006")
                    {
                        alert("您选择的商品不存在！");
                    }
                }
              })
              .catch(function (error) {
                console.log(error);
              });    
        }
    }
}

function delShopcart(own,index)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
   
        var userId=Cookies.get('userinfo');
        var pid= $("#check_"+index).val();
        axios.post(serverUrl+'DeleteShoppingCat', {
            customerId: userId,
            productId:pid,
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                    $(own).parents("ul").remove();
                }
                else if(returnData.code=="10005")
                {
                    alert("您的购物车不存在！");
                }
                else if(returnData.code=="10006")
                {
                    alert("您选择的商品不存在！");
                }
                else
                {
                    alert("删除购物车中的商品失败！");
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });   
    }
}

//全选
function checkedAll(own)
{
    var checkStatus=$(own).attr("checked");
    var allcheckbox=$("#divShopCart").find(".check");
    allcheckbox.attr("checked",checkStatus?true:false);
    checkedProduct(allcheckbox[0]);

}

//选择某产品
function checkedProduct(own)
{
    var checkedInput=$("#divShopCart").find(":checked");
    var allBuyCount=0;
    var allAmount=0.00;
    for(var i=0;i<checkedInput.length;i++)
    {
        var parent=$(checkedInput[i]).parents("ul");
        var amount=parent.find(".J_ItemSum").html();
        var buycount=parent.find(".buyCount").val();
        allAmount+=parseFloat(amount);
        allBuyCount+=parseInt(buycount);
    }
    $("#J_Total").html(allAmount.toFixed(2));
    $("#J_SelectedItemsCount").html(allBuyCount);
}

//结算
function settleAccount()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        var checkedInput=$("#divShopCart").find(":checked");
        if(checkedInput.length==0)
        {
            alert("您还未选择要结算的商品！");
            return;
        }
        var submitData=[];
        for(var i=0;i<checkedInput.length;i++)
        {
            var pid=$(checkedInput[i]).val();
            var parent=$(checkedInput[i]).parents("ul");
            submitData.push({
                productId:pid,
                name:parent.find(".item-title").html(),
                img:parent.find(".itempic").attr("src"),
                price:parent.find(".price-now").html(),
                buyCount:parent.find(".buyCount").val(),
                amount:parent.find(".number").html(),
            });
        }
        var data=JSON.stringify(submitData);
        Cookies.set('settleAccountData', data, { expires: 0.0104167}); //记录结算信息cookie,缓存15分钟
        location.href="pay.html";
    }
}

$(document).ready(function(){
    getShopcart();				
});