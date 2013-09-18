var Templates = {
	total: '<div id="totalView" class="view">{{? it.total}}{{=it.total}} {{? it.total === 1}}item {{?? }}items {{?}} left{{?}}</div>',
	item: '<table class="item"><tr><td class="detail left" rel="done">done</td><td class="detail middle {{? it.done}}done{{?}}">{{=it.name}}</td><td class="detail right" rel="delete">del</td></tr></table>'
};