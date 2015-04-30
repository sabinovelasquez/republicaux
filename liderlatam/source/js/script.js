"use-strict";

var tweets = [];
function buildTweets() {
	$.each(tweets, function(index, item) {
		var twt = item.text;
		var lang = item.lang;
		var user = item.user.screen_name;
		var img;
		var div = '<div class="item col-md-4 col-sm-6 col-xs-12"><div class="well well-lg">';

		if(item.entities.media){

			img = item.entities.media[0].media_url;
			div += '<img class="img-responsive" src="'+img+'">';

		}

		div += '<p class="ttext">'+twt+'</p><small><a class="tw" href="https://twitter.com/'+user+'" target="_blank">@'+user+'</a></small><span class="icon-twitter bottom"></span></div><!--.well--></div><!--.col-->';
		
		$('#content').append(div);
		$('p.ttext').linkify();
	});
	$('#loader').fadeOut();
	$('#content').imagesLoaded( function(){
    	$('#content').isotope({
      		itemSelector : '.item'
    	});
  	});
}
function postToTweet() {
    var url = 'https://twitter.com/intent/tweet?hashtags=LideresLatam&url=http://lidereslatam.techo.org';
    share_window = window.open(url, 'Twitter', 'status = 1, left = ' + ($(window).width() / 3) + ', top = 90, height = 350, width = 420, resizable = 0');
}
$(document).ready(function() {
	$('#historia').click(postToTweet);
	$('#loader').fadeIn();
	$.getJSON('php/tweets.php', function(data) {
		if(data.statuses.length<1){
			$('#loader').fadeOut();
			$('#alerta').fadeIn();
		}else{
			tweets = data.statuses;
			buildTweets();
		}
	});
});