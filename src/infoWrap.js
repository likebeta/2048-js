var InfoWrap = cc.LayerColor.extend({
    sprite: null,
    ctor: function (margin, width, height) {
        this.margin = margin;
        this._super(cc.color(0, 0, 0, 0), width, height);
        this.ignoreAnchorPointForPosition(false);
        this.initInfo();
        return true;
    },
    initInfo: function () {
        var sz = this.getContentSize();
        var width = (sz.width - this.margin * 3 - 30) / 2.0;
        var name = new cc.LayerColor(cc.color(0, 0, 0, 0), width, sz.height);
        name.setAnchorPoint(0, 0);
        name.setPosition(this.margin * 1.5, 0);
        var label = cc.LabelTTF.create('2048', '', 100, cc.size(0, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        var name_sz = label.getContentSize();
        label.setPosition(width / 2.0, sz.height / 2.0);
        label.setColor(cc.color(119, 110, 100));
        name.addChild(label);
        this.addChild(name);

        var high_score = new ScoreWrap('HIGH SCORE', 0, width / 2.0 - 5, name_sz.height);
        high_score.setAnchorPoint(0.5, 0.5);
        high_score.setPosition(sz.width - this.margin * 1.5 - width * 0.25, sz.height / 2.0);
        this.addChild(high_score, 1, 'high_score');
        var score = new ScoreWrap('SCORE', 0, width / 2.0 - 5, name_sz.height);
        score.setAnchorPoint(0.5, 0.5);
        score.setPosition(sz.width - this.margin * 1.5 - width * 0.75 - 5, sz.height / 2.0);
        this.addChild(score, 1, 'score');
        return true;
    },
    setScore: function(score) {
        var _score = this.getChildByName('score');
        return _score.setScore(score);
    },
    setHighScore: function(score) {
        var _score = this.getChildByName('high_score');
        return _score.setScore(score);
    },
    incrScore: function(score) {
        var _score = this.getChildByName('score');
        score = _score.incrScore(score);
        var high_score = this.getHighScore();
        if (score > high_score) {
            this.setHighScore(score);
        }
        return score;
    },
    getScore: function() {
        var _score = this.getChildByName('score');
        return _score.getScore();
    },
    getHighScore: function() {
        var _score = this.getChildByName('high_score');
        return _score.getScore();
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
    setScore: function(score) {
        this.score = score;
        var _score = this.getChildByName('score');
        _score.setString(this.score);
        return this.score;
    },
    incrScore: function(incr) {
        this.score = this.score + incr;
        var _score = this.getChildByName('score');
        _score.setString(this.score);
        return this.score;
    },
    getScore: function() {
        return this.score;
    }
});
