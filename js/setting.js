$(document).ready(function () {
	var form = $('form');
	chrome.storage.sync.get(function(setting) {
		for (var i in setting) {
			$line = $(makeLine(i, setting[i].bg, setting[i].ft));
			form.append($line);
			bindColorPicker($line);
			bindNameChange($line);
		}
	});

	$('#add').click(function () {
		$line = $(makeLine('', '', ''));
		form.append($line);
		bindColorPicker($line);
		bindNameChange($line);
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
		console.log(setting);
		chrome.storage.sync.get(function(oldSetting) {
			var deletedSetting = {};
			for (var i in oldSetting) {
				if (!setting[i]) {
					deletedSetting[i] = 'deleting';
				}
			}
			//trigger the delete
			chrome.storage.sync.set(deletedSetting);

			var addSetting = {};
			for (var j in setting) {
				if (!oldSetting[j]) {
					addSetting[j] = 'adding';
				}
			}
			console.log(addSetting)

			//preadd the new setting
			chrome.storage.sync.set(addSetting);
		});
		//really set all changes
		chrome.storage.sync.set(setting);
	}

	fronted = false;
	function bindColorPicker($line) {
		$line.find('span').colorPicker({
			customBG: '#000',
			margin: '-20px 0 0 -80px',
			renderCallback:function ($ele, toggled) {
				ts = $ele.find('.tag-sample');
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
			},
		});
	}

	function bindNameChange($line) {
		nameInput = $line.find('.name');
		nameInput.change(function (e) {
			input = $(e.target);
			input.closest('.tag-group').find('.tag-sample').text(input.val());
		});
	}
});
