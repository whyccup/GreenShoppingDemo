		//header的登录号码改变和已登录
		if (localStorage != '') {
			$("#zhanghao").text(localStorage.phone);
			$("#zhanghao").attr("href", "#");
      		$("#yidenglu").text('已登录');
      		$("#yidenglu").attr("href","./login.html");
		}

		

		

		//声明非常重要的全局变量
		//用来保存上一次点了那一页
		var _page = 1;
		//用来保存经过运算有多少页
		var _pages = 0;
		//用来保存上一次点了什么排序
		var _sort = 0;
		//用来改变ajax中的data
		var _status= 0;
		//搜索函数的默认值
		var _content = 0;

		//在所有页面加载完成后进行ajax
		$(document).ready(function($) {
			
			//ajax调用方法，执行第一页
			ajaxdata(_page,_status,_content);

			//得到点了搜索后的value，转换encodeURIComponent，传到ajax
			$(".serach-input").find('button').click(function(event) {
				_page = 1;
				_status = 0;
				_content = 0;
				var inputval = $("#serachInput").val();
				console.log(inputval);
				var content = encodeURIComponent(inputval);
				console.log(content);
				_content = content;
				ajaxdata(_page,_status,_content);
			});

			//点击sort——排序，排序函数
			$("#sort").on('click','.sortow',function(event) {
				var sortMark = $(this).attr("data-id");
				var name =$(this).attr("data-name");
				// $("div[class='default']").attr('id', 'sort-check');
				//把要的数据相反绑定
				var sortObj={
					"default":{
						0:0
					},
					"sale":{
						1:2,
						2:1
					},
					"price":{
						3:4,
						4:3
					},
					"time":{
						5:6,
						6:5
					}
				};
				//取得反向的排序值
				_status = sortObj[name][sortMark];
				$(this).attr("data-id",_status);
				switch (name) {
					case 'default':
						_page = 1;
						ajaxdata(_page,_status,_content);
						$("#sort").find('div').removeAttr("id");
						$(this).attr('id', 'sort-check');
						$(".sortow").find('img').attr('src','./png/drop.png');
						break;
					case 'sale':
						_page = 1;
						ajaxdata(_page,_status,_content);
						$("#sort").find('div').removeAttr("id");
						$(this).attr('id', 'sort-check');
						$(".sortow").find('img').attr('src','./png/drop.png');
						if (_status % 2 == 0) {
							$(this).find('img').attr('src', './png/drop.png');
						}else{
							$(this).find('img').attr('src', './png/rise.png');
						};
						break;
					case 'price':
						_page = 1;
						ajaxdata(_page,_status,_content);
						$("#sort").find('div').removeAttr("id");
						$(this).attr('id', 'sort-check');
						$(".sortow").find('img').attr('src','./png/drop.png');
						if (_status % 2 == 0) {
							$(this).find('img').attr('src', './png/drop.png');
						}else{
							$(this).find('img').attr('src', './png/rise.png');
						}
						break;
					case 'time':
						_page = 1;
						ajaxdata(_page,_status,_content);
						$("#sort").find('div').removeAttr("id");
						$(this).attr('id', 'sort-check');
						$(".sortow").find('img').attr('src','./png/drop.png');
						if (_status % 2 == 0) {
							$(this).find('img').attr('src', './png/drop.png');
						}else{
							$(this).find('img').attr('src', './png/rise.png');
						}
						break;
					default:
						ajaxdata(_page,0);
						break;
				}				
			});


			//  //判断页数
			// 	//如果在第一页，上一页按钮就没用
			// 	if(_page == 1){
			// 		$(".disable").off('click');
			// 	}
			// 	//如果在最后一页，下一页按钮就没用
			// 	if(_page == _pages){
			// 		$(".next").off('click');
			// 	}
			


			//取得当前用户点击的页码
			$("#footflip").on('click','li',function(event){
				//坑爹的一个命名，将点击的元素的data-id变成数字
				var page = $(this).attr("data-id");
				//把当前页面保留在全局变量中
				if ($(this).hasClass('pages')) {
					_page = page;
				}else {
					//如果点击的是上一页
					if($(this).attr('data-id') == 0){
						_page = _page - 1;
					}
					//如果点击的是下一页
					if ($(this).attr('data-id') == 100) {
						_page = _page + 1;	
					}
				}
				

				//将用户点击的页码传出，执行
				ajaxdata(_page,_status,_content);//√
				
				
				//当用户点击当前页面不进行异步调用
				// if ($(this).attr('data-id') == _page) {return;}
		
			});
			
			
			//返回顶部
			$("#toTop").click(function(event) {
				$('body,html').animate({scrollTop:0},1000); 
				return false; 
			});
			// //实现商品跳转到商品详情页
			// $("#ulcollect").find('li').find('img').click(function(event) {
			// 	window.location.href='./goods.html'
			// });
		});


		//点击之后传入page的修改ajax的函数
		function ajaxdata(_page,_status,_content){

			var limit = 20;
			var offset = _page;
			var status = _status;
			var cont =_content;
			var _data ={
				limit: limit,
				offset: offset,
				status: status,
				content: cont,
			};
			//调用接口，在函数内，目的是让每一次点击页码重新生产
			$.ajax({
				url: 'http://192.168.1.8:8006/v1/goods/search',
				type: 'GET',
				dataType: 'json',
				data:_data,
			})
			//ajax成功后发生的事
			.done(function(gg) {
				console.log(gg);
				var _goods = gg.data;
				if (_goods.goods_list.length == 0) {
					alert('你可能搜了假的商品');
				}				
				//移除页脚导航栏
				$("#footflip").find('ul').remove();
				//移除页面中之前的内容
				$("#ulcollect").find('li').remove();
				//执行内容动态生成函数
				collect(_goods);
				//获得一共有多少商品
				$(".sort-span").find('a').text(_goods.goods_count);				
				//执行动态生成页脚导航函数
				footflip(_goods,_page);
			});
		}//函数 ajaxdata的结尾。


		//主要内容动态生成函数
		function collect(_goods){
			//写出collect的ul的li
			for (var i = 0; i < _goods.goods_list.length; i++) {
				$("<li>").attr('data-shuzi',i).appendTo('#ulcollect');
			}
			
			//给每个li里加入框架
			$("#collect").find('ul').find('li').html('<a>'+'<img class="collect-goods" src="/">'+'<div class="collect-price">$123<span>123</span></div>'+'<div class="collect-content"><p>niu</p></div>'+'<div class="collect-join"></div>'+'</a>');

			//循环填充已写好的div
			$("#collect").find('ul').find('li').each(function(index, el) {
				$(el).find('img').attr('src',"http://192.168.1.8:8008/"+_goods.goods_list[index].thumbnail);
				$(el).find('.collect-price').html("￥"+_goods.goods_list[index].sale_price+'<span>'+"￥"+_goods.goods_list[index].promotion_price+'</span>');
				$(el).find('.collect-content').find('p').text(_goods.goods_list[index].goods_name);
				$(el).find('a').attr('href', './goods.html?goods_id='+_goods.goods_list[index].goods_id);
			});
		}


		//生成动态生成页脚导航
		function footflip(_goods,_page){
			//向上取整=Math.ceil  算需要几页
			var pages = Math.ceil(_goods.goods_count/20);
			_pages = pages;
			$("<ul>").attr('id', 'ulfootflip').appendTo('#footflip');
			//for循环写出页脚导航
			for (var i = 1; i <= pages; i++) {
				$("<li>").attr({'data-id':i,class:'pages'}).html('<a>' + i + '</a>').appendTo('#ulfootflip');
			}
			$("<li>").attr({'data-id':0,class:'disable'}).html('<a>&lt;</a>').prependTo('#ulfootflip');
			$("<li>").attr({'data-id':100,class:'next'}).html('<a>&gt;</a>').appendTo('#ulfootflip');
			$("li[data-id="+ _page +"]").attr('id', 'detip');
		}

		
