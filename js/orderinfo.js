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
  //我的订单列表
  var orderinfo_id = getUrlParam("orderinfo_id");
  orderDetail(orderinfo_id);
  orderShip(orderinfo_id);

});//ready在这停顿;

//全局变量
var _token = localStorage.token;

//订单详情接口
function orderDetail(orderinfo_id){
  $.ajax({
    url: 'http://192.168.1.8:8006/v1/account/orderDetail',
    type: 'GET',
    dataType: 'json',
    data: {
      order: orderinfo_id,
      token: _token
    },
  })
  .done(function(data) {
    $(".order_no").html(data.data.order.order_no);
    $(".accept_name").append(data.data.order.accept_name);
    $(".area_name").append(data.data.order.area_name);
    $(".address").append(data.data.order.address);
    $(".mobile").append(data.data.order.mobile);
    $(".Discount").html('（￥'+(data.data.order.order_amount-data.data.order.real_amount).toFixed(2)+'）');
    $(".order_amount").append('￥'+data.data.order.order_amount);
    $(".real_amount").append('￥'+data.data.order.real_amount);
    var strHtml = [];
    for (var i = 0; i < data.data.order.goods.length; i++) {
      strHtml.push('<tr class="goodsinfo" style="border-bottom: 1px solid #ddd;">');
      strHtml.push('<td class="goods_id">'+data.data.order.goods[i].goods_id+'</td>');
      strHtml.push('<td class="thumbnail"><img src="http://192.168.1.8:8008/'+data.data.order.goods[i].thumbnail+'"></td>');
      strHtml.push('<td class="goods_name">'+data.data.order.goods[i].goods_name+'</td>');
      strHtml.push('<td class="goods_price">'+data.data.order.goods[i].goods_price+'</td>');
      strHtml.push('<td class="goods_nums">'+data.data.order.goods[i].goods_nums+'</td>');
      strHtml.push('<td>&#12288;</td>');
      strHtml.push('</tr>');
    }
    $(".table").append(strHtml.join(""));
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




//订单物流接口
function orderShip(orderinfo_id){
  $.ajax({
    url: 'http://192.168.1.8:8006/v1/account/orderShip',
    type: 'GET',
    dataType: 'json',
    data: {
      order: orderinfo_id,
      token: _token
    },
  })
  .done(function(data) {
    console.log(data);
    var strHtml = [];
    for (var i = 0; i < data.data.ship.length; i++) {
      strHtml.push('<ul>');
      strHtml.push('<li class="killorder_time">'+getLocalTime(data.data.ship[i].create_time)+'</li>');
      strHtml.push('<li class="killorder_info">'+data.data.ship[i].content+'</li>');
      strHtml.push('</ul>');
    }
    $("#orderfollow").find('.content').append(strHtml.join(""));
  });
  
}
//时间戳转换代码
function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}