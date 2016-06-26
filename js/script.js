(function () {
	chrome.storage.sync.get(function(setting) {
		$(document).ready(function() {change();});
		$(document).on('DOMNodeInserted', function(e) {
			if(e.target.className == 'todos-all todos-view member-view' || e.target.className == 'todos-all todos-view list-view' || e.target.className == 'simple-filedrop') {
				change();
			}
		});
		function change() {
			$('.tag').each(function (i, tag) {
				$tag = $(tag);
				tagText = $tag.text();
				switch (tagText) {
					case 'block-header':
						$todo = $tag.closest('.todo');
						$todo.css({
							'margin':'10px 0',
							'text-align':'center'
						});
						$wrap = $tag.closest('.todo-wrap');
						$wrap.children('.simple-checkbox').hide();
						$wrap.children('.todo-detail').hide();
						$wrap.children('.todo-content').css({ 'color':'#333333'});
						$tag.hide();
						break;
					default:
						if (setting[tagText]) {
							changeColor($tag, setting[tagText]);
						}
				}
			});
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
