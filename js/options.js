function collect(){
	var settings = {
		position: $('#popup-position').val(),
		opacity: $('#opacity').val(),
		onbadge: $('#on-badge-info').val(),
	}
	localStorage.setItem('awsettings', JSON.stringify(settings));
	delete(settings);
	
}

function loadSettings(){
	var settings = JSON.parse(localStorage.getItem('awsettings'));
	$('#popup-position').children('option[value="'+settings.position+'"]').attr('selected', true);
	$('#opacity').val(settings.opacity);
	syncRange();
	$('#on-badge-info').children('option[value="'+settings.onbadge+'"]').attr('selected', true);
	/*alert(settings.onbadge); */
}

function syncRange(){
	$('#visual-range').val($('#opacity').val());
}




$(document).ready(function(){
	$('#opacity').live('change', function(){
		syncRange();
	});
	
	$('input, select').live('change', function(){
		collect();
		loadSettings();
	})
	
	$('.navigation li').live('click', function(){
		$('.nav-item-selected').removeClass('nav-item-selected');
		$(this).addClass('nav-item-selected');
		$('.main-area .page').hide();
		$('#'+$(this).attr('data')).show();
	})
	$('#visual').show();
	loadSettings();
})
