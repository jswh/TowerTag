(function () {
	$(document).ready(function () {
		addCss();
		chrome.storage.sync.get(function(setting) {
			changeAll(setting);
		});

		$(document).on('DOMNodeInserted', function(e) {
			chrome.storage.sync.get(function(setting) {
			if(e.target.className == 'todos-all todos-view member-view' || e.target.className == 'todos-all todos-view list-view' || e.target.className == 'simple-filedrop') {
				changeAll(setting);
			}
			});
		});

		$('#todolists').on('DOMNodeInserted', function (e) {
			chrome.storage.sync.get(function(setting) {
				target = $(e.target);
				if(target.hasClass('todo')) {
					change(target.find('.content-linkable>.tag'), setting);
				}
			});
		});
	});

	function changeAll(setting) {
		$('.content-linkable>.tag').each(function (i, tag) {
			$tag = $(tag);
			change($tag, setting);
		});
		$('.content-linkable>.changed-tag').each(function (i, tag) {
			$tag = $(tag);
			change($tag, setting);
		});
	}

	function addCss() {
		$('head').append("<style>.block-header .simple-checkbox, .block-header .todo-detail{display:none;}.block-header .todo-content{color:#333}</style>");
	}

	function change($tag, setting) {
			tagText = $tag.text();
			switch (tagText) {
				case 'block-header':
					$todo = $tag.closest('.todo');
					$todo.css({
						'margin':'10px 0',
						'text-align':'center'
					});
					$wrap = $tag.closest('.todo-wrap');
					$wrap.addClass('block-header');
					$tag.hide();
					break;
				default:
					if (setting[tagText]) {
						changeColor($tag, setting[tagText]);
					} else if ($tag.hasClass('change-tag')) {
						revertColor($tag);
					}
			}
	}

	function changeColor($tag, color) {
		$tag.removeClass('tag');
		$tag.addClass('changed-tag');
		$tag.css({
			'background': color.bg,
			'color': color.ft,
			'padding': '0.1em 0.2em',
			'vertical-align': '1px',
			'font-size': '82%',
			'font-weight': 'normal',
			'border-radius': '2px'
		});
	}

	function revertColor($tag) {
		$tag.css({
			'background': color.bg,
			'color': color.ft,
			'padding': '0.1em 0.2em',
			'vertical-align': '1px',
			'font-size': '82%',
			'font-weight': 'normal',
			'border-radius': '2px'
		});
		$tag.addClass('tag');
		$tag.removeClass('changed-tag');
	}

})();
function test() {console.log(123);}
