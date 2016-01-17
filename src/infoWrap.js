var InfoWrap = cc.LayerColor.extend({
    sprite: null,
    ctor: function (margin, width, height) {
        this.margin = margin;
        this._super(cc.color(255, 0, 0, 0), width, height);
        this.ignoreAnchorPointForPosition(false);
        this.initInfo();
        return true;
    },
    initInfo: function () {
        var sz = this.getContentSize();
        var width = (sz.width - this.margin * 3 - 30) / 2.0;
        var name = new cc.LayerColor(cc.color(0, 255, 0, 0), width, sz.height);
        name.setAnchorPoint(0, 0);
        name.setPosition(0, 0);
        var label = cc.LabelTTF.create('2048', '', 100, cc.size(0, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        var name_sz = label.getContentSize();
        label.setPosition(width / 2.0, sz.height / 2.0 + 20);
        label.setColor(cc.color(119, 110, 100));
        name.addChild(label, 1, 'label');
        this.addChild(name, 1, 'name');

        var high_score = new ScoreWrap('HIGH SCORE', 0, width / 2.0 - 5, name_sz.height);
        high_score.setAnchorPoint(0.5, 0.5);
        high_score.setPosition(sz.width - width * 0.25, sz.height / 2.0 + 20);
        this.addChild(high_score, 1, 'high_score');
        var score = new ScoreWrap('SCORE', 0, width / 2.0 - 5, name_sz.height);
        score.setAnchorPoint(0.5, 0.5);
        score.setPosition(sz.width - width * 0.75 - 5, sz.height / 2.0 + 20);
        this.addChild(score, 1, 'score');

        var item = new cc.MenuItemFont('NEW GAME', this.onNewGame, this);
        item.setFontSize(20);
        item.setColor(cc.color(69, 60, 50, 255));
        var menu_size = item.getContentSize();
        var menu = new cc.Menu(item);
        menu.setPosition(sz.width - menu_size.width / 2.0 - 20, 30 + menu_size.height / 2.0);
        this.addChild(menu, 1, 'new_game');
        return true;
    },
    setAppName: function(name) {
        var _name = this.getChildByName('name');
        var label = _name.getChildByName('label');
        label.setString(name);
    },
    setScore: function (score) {
        var _score = this.getChildByName('score');
        return _score.setScore(score);
    },
    setHighScore: function (score) {
        var _score = this.getChildByName('high_score');
        return _score.setScore(score);
    },
    incrScore: function (score) {
        var _score = this.getChildByName('score');
        score = _score.incrScore(score);
        var high_score = this.getHighScore();
        if (score > high_score) {
            this.setHighScore(score);
        }
        return score;
    },
    getScore: function () {
        var _score = this.getChildByName('score');
        return _score.getScore();
    },
    getHighScore: function () {
        var _score = this.getChildByName('high_score');
        return _score.getScore();
    },
    onNewGame: function (sender) {
        var parent = this.getParent();
        parent.rePlay();
    },
    snapshoot: function() {
        return {
            high_score: this.getHighScore(),
            score: this.getScore()
        };
    },
    recover: function(info) {
        if (info.high_score) {
            console.log(cc.formatStr('recover high score to', info.high_score));
            this.setHighScore(info.high_score);
        }
        if (info.score) {
            console.log(cc.formatStr('recover score to', info.score));
            this.setScore(info.score);
        }
        return true;
    }
});

var ScoreWrap = cc.LayerColor.extend({
    sprite: null,
    ctor: function (title, score, width, height) {
        this.title = title;
        this.score = score;
        this._super(cc.color(187, 170, 160, 255), width, height);
        this.ignoreAnchorPointForPosition(false);
        this.initInfo();
        return true;
    },
    initInfo: function () {
        var sz = this.getContentSize();
        var title = cc.LabelTTF.create(this.title, '', 15, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        title.setColor(cc.color(215, 206, 197));
        title.setAnchorPoint(0.5, 0.5);
        var title_sz = title.getContentSize();
        title.setPosition(sz.width / 2.0, sz.height - 30 - title_sz.height / 2.0);
        this.addChild(title, 1, 'title');
        var score = cc.LabelTTF.create(this.score.toString(), '', 15, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        score.setColor(cc.color(250, 247, 243));
        score.setAnchorPoint(0.5, 0.5);
        var score_sz = title.getContentSize();
        score.setPosition(sz.width / 2.0, 30 + score_sz.height / 2.0);
        this.addChild(score, 1, 'score');
        return true;
    },
    setScore: function (score) {
        this.score = score;
        var _score = this.getChildByName('score');
        _score.setString(this.score);
        return this.score;
    },
    incrScore: function (incr) {
        this.score = this.score + incr;
        var _score = this.getChildByName('score');
        _score.setString(this.score);
        return this.score;
    },
    getScore: function () {
        return this.score;
    }
});
