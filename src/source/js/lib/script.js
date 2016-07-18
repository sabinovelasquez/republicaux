"use-strict";
var twitterUrl = 'php/tweets.php',
//var twitterUrl = 'json/tweets.json',
	profilesUrl = 'php/getprofile.php',
//	profilesUrl = 'json/profiles.json',
	blocks = [],
	profiles = [],
	categories =[],
	properties = {

	}

var Block = function(rt, message, user, name, date, order, fav, cats) {
	rt = this.rt,
	message = this.message;
	user = this.user;
	name = this.name;
	date = this.date;
	link = this.link;
	fav = this.fav;
	cats = this.cats;
}
var Category = function (name) {
	name = this.name;
}
function getProfiles(){
	$.getJSON(profilesUrl, function(data) {
		profiles = data;
	}).done(function(){
		$.each(profiles, function(index, user){
			var url;
			if(user.url){
				url = user.url;
			}else{
				url = 'https://twitter.com/'+user.user_name;
			}
			var cleanfilter = user.user_name.replace(/_/g, "");
			var profile_pic = user.profile_image_url.replace('normal', 'bigger');
			var div = '<li class="profile" data="p'+cleanfilter.toLowerCase()+'">';
			div += '<div class="imgcontent"><img class="profile-pic" src="'+profile_pic+'" /></div>';
			div += '<h4>'+user.name+'</h4>';
			div += '<p>'+user.description+'</p></li>';
			$('ul.profiles').append(div);
		});
		$('li.profile').click(function(){
			var filter = $(this).attr('data');
			$('#content').isotope({ filter: '.'+filter });
		});
	});
	$('#sidebar a.profiles').click(function(){
  		$('ul.menu').addClass('menu-collapsed');
  		$('ul.profiles').addClass('menu-expanded');
  	});
  	$('#sidebar ul.profiles a.back').click(backtocat);
}
function buildBlocks() {
	var tweets = [];
	$.getJSON(twitterUrl, function(data) {
		tweets = data;
	}).done(function(){
		$.each(tweets, function(index, item) {
			var block = new Block();
			var date = new Date(item.created_at);
			var tags = item.message.toLowerCase().match(/#\S+/g); 
			block.message = item.message
							.replace(/#[a-z0-1A-Z]+/g,
								function parseString(str){
									var htag = str.toLowerCase();
									if(htag != '#republicaux'){
										return '<a class="filter">'+str+'</a>';
									}else{
										return '';
									}
								}).replace(/@[a-z0-1A-Z]+/g,
								function(str){
									var twitterUser = str.split('@');
									return '<a class="twitterUser" href="https://twitter.com/'+twitterUser[1]+'" target="_blank">'+str+'</a>'
								});
			block.rt = item.retweet_count;
			block.user = item.username;
			block.name = item.name;
			block.date = jQuery.timeago(date);
			block.order = date.getTime();
			block.fav = item.favorite_count;
			block.cats = tags;
			$.each(tags, function(index, item){
				var catname = item.replace('#', '');
				var find = _.indexOf(categories, catname);
				if( find === -1 && catname != 'republicaux'){
					categories.push(catname);
				}
			});
			blocks.push(block);
		});
		generalBuild();
	});
}
function resize() {
	alto = $(window).height();
	$('ul.categories').css({'height': (alto-160) + 'px'});
	$('ul.profiles').css({'height': (alto-160) + 'px'});
}
function getFont(val){
	if(val%3 == 0){
		return 'font1';
	}else if(val%2 == 0){
		return 'font2';
	}else{
		return 'font3';
	}
}
function getTags(arr){
	var tags = '';
	$.each(arr, function(index, item){
		tags += item.replace('#', '')+' ';
	});
	return tags;
}
function generalBuild() {
	
	var elems = [];
	$.each(blocks, function(index, item) {
		var cleanfilter = item.user.replace(/_/g, "");
		var div = '<div class="item '+getTags(item.cats)+' col-md-3 col-sm-4 col-xs-12 '+getFont(index)+' p'+cleanfilter.toLowerCase()+'"><div class="tweet">';
		var rt = '';
		var fav = '';
		
		if(parseInt(item.rt)>0){
			rt = '<span class="rt"><i class="fa fa-retweet"></i> '+item.rt+'</span>';
		}
		
		if(parseInt(item.fav)>0){
			fav = '<span class="fav"><i class="fa fa-star"></i> '+item.fav+'</span>';
		}
		
		div += '<p class="ttext">'+item.message+'</p>'+rt+fav;
		div += '<span class="ago">'+item.date+'</span><small><a class="tw" href="https://twitter.com/'+item.user+'" target="_blank">'+item.name+'</a></small></div><!--.tweet--></div><!--.col-->';
		
		elems.push(div);

	});

		

	$.each(categories, function(index, item) {
		cat = '<li class="menu-item"><a data="side" class="filter '+item.toLowerCase()+'">'+item.toUpperCase()+'</a></li>';
		$('ul.categories').append(cat);
	});
	$('#content').append(elems).isotope({
			itemSelector : '.item',
			animationEngine: 'css'
	})
	$('p.ttext').linkify();
	$('#loader').fadeOut('fast',function(){
		$('#content').isotope('layout');
	});

  	$('#sidebar a.cats').click(function(){
  		$('ul.menu').addClass('menu-collapsed');
  		$('ul.categories').addClass('menu-expanded');
  	});
  	$('#sidebar ul.categories a.back').click(backtocat);
  	$('a.filter').click(function(){
  		var pos = $(this).attr('data');
  		var fil = $(this).text().replace('#', '').trim();
  		fil = fil.toLowerCase();
  		$('ul.categories a').removeClass('active-cat');
  		$('ul.categories a.'+fil).addClass('active-cat');

  		if(fil != 'todos'){
  			$('#content').isotope({ filter: '.'+fil });
			if(pos != 'side'){
				$('#menu').trigger('click');
				$('#sidebar a.cats').trigger('click');
			}

  		}else{
  			$(this).addClass('active-cat');
  			$('#content').isotope({ filter: '*' });
  		}

  	});
  	$('a.filter-all').click(function(){
		$('#allcat').trigger('click');
	});
}
function backtocat(){
	$('ul.menu').removeClass('menu-collapsed');
	$('ul.profiles').removeClass('menu-expanded');
  	$('ul.categories').removeClass('menu-expanded');
}
function postToTweet() {
    var url = 'https://twitter.com/intent/tweet?hashtags=LideresLatam&url=http://lidereslatam.techo.org';
    share_window = window.open(url, 'Twitter', 'status = 1, left = ' + ($(window).width() / 3) + ', top = 90, height = 350, width = 420, resizable = 0');
}
$(window).resize(resize);
$(document).ready(function() {
	resize();
	getProfiles();
	$('#menu').click(function(){
		backtocat();
		$('body').addClass('pad-r');
		$('#sidebar').removeClass('side-collapsed').addClass('side-expanded');
		$('a#close').removeClass('side-collapsed');
		$('#loader').fadeOut('slow',function(){
			$('#content').isotope('layout');
		});
	});
	
	$('a#close').click(function(){
		$('body').removeClass('pad-r');
		$('#sidebar').removeClass('side-expanded').addClass('side-collapsed');
		$('a#close').addClass('side-collapsed');
		$('#loader').fadeOut('slow',function(){
			$('#content').isotope('layout');
		});
	});
	$('#historia').click(postToTweet);
	$('#loader').fadeIn();
	buildBlocks();
});