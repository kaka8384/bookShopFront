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

function addShopCart()
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

$(document).ready(function(){
    getProductDetail();
    getTopCollectionProduct();
 
							
});