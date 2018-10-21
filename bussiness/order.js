function getOrders(pagenum,isInitPage)
{
    var userId=Cookies.get('userinfo');
    var url=serverUrl+'OrdersByPage?queryType=1&currentPage='
    +pagenum+'&pageSize=10&customerId='+userId+'&isDelete=false';
    var status=$("#selOrderStatus").val();
    if(status!=0)
    {
        url+="&lastStatus="+status;
    }
    var createdate_s=$("#start").val().trim();
    var createdate_e=$("#end").val().trim();
    if(!!createdate_s)
    {
        url+="&createdate_s="+createdate_s;
    }
    if(!!createdate_e)
    {
        url+="&createdate_e="+createdate_e;
    }
    // console.log(url);
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
       
            response.data.list.map(function(item,index){
                var htmlProducts="";
                item.products.map(function(product,i){
                   htmlProducts+="<ul class='item-list'>"+
                   "<li class='td td-item'>"+
                   "<div class='item-pic'>"+
                   "<a href='../home/introduction.html?pid="+product.productId+"' class='J_MakePoint'>"+
                   "<img width='80px;' height='80px;' src='"+product.img+"' class='itempic J_ItemImg'>"+
                   "</a>"+
                   "</div>"+
                   "<div class='item-info'>"+
                   "<div class='item-basic-info'>"+
                   "<a href='../home/introduction.html?pid="+product.productId+"'>"+
                   "<p>"+product.name+"</p>"+
                   "</a>"+
                   "</div>"+
                   "</div>"+
                   "</li>"+
                   "<li class='td td-price'>"+
                   "<div class='item-price'>"+product.price.$numberDecimal+"</div>"+
                   "</li>"+
                   "<li class='td td-number'>"+
                   "<div class='item-number'>"+
                   "<span>×</span>"+product.buyCount+
                   "</div>"+
                   "</li>"+
                   "<li class='td td-operation'>"+
                   "<div class='item-operation'><a href='addcomment.html?oid="+item._id+"&pid="+product.productId+"'>评价</a></div>"+
                   "</li>"+
                   "</ul>";
                });
                htmlcontent+="<div class='order-status5'>"+
               "<div class='order-title'>"+
               "<div class='dd-num'>订单编号：<a href='orderinfo.html?oid="+item._id+"'>"
               +item.orderNumber+"</a></div>"+
               "<span>成交时间："+item.createdateStr+"</span>"+
               "</div>"+
               "<div class='order-content'>"+
               "<div class='order-left'>"+htmlProducts+
               "</div>"+
               "<div class='order-right'>"+
      
               "<li class='td td-amount'>"+
               "<div class='item-amount'>合计："+parseFloat(item.orderPrice.$numberDecimal).toFixed(2)+
               "<p>含运费：<span>"+parseFloat(item.freight.$numberDecimal).toFixed(2)+"</span></p>"+
               "</div>"+
               "</li>"+
               "<div class='move-right'>"+
               "<li class='td td-status'>"+
               "<div class='item-status'>"+
               "<p class='Mystatus'>"+getOrderStatus(item.lastStatus)+"</p>"+
               "<p class='Mytype'>"+(item.payType==1?"在线支付":"货到付款")+"</p>"+
               "<p class='order-info'><a href='orderinfo.html?oid="+item._id+"'>订单详情</a></p>"+

               "</div>"+
               "</li>"+
               "<li class='td td-change'>"+getOrderOperation(item.lastStatus,item._id)+
               "</li>"+
               "</div>"+
               "</div>"+
               "</div>"+
               "</div>";
            });
            $("#orderList").html(htmlcontent);
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
            getOrders(num,false);
        }
    });
}

function Search()
{
    var createdate_s=$("#start").val().trim();
    var createdate_e=$("#end").val().trim();
    if(createdate_s!=""&&createdate_e=="")
    {
        alert("请选择结束时间！");
        $("#end").focus();
    }
    else if(createdate_e!=""&&createdate_s=="")
    {
        alert("请选择开始时间！");
        $("#start").focus();
    }
    else
    {
        getOrders(1,true);
    }
  
}

function getOrderOperation(num,oid)
{
    var retrunstr="";
    switch(num)
    {
        case 3:
        retrunstr="<div onclick='completeOrder(this,\""+oid+"\");' class='am-btn am-btn-danger anniu'>确认收货</div>";
        break;
        // case 4:
        // retrunstr="<div class='am-btn am-btn-danger anniu'>删除订单</div>";
        // break;
    }
    return retrunstr;
}

function getOrderStatus(num)
{
    var retrunstr="";
    switch(num)
    {
        case -1:
        retrunstr="订单已删除";
        case 1:
        retrunstr="订单已提交";
        break;
        case 2:
        retrunstr="订单已确认";
        break;
        case 3:
        retrunstr="订单已发货";
        break;
        case 4:
        retrunstr="订单已完成";
        break;
    }
    return retrunstr;
}

//确认收货
function completeOrder(own,oid)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    var url=serverUrl+'UpdateOrder/'+oid;
    axios.put(url, {
        isFront: true,
        status: 4
      })
      .then(function (response) {
        if(!!response.data)
        {
            var returnData=response.data;
            if(returnData.success)
            {
                $(own).parent().prev().find(".Mystatus").html("订单已完成");
                $(own).remove();  
                alert("确认收货成功！");
            }
            else
            {
                alert("确认收货失败！");
            }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

function initDatePicker()
{
    $("#start").datetimepicker({
        format:'yyyy-mm-dd',  //格式  如果只有yyyy-mm-dd那就是0000-00-00
        autoclose:true,//选择后是否自动关闭 
        minView:2,//最精准的时间选择为日期  0-分 1-时 2-日 3-月
        language:  'zh-CN', //中文
        weekStart: 1, //一周从星期几开始
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
       // daysOfWeekDisabled:"1,2,3", //一周的周几不能选 格式为"1,2,3"  数组格式也行
        todayBtn : true,  //在底部是否显示今天
        todayHighlight :false, //今天是否高亮显示
        keyboardNavigation:true, //方向图标改变日期  必须要有img文件夹 里面存放图标
        showMeridian:false,  //是否出现 上下午
        initialDate:new Date()
        //startDate: "2017-01-01" //日期开始时间 也可以是new Date()只能选择以后的时间
    }).on("changeDate",function(){
        var start = $("#start").val();
        $("#end").datetimepicker("setStartDate",start);
    }); 
    $("#end").datetimepicker({
        format:'yyyy-mm-dd',  //格式  如果只有yyyy-mm-dd那就是0000-00-00
        autoclose:true,//选择后是否自动关闭 
        minView:2,//最精准的时间选择为日期  0-分 1-时 2-日 3-月
        language:  'zh-CN', //中文
        weekStart: 1, //一周从星期几开始
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        //daysOfWeekDisabled:"1,2,3", //一周的周几不能选
        todayBtn : true,  //在底部是否显示今天
        todayHighlight :false, //今天是否高亮显示
        keyboardNavigation:true, //方向图标改变日期  必须要有img文件夹 里面存放图标
        showMeridian:false  //是否出现 上下午
       // startDate: "2017-01-01"  //开始时间  ENdDate 结束时间
    }).on("changeDate",function(){
        var end = $("#end").val();
        $("#start").datetimepicker("setEndDate",end);
    });   
}

$(document).ready(function(){
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    initDatePicker();
    getOrders(1,true);	
});