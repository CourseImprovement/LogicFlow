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