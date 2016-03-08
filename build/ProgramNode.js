var _nodes = [
    {
        title: 'Add',
        namespace: 'Math',
        in: {
            value1: 'String|Number',
            value2: 'String|Number'
        },
        out: {
            result: 'String|Number'
        }
    },
    {
        title: 'Subtract',
        namespace: 'Math',
        in: {
            value1: 'String|Number',
            value2: 'String|Number'
        },
        out: {
            result: 'String|Number'
        }
    },
    {
        title: 'Concatenate',
        namespace: 'String',
        in: {
            value1: 'String',
            value2: 'String'
        },
        out: {
            result: 'String'
        }
    },
    {
        title: 'Console',
        namespace: 'Output',
        in: {
            value: 'String|Number'
        }
    }
];

/**
 * @namespace Math
 * @name Add
 * @arg {
 *      name: 'A',
 *      type: 'Number'
 * }
 * @arg B Number
 * @return Number
 * @description 
 * @call Add
 */
function Add(a, b){

}

function Menu(){
    this.ele;
    this.render();
    this.opened = false;
}

Menu.prototype.render = function(){
    var html = '<div class="search"><input type="text" class="q">';
    html += '<div class="suggestions"></div>';
    html += '</div>';
    this.ele = $(html)[0];
    $('body').append(this.ele);
    var _this = this;
    $('.q').keyup(function(e){
        var q = this.value;
        if (q && typeof q == 'string') _this.search(q);
    });
    $('.q').keydown(function(e){
        if (e.keyCode == 13){
            $('.search .suggestion').first().click();
        } 
    });
}

Menu.prototype.search = function(q){
    q = q.toLowerCase();
    var result = [];
    for (var i = 0; i < _nodes.length; i++){
        if (_nodes[i].title && _nodes[i].title.toLowerCase().indexOf(q) > -1) result.push(_nodes[i]);
        else if (_nodes[i].namespace && _nodes[i].namespace.toLowerCase().indexOf(q) > -1) result.push(_nodes[i]);
    }
    $(this.ele).find('.suggestions').html('');
    for (var i = 0; i < result.length; i++){
        $(this.ele).find('.suggestions').append('<div class="suggestion" id="tmp">' + result[i].namespace + ': ' + result[i].title + '</div>');
        $(this.ele).find('#tmp').removeAttr('id').prop('node', result[i]);
    }
    
    $(this.ele).find('.suggestion').click(function(){
        nodes.push(new Node(this.node)); 
    });
}

Menu.prototype.open = function(){
    var _this = this;
    setTimeout(function(){
        $(_this.ele).find('.q').val('');
        $(_this.ele).show();
        $(_this.ele).find('.q').focus();
    }, 100);
    this.opened = true;
}

Menu.prototype.close = function(){
    $(this.ele).hide();
    this.opened = false;
    $(this.ele).find('.suggestions').html('');
}

var menu = new Menu();
function ConnectionPoint(isIn, name, dataTypes, node){
    this.type = isIn ? 'in' : 'out';
    this.name = name;
    this.dataTypes = dataTypes;
    this.from = node;
    this.to;
    this.connection;
}

ConnectionPoint.prototype.toHtml = function(){
    if (this.type == 'out') return $('<div class="node-output out prop">' + this.name + '<div class="connector out"></div></div>')[0];
    if (this.dataTypes.indexOf('String') > -1){
        return '<div class="prop"><div class="connector in"></div><input type="text" class="node-input out" placeholder="' + this.name + '"></div>';
    }
}

ConnectionPoint.prototype.render = function(){
    this.ele = this.toHtml();
    $(this.from.ele).find('.connector-area').append(this.ele);
}

ConnectionPoint.prototype.destroy = function(){
    $(this.ele).remove();
}
function Node(options){
    this.title = !options.title ? 'Untitled' : options.title;
    this.namespace = !options.namespace ? 'Unknown' : options.namespace;
    this.isActive = false;
    this.isMovable = true;
    this.x = !options.x ? 100 : options.x;
    this.y = !options.y ? 100 : options.y;
    this.in = options.in;
    this.out = options.out ? options.out : {};
    this.connectionPoints = [];
    
    this.ele = this.toHtml();
    this.ele.node = this;
    this.render();
}

