/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/

/*===========================
 1. function declearetion
 ==========================*/
var themeApp = {
	featuredMedia: function(){
		$(".post-wrap").each(function() {
			var thiseliment = $(this);
			var media_wrapper = $(this).find('featured');
			var media_content_embeded = media_wrapper.find('iframe');
			if (media_content_embeded.length > 0) {
				$(media_content_embeded).prependTo(thiseliment).wrap("<div class='featured-media'></div>");
				thiseliment.addClass('post-type-embeded');
			}
		});
	},
	responsiveIframe: function() {
		$('.post').fitVids();
	},
	masonryLayout: function() {
		/*$container = $('.item-container');
    	$items = $('.item');
    	var $msnry = $container.masonry({
			itemSelector: '.item',
			columnWidth: '.item',
			isAnimated: true,
			transitionDuration: 1
	    });
	    $items.hide();
	    $container.imagesLoaded(function() {
			$items.addClass('animate').show();
			$msnry.masonry();
		});*/
	},
	navBar: function() {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 40) {
				$('.navbar-wrap').addClass('shrink');
			} else {
				$('.navbar-wrap').removeClass('shrink');
			}
		});
	},
	searchForm: function() {
		$('.search-open').on('click', function(e){
			e.preventDefault();
			$('.search-wrap').addClass('visible');
			$(this).addClass('hide-this');
			$('.navbar-toggle').addClass('hide-this');
			$('#search-result').show(300);
		});
		$('.search-close').on('click', function(e){
			e.preventDefault();
			$('.search-wrap').removeClass('visible');
			$('.search-open').removeClass('hide-this');
			$('.navbar-toggle').removeClass('hide-this');
			$('#search-result').hide(300);
		});
		$("#search-field").ghostHunter({
		    results         : "#search-result",
		    onKeyUp         : true,
		    zeroResultsInfo     : false,
		    info_template   : "<div class=\"search-info\">{{amount}} posts found</div>",
		    result_template : "<div><a href='{{link}}'>{{title}}</a></div>"
		});
	},
	highlighter: function() {
		$('pre code').each(function(i, block) {
		    hljs.highlightBlock(block);
		});
	},
	PreventClick: function() {
		$('.share-text').on('click', function(e){
			e.preventDefault();
		})
	},
	shareCount: function() {
		$('.post-wrap').each(function() {
			var $this = $(this);
			var url = $(this).find('.post-url').html();
			var placeHolder = $this.find('.share-count');

			$.getJSON( 'http://graph.facebook.com/?id=' + url, function( fbdata ) {
		        fbc = fbdata.shares;
		        $(placeHolder).attr('data-fbc', fbc);

		    });
		    $.getJSON( 'http://cdn.api.twitter.com/1/urls/count.json?url=' + url + '&callback=?', function( twitdata ) {
		        twc = twitdata.count;
		       $(placeHolder).attr('data-twc', twc);
		    });
		    $.getJSON( 'http://api.pinterest.com/v1/urls/count.json?url=' + url + '&callback=?', function( pindata ) {
		        pinc = pindata.count;
		        $(placeHolder).attr('data-pinc', pinc);
		    });

		    function checkJSON_getSum() {
		    	if($(placeHolder).attr('data-fbc') != undefined && $(placeHolder).attr('data-twc') != undefined && $(placeHolder).attr('data-pinc') != undefined) {
			    	var fbc = parseInt($(placeHolder).attr('data-fbc'));
			    	var twc = parseInt($(placeHolder).attr('data-twc'));
			    	var pinc = parseInt($(placeHolder).attr('data-pinc'));
			    	var totalShare = fbc + twc + pinc;
				    $this.find('.share-count').html(totalShare);
				    console.log(totalShare);
			    }
			    else {
			        setTimeout(function () {
			                checkJSON_getSum();
			        }, 200);
			    }
			}
			checkJSON_getSum();
		});
	},
	backToTop: function() {
		$(window).scroll(function(){
			if ($(this).scrollTop() > 100) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		$('#back-to-top').on('click', function(e){
			e.preventDefault();
			$('html, body').animate({scrollTop : 0},1000);
			return false;
		});
	},
	recentPost:function() {
		var code = String('');
		var recentPost;
		$.get(ghost.url.api('posts', {limit: recent_post_count})).done(function (data) {
			recentPost = data.posts;
			if (recentPost.length > 0) {
				for (var i = 0; i < recentPost.length; i++) {
					var link = recentPost[i].url;
					var title = recentPost[i].title;
					var published_date = format_date(recentPost[i].published_at);
					code += '<div class="recent-single-post">';
					code += '<a href="' + link + '" class="post-title">' + title + '</a><div class="date">' + format_date(published_date) + '</div>';
					code += '</div>';
				}
			}
			function format_date (dt) {
				var d = new Date(dt);
				var month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				var month = month_name[d.getMonth()];
				var date = d.getDate();
				var year = d.getFullYear();
				var formatted_dt = month+' '+date+','+' '+year;
				return formatted_dt;
			}
			$(".recent-post").html(code);
		});
	},
	mailchimp:function() {
		var form = $('#mc-embedded-subscribe-form');
		form.attr("action", mailchimp_form_url);
		var message = $('#message');
		var submit_button = $('mc-embedded-subscribe');
		function IsEmail(email) {
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return regex.test(email);
		}
		form.submit(function(e){
			e.preventDefault();
			$('#mc-embedded-subscribe').attr('disabled','disabled');
			if($('#mce-EMAIL').val() != '' && IsEmail($('#mce-EMAIL').val())) {
				message.html('please wait...').fadeIn(1000);
				var url=form.attr('action');
				if(url=='' || url=='YOUR_MAILCHIMP_WEB_FORM_URL_HERE') {
					alert('Please config your mailchimp form url for this widget');
					return false;
				}
				else{
					url=url.replace('?u=', '/post-json?u=').concat('&c=?');
					console.log(url);
					var data = {};
					var dataArray = form.serializeArray();
					$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
					});
					$.ajax({
						url: url,
						type: "POST",
						data: data,
						dataType: 'json',
						success: function(response, text){
							if (response.result === 'success') {
								message.html(success_message).delay(10000).fadeOut(500);
								$('#mc-embedded-subscribe').removeAttr('disabled');
								$('#mce-EMAIL').val('');
							}
							else{
								message.html(response.result+ ": " + response.msg).delay(10000).fadeOut(500);
								console.log(response);
								$('#mc-embedded-subscribe').removeAttr('disabled');
								$('#mce-EMAIL').focus().select();
							}
						},
						dataType: 'jsonp',
						error: function (response, text) {
							console.log('mailchimp ajax submit error: ' + text);
							$('#mc-embedded-subscribe').removeAttr('disabled');
							$('#mce-EMAIL').focus().select();
						}
					});
					return false;
				}
			}
			else {
				message.html('Please provide valid email').fadeIn(1000);
				$('#mc-embedded-subscribe').removeAttr('disabled');
				$('#mce-EMAIL').focus().select();
			}
		});
	},
	facebook:function() {
		var fb_page = '<iframe src="//www.facebook.com/plugins/likebox.php?href='+facebook_page_url+'&amp;width&amp;height=258&amp;colorscheme=light&amp;show_faces=true&amp;header=false&amp;stream=false&amp;show_border=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:258px; width:100%;" allowTransparency="true"></iframe>';
		$('.fb').append(fb_page);
		$(".fb").fitVids();
	},
	init:function(){
		themeApp.featuredMedia();
		themeApp.responsiveIframe();
		themeApp.masonryLayout();
		themeApp.navBar();
		themeApp.searchForm();
		themeApp.highlighter();
		themeApp.PreventClick();
		themeApp.shareCount();
		themeApp.recentPost();
		themeApp.mailchimp();
		themeApp.facebook();
	}
}
/*===========================
2. Initialization
==========================*/
$(document).ready(function(){
	themeApp.init();
});
