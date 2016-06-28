$(document).ready(function () {
	var form = $('form');
	chrome.storage.sync.get(function(setting) {
		for (var i in setting) {
			$line = $(makeLine(i, setting[i].bg, setting[i].ft));
			form.append($line);
			bindColorPicker($line);
		}
	});

	$('#add').click(function () {
		$line = $(makeLine('', '', ''));
		form.append($line);
		bindColorPicker($line);
	});

	form.focusout(function () {
		save();
	});

	function makeLine(name, bg, ft) {
		bg = bg ? bg : '#e3f2f7';
		ft = ft ? ft : '#335566';
		return '<div class="tag-group" style="text-align: center;">' + 
			'<div class="input-field col s6" style="margin:0">' +
				'<input placeholder="name" class="name" style="margin:0;text-align:center;" type="text" value="' + name +
		  '"></div>' +
			'<div class="input-field col s6" style="margin:0">' +
				'<span><a class="tag-sample" style="color:' + ft + ';background-color:' + bg + ';">' + name + '</a></span>' +
				'<input style="display:none;" class="bg" type="text" style="margin:0" value="' + bg + '">' +
				'<input style="display:none;" class="ft" type="text" style="margin:0" value="' + ft + '">' +
			'</div>' +
		'</div>';
	}
	

	function save() {
		var setting = {};
		$(".tag-group").each(function (index, ele){
			ele = $(ele);
			name = ele.find('.name').val();
			bg = ele.find('.bg').val();
			ft = ele.find('.ft').val();
			if (name && bg) {
				setting[name] = {'bg':bg, 'ft':ft};
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

	fronted = false;
	function bindColorPicker($line) {
			ts = $line.find('.tag-sample');
			$line.find('span').colorPicker({
				renderCallback:function ($ele, toggled) {
					if (toggled === undefined) {
						bg = '#' + this.color.colors.HEX;
						ft = this.color.colors.HUELuminance > 0.22 ? '#666' : '#fff';
						ts.css('background-color', bg);
						ts.css('color', ft);
						$line.find('.bg').val(bg);
						$line.find('.ft').val(ft);
					} else if (toggled === false) {
						save();
					} else if (toggled === true && !fronted) {
						$('.cp-color-picker').css('z-index', '1');
					}
				}
			});
	}
});
