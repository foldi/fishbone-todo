/**
 * @requires MenuItem
 * @extends {Controller}
 */
var MenuItemController = Controller.extend({
  create: function(props) {
    var inst = new MenuItem(++this.app.idCount, props);
    inst.on('update', this.updateView);
    inst.on('remove', this.removeView);
    this.app.records.list.push(inst);
    this.app.records.lookup[inst.id] = inst;
    this.trigger('createItem');
    return inst;
  },
  click: function(e) {
    var i, max, record, records = this.app.records,
        recs, id = this.getItemIdByDOMNode(e.target),
        rel = e.target.getAttribute('rel');

    // get all menu items and set selected = false
    for (i = records.list.length - 1; i >= 0; i--) {
      record = records.list[i];
      if (record instanceof MenuItem) {
        this.updateItem(record.id, 'selected', false);
      }
    }

    // set this selected = true
    this.updateItem(id, 'selected', true);

    // build a url and push it to the history
    e.preventDefault();
    var result, url = '#/show/' + e.target.rel;
    window.history.pushState(e.target.rel, 'ToDo', url);
    result = this.app.router.recognize(url);
    for (i = 0, max = result.length; i < max; i++) {
      result[i].handler.call(this, result[i].params.type);
    }
  }
});