Node.prototype.toHtml = function(){
    var html = '<div class="node">';
    html += '<div class="head">' + this.namespace + ': ' + this.title + '</div><div class="connector-area">';
    
    var keys = Object.keys(this.out);
    for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        var dataType = this.out[key];
        this.connectionPoints.push(new ConnectionPoint(false, key, dataType, this));
    }
    
    var keys = Object.keys(this.in);
    for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        var dataType = this.in[key];
        this.connectionPoints.push(new ConnectionPoint(true, key, dataType, this));
    }
    
    html += '</div></div>';
    return $(html)[0];
}

Node.prototype.render = function(){
    for (var i = 0; i < this.connectionPoints.length; i++){
        this.connectionPoints[i].render();
    }
    var _this = this;
    $(this.ele).css({left: this.x + 'px', top: this.y + 'px', width: '150px'});
    $(this.ele).draggable({
        start: function(){
            if (!_this.isMovable) return false;
        },
        drag: function(e){
            $('.node.active').removeClass('active');
            _this.x = e.clientX;
            _this.y = e.clientY;
            $(this).addClass('active');
        }
    });
    $(this.ele).click(function(e){
        if (!e.shiftKey && !e.ctrlKey) $('.node.active').removeClass('active');
        if (!$(this).hasClass('active')) $(this).addClass('active');
    });
    $('.content').append(this.ele);
}

Node.prototype.destroy = function(){
    var idx = nodes.indexOf(this);
    $(this.ele).remove();
    for (var i = 0; i < this.connectionPoints.length; i++){
        this.connectionPoints[i].destroy();
    }
    nodes.splice(idx, 1);
}

Node.prototype.grabMoveTo = function(x, y){
    this.x += (x - Node.startX);
    this.y += (y - Node.startY);
    $(this.ele).css({left: this.x + 'px', top: this.y + 'px'});
}

Node.prototype.clone = function(){
    var n = new Node({
        x: this.x,
        y: this.y,
        title: this.title,
        namespace: this.namespace,
        in: this.in,
        out: this.out
    });
    nodes.push(n);
}

Node.removeActive = function(){
    var eles = $('.node.active');
    if (eles.length == 0) return;
    for (var i = 0; i < eles.length; i++){
        var node = eles[i].node;
        node.destroy();
    }
}

Node.isMoving = false;
Node.startX = undefined;
Node.startY = undefined;

Node.clearMoving = function(){
    Node.isMoving = false;
    Node.startX = undefined;
    Node.startY = undefined;
}

Node.moveSelected = function(a){
    var eles = $('.node.active');
    if (eles.length == 0) return;
    if (Node.isMoving) {
        Node.clearMoving();
        return;
    }
    Node.isMoving = true;
    $(window).bind('mousemove', function(e){
        if (!Node.startX) Node.startX = e.clientX;
        if (!Node.startY) Node.startY = e.clientY;
        for (var i = 0; i < eles.length; i++){
            var node = eles[i].node;
            node.grabMoveTo(e.clientX, e.clientY);
        }
        Node.startY = e.clientY;
        Node.startX = e.clientX;
    });
    $('body').bind('click', function(){
        $(window).unbind('mousemove');
        $('body').unbind('click');
        Node.clearMoving();
    });
}

Node.duplicatedSelected = function(){
    var eles = $('.node.active');
    if (eles.length == 0) return;
    for (var i = 0; i < eles.length; i++){
        eles[i].node.clone();
    }
}

var nodes = [];
function Shortcut(keys, func){
    this.func = func;
    this.keys = keys;
    this.parseKeys();
}

Shortcut.prototype.parseKeys = function(){
    this.shift = this.keys.indexOf('shift+') > -1;
    this.ctrl = this.keys.indexOf('ctrl+') > -1;
    this.key = this.keys.split('+')[1].toUpperCase().charCodeAt(0);
}

var shortcuts = [
    new Shortcut('shift+a', function(e){menu.open();}),
    new Shortcut('shift+x', function(e){Node.removeActive();}),
    new Shortcut('shift+g', function(e){Node.moveSelected(e);}),
    new Shortcut('shift+d', function(e){Node.duplicatedSelected();})
];

$(window).on('keydown', function(e){
    if (e.target.nodeName == 'INPUT') return;
    if (e.keyCode == 27){
        menu.close();
    }
    else{
        for (var i = 0; i < shortcuts.length; i++){
            var sc = shortcuts[i];
            if (e.shiftKey != sc.shift) continue;
            if (e.ctrlKey != sc.ctrl) continue;
            if (e.keyCode == sc.key){
                sc.func(e);
            }
        }
    }
});

$(window).click(function(){
    menu.close();
});