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