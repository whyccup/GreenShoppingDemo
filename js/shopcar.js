$(document).ready(function() {
	delete localStorage.goodsl;
	delete localStorage.goodscount;
	delete localStorage.order_id;
	
	//如果localStorage不等于空，则修改#zhanghao和#yidenglu的value和harf。否则什么也不做。
    if (localStorage != '') {
      $("#zhanghao").text(localStorage.phone);
      $("zhanghao").attr("href", "#");
      $("yidenglu").text('已登录');
      $("yidenglu").attr("href","./login.html");
    }
    //隐藏动画框
    $("#loading").hide();

    // 执行购物车列表接口
    getGoods();
    
    
    //修改买多少货——按钮!!!!动态的绑定事件。
	$("#shopcar-ulli").on('click', '.add', function(event) {
		var oldValue=parseInt($(this).prev().val());
        oldValue++;//自加1
        $(this).prev().val(oldValue);
        var id = $(this).prev().attr('data-id');
        var nums = $(this).prev().val();
        updateGoods(id,nums);
        $(function () {
	    	setTimeout(function () {
	        	$("#loading").show();
	    	}, 0);
	    	setTimeout(function () {
	        	$("#loading").hide();
	    	}, 500);
		})
        getGoods();
       	});
	$("#shopcar-ulli").on('click', '.minus', function(event) {
		var oldValue=parseInt($(this).next().val());
		 oldValue--;//自减1
        if (oldValue >= 1) {
			$(this).next().val(oldValue);
		}
		var id = $(this).next().attr('data-id');
        var nums = $(this).next().val();
        updateGoods(id,nums);
        $(function () {
	    	setTimeout(function () {
	        	$("#loading").show();
	    	}, 0);
	    	setTimeout(function () {
	        	$("#loading").hide();
	    	}, 500);
		})
        getGoods();
	});

	
	
	//checkbox添加全不选事件
	$("#allcheck").click(function(event) {
		if ($("#allcheck").prop("checked") == true) {
			$(".goods_checkbox").prop("checked",true);
		}
		if ($("#allcheck").prop("checked") == false) {
			$(".goods_checkbox").prop("checked",false);
		}
		whatchecked ();
	});

	//给checkbox加的事件删除当前商品在数量和价格中的运算。
	$("#shopcar-ulli").on('click', '.killcheckbox', function(event) {
		// 判断并删除class的函数
		whatchecked ();
	});		
		
		
	//checkbox添加全部删除事件，执行批量删除购物车接口函数；并执行一遍购物车列表接口函数;
	$("#diecheck").click(function(event) {
		if ($("#diecheck").prop("checked") == true) {
			$(".goods_checkbox").prop("checked",true);
		}
		if ($("#diecheck").prop("checked") == false) {
			$(".goods_checkbox").prop("checked",false);
		}
		whatchecked ();
	});
	
	//全部删除
	$("#allkill").click(function(event) {
		$('#myModal-all').modal();
	});
	var goodsidszz = new Array();
	$(".killallgoods").click(function(event) {
		$(".killcheckbox").each(function(index, el) {
			if ($(this).prop("checked") == true) {
				var dataid = $(this).parents("tr").find(".css_count").attr("data-id");
				goodsidszz.push(dataid);
			}
		});
		var goods_ids = goodsidszz.join(",");//join后可以用任何符号分隔字符串。
		delGoodss(goods_ids);
		window.location.reload();
	});
	//单独删除商品
	$("#shopcar-ulli").on('click', '.del', function(event) {
		var goodsid = $(this).attr('data-id');
		$('#myModal').modal();
		$(".killgoods").attr("data-id",goodsid);
	});
	$(".killgoods").click(function(event) {
		var goods_id = $(this).attr('data-id');
		delGoods(goods_id);
		window.location.reload();
	});
	//结算跳转并存localStorage
	$(".settlement").click(function(event) {
		iseeyou();
		window.location.href="./address.html";
	});
	//返回顶部
	$("#toTop").click(function(event) {
      $('body,html').animate({scrollTop:0},1000); 
      return false; 
    });
});//ready在这停顿。



