function getCollections(pagenum,isInitPage)
{
    var userId=Cookies.get('userinfo');
    var url=serverUrl+'Product_CollectByPage?currentPage='+pagenum+'&pageSize=10&customerId='+userId;
    // var status=$("#selOrderStatus").val();
    // if(status!=0)
    // {
    //     url+="&lastStatus="+status;
    // }
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
       
            response.data.list.map(function(item,index){  
                htmlcontent+="<div class='s-item-wrap'>"+
               "<div class='s-item'>"+
               "<div class='s-pic'>"+
               "<a href='../person/introduction.html?pid="+item.product.productId+"' class='s-pic-link'>"+
               "<img class='product_img' src='"+item.product.img+"' alt='"+item.product.name+"' title='"+item.product.name+"' class='s-pic-img s-guess-item-img'>"+
               "</a>"+
               "</div>"+
               "<div class='s-info'>"+
               "<div class='s-title'><a class='product_name' href='../person/introduction.html?pid="+item.product.productId+"' title='"+item.product.name+"'>"+item.product.name+"</a></div>"+
               "<div class='s-price-box'>"+
               "<span class='s-price'><em class='s-price-sign'>¥</em><em class='s-value product_price'>"+item.product.price.$numberDecimal+"</em></span>"+
               "</div>"+
               "</div>"+
               "<div class='s-tp'>"+
               "<span class='ui-btn-loading-before'>删除</span>"+
               "<i class='am-icon-shopping-cart'></i>"+
               "<span onclick='addShopCart(this,\""+item.product.productId+"\");' class='ui-btn-loading-before buy'>加入购物车</span>"+
               "<p>"+
               "<a href='javascript:deleteCollection(\""+item._id+"\");' class='c-nodo J_delFav_btn'>取消收藏</a>"+
               "</p>"+
               "</div>"+
               "</div>"+
               "</div>";
            });
            $("#collectList").html(htmlcontent);
            var listCount=response.data.list.length;
            if(listCount<=0)
            {
                $('#pagination1').hide();
            }
            else if(isInitPage&&listCount>0)
            {
                var total=response.data.pagination.total;
                var current=response.data.pagination.current;
                initPagination(total,current);
                $('#pagination1').show();
            }
      
        }      
    })
    .catch(function (error) {
        console.log(error);
    });  
}

function initPagination(total,current)
{
    var visiblePages=Math.floor(total/1)+1;
    $('#pagination1').jqPaginator({
        totalCounts: total,
        pageSize:10,
        visiblePages:visiblePages,
        currentPage: current,
        first:'<li class="first"><a href="javascript:;">首页</a></li>',
        last:'<li class="last"><a href="javascript:;">末页</a></li>',
        prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            getCollections(num,false);
            $("#hidPageNum").val(num);
        }
    });
}

//商品加入购物车
function addShopCart(own,pid)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        var userId=Cookies.get('userinfo');
        var parent=$(own).parent().parent()
        // var pid=querystring("pid");
        axios.post(serverUrl+'AddShoppingCat', {
            customerId: userId,
            products: {
                productId:pid,
                name:parent.find(".product_name").html(),
                img:parent.find(".product_img").attr("src"),
                price:parent.find(".product_price").html(),
                buyCount:1
            }
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                    alert("商品已添加到购物车！");
                }
                else
                {
                    alert("将商品添加到购物车中失败！");
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}

//取消收藏
function deleteCollection(collectionId)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        axios.delete(serverUrl+'DeleteProductCollect/'+collectionId)
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                    alert("商品已从收藏中删除！");
                    //刷新页面列表
                    var num=parseInt($("#hidPageNum").val());
                    getCollections(num,true);
                    
                }
                else if(returnData.code==10012)
                {
                    alert("收藏中不存在要删除的商品！");
                }
                else
                {
                    alert("取消收藏失败！");
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
    getCollections(1,true);	
    $("#hidPageNum").val(1);
});