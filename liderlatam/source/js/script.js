var tweets = [];
function buildTweets() {
	$.each(tweets, function(index, item) {
		var twt = item.text;
		var lang = item.lang;
		var user = item.user.screen_name;
		var img;
		var div = '<div class="col-md-4 col-sm-6 col-xs-12"><div class="well well-lg">';
		if(item.entities.media){
			img = item.entities.media[0].media_url;
			div += '<img class="img-responsive" src="'+img+'">';
		}
		div += '<p>'+twt+'</p><small><a href="https://twitter.com/'+user+'" target="_blank">@'+user+'</a></small></div><!--.well--></div><!--.col-->';
		$('#loader').fadeOut();
		$('#content').append(div);
	});
}
$(document).ready(function() {
	console.log('loading new divs');
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