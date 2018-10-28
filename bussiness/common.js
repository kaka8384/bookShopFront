var serverUrl="http://localhost:3001/API/";
var webUrl="http://localhost:8009";
// axios.defaults.withCredentials = true;

//获取querystring
function querystring(item){
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
    return svalue ? svalue[1] : svalue;
}

//判断是否登录
function isLogin()
{
    var userInfo=Cookies.get('userinfo');
    if(!!userInfo)
    {
        return true;
    }
    else
    {
        return false;
    }
}

//获取底部
function getfooter()
{
    $(".footer").html("<div class=\"footer-hd\"><p><a href='"+webUrl+"/home/default.html'>书城首页</a>"
    +"<b>|</b><a target='_blank' href='http://localhost:8000/#/'>后台管理</a>"
    +"<b>|</b><a target='_blank' href='https://github.com/kaka8384'>GitHub</a>"
    +"<b>|</b><a target='_blank' href='https://ant.design/index-cn'>Antd</a></p></div>");
}

function getsimplehead()
{
    $(".login-boxtitle").html("<a href=\"default.html\"><img alt=\"logo\" src=\"../images/logobig.png\" /></a>");
}

//头部
function gethead()
{
    $(".mainHead").html("<div class='am-container header'><ul class='message-l login-before'>"
    +"<div class='topMessage'><div class='menu-hd'>"
    +"<a href='login.html' target='_top' class='h'>亲，请登录</a>&nbsp;<a href='../home/register.html' target='_top'>免费注册</a>"
    +"</div></div></ul><ul class='message-r login-after'><div class='topMessage home'>"
    +"<div class='menu-hd'><a href='../home/default.html' target='_top' class='h'>商城首页</a></div></div>"
    +"<div class='topMessage my-shangcheng'><div class='menu-hd MyShangcheng'>"
    +"<a href='../person/information.html' target='_top'><i class='am-icon-user am-icon-fw'></i>个人中心</a></div>"
    +"</div><div class='topMessage mini-cart'><div class='menu-hd'>"
    +"<a id='mc-menu-hd' href='../home/shopcart.html' target='_top'>"
    +"<i class='am-icon-shopping-cart am-icon-fw'></i><span>购物车</span></a>"
    +"</div></div><div class='topMessage favorite'><div class='menu-hd'>"
    +"<a href='javascript:void(0);' onclick='cancelLogin();' target='_top'><span>退出登录</span></a>"
    +"</div></ul></div><div class='nav white'><div class='logo'><img src='../images/logo.png' /></div>"
    +"<div class='logoBig'><li><a href='../home/default.html'><img src='../images/logobig.png'/></a></li></div>"
    +"<div class='search-bar pr'><a  href='#'></a>"
    +"<form><input id='searchInput' type='text' placeholder='请输入关键字' autocomplete='off'>"
    +"<input id='ai-topsearch' class='submit am-btn' value='搜索' onclick='search();' index='1' type='button'>"
    +"</form></div></div><div class='clear'></div>");
    var name=querystring("key");
    if(!!name)
    {
        $("#searchInput").val(decodeURI(name));  //初始化搜索框
    }
}

//产品导航
function getproductnav()
{
    $(".product_nav").html("<a href='javascript:void(0);'><div class='long-title'><span class='all-goods'>全部分类</span></div></a>"+
    "<div class='nav-cont'><ul>"+
    "<li class='index'><a href='../home/default.html'>首页</a></li>"+
    "<li class='qc'><a href='../home/search.html'>所有商品</a></li>"+
    "<li class='qc last'><a href='../home/search.html?tag=new'>新书</a></li>"+
    "</ul>"+
    "<div class='nav-extra login-after' onclick='gotocollection();'>"+
    "<i class='am-icon-user-secret am-icon-md nav-user'></i><b></b>我的收藏"+
    "<i class='am-icon-angle-right' style='padding-left: 10px;'></i>"+
    "</div></div>");
}

function gotocollection()
{
    location.href="../person/collection.html";
}

//右边导航
function getrightnav()
{
    $(".tip").html("<div id='sidebar'><div id='wrap'>"+
    "<div id='prof' class='item login-after'>"+
    "<a href='#'><span class='setting'></span></a>"+
    "<div class='ibar_login_box status_login'>"+
    "<div class='avatar_box'>"+
    "<p class='avatar_imgbox'><img id='img_head' src='../images/no-img_mid_.jpg'/></p>"+
    "<ul class='user_info'>"+
    "<li id='li_username'></li>"+
    "<li id='li_mobile'></li>"+
    "</ul></div>"+
    "<div class='login_btnbox'>"+
    "<a href='../person/order.html' class='login_order'>我的订单</a>"+
    "<a href='../person/comment.html' class='login_favorite'>我的评论</a>"+
    "</div><i class='icon_arrow_white'></i></div></div>"+
    "<div id='shopCart' class='item login-after'>"+
    "<a href='../home/shopcart.html'><span class='message'></span></a>"+
    "<p>购物车</p></div>"+
    "<div id='brand' class='item login-after'>"+
    "<a href='../person/collection.html'>"+
    "<span class='wdsc'><img src='../images/wdsc.png'/></span>"+
    "</a>"+
    "<div class='mp_tooltip'>我的收藏"+
    "<i class='icon_arrow_right_black'></i>"+
    "</div></div>"+
    "<div class='quick_toggle'>"+
    "<li class='qtitem'>"+
    "<a href='#top' class='return_top'><span class='top'></span></a>"+
    "</li></div></div></div>");
}

