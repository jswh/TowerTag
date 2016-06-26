$(document).ready(function () {
	var form = $('form');
	chrome.storage.sync.get(function(setting) {
		for (var i in setting) {
			form.append(makeLine(i, setting[i]));
		}
	});

	$('#add').click(function () {
		form.append(makeLine('', ''));
	});

	$('form').focusout(function (evt) {
		if($(evt.target).is('input')) {
			save();
		}
	});

	function makeLine(name, color) {

		return '<div class="tag-group">' + 
			'<div class="input-field col s6" style="margin:0">' +
				'<input placeholder="name" class="name" style="margin:0" type="text" value="' + name + '">' +
			'</div>' +
			'<div class="input-field col s6" style="margin:0">' +
				'<input placeholder="color" class="color" style="margin:0" type="text" value="' + color + '">' +
			'</div>' +
		'</div>';
	}
	

	function save() {
		var setting = {};
		$(".tag-group").each(function (index, ele){
			ele = $(ele);
			name = ele.find('.name').val();
			color = ele.find('.color').val();
			if (name && color) {
				setting[name] = color;
			}
		});
		chrome.storage.sync.get(function(oldSetting) {
			for (var i in oldSetting) {
				if (!setting[i]) {
					chrome.storage.sync.remove(i);
				}
			}
		});
		chrome.storage.sync.set(setting);
	}
});
