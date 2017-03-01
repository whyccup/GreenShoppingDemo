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
      return false; 
    });
    //返回购物车跳转
	$(".backshopcar").click(function(event) {
		window.location.href="./shopcar.html";
	});
	//立即支付跳转
	$(".settlement").click(function(event) {
		var address_id = 0;
		//循环所有 inp-radio,选中的传
		$('#address_table').find('.radio').each(function(){
			if($(this).is(":checked")){
			    address_id = $(this).attr('data-id');
			    ;
			}
		});
		console.log(address_id);
		//提交订单
		if (address_id == 0) {
			alert('你都不选地址，怎么送货上门啊？')
		}else{
			placeorder(address_id);
		}
		
	});
	

	//用户收货地址列表
	getAddress();
	//点击添加收获地址按钮的事件
	$("#addaddress_btn").click(function(event) {
		$(".glyphicon").hide();
	});
	//用户田收货地址第一级
	getareasF();
	$(".select").on('change', 'select', function(event) {
		var area_id = $(this).val();
		var select_id = $(this).attr("id");
		getareas(area_id,select_id);
		if ($(this).val() == -1) {
			$(".select").find('select').empty();
			$(".select").find('select').html('<option value="-1">请选择</option>');
			getareasF();
		}
	});
	//保存地址函数
	$("#save").click(function(event) {
		var area = $("#userhome").val();
		var address =$("#userplace").val();
		var contact = $("#username").val();
		var phone = $("#usertel").val();
		var fault = -1;
		addAddress(area,address,contact,phone,fault);
	});

	//收货地址点击删除
	$("#address-content").on('click', '.delAddress', function(event) {
		var address_id = $(this).attr("data-id")
		delAddress(address_id);
	});
	//显示购物车里的商品;
	getgoods();
	//计算商品价格
	mathpay();

	

});
//ready在这停顿

//全局变量
	var _token = localStorage.token;
//从localStorage取到商品
	var goodsinfo = JSON.parse(localStorage.goodsl);
	console.log(goodsinfo);
//拼接要买的的商品
	var goodsandnub = {};
	for (var i = 0; i < goodsinfo.length; i++) {
		 goodsandnub[goodsinfo[i].id] = JSON.parse(goodsinfo[i].nums);
	} 




//监听滚动条事件
//结算div的动态显示时间
window.onscroll = function(){
	//让.abchidden在下拉固定点消失，上拉固定点出现;
	//取到#boxs的动态位置，关于进度条
	//根据高度做判断;
	var h_boxs = Math.ceil($("#boxs").offset().top);//当前元素距页面顶部的高度
	var Height_window = $(window).height();//当前窗口的高度//滚动黑条
	var scroll_window = $(window).scrollTop();//当前窗口滚动条对于顶部的高度//滚动条上白条
	var h_window = Math.ceil(Height_window+scroll_window);//滚动条上白条和滚动黑条之和，为了让事件在页面最下发生
	if (h_window > h_boxs) {
		$(".abchidden").css("display","none");
	}else {
		$(".abchidden").css("display","block");
	}
}

// 算总共有几件商品
function mathmany (){
	var many = new Array();
	$(".caringoods-table").find('.count').each(function(index, el) {
		many.push(el.textContent);
	});
	var man = 0;
	for (var i = 0; i < many.length; i++) {
		man += parseInt(many[i]);
	}
	var c_many = parseInt(man);
	$(".howmanygoods").text(c_many);
	$(".nub").text(c_many);
}
//算总价//要放在动作里面去找这个动态生成的元素，比如放在某一ajax的done中
function mathmoney(){
	var money= new Array();
    $(".caringoods-table").find('.hidered').each(function(index, el) {
    	var eltext = parseFloat(el.textContent).toFixed(1);
    	money.push(eltext);
    });
    var sum = 0; 
    for (var i = 0; i < money.length; i++) {
    	sum += parseFloat(money[i]);
    }
    
    // var c_money = parseFloat(sum);
    // $(".trolley-bottom-account").text('￥'+c_money);
    // var allmoney = parseFloat(c_money);
    // $(".allmoney").text('￥'+allmoney);
}

//购物车里的商品
function getgoods(){
	$(".shopcar-goods").find('tbody').empty();//移除节点内所有子集
	$(".shopcar-goods").append('<tr><td>商品</td><td> &nbsp;</td><td style="text-align: center;">价格</td><td style="text-align: center;">数量</td></tr>');
	var goods_list = goodsinfo;
	for (var i = 0; i < goods_list.length; i++) {
		$(".shopcar-goods").append('<tr><td class="img-td"><a href="#"><img src="'+goods_list[i].img+'"></a></td><td style="width:492px;"><a href="#"><span>'+goods_list[i].name+'</span></a></td><td style="text-align: center;font-size: 18px;color: red;">￥<span class="red">'+goods_list[i].sale_price+'</span><span class="hidered" style="display:none">'+goods_list[i].pay+'</span></td><td style="text-align: center;font-size: 18px;">x<span class="count">'+goods_list[i].nums+'</span></td></tr>')
	}
	//算商品数和总价	
	mathmany();
	mathmoney();
}

