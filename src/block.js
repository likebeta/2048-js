var Block = cc.LayerColor.extend({
    sprite: null,
    ctor: function (value, width, height) {
        this.value = value;
        this.fake_value = value;
        var bk_color = this.getBkColorByValue(value);
        this._super(bk_color, width, height);
        this.ignoreAnchorPointForPosition(false);
        var text = value > 0 ? value : '';
        var font_size = this.getFontSizeByValue(value);
        var label = cc.LabelTTF.create(text, '', font_size, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        var text_color = this.getTextColorByValue(value);
        label.setColor(text_color);
        label.setPosition(width / 2, height / 2);
        this.addChild(label, 1, 'label');
        return true;
    },
    getBkColorByValue: function (value) {
        var color_map = {
            2: cc.color(0xee, 0xe4, 0xda, 0xFF),
            4: cc.color(0xed, 0xe0, 0xc8, 0xFF),
            8: cc.color(0xf2, 0xb1, 0x79, 0xFF),
            16: cc.color(0xf5, 0x95, 0x63, 0xFF),
            32: cc.color(0xf6, 0x7c, 0x5f, 0xFF),
            64: cc.color(0xf6, 0x5e, 0x3b, 0xFF),
            128: cc.color(0xed, 0xcf, 0x72, 0xFF),
            256: cc.color(0xed, 0xcc, 0x61, 0xFF),
            512: cc.color(0xed, 0xc8, 0x50, 0xFF),
            1024: cc.color(0xed, 0xc5, 0x3f, 0xFF),
            2048: cc.color(0xed, 0xc2, 0x2e, 0xFF)
        };
        return color_map[value] || cc.color(0xee, 0xe4, 0xda, 100);
    },
    getTextColorByValue: function (value) {
        var color_map = {
            2: cc.color(0x77, 0x6e, 0x65, 0xFF),
            4: cc.color(0x77, 0x6e, 0x65, 0xFF),
            8: cc.color(0x77, 0x6e, 0x65, 0xFF),
            16: cc.color(0x77, 0x6e, 0x65, 0xFF),
            32: cc.color(0x77, 0x6e, 0x65, 0xFF),
            64: cc.color(0x77, 0x6e, 0x65, 0xFF),
            128: cc.color(0x77, 0x6e, 0x65, 0xFF),
            256: cc.color(0x77, 0x6e, 0x65, 0xFF),
            512: cc.color(0x77, 0x6e, 0x65, 0xFF),
            1024: cc.color(0x77, 0x6e, 0x65, 0xFF),
            2048: cc.color(0x77, 0x6e, 0x65, 0xFF)
        };
        return color_map[value] || cc.color(0x77, 0x6e, 0x65, 100);
    },
    getFontSizeByValue: function (value) {
        return 50;
    },
    setValue: function (value) {
        if (value != this.value) {
            this.value = value;
            this.fake_value = value;
            var bk_color = this.getBkColorByValue(value);
            this.setColor(bk_color);
            this.setOpacity(bk_color.a);
            var child = this.getChildByName('label');
            if (value > 0) {
                child.setString(value);
                var text_color = this.getTextColorByValue(value);
                child.setColor(text_color);
            }
            else {
                child.setString('');
            }
        }
    },
    setFakeValue: function (value) {
        this.fake_value = value;
    },
    clone: function() {
        var b = new Block(this.value, this.width, this.height);
        var pos = this.getPosition();
        b.setPosition(pos);
        return b;
    },
    getValue: function() {
        return this.fake_value;
    },
    getFakeValue: function() {
        return this.fake_value;
    }
});