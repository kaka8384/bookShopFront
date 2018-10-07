var serverUrl="http://localhost:3001/API/";
var webUrl="http://localhost:8009";
// axios.defaults.withCredentials = true;
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

function getfooter()
{
    $(".footer").html("<div class=\"footer-hd\"><p><a href='"+webUrl+"/home/default.html'>书城首页</a>"
    +"<b>|</b><a href=''>后台管理</a>"
    +"<b>|</b><a href=''>GitHub</a>"
    +"<b>|</b><a href=''''>Antd</a></p></div>");
}

function getsimplehead()
{
    $(".login-boxtitle").html("<a href=\"default.html\"><img alt=\"logo\" src=\"../images/logobig.png\" /></a>");
}

function gethead()
{
    $(".mainHead").html("<div class='am-container header'><ul class='message-l login-before'>"
    +"<div class='topMessage'><div class='menu-hd'>"
    +"<a href='login.html' target='_top' class='h'>亲，请登录</a>&nbsp;<a href='register.html' target='_top'>免费注册</a>"
    +"</div></div></ul><ul class='message-r login-after'><div class='topMessage home'>"
    +"<div class='menu-hd'><a href='default.html' target='_top' class='h'>商城首页</a></div></div>"
    +"<div class='topMessage my-shangcheng'><div class='menu-hd MyShangcheng'>"
    +"<a href='#' target='_top'><i class='am-icon-user am-icon-fw'></i>个人中心</a></div>"
    +"</div><div class='topMessage mini-cart'><div class='menu-hd'>"
    +"<a id='mc-menu-hd' href='#' target='_top'>"
    +"<i class='am-icon-shopping-cart am-icon-fw'></i><span>购物车</span><strong id='J_MiniCartNum' class='h'>0</strong></a>"
    +"</div></div><div class='topMessage favorite'><div class='menu-hd'>"
    +"<a href='#' target='_top'><i class='am-icon-heart am-icon-fw'></i><span>收藏夹</span></a>"
    +"</div></ul></div><div class='nav white'><div class='logo'><img src='../images/logo.png' /></div>"
    +"<div class='logoBig'><li><a href='default.html'><img src='../images/logobig.png'/></a></li></div>"
    +"<div class='search-bar pr'><a name='index_none_header_sysc' href='#'></a>"
    +"<form><input id='searchInput' name='index_none_header_sysc' type='text' placeholder='请输入关键字' autocomplete='off'>"
    +"<input id='ai-topsearch' class='submit am-btn' value='搜索' index='1' type='submit'>"
    +"</form></div></div><div class='clear'></div>");
}

function getproductnav()
{
    $(".product_nav").html("<a href='category.html'><div class='long-title'><span class='all-goods'>全部分类</span></div></a>"+
    "<div class='nav-cont'><ul>"+
    "<li class='index'><a href='default.html'>首页</a></li>"+
    "<li class='qc'><a href='search.html'>所有商品</a></li>"+
    "<li class='qc last'><a href='search.html'>新书</a></li>"+
    "</ul>"+
    "<div class='nav-extra login-after'>"+
    "<i class='am-icon-user-secret am-icon-md nav-user'></i><b></b>我的收藏"+
    "<i class='am-icon-angle-right' style='padding-left: 10px;'></i>"+
    "</div></div>");
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
                    categoryNameDetail+="<dd><a title=\""+namestr+"\" href=\"#\"><span>"+namestr+"</span></a></dd>";
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




$(document).ready(function(){
    if(location.pathname=="/home/login.html"||location.pathname=="/home/register.html")
    {
        getsimplehead();
    }
    else
    {
        gethead();
        getproductnav();
        getAllCatgeory();
    }

    getfooter();
});