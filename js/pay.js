$(document).ready(function() {
	//如果localStorage不等于空，则修改#zhanghao和#yidenglu的value和harf。否则什么也不做。
	console.log(localStorage);
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
	//从localStorage取出价格
	$("#counts").text('￥'+localStorage.goodscount);

	//账户余额接口
	over();

	//点击立即支付按钮的事件
	$('.settlement').click(function(event) {
		payOrder();
		alert('支付成功！！！！')
		window.location.href="./orderinfo.html?orderinfo_id="+localStorage.order_id+""
	});


	//倒计时2小时//模拟假的。
	setInterval("CountDown()",500);
	


});//ready在这停顿;



var maxtime = 60*60*2//2小时，按秒计算   
function CountDown(){
	if(maxtime>0){
		hours = Math.floor((maxtime-1)/60/60);
		minutes = Math.floor((maxtime-1)/2/60);   
		seconds = Math.floor((maxtime-1)/2%60);   
		var msg = hours+"小时"+minutes+"分"+seconds+"秒";
		--maxtime; 
		$("#twohour").html(msg);
	}else {
		var msg = 0+"小时"+0+"分"+0+"秒";
	}
}

//全局变量
var _token = localStorage.token;

//账户余额接口
function over(){
	$.ajax({
		url: ' http://192.168.1.8:8006/v1/account/over',
		type: 'GET',
		dataType: 'json',
		data: {
			token: _token
		},
	})
	.done(function(data) {
		console.log(data);
		$(".balance").text(data.data.user.over);
	});	
}

//余额结算订单接口
function payOrder(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/payOrder',
		type: 'POST',
		dataType: 'json',
		data: {
			order: localStorage.order_id,
			token:_token
		},
	})
	.done(function(data) {
		if (data.status == 200) {
			alert('下单成功');
		}
		console.log(data)
	});	
}

