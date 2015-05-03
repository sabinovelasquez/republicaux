"use-strict";
var twitterUrl = 'php/tweets.php';
var blocks = [];

var properties = {
  getColor: function() {
  	switch(this.lang){
  		case 'es':
  			return '#FF9000';
  			break;
  		case 'en':
  			return '#00AA00';
  			break
  		default:
  			return '#FF6400';
  	}
  }
}

var Block = function(message, media, lang, user, date, link, order) {
  message = this.message;
  media = this.media;
  lang = this.lang;
  user = this.user;
  date = this.date;
  link = this.link;
}

function buildBlocks() {
	var tweets = [];
	$.getJSON(twitterUrl, function(data) {
		tweets = data.statuses;
	}).done(function(){
		$.each(tweets, function(index, item) {
			var block = new Block();
			var date = new Date(item.created_at);
			block.message = item.text;
			block.user = item.user.screen_name;
			if(item.entities.media){
				block.media = item.entities.media[0].media_url;
			}
			block.date = jQuery.timeago(date);
			block.order = date.getTime();
			block.lang = item.user.lang;
			_.extend(block, properties);
			blocks.push(block);
		});
		generalBuild();
	});
}

function generalBuild() {
	$.each(blocks, function(index, item) {
		var div = '<div class="item col-md-4 col-sm-6 col-xs-12"><div class="well well-lg" style="border:3px solid '+item.getColor()+'">';

		if(item.media) {
			div += '<img class="img-responsive" src="'+item.media+'">';
		}
		div += '<p class="ttext">'+item.message+'</p>';
		div += '<span class="ago">'+item.date+'</span><small><a class="tw" href="https://twitter.com/'+item.user+'" target="_blank">@'+item.user+'</a></small><span class="lang">'+item.lang+'</span><span class="icon-twitter bottom"></span></div><!--.well--></div><!--.col-->';
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
	buildBlocks();
});