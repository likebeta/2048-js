var AppLayer = cc.LayerColor.extend({
    sprite: null,
    ctor: function (color, width, height) {
        //////////////////////////////
        // 1. super init first
        this._super(color, width, height);

        var sz = cc.director.getVisibleSize();

        var matrix_width = Math.min(sz.width, sz.height);
        var bm = new BlockManager(4, matrix_width, matrix_width);
        bm.setAnchorPoint(0, 0);
        var info = new InfoWrap(bm.getBlockGap(), matrix_width, Math.abs(sz.height - sz.width));
        info.setAnchorPoint(0, 0);
        if (sz.width > sz.height) {
            bm.setPosition(sz.width - sz.height, 0);
            info.setPosition(0, 0);
        }
        else {
            bm.setPosition(0, 0);
            info.setPosition(0, matrix_width);
        }
        this.addChild(bm, 1, 'block_manager');
        this.addChild(info, 1, 'info_wrap');

        // add keyboard listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                //console.log(cc.formatStr('key %d pressed', keyCode));
                var node = event.getCurrentTarget();
                var bm = node.getChildByName('block_manager');
                var result = false;
                switch (keyCode) {
                    case 37:
                        result = bm.handleAction('left');
                        break;
                    case 38:
                        result = bm.handleAction('up');
                        break;
                    case 39:
                        result = bm.handleAction('right');
                        break;
                    case 40:
                        result = bm.handleAction('down');
                        break;
                }
                if (result) {
                    info.incrScore(result);
                }
            }
        }, this);

        // add touch listener
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                var node = event.getCurrentTarget();
                node.begin_pt = touch.getLocation();
                return true;
            },
            onTouchEnded: function (touch, event) {
                var node = event.getCurrentTarget();
                var end_pt = touch.getLocation();
                var prev_pt = node.begin_pt;
                //console.log(cc.formatStr('touch: (%d, %d) -> (%d, %d)', prev_pt.x, prev_pt.y, end_pt.x, end_pt.y));
                var x_axis = end_pt.x - prev_pt.x;
                var y_axis = end_pt.y - prev_pt.y;
                var block_gap = node.getBlockGap();
                var result = false;
                if (Math.abs(x_axis) >= Math.abs(y_axis)) {
                    if (x_axis <= -block_gap) {
                        result = node.handleAction("left");
                    }
                    else if (x_axis >= block_gap) {
                        result = node.handleAction("right");
                    }
                }
                else {
                    if (y_axis <= -block_gap) {
                        result = node.handleAction("down");
                    }
                    else if (y_axis >= block_gap) {
                        result = node.handleAction("up");
                    }
                }
                if (result) {
                    info.incrScore(result);
                }
            }
        }, bm);
        return true;
    }
});

var AppScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new AppLayer(cc.color(250, 248, 239, 255));
        this.addChild(layer);
    }
});
