var View = Model({
	init: function(id) {
    this.el = document.createElement('div');
    this.el.id = id;
    this.el.className = 'item';
	},
  render: function(data) {

    var table = document.createElement('table');
    var tr = document.createElement('tr');
    var tdLeft = document.createElement('td');
    tdLeft.className = 'detail left';
    tdLeft.rel = 'done';
    var tdMid = document.createElement('td');
    tdMid.className = data.done === true ? 'detail middle done' : 'detail middle';
    var tdRight = document.createElement('td');
    tdRight.className = 'detail right';
    tdRight.rel = 'delete';
    tr.appendChild(tdLeft);
    tr.appendChild(tdMid);
    tr.appendChild(tdRight);
    table.appendChild(tr);

    this.el.innerHTML = '';
    this.el.appendChild(tr);
    this.el.querySelector('.left').textContent = 'done';
    this.el.querySelector('.middle').textContent = data.name;
    this.el.querySelector('.right').textContent = 'del';
    return this.el;
  }
});