function getProductDetail()
{
    var pid=querystring("pid");
    axios.get(serverUrl+'ProductQuery?queryType=1&pid='+pid)
    .then(function (response) {
        if(!!response.data)
        {
            var product=response.data.item[0];
            var imageHtml="";
            var moblie_imageHtml="";         
            product.images.map(function(item,index){
                var moblie_imgTitle="";
                var imgClass="";
                if(index==0)
                {
                    imgClass="tb-selected";
                    moblie_imgTitle="pic";
                    $("#product_img_first").attr("src",item).attr("rel",item);
                    $("#product_img_first").parent().attr("href",item);
                    $("#hidimg").val(item);
                }
                else
                {
                    imgClass="";
                    moblie_imgTitle="";
                }
                imageHtml+="<li class='"+imgClass+"'>"+
                "<div class='tb-pic tb-s40'><a onclick='selectImg(this);'>"+
                "<img src='"+item+"' mid='"+item+"' big='"+item+"'>"+
                "</a></div></li>";
                moblie_imageHtml+="<li><img src='"+item+"' title='"+moblie_imgTitle+"'/></li>";
            });  //绑定页面中商品图片
            $("#thumblist").html(imageHtml);
            $("#ul_productImgs_mobile").html(moblie_imageHtml);
            //商品名
            $("#product_name").html(product.name);
            $("#product_href_name").html(product.name);
            //价格
            $("#product_price").html(product.price.$numberDecimal);
            $("#product_salescount").html(product.salesCount);
            $("#product_commentcount").html(product.commentCount);
            $("#product_collectioncount").html(product.collectCount);
            //库存
            $("#product_inventory").html(product.inventory);
            $("#product_isactive").html(product.inventory>0?"有货":"无货");
            if(product.inventory<=0)
            {
                $("#LikBuy").hide();
                $("#LikBasket").hide();
            }
            $("#li_product_author").html("作者:&nbsp;"+product.bookAttribute.author);
            $("#li_product_publisher").html("出版社:&nbsp;"+product.bookAttribute.publisher);
            $("#li_product_publicationTime").html("出版时间:&nbsp;"+product.bookAttribute.publicationTime.substr(0,10));
            $("#li_product_ISBN").html("ISBN:&nbsp;"+product.bookAttribute.ISBN);
            $("#product_descption").html(product.descption);
            //绑定分类名
            var cid=product.categoryId;
            axios.get(serverUrl+'CategoryQuery?cid='+cid)
            .then(function (response) {
                if(!!response.data)
                {
                    var category=response.data.item[0];
                    $("#product_category").html(category.name);
                    $("#product_category").attr("href","search.html?cid="+cid);
                }
            }).catch(function (error) {
                console.log(error);
            });   
        }      
    })
    .catch(function (error) {
        console.log(error);
    });   
}

//获取最受欢迎图书
function getTopCollectionProduct()
{
    axios.get(serverUrl+'ProductByPage?queryType=1&currentPage=1&pageSize=5&sorter=collectCount_descend')
    .then(function (response) {
        if(!!response.data)
        {
            var contenthtml="";
    
            response.data.list.map(function(item,index){
                var liclass="";
                if(index==0)
                {
                    liclass='first';
                }
                contenthtml+="<li class='"+liclass+"'>"+
                "<div class='p-img'>"+                    
                "<a href='introduction.html?pid="+item._id+"'>"
                +"<img height='194px' width='194px' src='"+item.images[0]+"'></a></div>"+              
                "<div class='p-name'><a href='"+item.images[0]+"'>"+item.name+"</a>"+
                "</div>"+
                "<div class='p-price'><strong>￥"+item.price.$numberDecimal+"</strong></div></li>";

            });
            $("#divTopCollection").html(contenthtml);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });   
}

//选择图书图片和绑定大图
function selectImg(own)
{
    $(own).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
    $(".jqzoom").attr('src', $(own).find("img").attr("mid"));
    $(".jqzoom").attr('rel', $(own).find("img").attr("big"));
}

function addShopCart(isBuy)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        var userId=Cookies.get('userinfo');
        var pid=querystring("pid");
        axios.post(serverUrl+'AddShoppingCat', {
            customerId: userId,
            products: {
                productId:pid,
                name:$("#product_name").html(),
                img:$("#hidimg").val(),
                price:$("#product_price").html(),
                buyCount:$("#text_box").val().trim()
            }
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                    if(isBuy)
                    {
                        location.href='shopcart.html';
                    }
                    else
                    {
                        alert("商品已添加到购物车！");
                    }
                }
                else
                {
                    if(isBuy)
                    {
                        alert("购买商品失败！");
                    }
                    else
                    {
                        alert("将商品添加到购物车中失败！");
                    }
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}

function buy()
{
    addShopCart(true);
}

//收藏
function collect()
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
    }
    else
    {
        var userId=Cookies.get('userinfo');
        var pid=querystring("pid");
        axios.post(serverUrl+'AddProductCollect', {
            customerId: userId,
            product: {
                productId:pid,
                name:$("#product_name").html(),
                img:$("#hidimg").val(),
                price:$("#product_price").html(),
            }
          })
          .then(function (response) {
            if(!!response.data)
            {
                var returnData=response.data;
                if(returnData.success)
                {
                    alert("商品已收藏！");
                }
                else if(returnData.code=="10011")
                {
                    alert("商品已收藏！");
                }
                else
                {
                    alert("商品收藏失败！");
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}


//绑定评论列表
function getCommentList(pagenum,isInitPage)
{
    var pid=querystring("pid");
    var url=serverUrl+'Product_CommentByPage?queryType=1&currentPage='
    +pagenum+'&pageSize=10&productId='+pid;
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
            response.data.list.map(function(item,index){
                var avatar=!!item.customerHeadImg?item.customerHeadImg:'../images/hwbn40x40.jpg';
                htmlcontent+="<li class='am-comment'><a href='javascript:void(0);'>"+
                "<img class='am-comment-avatar' src='"+avatar+"'/>"+
                "</a>"+
                "<div class='am-comment-main'>"+
                "<header class='am-comment-hd'>"+
                "<div class='am-comment-meta'>"+
                "<a href='#link-to-user' class='am-comment-author'>"+item.customerName+"</a>"+
                "评论于<time datetime=''>"+moment(item.updated).format("YYYY年MM月DD日 HH:mm")+"</time>"+
                "</div></header>"+
                "<div class='am-comment-bd'>"+
                "<div class='tb-rev-item ' data-id=''>"+
                "<div class='J_TbcRate_ReviewContent tb-tbcr-content '>"+item.commentCotent+
                "</div><div class=’tb-r-act-bar'>评分："+item.commentStar+"星</div></div></div></div></li>"; 
            });
            $("#ulCommnetList").html(htmlcontent);
            var listCount=response.data.list.length;
            if(listCount<=0)
            {
                $('#pagination1').hide();
            }
            else if(isInitPage&&listCount>0)
            {
                var total=response.data.pagination.total;
                var current=response.data.pagination.current;
                $("#spancount").html("("+total+")");
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
            getCommentList(num,false);
        }
    });
}

$(document).ready(function(){
    getProductDetail();
    getTopCollectionProduct();	
    getCommentList(1,true);						
});