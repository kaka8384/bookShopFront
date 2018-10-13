function getProductList(pagenum,isInitPage)
{
    var url=serverUrl+'ProductByPage?queryType=1&currentPage='+pagenum+'&pageSize=12';
    if($("#selectCat").val()!="")
    {
        url+="&categoryId="+$("#selectCat").val();
    }
    var name=querystring("key");
    if(!!name)
    {
        url+="&name="+decodeURI(name);
        $("#spankey").html(decodeURI(name));
    }
    var tag=querystring("tag");
    if(!!tag)
    {
        switch(tag)
        {
            case 'new': //查询最近1个月出版的新书
            var endtime=moment().format("YYYY-MM-DD");
            var starttime=moment().subtract(1, 'month').format("YYYY-MM-DD");
            url+="&publicationTime_S="+starttime+"&publicationTime_E="+endtime;
            break;
        }
    }
    var sorter=$("#hidSortCondition").val();
    if(!!sorter)
    {
        url+="&sorter="+sorter;
    }
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
            response.data.list.map(function(item,index){
                htmlcontent+="<li><div class='i-pic limit'><a href='introduction.html?pid="+
                item._id+"'><img width='218px' height='218px' src='"+item.images[0]+"'/>"+											
                "<p class='title fl'>"+item.name+"</p>"+
                "<p class='price fl'><b>¥</b><strong>"+item.price.$numberDecimal+"</strong>"+
                "</p><p class='number fl'>销量<span>"+item.salesCount+"</span></p>"+
                "</div></a></li>";
            });
            $("#ulProduct").html(htmlcontent);
            if(isInitPage&&response.data.list.length>0)
            {
                var total=response.data.pagination.total;
                var current=response.data.pagination.current;
                $("#spancount").html(total);
                initPagination(total,current);
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
        pageSize:12,
        visiblePages:visiblePages,
        currentPage: current,
        first:'<li class="first"><a href="javascript:;">首页</a></li>',
        last:'<li class="last"><a href="javascript:;">末页</a></li>',
        prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            getProductList(num,false);
        }
    });
}

//热卖产品
function getTopSalesProduct()
{
    axios.get(serverUrl+'ProductByPage?queryType=1&currentPage=1&pageSize=3&sorter=salesCount_descend')
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
            response.data.list.map(function(item,index){
                htmlcontent+="<li><div class='i-pic check'>"+
                "<img src='"+item.images[0]+"' width='218px' height='218px'/>"+
                "<p class='check-title'>"+item.name+"</p>"+
                "<p class='price fl'>"+
                "<b>¥</b><strong>"+item.price.$numberDecimal+"</strong></p>"+
                "<p class='number fl'>销量<span>"+item.salesCount+"</span>"+
                "</p></div></li>";
            });
            $("#hotSales").html(htmlcontent);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });   
}

//加载所有分类
function getCategories()
{
    axios.get(serverUrl+'AllCatgeory')
    .then(function (response) {
        if(!!response.data)
        {
            var cid=querystring("cid");
            var selectallClass=!!cid?"":"selected";
            var catgeories=response.data.categories;
            var html="<dd onclick='selectCat(this);' cid='' class=\"select-all "+selectallClass+"\"><a href=\"javascript:void(0);\">全部</a></dd>"
            catgeories.map(function(item,index){
                var selectClass=cid===item._id?"selected":"";
                html+="<dd onclick='selectCat(this);' cid='"+item._id+"' class='"+selectClass+"'><a href=\"javascript:void(0);\">"+item.name+"</a></dd>";
            });
            $("#divCategoies").html(html);         
        }
    })
    .catch(function (error) {
        console.log(error);
    });   
}

//选择页面中的分类
function selectCat(own)
{
    $(own).siblings().removeClass("selected");
    $(own).addClass("selected");
    $("#selectCat").val($(own).attr("cid"));
    getProductList(1,true);
}

//更改排序条件
function productsSort(own)
{
    $(own).siblings().removeClass("first");
    $(own).addClass("first");
    var sortKey=$(own).children("a").attr("key");
    if($(own).children("span").attr("class")=="glyphicon glyphicon-arrow-down")
    {
        $(own).children("span").removeClass("glyphicon-arrow-down");
        $(own).children("span").addClass("glyphicon-arrow-up");
        sortKey+="_ascend";
    }
    else if($(own).children("span").attr("class")=="glyphicon glyphicon-arrow-up")
    {
        $(own).children("span").removeClass("glyphicon-arrow-up");
        $(own).children("span").addClass("glyphicon-arrow-down");
        sortKey+="_descend";
    }
    console.log(sortKey);
    $("#hidSortCondition").val(sortKey);
    getProductList(1,true);
}

function initPage()
{
    //设置页面显示的分类
    var cid=querystring("cid");
    if(!!cid)
    {
        $("#selectCat").val(cid);
    }
}

$(document).ready(function(){
    initPage();
    getCategories();
    getProductList(1,true);
    getTopSalesProduct();
});