function getPersonNav()
{

    $(".personNav").html("<ul><li class='person'>"+
    "<a href='javascript:void(0);'>个人中心</a>"+
    "<ul><li class='"+bindPersonNav('information.html')+"'><a href='information.html'>个人信息</a></li>"+
    "<li class='"+bindPersonNav('password.html')+"'><a href='password.html'>修改密码</a></li>"+
    "<li class='"+bindPersonNav('address.html')+"'><a href='address.html'>收货地址</a></li>"+
    "<li class='"+bindPersonNav('order.html')+"'><a href='order.html'>订单管理</a></li>"+
    "<li class='"+bindPersonNav('collection.html')+"'><a href='collection.html'>我的收藏</a></li>"+
    "<li class='"+bindPersonNav('comment.html')+"'><a href='comment.html'>我的评价</a></li>"+	
    "</ul></li></ul>");
}

function bindPersonNav(webName)
{
    if(location.pathname.indexOf(webName)!=-1)
    {
        return "active";
    }
    else
    {
        return "";
    }
}

function getAllCatgeory()
{
    axios.get(serverUrl+'AllCatgeory')
    .then(function (response) {
        if(!!response.data)
        {
            var catgeories=response.data.categories;
            var catgeoryCount=catgeories.length;  
            var catNameCount=1; //每个li显示的分类名称个数
            if(catgeoryCount>10) 
            {
                var mo = Math.floor(catgeoryCount/10);
                var  yu = catgeoryCount%10;
                catNameCount=mo;
                if(yu>0)
                {
                    catNameCount+=1;
                }
            }
            var htmlcontent="";
            var catgeoryTag=0; //分类循环下标
            for(var i=0;i<10&&catgeoryTag<catgeoryCount;i++)
            {
                var categoryName="";
                var categoryNameDetail="";
               
                for(var j=0;j<catNameCount&&catgeoryTag<catgeoryCount;j++)
                {
                    var namestr=catgeories[catgeoryTag].name;
                    if(j>0)
                    {
                        categoryName+='/';
                    }
                    categoryName+=namestr;
                    categoryNameDetail+="<dd><a title=\""+namestr+"\" href='search.html?cid="
                    +catgeories[catgeoryTag]._id+"'><span>"+namestr+"</span></a></dd>";
                    catgeoryTag++;
                }
  
                var liTag="";
                if(i==0)
                {
                    liTag="first";
                }
                if(i==9)
                {
                    liTag="last";
                }
                htmlcontent+="<li onmouseover='showCategoryDetail(this);' onmouseout='hideCategoryDetail(this);' class=\"appliance js_toggle relative"+liTag+"\">"
                +"<div class=\"category-info\">"
                +"<h3 class=\"category-name b-category-name\">"
                +"<i><img src=\"../images/cake.png\"></i>"
                +"<a class=\"ml-22\">"+categoryName+"</a>"
                +"</h3><em>&gt;</em></div>"
                +"<div class=\"menu-item menu-in top\"><div class=\"area-in\">"
                +"<div class=\"area-bg\"><div class=\"menu-srot\">"
                +"<div class=\"sort-side\"><dl class=\"dl-sort\">"
                +categoryNameDetail
                +"</dl></div></div></div></div></div>"
                +"<b class=\"arrow\"></b></li>";                   
            }
            $("#js_climit_li").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });   
}

//根据状态获取登录信息
function getLoginInfo()
{
    var userId=Cookies.get('userinfo');
    if(!!userId)
    {
        $(".login-after").show();
        $(".login-before").hide();
        axios.get(serverUrl+'CurrentCustomer/'+userId)
        .then(function(response) {
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
    Cookies.remove('useraccount');
    $(".login-before").show();
    $(".login-after").hide();
}

function search()
{
    var searchValue=$("#searchInput").val().trim();
    location.href="../home/search.html?key="+encodeURI(searchValue);
}

$(document).ready(function(){
    if(location.pathname=="/home/login.html"||location.pathname=="/home/register.html")
    {
        getsimplehead();
    }
    else if(location.pathname.indexOf("/person/")!=-1)
    {
        
        gethead();
        getproductnav();
        getPersonNav();
        getLoginInfo();
    }
    else
    {
        gethead();
        getrightnav();
        getproductnav();
        getAllCatgeory();
        getLoginInfo();
    }

    getfooter();
});