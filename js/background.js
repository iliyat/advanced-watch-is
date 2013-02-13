var mainDomain = 'http://watch.is';
var updateTimer = 30000;


function checkTabUrl(url){
	if(url.indexOf(mainDomain) <0){
		return false;
	}
	else{
		return true;
	}
}

function openSiteTab(){
	
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && checkTabUrl(tab.url)) {	
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
	    }
		chrome.tabs.create({url: mainDomain});
 	});
	
}

function checkAuth(){
	function checkAuthState(data){
		if(data.match('page-login'))
			{
				
				chrome.browserAction.setBadgeText({text: '?'});
				chrome.browserAction.setIcon({path: 'icons/icon_no_auth_128.png'});
				chrome.browserAction.setTitle({title: 'Необходимо авторизоваться.'})
				chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
				delete(data);
			}
		else
			{
				
				chrome.browserAction.setIcon({path: 'icons/icon_128.png'});
				chrome.browserAction.setBadgeBackgroundColor({color:[242, 153, 38, 255]});
				
				var s = getSettings();
				if(s.onbadge == 'rating')
					{
						getUser(data);
					}
				else if(s.onbadge == 'messages')
					{
						getMessages();
					}
				
				
				delete(data);
			}
	}
	
	var loader = $.ajax({
		url: mainDomain,
		type: 'GET',
		success: function(data){
			checkAuthState(data);
		}
	})
}

function getMessages()
	{
		var mUrl = '/messages';
		$.ajax({
			url: mainDomain+mUrl,
			type: 'GET',
			success: function(messagepage){
				
				var messagebox = $(messagepage).find('.back-bs2').text();
				var r = new RegExp('\\d+', 'g');
				var messagecount = messagebox.match(r);
				chrome.browserAction.setBadgeText({text: messagecount[0]});
				chrome.browserAction.setTitle({title: 'Сообщений - ' + messagecount[0]})
			}
		})
	}



function getUser(data)
	{
		var userUrl = $(data).find('a:contains("Профиль")').attr('href');
		//var testUrl  = '/user/user0ff';
		$.ajax({
			url: mainDomain+userUrl,
			type: 'GET',
			success: function(userdata){
				var rating = $(userdata).find('#rating').text();
				chrome.browserAction.setBadgeText({text: rating});
				chrome.browserAction.setTitle({title: 'Рейтинг на сайте - ' + rating})
			}
		})
	}

function getSettings(){
	var settings = JSON.parse(localStorage.getItem('awsettings'));
	return settings;
}


function init(){
	//проверяем наличие настроек, если нет записываем
	if(!getSettings())
	  	{
			 settings = {
				position: 'side',
				opacity: '0.9',
				onbadge: 'rating',
			}
			//chrome.extension.sendMessage({get: 'default', data: settings});
			//этот костыль вроде не нужен, ставим настройки тут
			
			localStorage.setItem('awsettings', JSON.stringify(settings));
		}
		
	//ловушка для получения настроект контент-скриптом. костыль тот еще
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
		sendResponse(getSettings());
	});
	
	
	checkAuth();
	setTimeout(function(){
		init();
	}, updateTimer)
}

chrome.browserAction.onClicked.addListener(function(){
	openSiteTab();
});

init();




