





//Объекты интерфейса
var Interface = {
	timer: null,
	popup: '<div class="adv-controls"></div>',
	addBookmarks: '<div id=""><a href="" class="adv-add-bookmarks">В закладки</a></div>',
	description: '<div class="video-desc">Загружаю...</div>'
	
}






/* Основное тело */
$(document).ready(function(){
	chrome.extension.sendMessage({get: "settings"}, function(response) { //отправка сообщения для получения настроек в background.js
	  var settings = response;
	 
	  if(isAllowedPage())
		{
			$('.pagination-block').css('clear', 'both');
			$('.form-normal').css('clear', 'both');
			$('.catalog-block').css('overflow', 'inherit'); // Костыль, но что делать.
			
			$('.poster').live('mouseenter', function(){
				if(!$(this).children('div').is('.adv-controls'))
					{
						var obj = this;
						Interface.timer = setTimeout(function(){
							$(obj).append(Interface.popup);
							var controls = $(obj).children('.adv-controls');
							if(settings.position == 'side')
								{
									// Второй вариант наложения попапа
									$(controls).addClass('adv-overlay-side');
								}
							if(settings.opacity)
								{
									$(controls).css('background', 'rgba(0, 0, 0, ' + settings.opacity + ')')
								}
							
							if($(obj).parent('div').next('div').is('.clear') || $(obj).parent('div').next('div').next('div').is('.clear'))
								{
									$(controls).addClass('right');
								}
							var url = getUrl($(obj).children('a'));
							var id = getIdFromUrl(url);
							if(isAllowBookmark()){
								$(controls).append(Interface.addBookmarks);
								$(controls).children('div').attr('id', 'bookmark_' + id);
								$(controls).children('div').children('.adv-add-bookmarks').attr('href', 'javascript:bookmark_add('+ id +')');
							}
							$(controls).append(Interface.description);
							$('.video-desc').delay(500).load(url + ' #video-descr');
						}, 500)
						
					}
			})
			$('.poster').live('mouseleave', function(){
				$('.adv-controls').remove();
				$(this).children('a').show();
				$(this).children('.hd').show();
				if(Interface.timer) clearTimeout(Interface.timer);
			})
		}
	});
	
	
});



/* Функции */
function getUrl(a){
	//для объекта <a>
	var pageUrl = 'http://watch.is' + $(a).attr('href');
	return pageUrl;
}

function getIdFromUrl(url){
	var exp = new RegExp('\\d+', 'g');
	var id = url.match(exp);
	return id[0];
}

function isAllowedPage(){
	var notAllowedPage = 'login'; /* надо где-то хранить список запрещенных страниц*/
	if(location.href.match(notAllowedPage))
		{
			return false;
		}
		else
		{
			return true;
		}
}

function isAllowBookmark(){
	if(location.href.match('bookmark'))
		{
			return false;
		}
		else
		{
			return true;
		}
}




