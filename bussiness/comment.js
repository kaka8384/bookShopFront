function getcomment(pagenum,isInitPage)
{
    var userId=Cookies.get('userinfo');
    var url=serverUrl+'Product_CommentByPage?currentPage='+pagenum+'&pageSize=10&customerId='+userId;
    axios.get(url)
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
       
            response.data.list.map(function(item,index){  
                htmlcontent+="<li class='td td-item'>"+
               "<div class='item-pic'>"+
               "<a href='javascript:void(0);' class='J_MakePoint'>"+
               "<img src='../images/kouhong.jpg_80x80.jpg' class='itempic'>"+
               "</a>"+
               "</div>"+
               "</li>"+
               "<li class='td td-comment'>"+
               "<div class='item-title'>"+
               "<div class='item-opinion'>"+item.commentStar+"星</div>"+
               "<div class='item-name'>"+
               "<a href='introduction.html?pid="+item.productId+"'>"+
               "<p class='item-basic-info'>"+item.productName+"</p>"+
               "</a>"+
               "</div>"+
               "</div>"+
               "<div class='item-comment'>"+item.commentCotent+"</div>"+
               "<div class='item-info'>"+
               "<div>"+
               "<p class='info-little'><span>"+item.orderNumber+"</span><span><a onclick='delcomment(\""+item._id+"\");'>删除评论</a></span></p>"+
               "<p class='info-time'>"+moment(item.updated).format("YYYY-MM-DD")+"</p>"+
               "</div>"+
               "</div>"+
               "</li>";
            });
            $("#divComments").html(htmlcontent);
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
            getcomment(num,false);
        }
    });
}

function delcomment(cid)
{
    if(!isLogin())
    {
        alert("您还未登录，请先登录！");
        location.href="../home/login.html";
    }
    axios.delete(serverUrl+'DeleteProductComment/'+cid)
    .then(function (response) {
      if(!!response.data)
      {
          var returnData=response.data;
          if(returnData.success)
          {
              alert("删除评论成功！");
              //刷新页面列表
              // var num=parseInt($("#hidPageNum").val());
              getCollections(1,true);
              
          }
          else if(returnData.code==10012)
          {
              alert("收藏中不存在要删除的商品！");
          }
          else
          {
              alert("删除评论失败！");
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
    getcomment(1,true);	
});