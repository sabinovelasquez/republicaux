"use-strict";
var fbUrl = 'https://graph.facebook.com/search?q=%23LideresLatam&type=post&access_token=229178077289513|civ3ffn8Iyb8nVs-lvTl3_tF9Vg';
var twitterUrl = 'php/tweets.php';
//var twitterUrl = 'js/twtest.json';


var blocks = [];

var properties = {
  getColor: function() {

  },
  getLogo: function() {
  	switch(this.social){
  		case 'tw' :
  			return 'icon-twitter';
  			break;
  		default :
  			return 'icon-facebook'

  	}
  }
}

var Block = function(message, media, lang, social, user, date, link, order) {
  message = this.message;
  media = this.media;
  lang = this.lang;
  social = this.social;
  user = this.user;
  date = this.date;
  link = this.link;
}

function buildBlocks() {
	var posts = [];
	var tweets = [];
	$.getJSON(fbUrl, function(data) {
		posts = data.data;
	}).done(function() {
		$.each(posts, function(index, item) {
			var block = new Block();
			var date = new Date(item.created_time);

			if(item.type=='video') {
				block.message = item.description;
			}else {
				block.message = item.message;
			}
			block.social = 'fb';
			block.user = item.from.name;
			block.date = jQuery.timeago(date);
			block.order = date.getTime();
			block.link = item.link;
			_.extend(block, properties);
			blocks.push(block);
		});
	
		$.getJSON(twitterUrl, function(data) {
			tweets = data.statuses;
		}).done(function(){
			$.each(tweets, function(index, item) {
				var block = new Block();
				var date = new Date(item.created_at);
				block.message = item.text;
				block.social = 'tw';
				block.user = item.user.screen_name;
				if(item.entities.media){
					block.media = item.entities.media[0].media_url;
				}
				block.date = jQuery.timeago(date);
				block.order = date.getTime();
				block.lang = item.lang;
				_.extend(block, properties);
				blocks.push(block);
			});
			generalBuild();
		});
	});
}

function generalBuild() {
	$.each(blocks, function(index, item) {
		console.log(item.social);
		var div = '<div class="item col-md-4 col-sm-6 col-xs-12"><div class="well well-lg">';

		if(item.media) {
			div += '<img class="img-responsive" src="'+item.media+'">';
		}
		div += '<p class="ttext">'+item.message+'</p>';
		if(item.social == 'tw'){
			div += '<small><a class="tw" href="https://twitter.com/'+item.user+'" target="_blank">@'+item.user+'</a></small><span class="icon-twitter bottom"></span></div><!--.well--></div><!--.col-->';
		}else{
			div += '<small><a class="fb" href="'+item.link+'" target="_blank">'+item.user+'</a></small><span class="icon-facebook bottom"></span></div><!--.well--></div><!--.col-->';
		}
		
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