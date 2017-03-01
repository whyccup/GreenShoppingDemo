$(document).ready(function() {
	//如果localStorage不等于空，则修改#zhanghao和#yidenglu的value和harf。否则什么也不做。
  if (localStorage != '') {
    $("#zhanghao").text(localStorage.phone);
    $("zhanghao").attr("href", "#");
    $("yidenglu").text('已登录');
    $("yidenglu").attr("href","./login.html");
  }
  //隐藏动画框
  $("#loading").hide();
  //返回顶部
	$("#toTop").click(function(event) {
      $('body,html').animate({scrollTop:0},1000); 
      return false; });
  //显示要评论的商品
  goodsinfo()
  //提交评论
  $(".btn-danger").click(function(event) {
    addComment();
  });
  
	
});//ready在这停顿;

//全局变量
var _token = localStorage.token;

//商品详情
function goodsinfo(){
  $.ajax({
    url: 'http://192.168.1.8:8006/v1/goods/detail',
    type: 'GET',
    dataType: 'json',
    data: {
      goods: getUrlParam("goods_id"),
      token: _token
    },
  })
  .done(function(data) {
    console.log(data);
    $(".goods_info").find('img').attr('src', 'http://192.168.1.8:8008/'+data.data.goods.cover);
    $(".goods_info").find('span').html(data.data.goods.goods_name);
  });
  
}

//切割页面URL
function getUrlParam(name){
  var results = new RegExp('[\\?&]'+name+'=([^&#]*)').exec(window.location.search);
  if (!results) {
    return 0;
  }
  return results[1] || 0;
}

//点击星星改变span
function comment_star(num,el){
 if ($(el).attr('class') == "star-low") {
      $(el).removeClass('star-low');
      $(el).prevAll('span').removeClass('star-low');
    }else{
      $(el).nextAll('span').addClass('star-low');
    }
  $(".text").find('span').text(num);
}


//添加评价接口
function addComment(){
  $.ajax({
    url: 'http://192.168.1.8:8006/v1/account/addComment',
    type: 'post',
    dataType: 'json',
    data: {
      token: _token,
      goods: getUrlParam("goods_id"),
      order: getUrlParam("order_id"),
      content: $("textarea").val(),
      star: $(".text").find('span').text()
    },
  })
  .done(function(data) {
    if (data.status == 200) {
      alert('评价成功');
      window.location.href="./myevaluate.html";
    }
  });
}

