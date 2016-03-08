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