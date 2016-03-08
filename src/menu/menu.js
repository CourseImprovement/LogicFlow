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