//checkbox选中判断的函数
//checkbox添加不选则删除当前div.red,删除当前input.count,并执行一遍购物车列表接口函数;
function whatchecked () {
	$(".killcheckbox").each(function(index, el) {
		if($(this).prop("checked") == false){
			$(this).parents("tr").find(".css_red").removeClass("red");
			$(this).parents("tr").find(".css_count").removeClass("count");
		}else{
			$(this).parents("tr").find(".css_red").attr("class","red css_red");
			$(this).parents("tr").find(".css_count").attr("class","count css_count");
		}
	});
	mathmany();
	mathmoney();
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



//全局变量
var _token = localStorage.token;
var _sum = 0;

// 购物车列表接口
function  getGoods() {
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/getGoods',
		type: 'GET',
		dataType: 'json',
		data: {
			token: _token
		},
	})
	.done(function(data) {
		$("#shopcar-ulli").empty();
		console.log(data);
		var goods_list = data.data.goods_list;
		for (var i = 0; i < goods_list.length; i++) {

			$("#shopcar-ulli").append('<div class="shopcar-goods"><table class="table"><tr class="title"><th style="width: 30px;"><input type="checkbox" class="goods_checkbox killcheckbox" checked="checked"></th><th style="width: 170px;"><a href="#"><img src="'+'http://192.168.1.8:8008/'+goods_list[i].thumbnail+'"></a></th><th style="width: 500px;" class="left"><a href="#">'+goods_list[i].goods_name+'</a></th> <th style="width: 100px;"><div class="price-decoration">'+goods_list[i].promotion_price+'</div><div class="price">'+goods_list[i].sale_price+'</div></th><th style="width: 170px;"><button type="button" class="minus">-</button><input type="text" name="123" class="count css_count" value="'+goods_list[i].goods_nums+'" data-id="'+goods_list[i].goods_id+'"><button type="button" class="add">+</button></th><th style="width: 120px;"><div class="css_red red">'+(parseFloat(goods_list[i].sale_price)*parseInt(goods_list[i].goods_nums)).toFixed(1)+'</div></th><th><a href="#"><div class="remove">&#12288;移入收藏夹</div></a><div class="del" style="cursor:pointer" data-id="'+goods_list[i].goods_id+'">&#12288;删除</div></th></tr></table></div>');
		}
		mathmany();
		mathmoney();
	});
}
//更新购物车接口
function updateGoods(id,nums){
	var goods_obj = [{"goods_id":""+id+"","goods_nums":""+nums+""}];
	var goods_str = JSON.stringify(goods_obj);
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/updateGoods',
		type: 'post',
		dataType: 'json',
		data: {
			token: _token,
			goods: goods_str
		},
	})
	.done(function(data) {
		console.log(data);
	});
	
}

//单独删除购物车接口
function delGoods(goods_id){
	var goods = ""+goods_id+"";
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/delGoods',
		type: 'POST',
		dataType: 'json',
		data: {
			token: _token,
			goods: goods
		},
	})
	.done(function() {
		mathmany ();
		mathmoney();
	});
}
//批量删除购物车接口
function delGoodss(goods_ids){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/delGoods',
		type: 'POST',
		dataType: 'json',
		data: {
			token: _token,
			goods: goods_ids
		},
	})
	.done(function() {
	});
}
// 算总共有几件商品
function mathmany (){
	var many = new Array();
	$("#shopcar-ulli").find('.count').each(function(index, el) {
		many.push(el.value);
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
    $("#shopcar-ulli").find('.red').each(function(index, el) {
    	var eltext = parseFloat(el.textContent).toFixed(1);
    	money.push(eltext);
    });
    var sum = 0; 
    for (var i = 0; i < money.length; i++) {
    	sum += parseFloat(money[i]);
    }
    var c_money = parseFloat(sum);
    $(".trolley-bottom-account").text('￥'+c_money);
    var allmoney = c_money;
    $(".allmoney").text('￥'+allmoney);
}
//遍历所有killbox
function iseeyou(){
	var goodsl = ''; 
	$(".killcheckbox").each(function(index, el) {
		if($(el).prop("checked") == true){
			//要用css_开头的因为不会变
			var id = $(this).parents("tr").find(".css_count").attr("data-id");
			var img = $(this).parents("tr").find("img").attr("src");
			var name = $(this).parents("tr").find(".left").find("a").text();
			var pay = $(this).parents("tr").find(".css_red").text();
			var sale_price = $(this).parents("tr").find(".price").text();
			var nums = $(this).parents("tr").find(".css_count").val();
			var goods = {
				"id":id,
				"img":img,
				"name":name,
				"sale_price":sale_price,
				"pay":pay,
				"nums":nums,
			}
			//拼接成json对象
			goodsl += JSON.stringify(goods)+',';
		}
	});
	//拼接成有多个json对象的数组
	goodsl = ('['+goodsl.slice(0, -1)+']');
	//储存
	localStorage.goodsl = goodsl;
	console.log(JSON.parse(goodsl));
}	    		