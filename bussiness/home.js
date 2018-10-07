

function showCategoryDetail(own)
{   
    $(own).parent('ul').children().removeClass("hover");
    $(own).addClass("hover");
    $(".menu-item").hide();
    $(own).children(".menu-item").show();
}

function hideCategoryDetail(own)
{
    $(own).removeClass("hover");
    $(".menu-item").hide();
}

//获取畅销书
function getTopSalesProduct()
{
    axios.get(serverUrl+'ProductByPage?queryType=1&currentPage=1&pageSize=7&sorter=salesCount_descend')
    .then(function (response) {
        if(!!response.data)
        {
            response.data.list.map(function(item,index){
                var tag=index+1;
                if(tag==1)
                {
                    $("#topSales"+tag).html("<a href=\"#\"><div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"+item.price.$numberDecimal+"</div></div><img src=\""+item.images[0]+"\"/></a>");
                }
                else
                {
                    var imgWidth='139px';
                    var imgHeight='139px';
                    if(tag<=3)
                    {
                        imgWidth='199px';
                        imgHeight='199px';
                    }
                    $("#topSales"+tag).html("<div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"
                    +item.price.$numberDecimal+"</div></div><a href=\"#\"><img width='"+imgWidth+"' height='"+imgHeight+"' src=\""+item.images[0]+"\"/></a>");
                }
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
    axios.get(serverUrl+'ProductByPage?queryType=1&currentPage=1&pageSize=9&sorter=collectCount_descend')
    .then(function (response) {
        if(!!response.data)
        {
            response.data.list.map(function(item,index){
                var tag=index+1;
                var imgWidth='209px';
                var imgHeight='209px';
                if(tag!==1||tag!==7||tag!==9)
                {
                    imgWidth='158px';
                    imgHeight='158px';
                }
                if(tag==1)
                {
                    $("#topCollection"+tag).html("<a href=\"#\"> <img width='"+imgWidth+"' height='"+imgHeight+"' src=\""
                    +item.images[0]+"\"/><div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"+item.price.$numberDecimal+"</div></div></a>");
                }
                else
                {
                   
                    $("#topCollection"+tag).html("<div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"
                    +item.price.$numberDecimal+"</div></div><a href=\"#\"><img width='"+imgWidth+"' height='"+imgHeight+"' src=\""+item.images[0]+"\"/></a>");	
                }
            });
        }      
    })
    .catch(function (error) {
        console.log(error);
    });   
}

//获取评论最多图书
function getTopCommentProduct()
{
    axios.get(serverUrl+'ProductByPage?queryType=1&currentPage=1&pageSize=12&sorter=commentCount_descend')
    .then(function (response) {
        if(!!response.data)
        {
            var contentHtml="";
            response.data.list.map(function(item,index){
                contentHtml+="<li><div class=\"list\"><a href=\"#\"><img src=\""
                +item.images[0]+"\"/><div class=\"pro-title\">"
                +item.name+"</div> <span class=\"e-price\">￥"
                +item.price.$numberDecimal+"</span></a></div></li>";
            });
            $("#ulTopCommnet").html(contentHtml);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });   
}

function getLoginInfo()
{
    var userId=Cookies.get('userinfo');
    if(!!userId)
    {
        $(".login-after").show();
        $(".login-before").hide();
        axios.get(serverUrl+'CurrentCustomer/'+userId)
        .then(function(response) {
            console.log(response);
            if(!!response.data&&response.data.success)
            {
                var userinfo=response.data;
             
                $("#span_nickname").html(!!userinfo.nickname?userinfo.nickname:"新用户");
                $("#li_username").html("用户名："+userinfo.username);
                $("#li_mobile").html("手机："+!!userinfo.mobile?userinfo.mobile:"");
                if(!!userinfo.headImg)
                {
                    $("#img_head").attr("src",userinfo.headImg);
                    $("#imgUserHead").attr("src",userinfo.headImg);
                } 
            }

        }).catch(function (error) {
            console.log(error);
        });
    }
    else
    {
        $(".login-after").hide();
        $(".login-before").show();
    }
}

//注销登录
function cancelLogin()
{
    Cookies.remove('userinfo');
    $(".login-before").show();
    $(".login-after").hide();
}

$(document).ready(function(){

    getTopSalesProduct();
    getTopCollectionProduct();
    getTopCommentProduct();
    getLoginInfo();
});
