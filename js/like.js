$(document).ready(function() {
	//如果localStorage不等于空，则修改#zhanghao和#yidenglu的value和harf。否则什么也不做。
    if (localStorage != '') {
      $("#zhanghao").text(localStorage.phone);
      $("zhanghao").attr("href", "#");
      $("yidenglu").text('已登录');
      $("yidenglu").attr("href","./login.html");
    }

    //返回顶部
	$("#toTop").click(function(event) {
      $('body,html').animate({scrollTop:0},1000); 
      return false;
  	});


  	//执行收藏
  	$.ajax({
	url: 'http://192.168.1.8:8006/v1/account/getCollect',
	type: 'GET',
	dataType: 'json',
	data: {
		token: localStorage.token,
		limit: 20,
		offset: 0,
		},
	})
	.done(function(data) {
		console.log(data);
		var collects = data.data.collects;
		for (var i = 0; i < collects.length; i++) {
			$('#like-goods').find('ul').append('<li>'+i+'</li>');
		}

		$("#like-goods").find('li').html('<a><img class="collect-goods" src="/"><div class="collect-price">$123<span>123</span></div><div class="collect-content"><p>niu</p></div><div class="collect-join"></div></a><span id="deletelike" class="glyphicon glyphicon-remove"></span><div class="likehidden"><span>取消收藏</span><button class="btn btn-success btn-xs">确定</button><button class="btn btn-default btn-xs">取消</button></div>');

		$('#like-goods').find('ul').find('li').each(function(index, el) {
			$(el).find('img').attr('src',"http://192.168.1.8:8008/"+collects[index].thumbnail);
			$(el).find('.collect-price').html("￥"+collects[index].sale_price+'<span>'+"￥"+collects[index].promotion_price+'</span>');
			$(el).find('.collect-content').find('p').text(collects[index].goods_name);
			$(el).find('a').attr('href', './goods.html?goods_id='+collects[index].goods_id);
			$(el).attr('value', collects[index].goods_id);
		});
	});


	
	
  	//取消收藏的×
  	$("#like-goods").on('click', '#deletelike', function(event) {
  		$(this).next('.likehidden').css('display','block');
  	});	

  	//点击按钮的事件
  	$("#like-goods").on('click', '.btn-success', function(event) {
  		var goodsid = $(this).parents('li').val()
  		goodslike(goodsid);
  		$(this).parents('li').remove();
  	});
  	$("#like-goods").on('click', '.btn-default', function(event) {
  		console.log($(this).parents('.likehidden'));
  		$(this).parents('.likehidden').hide();
  	});
});




console.log(localStorage);
 
var _token = localStorage.token;

//收藏的函数
function goodslike(goodsid){
	$.ajax({
		url: 'http://192.168.1.8:8006/v1/account/editCollect',
		type: 'POST',
		dataType: 'json',
		data: {
			token: _token,
			goods: goodsid
			},
	})
	.done(function(data) {})};	
	
	
