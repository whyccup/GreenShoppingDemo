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
	searchOrder();
	
});//ready在这停顿;

//全局变量
var _token = localStorage.token;


//订单列表接口
function searchOrder(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/searchOrder',
		type: 'GET',
		dataType: 'json',
		data: {
			type: 'all',
			token: _token,
			limit: 20,
			offset: 1,
		},
	})
	.done(function(data) {
		console.log(data);
		var strHtml = [];
		for (var i = 0; i < data.data.orders.length; i++) {
			var strGoods = [];
			strHtml.push('<div class="order">');
			strHtml.push('<span class="ordertime">'+data.data.orders[i].sendtime+'</span>');
			strHtml.push('<span class="orderid">订单编号：'+data.data.orders[i].order_no+'</span>');
			strHtml.push('<table class="table table-bordered">');
			strHtml.push('<tr>');
			strHtml.push('<td style="width: 605px;text-align: left;">');
			for (var j = 0; j < data.data.orders[i].goods.length; j++) {
				strGoods.push('<p><img src="http://192.168.1.8:8008/'+data.data.orders[i].goods[j].thumbnail+'"><span class="goodsname">'+data.data.orders[i].goods[j].goods_name+'</span></p>');
			}
			strHtml.push(strGoods.join(""));
			strHtml.push('</td>');
			strHtml.push('<td style="width: 150px;"><span class="username">'+data.data.orders[i].accept_name+'</span></td>');
			strHtml.push('<td style="width: 150px;"><span class="howmuch" style="display: block;">￥'+data.data.orders[i].order_amount+'</span><span>余额支付</span></td>');
			var ifstatus = data.data.orders[i].status;
			switch (ifstatus) {
				case 0:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已下单</span></td>');
					break;
				case 1:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已支付</span></td>');
					break;
				case 2:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已打印配货单</span></td>');
					break;
				case 3:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已完成配货检查</span></td>');
					break;
				case 4:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已打印发货单</span></td>');
					break;
				case 5:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已发货确认</span></td>');
					break;
				case 6:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已签字</span></td>');
					break;
				default:
					strHtml.push('<td style="width: 150px;"><span class="payorno">已超时</span></td>');
					break;
				}
			strHtml.push('<td><a class="orderinfos" href="./orderinfo.html?orderinfo_id='+data.data.orders[i].order_id+'">订单详情</a></td>');
			strHtml.push('</tr>');
			strHtml.push('</table>');
			strHtml.push('</div>');
		}
		$("#orders").append(strHtml.join(""));
		
	});
}
