function getProductList()
{
    axios.get(serverUrl+'ProductByPage?queryType=1&currentPage=1&pageSize=12')
    .then(function (response) {
        if(!!response.data)
        {
            var htmlcontent="";
            response.data.list.map(function(item,index){
                htmlcontent+="<li><div class='i-pic limit'><img width='218px' height='218px' src='"+item.images[0]+"'/>"+											
                "<p class='title fl'>"+item.name+"</p>"+
                "<p class='price fl'><b>¥</b><strong>"+item.price.$numberDecimal+"</strong>"+
                "</p><p class='number fl'>销量<span>"+item.salesCount+"</span></p>"+
                "</div></li>";
            });
            $("#ulProduct").html(htmlcontent);
            var total=response.data.pagination.total;
            var current=response.data.pagination.current;
            initPagination(total,current);
        }      
    })
    .catch(function (error) {
        console.log(error);
    });  
}

function initPagination(total,current)
{

    var visiblePages=Math.floor(total/12)+1;
    $('#pagination1').jqPaginator({
        totalPages: total,
        visiblePages:visiblePages,
        currentPage: current,
        prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            $alert('当前第' + num + '页');
        }
    });
}

$(document).ready(function(){
    getProductList();
   
});