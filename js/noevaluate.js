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
  //待评论
	noComment();

  //评价按钮
  $(".noevaluate").on('click', '.comment', function(event) {
    window.location.href="./comment.html?goods_id="+$(this).data('goods_id')+"&order_id="+$(this).data("order_id")+""
  });

});//ready在这停顿;

//全局变量
var _token = localStorage.token;

//未评价商品接口
function noComment(){
  $.ajax({
    url: 'http://192.168.1.8:8006/v1/goods/noComment',
    type: 'GET',
    dataType: 'json',
    data: {token: _token},
  })
  .done(function(data) {
    console.log(data);
    var strHtml = [];
    for (var i = 0; i < data.data.goods_list.length; i++) {
      strHtml.push('<tr>');
      strHtml.push('<td><img src="http://192.168.1.8:8008/'+data.data.goods_list[i].thumbnail+'"></td>');
      strHtml.push('<td>'+data.data.goods_list[i].goods_name+'</td>');
      strHtml.push('<td>'+getLocalTime(data.data.goods_list[i].pay_time)+'</td>');
      strHtml.push('<td><button class="btn btn-success comment" data-order_id="'+data.data.goods_list[i].order_id+'" data-goods_id="'+data.data.goods_list[i].goods_id+'">评价</button></td>');
      strHtml.push('</tr>');
    }
    $(".noevaluate").find('.table').append(strHtml.join(""));
  });
  
}

//时间戳转换代码
function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}