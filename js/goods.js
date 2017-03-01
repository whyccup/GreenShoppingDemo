$(document).ready(function() {
	//如果localStorage不等于空，则修改#zhanghao和#yidenglu的value和harf。否则什么也不做。
    if (localStorage != '') {
      $("#zhanghao").text(localStorage.phone);
      $("zhanghao").attr("href", "#");
      $("yidenglu").text('已登录');
      $("yidenglu").attr("href","./login.html");
    }

    //执行商品详情ajax
    goodsdetail();


	//买多少货
	$("#add").click(function(event) {
		var oldValue=parseInt($("#count").val());
        oldValue++;//自加1
        $("#count").val(oldValue);
	});
	$("#minus").click(function(event) {
		var oldValue=parseInt($("#count").val());
        oldValue--;//自减1
        if ($("#count").val() >= 2) {
			$("#count").val(oldValue);
		}  
	});
	
	
	

	//收藏
	$(".goods-like").click(function(event) {
		goodslike();
	});


	//判断送货时间
	var mytime = new Date();
	mytime.setMinutes(mytime.getMinutes()+30);
	var sendtime = mytime.getHours() + ":" + mytime.getMinutes();

	$("#sendTime").text(sendtime);
	console.log(sendtime);


	//商品详情hover
	$("#goods-info").find('.info-title').find('span').hover(function() {
		// $("#xiangqin").removeAttr('class', 'green');
		$(this).attr('class', 'green');
	}, function() {
		$(this).removeAttr('class', 'green');
		$("#title-xiangqin").attr('class', 'green');
	});


	//点击商品规格进行滚动条移动动画
	$('#title-guige').click(function(event) {
		$('body,html').animate({
			scrollTop: $('#big-guige').offset().top-5,
		},1000);
	});
	//点击相关文章进行滚动条动画
	$('#title-wenzhang').click(function(event) {
		$('body,html').animate({
			scrollTop: $('#big-wenzhang').offset().top-5,
		},1000);
	});
	//点击用户评价进行滚动条动画
	$('#title-pingjia').click(function(event) {
		$('body,html').animate({
			scrollTop: $('#big-pingjia').offset().top-5,
		},1000);
	});

	
	//执行商品评价函数
	goodscomment();

	// 点击加入购物车按钮
	$("#goods-joinCar").click(function(event) {
		// if ($("#count").val() > $("#stock").val()) {
		// 	alert('没有那么多商品');
		// 	$("#count").val() = $("#stock").val();
		// }
		var count = $("#count").val();
		joinshopcar(count);
	});



	

	//返回顶部
	$("#toTop").click(function(event) {
      $('body,html').animate({scrollTop:0},1000); 
      return false; 
    });
});
// ready在这里停顿

//一些全局变量
var _goodsid = getUrlParam("goods_id");//先写死了。
console.log(localStorage);
var _token = localStorage.token;
//商品详情
function goodsdetail(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/goods/detail',
		type: 'GET',
		dataType: 'json',
		data: {
			goods: _goodsid,
			token: _token
		},
	})
	.done(function(data) {
		console.log(data);
		var goods = data.data.goods;
		$(".goods-data-name").html('【进乐宝】'+goods.goods_name);
		$(".price-old").append(goods.city_price);
		$(".price-sale").append(goods.cost_price);
		$(".stock").find('span').html(goods.stock);
		$(".stock").attr('value', goods.stock);
		$(".goods-imgs-img").find('img').attr('src', "http://192.168.1.8:8008/"+goods.cover);
		for (var i = 0; i < goods.pics.length; i++) {
			$(".goods-imgs").append('<div class="goods-imgs-thumb"><a><img src="http://192.168.1.8:8008/' + goods.pics[i] + '")></a></div>');
		}
		
		$(".info-img").html(goods.content);
		$("#goodsguige")
		$("#goodsguige").find('span')[0].append(' '+goods.goods_name);
		$("#goodsguige").find('span')[1].append(' '+goods.goods_id);
		$("#goodsguige").find('span')[2].append(' 进乐宝');
		$("#goodsguige").find('span')[3].append(' 包');
		if ( goods.favorite==0) {
			$(".goods-like").find('img').attr({
				src: './png/xin.png',
				data_id: '0'
			});
		}
		if( goods.favorite==1){
			$(".goods-like").find('img').attr({
				src: './png/xin-hover.png',
				data_id:'1'
			});
		}
	});
}
//商品评价
function goodscomment(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/goods/comment',
		type: 'GET',
		dataType: 'json',
		data: {
			goods: _goodsid,
			limit:'10',
			offset:'0'
		},
	})
	.done(function(data) {
		// console.log(data);
		var comments = data.data.comments;
		$('.info-title-big').find('span').html('('+comments.length+')');
		for (var i = 0; i < comments.length; i++) {
			$(".godds-comment").find('ul').append('<li><div class="content"><div class="buyer-text">123</div><div class="reply">谢谢惠顾</div></div><div class="comment-user"><span>username</span><img src="./png/grade3.png"></div></li>');
		}
		$(".godds-comment").find('li').each(function(index, el) {
			$(el).find('.buyer-text').html(comments[index].content);
			$(el).find('.reply').html(comments[index].reply_content);
			$(el).find('.comment-user').find('span').html(comments[index].user_name);
		});

	});
}
//收藏的函数
function goodslike(){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/editCollect',
		type: 'POST',
		dataType: 'json',
		data: {
			token: _token,
			goods: _goodsid
		},
	})
	.done(function(data) {
		if ($(".goods-like").find('img').attr('data_id') == 0) {
			$(".goods-like").find('img').attr({
				src: './png/xin-hover.png',
				data_id: '1'
			});
			alert("收藏成功");
		}else{
			$(".goods-like").find('img').attr({
				src: './png/xin.png',
				data_id:'0'
			});
			alert("您取消了收藏");
		}
	});
}

// 加入购物车
function joinshopcar(count){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/addGoods',
		type: 'POST',
		dataType: 'json',
		data: {
			token: _token,
			goods: _goodsid,
			count: count
		},
	})
	.done(function(data) {
		console.log(data);
		if (data.status == 200) {
			alert('加入成功');
		}
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