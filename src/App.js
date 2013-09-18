var App = Model({
  records: {
    list: [],
    lookup: {}
  },
  idCount: 0,
	init: function(form, results, menu) {
		this.form = form;
    this.form.addEventListener('submit', this.formSubmit);
    this.results = results;
    this.menu = menu;

    this.results.addEventListener('click', this.handleItemClick);

    //
    
    var anchor = document.getElementById('showAll');
    anchor.addEventListener('click', this.filter);

    anchor = document.getElementById('showActive');
    anchor.addEventListener('click', this.filter);

    anchor = document.getElementById('showCompleted');
    anchor.addEventListener('click', this.filter);

	},
  formSubmit: function(e) {
    e.preventDefault();
    var input = e.target.querySelector('input');
    if (input.value) {
      this.createItem(input.value);
      input.value = '';
    }
  },
  createItem: function(name) {
    this.getId();
    var item = new Item(this.idCount, name);
    this.records.list.push(item);
    this.records.lookup[this.idCount] = item;
    this.renderItem(item);
  },
  updateItem: function(id, attr, val) {
    this.records.lookup[id].update(attr, val);
    // call update method on model
    // model should trigger event 'updated'
    // view should listen for event and re-render itself
  },
  deleteItem: function() {},
  renderItem: function(item) {
    var view = new View(this.idCount, {
      name: item.name,
      state: item.state
    });
    item.on('update', view.render.bind(item));
    this.results.appendChild(view.render(item), this.menu);
  },
  getId: function() {
    this.idCount++;
  },
  handleItemClick: function(e) {
    var id = e.target.parentNode.parentNode.id,
        rel = e.target.rel;
    if (rel === 'done') {
      this.updateItem(id, 'done', !this.getItemById(id).done);
    }
  },
  filter: function(e) {
    e.preventDefault(); // temp
    if (e.target.rel) {
      this.results.innerHTML = '';
      this.refresh(e.target.rel);
    }
  },
  refresh: function(filter) {
    var i, max, rec, recs;
    if (filter === 'all') {
      recs = this.records.list;
    } else {
      if (filter === 'active') {
        recs = this.getItemsByAttribute('done', false);
      } else {
        recs = this.getItemsByAttribute('done', true);
      }
    }
    for (i = 0, max = recs.length; i < max; i++) {
      this.renderItem(recs[i]);
    }
  },
  getItemById: function(id) {
    return this.records.lookup[id];
  },
  getItemsByAttribute: function(attr, val) {
    var i, max, rec, recs = [];
    for (i = 0, max = this.records.list.length; i < max; i++) {
      rec = this.records.list[i];
      if (rec[attr] === val) {
        recs.push(rec);
      }
    }
    return recs;
  }
});