//页面刷新用户收货地址一级接口
function getareasF(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/assist/areas',
		type: 'get',
		dataType: 'json',
		data: {
			parent: 0
		},
	})
	.done(function(data) {
		//获得的城市循环写入当前option，并把area_id存入value
		for (var i = 0; i < data.data.areas.length; i++) {
			$("#userprovince").append('<option value="'+data.data.areas[i].area_id+'">'+data.data.areas[i].area_name+'</option>')
		}
	});
}

// 用户收货地址四级接口
function getareas(area_id,select_id){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/assist/areas',
		type: 'get',
		dataType: 'json',
		data: {
			parent: area_id
		},
	})
	.done(function(data) {
		var strOption = ['<option value="-1">请选择</option>'];
		//获得的城市循环写入当前option，并把area_id存入value
		for (var i = 0; i < data.data.areas.length; i++) {
			strOption.push('<option value="'+data.data.areas[i].area_id+'">'+data.data.areas[i].area_name+'</option>');
		}
		$("#"+select_id).next('select').html(strOption.join(''));
	});
}
// 添加用户收货地址接口
function addAddress(area,address,contact,phone,fault){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/addAddress',
		type: 'post',
		dataType: 'json',
		data: {
			token: _token,
			area: area,
			address: address,
			contact: contact,
			phone: phone,
			default: fault
		},
	})
	.done(function(data) {
		if (data.status == 200) {
			$(".glyphicon").show();
			setTimeout("window.location.reload()",1000);
		}
	});
	
}
// 用户收货地址列表接口
function getAddress(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/getAddress',
		type: 'GET',
		dataType: 'json',
		data: {
			token: _token},
	})
	.done(function(data) {
		console.log(data);
		var useraddress = [];
		for (var i = 0; i < data.data.address.length; i++) {
			useraddress.push('<tr><td class="radio-td"><input type="radio" form="haha" class="radio" name="address" data-id="'+data.data.address[i].address_id+'"></td><td><span>'+data.data.address[i].contact+'</span></td><td><span>'+data.data.address[i].area_name+data.data.address[i].address+'</span></td><td><span>'+data.data.address[i].telephone+'</span></td><td><span>设为默认地址</span></td><td><span>编辑</span></td><td><span class="delAddress" data-id="'+data.data.address[i].address_id+'" style="cursor:pointer;color:red;">删除</span></td></tr>')
		}
		$("#address_table").append(useraddress.join(''))
	});
}
//更新用户收货地址接口 
//编辑我没写，第2个模态框，和上一个一样，区别在于保存地址按钮调这个函数，多传address_id进去
//address_id从点击的span上获取，再存在保存地址按钮的属性中，方便传参数。
function updateAddress(){
	$.ajax({
		url: 'http://192.168.1.8:8006/updateAddress',
		type: 'post',
		dataType: 'json',
		data: {
			id: address_id,
			token: _token,
			area: area,
			address: address,
			contact: contact,
			phone: phone,
			default: fault
		},
	})
	.done(function() {
		console.log("success");
	});
}
//删除用户收货地址接口
function delAddress(address_id){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/delAddress',
		type: 'post',
		dataType: 'json',
		data: {
			id: address_id,
			token: _token
		},
	})
	.done(function(data) {
		alert('不能选择删或不删，没有后悔药');
		window.location.reload();
	});	
}
//计算商品价格的接口
function mathpay(){
	$.ajax({
		url: 'http://192.168.1.8:8106/site/apicountfavourable',
		type: 'POST',
		dataType: 'json',
		data: {
			goods_id: goodsandnub,
			token:_token
		},
	})
	.done(function(data) {
		console.log(data);
    	$(".trolley-bottom-account").text('￥'+data.data.price_list.count);
    	$(".allmoney").text('￥'+data.data.price_list.count);
    	localStorage.goodscount = data.data.price_list.count;
    	
	});
	
}
//提交订单接口
function placeorder(address_id){
	$.ajax({
		url: 'http://192.168.1.8:8106/site/apiorderadd',
		type: 'POST',
		dataType: 'json',
		data: {
			adds: address_id,
			device: 'web',
			version:'1.0',
			goods_id:goodsandnub,
			paytype:'0',
			sendtype:'1',
			token:_token,
		},
	})
	.done(function(data) {
		if (data.status == 200) {
			//在localStorage存订单号
			localStorage.order_id = data.data.orderinfo.order_id;
			alert('下单成功');
			window.location.href="./pay.html"
		}else{
			alert(data.error);
		}
		console.log(data);
	});
	
}