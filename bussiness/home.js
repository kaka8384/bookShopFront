

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
                    $("#topSales"+tag).html("<a href=\"introduction.html?pid="+item._id+"\"><div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"+item.price.$numberDecimal+"</div></div><img src=\""+item.images[0]+"\"/></a>");
                }
                else
                {
                    var imgWidth='139px';
                    var imgHeight='139px';
                    if(tag<=3)
                    {
                        imgWidth='199px';
                    }
                        imgHeight='199px';
                    $("#topSales"+tag).html("<div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"
                    +item.price.$numberDecimal+"</div></div><a href=\"introduction.html?pid="+item._id+"\"><img width='"+imgWidth+"' height='"+imgHeight+"' src=\""+item.images[0]+"\"/></a>");
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
                    $("#topCollection"+tag).html("<a href=\"introduction.html?pid="+item._id+"\"> <img width='"+imgWidth+"' height='"+imgHeight+"' src=\""
                    +item.images[0]+"\"/><div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"+item.price.$numberDecimal+"</div></div></a>");
                }
                else
                {
                   
                    $("#topCollection"+tag).html("<div class=\"outer-con\"><div class=\"title\">"
                    +item.name+"</div><div class=\"sub-title\">售价：¥"
                    +item.price.$numberDecimal+"</div></div><a href=\"introduction.html?pid="+item._id+"\"><img width='"+imgWidth+"' height='"+imgHeight+"' src=\""+item.images[0]+"\"/></a>");	
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
                contentHtml+="<li><div class=\"list\"><a href=\"introduction.html?pid="+item._id+"\"><img src=\""
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





$(document).ready(function(){

    getTopSalesProduct();
    getTopCollectionProduct();
    getTopCommentProduct();

});
