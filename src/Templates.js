var Templates = {
	task: '<table class="item"><tr><td class="detail left" rel="done">done</td><td class="detail middle {{? it.done}}done{{?}}">{{=it.name}}</td><td class="detail right" rel="remove">del</td></tr></table>',
	menuItem: '<a id="{{=it.id}}" class="menuItem {{? it.selected}}selected{{?}}" rel="{{=it.type}}" href="#">{{=it.name}}</a>',
	totalTasks: '<span>{{? it.total}}{{=it.total}} {{? it.total === 1}}item {{?? }}items {{?}} left{{?}}</span>'
};