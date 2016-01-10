var AppLayer = cc.LayerColor.extend({
    sprite: null,
    ctor: function (color, width, height) {
        //////////////////////////////
        // 1. super init first
        this._super(color, width, height);

        var sz = cc.director.getVisibleSize();
        var matrix_width = Math.min(sz.width, sz.height);
        var bm = new BlockManager(4, matrix_width, matrix_width);
        bm.setAnchorPoint(cc.p(0, 0));
        if (sz.width > sz.height) {
            bm.setPosition(cc.p(sz.width - sz.height, 0));
        }
        else {
            bm.setPosition(0, 0);
        }
        this.addChild(bm, 1, 'block_manager');

        // add keyboard listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                //console.log(cc.formatStr('key %d pressed', keyCode));
                var node = event.getCurrentTarget();
                var bm = node.getChildByName('block_manager');
                switch (keyCode) {
                    case 37:
                        bm.handleAction('left');
                        break;
                    case 38:
                        bm.handleAction('up');
                        break;
                    case 39:
                        bm.handleAction('right');
                        break;
                    case 40:
                        bm.handleAction('down');
                        break;
                }
            }
        }, this);

        // add touch listener
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
                var now_pt = touch.getLocation();
                var prev_pt = touch.getStartLocation();
                //console.log(cc.formatStr('touch: (%d, %d) -> (%d, %d)', prev_pt.x, prev_pt.y, now_pt.x, now_pt.y));
                var x_axis = now_pt.x - prev_pt.x;
                var y_axis = now_pt.y - prev_pt.y;
                var node = event.getCurrentTarget();
                var bm = node.getChildByName('block_manager');
                var block_gap = bm.getBlockGap();
                if (Math.abs(x_axis) >= Math.abs(y_axis)) {
                    if (x_axis <= -block_gap) {
                        bm.handleAction("left");
                    }
                    else if (x_axis >= block_gap) {
                        bm.handleAction("right");
                    }
                }
                else {
                    if (y_axis <= -block_gap) {
                        bm.handleAction("down");
                    }
                    else if (y_axis >= block_gap) {
                        bm.handleAction("up");
                    }
                }
            }
        }, this);
        return true;
    }
});

var AppScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new AppLayer(cc.color(187, 170, 160, 255));
        this.addChild(layer);
    }
});
