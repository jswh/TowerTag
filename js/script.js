(function () {
	chrome.storage.sync.get(function(setting) {
		$(document).ready(function() {
			addCss();
			changeAll();
		});
		$(document).on('DOMNodeInserted', function(e) {
			if(e.target.className == 'todos-all todos-view member-view' || e.target.className == 'todos-all todos-view list-view' || e.target.className == 'simple-filedrop') {
				changeAll();
			}
		});

		$('#todolists').on('DOMNodeInserted', function (e) {
			target = $(e.target);
			if(target.hasClass('todo')) {
				change(target.find('.content-linkable>.tag'));
			}
		});

		function changeAll() {
			$('.content-linkable>.tag').each(function (i, tag) {
				$tag = $(tag);
				change($tag);
			});
		}

		function addCss() {
			$('head').append("<style>.block-header .simple-checkbox, .block-header .todo-detail{display:none;}.block-header .todo-content{color:#333}</style>");
		}

		function change($tag) {
				console.log($tag);
				tagText = $tag.text();
				console.log(tagText);
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
						}
				}
		}

		function changeColor($tag, color) {
			$tag.removeClass('tag');
			$tag.css({
				'background': color,
				'color': '#fff',
				'padding': '0.1em 0.2em',
				'vertical-align': '1px',
				'font-size': '82%',
				'font-weight': 'normal',
				'border-radius': '2px'
			});
		}
	});
})();
