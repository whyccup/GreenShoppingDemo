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
  //我的评论
  getComment();


});//ready在这停顿;


//全局变量
var _token = localStorage.token;

//获取我的评价接口
function getComment(){
  $.ajax({
    url: 'http://192.168.1.8:8006/v1/account/getComment',
    type: 'get',
    dataType: 'json',
    data: {
      token: _token,
      limit: 10,
      offset: 0,
    },
  })
  .done(function(data) {
    console.log(data);
    var strHtml = [];
    for (var i = 0; i < data.data.comments.length; i++) {
      strHtml.push('<tr>');
      strHtml.push('<td style="width: 205px;">');
      for (var j = 0; j < data.data.comments[i].points; j++) {
        strHtml.push('<div class="comment-show-star"></div>');
      }
      strHtml.push('<div class="comment-show-comment">'+data.data.comments[i].points+'</div>');
      strHtml.push('</td>');
      strHtml.push('<td style="width: 515px;text-align: left;">'+data.data.comments[i].content+'</td>');
      strHtml.push('<td style="width: 180px;text-align: left;">'+data.data.comments[i].goods_name+'</td>');
      strHtml.push('<td style="width: 300px;">'+getLocalTime(data.data.comments[i].reply_time)+'</td>');
      strHtml.push('</tr>');
    }
    $(".evaluate_table").append(strHtml.join(""));
});
  
}
// Path: /v1/account/getComment
// 类型：get
// 参数：
// token   | 用户标识  | 必填 | String
// limit   | 查询条数  | 必填 | Int
// offset  | 开始页数  | 必填 | Int

//时间戳转换成时间
function getLocalTime(nS) {     
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");      
}     
