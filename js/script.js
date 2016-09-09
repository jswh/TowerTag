(function () {
	$(document).ready(function () {
		addCss();
		var changing = false;
		$(document).on('DOMNodeInserted', function(e) {
			chrome.storage.sync.get(function(setting) {
			if(e.target.className == 'simple-checkbox' && !changing) {
				changing = true;
				setTimeout(function (){
					changeAll(setting);
					setTimeout(function () {
						changing = false;
					}, 1000);
				}, 150);
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
		
        $('.kanban-todos').on('DOMNodeInserted', function (e) {
			chrome.storage.sync.get(function(setting) {
				target = $(e.target);
				if(target.hasClass('todo')) {
					change(target.find('.assignee'), setting);
				}
			});
        });
		chrome.storage.onChanged.addListener(function (changed) {
			for (var i in changed) {
				if (changed[i].newValue === 'deleting') {
					chrome.storage.sync.remove(i);
					revert(i);
				} else if (changed[i].newValue !== 'adding') {
					chrome.storage.sync.get(changeAll);
				}
			}
		});

		chrome.storage.sync.get(function(setting) {
			changeAll(setting);
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
        $('.assignee').each(function (i, tag) {
            $tag = $(tag);
            change($tag, setting);
        });
	}

	function revert(tagName) {
		$('.content-linkable>.changed-tag').each(function (i, tag) {
			$tag = $(tag);
			if ($tag.text() == tagName) {
				revertColor($tag);
			}
		});
	}

	function addCss() {
		$('head').append("<style>.block-header .simple-checkbox, .block-header .todo-detail{display:none;}.block-header .todo-content{color:#333}</style>");
	}
	
	function change($tag, setting) {
			tagText = $tag.text().replace(/^\s+|\s+$/g, '');
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
                        $assign = $tag.closest('.todo-assign-due');
                        if ($assign.length > 0) {
                            changeColor($assign, setting[tagText], false);
                        } else {
                            changeColor($tag, setting[tagText], true);
                        }
					}
			}
	}

	function changeColor($tag, color, isTag) {
		$tag.removeClass('tag');
		$tag.addClass('changed-tag');
        if (isTag) {
            $tag.css({
                'background': color.bg,
                'color': color.ft,
                'padding': '0.1em 0.2em',
                'vertical-align': '1px',
                'font-size': '82%',
                'font-weight': 'normal',
                'border-radius': '2px'
            });
        } else {
            $tag.css({
                'background': color.bg,
                'color': color.ft,
            });
        }
	}

	function revertColor($tag) {
		$tag.css({});
		$tag.addClass('tag');
		$tag.removeClass('changed-tag');
	}

})();
function test() {console.log(123);}
