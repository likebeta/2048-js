var BlockManager = cc.LayerColor.extend({
    sprite: null,
    ctor: function (block_number, width, height) {
        this.game_over = false;
        this.block_number = block_number;
        this.block_gap = 0;
        this.block_width = 0;
        this.is_animation = false;
        this.free_blocks = [];
        this._super(cc.color(187, 170, 160, 255), width, height);
        this.ignoreAnchorPointForPosition(false);
        this.initBlocks();
        return true;
    },
    initBlocks: function () {
        var sz = this.getContentSize();
        var matrix_width = sz.width;

        /*
         * block_width = 14*gap_width
         * margin_width = gap_width/2 + gap_width/2
         * matrix_width = block_width*block_number + gap_width*(block_number+1) + margin_width
         *              = gap_width*(15*block_number+2)
         */
        this.block_gap = matrix_width / (15 * this.block_number + 2);
        this.block_width = this.block_gap * 14;

        var block_gap = this.block_gap;
        var block_width = this.block_width;
        var block_number = this.block_number;

        for (var i = 0; i < block_number * block_number; ++i) {
            this.addFreeBlock(i);
        }

        var diff_x = block_gap / 2;
        var diff_y = block_gap / 2;

        var block1 = this.getFreeBlock();
        var block2 = this.getFreeBlock();

        for (var x = 0; x < block_number; ++x) {
            var _x = x * (block_gap + block_width) + block_gap + block_width / 2 + diff_x;
            for (var y = 0; y < block_number; ++y) {
                var tag = x + block_number * y;
                var value = (tag == block1 || tag == block2) ? 2 : 0;
                var b = new Block(value, block_width, block_width);
                var _y = y * (block_gap + block_width) + block_gap + block_width / 2 + diff_y;
                b.setPosition(_x, _y);
                this.addChild(b, 1, tag);
            }
        }
        return true;
    },
    rePlay: function () {
        if (this.is_animation) {
            console.log('is animation, rePlay failed');
            return false;
        }
        console.log('rePlay');
        this.game_over = false;
        this.is_animation = false;
        this.free_blocks = [];
        this.removeAllChildren(true);
        return this.initBlocks();
    },
    getFreeBlock: function () {
        var index = rand(10000) % this.free_blocks.length;
        var return_val = this.free_blocks[index];
        this.removeFreeBlockByIndex(index);
        return return_val;
    },
    randomNewBlock: function () {
        if (this.free_blocks.length == 0) {
            console.log('no free block exist, maybe win');
            return null;
        }
        var tag = this.getFreeBlock();
        var b = this.getChildByTag(tag);
        var tmp = b.clone();
        this.addChild(tmp, 99);
        var value = (rand(100) <= 10) ? 4 : 2;
        b.setFakeValue(value);
        tmp.setValue(value);
        tmp.setTag(100 + tag);
        tmp.setScale(0.2);
        this.is_animation = true;
        var zoom_in = new cc.ScaleTo(0.2, 1.0);
        var action_callback = new cc.CallFunc(this.animationEnd, this, [b, value]);
        var seq = new cc.Sequence(zoom_in, action_callback);
        tmp.runAction(seq);
        return b;
    },
    animationEnd: function (target, data) {
        var b = data[0];
        var value = data[1];
        target.removeFromParent(true);
        b.setValue(value);
        this.is_animation = false;
    },
    combineBlocks: function (blocks, t1, t2) {
        var v1 = blocks[t1].getValue();
        var v2 = blocks[t2].getValue();
        this.addFreeBlock(t1);
        this.removeFreeBlock(t2);
        blocks[t1].setValue(0);
        blocks[t2].setValue(v1 + v2);
        return v1 + v2;
    },
    addFreeBlock: function (tag) {
        this.free_blocks.push(tag);
    },
    removeFreeBlock: function (tag) {
        for (var i = 0; i < this.free_blocks.length; ++i) {
            if (this.free_blocks[i] == tag) {
                this.removeFreeBlockByIndex(i);
                break;
            }
        }
    },
    removeFreeBlockByIndex: function (index) {
        this.free_blocks[index] = this.free_blocks[0];
        this.free_blocks.shift();
    },
    setAnimation: function (ing) {
        this.is_animation = ing;
    },
    isAnimation: function () {
        return this.is_animation;
    },
    getBlockGap: function () {
        return this.block_gap;
    },
    handleAction: function (direction) {
        if (this.is_animation) {
            console.log('is animation ...');
            return false;
        }

        if (this.game_over == 'lose') {
            console.log('you lost, game over -_-!');
            return false;
        }
        else if (this.game_over == 'win') {
            console.log('you won, game over ^_^!');
            return false;
        }

        console.log(direction);

        var tmp_blocks = [];
        for (var i = 0; i < this.block_number * this.block_number; ++i) {
            var child = this.getChildByTag(i);
            tmp_blocks.push(child);
        }

        var result = false;
        switch (direction) {
            case 'left':
                result = this.moveLeft(tmp_blocks);
                break;
            case 'right':
                result = this.moveRight(tmp_blocks);
                break;
            case 'down':
                result = this.moveDown(tmp_blocks);
                break;
            case 'up':
                result = this.moveUp(tmp_blocks);
                break;
        }

        if (result.success) {   // vanish block this turn
            this.randomNewBlock();
            if (this.free_blocks.length == 0) {
                if (!this.moveLeft(tmp_blocks, true) && !this.moveRight(tmp_blocks, true)
                    && !this.moveUp(tmp_blocks, true) && !this.moveDown(tmp_blocks, true)) {
                    this.game_over = 'lose';
                    console.log('you lose, game over');
                }
            }
        }
        return result;
    },
    moveLeft: function (blocks, test) {
        //console.log('left');
        var success = false, score = 0;
        for (var y = 0; y < this.block_number; ++y) {
            var left = -1, tmp_tag = 0, tmp_value = 0;
            for (var x = 1; x < this.block_number; ++x) {
                var curr_tag = x + y * this.block_number;
                var curr_value = blocks[curr_tag].getValue();
                if (curr_value <= 0) {
                    continue;
                }
                var left_prev = left;
                for (var i = x - 1; i > left; --i) {
                    tmp_tag = i + y * this.block_number;
                    tmp_value = blocks[tmp_tag].getValue();
                    if (tmp_value <= 0) {
                    }
                    else if (tmp_value == curr_value) { // 合并
                        if (test) {
                            return true;
                        }
                        score += this.combineBlocks(blocks, curr_tag, tmp_tag);
                        left = i;
                        success += true;
                        break;
                    }
                    else {
                        if (i + 1 == x) { // 相邻未移动
                            left = i;
                            break;
                        }
                        else {
                            if (test) {
                                return true;
                            }

                            tmp_tag = i + 1 + y * this.block_number;
                            this.combineBlocks(blocks, curr_tag, tmp_tag);
                            left = i;
                            success = true;
                            break;
                        }
                    }
                }
                if (left == left_prev && left + 1 != x) {   // 未移动, 全部是free
                    if (test) {
                        return true;
                    }
                    tmp_tag = left + 1 + y * this.block_number;
                    this.combineBlocks(blocks, curr_tag, tmp_tag);
                    success = true;
                }
            }
        }
        return {success: success, score: score};
    },
    moveRight: function (blocks, test) {
        //console.log('right');
        var success = false, score = 0;
        for (var y = 0; y < this.block_number; ++y) {
            var right = this.block_number, tmp_tag = 0, tmp_value = 0;
            for (var x = this.block_number - 2; x >= 0; --x) {
                var curr_tag = x + y * this.block_number;
                var curr_value = blocks[curr_tag].getValue();
                if (curr_value <= 0) {
                    continue;
                }
                var right_prev = right;
                for (var i = x + 1; i < right; ++i) {
                    tmp_tag = i + y * this.block_number;
                    tmp_value = blocks[tmp_tag].getValue();
                    if (tmp_value <= 0) {
                    }
                    else if (tmp_value == curr_value) { // 合并
                        if (test) {
                            return true;
                        }
                        score += this.combineBlocks(blocks, curr_tag, tmp_tag);
                        right = i;
                        success = true;
                        break;
                    }
                    else {
                        if (i - 1 == x) { // 相邻未移动
                            right = i;
                            break;
                        }
                        else {
                            if (test) {
                                return true;
                            }

                            tmp_tag = i - 1 + y * this.block_number;
                            this.combineBlocks(blocks, curr_tag, tmp_tag);
                            right = i;
                            success = true;
                            break;
                        }
                    }
                }
                if (right == right_prev && right - 1 != x) {   // 未移动, 全部是free
                    if (test) {
                        return true;
                    }
                    tmp_tag = right - 1 + y * this.block_number;
                    this.combineBlocks(blocks, curr_tag, tmp_tag);
                    success = true;
                }
            }
        }
        return {success: success, score: score};
    },
    moveUp: function (blocks, test) {
        //console.log('up');
        var success = false, score = 0;
        for (var x = 0; x < this.block_number; ++x) {
            var up = this.block_number, tmp_tag = 0, tmp_value = 0;
            for (var y = this.block_number - 2; y >= 0; --y) {
                var curr_tag = x + y * this.block_number;
                var curr_value = blocks[curr_tag].getValue();
                if (curr_value <= 0) {
                    continue;
                }
                var up_prev = up;
                for (var i = y + 1; i < up; ++i) {
                    tmp_tag = x + i * this.block_number;
                    tmp_value = blocks[tmp_tag].getValue();
                    if (tmp_value <= 0) {
                    }
                    else if (tmp_value == curr_value) { // 合并
                        if (test) {
                            return true;
                        }
                        score += this.combineBlocks(blocks, curr_tag, tmp_tag);
                        up = i;
                        success = true;
                        break;
                    }
                    else {
                        if (i - 1 == y) { // 相邻未移动
                            up = i;
                            break;
                        }
                        else {
                            if (test) {
                                return true;
                            }

                            tmp_tag = x + (i - 1) * this.block_number;
                            this.combineBlocks(blocks, curr_tag, tmp_tag);
                            up = i;
                            success = true;
                            break;
                        }
                    }
                }
                if (up == up_prev && up - 1 != y) {   // 未移动, 全部是free
                    if (test) {
                        return true;
                    }
                    tmp_tag = x + (up - 1) * this.block_number;
                    this.combineBlocks(blocks, curr_tag, tmp_tag);
                    success = true;
                }
            }
        }
        return {success: success, score: score};
    },
    moveDown: function (blocks, test) {
        //console.log('down');
        var success = false, score = 0;
        for (var x = 0; x < this.block_number; ++x) {
            var down = -1, tmp_tag = 0, tmp_value = 0;
            for (var y = 1; y < this.block_number; ++y) {
                var curr_tag = x + y * this.block_number;
                var curr_value = blocks[curr_tag].getValue();
                if (curr_value <= 0) {
                    continue;
                }
                var down_prev = down;
                for (var i = y - 1; i > down; --i) {
                    tmp_tag = x + i * this.block_number;
                    tmp_value = blocks[tmp_tag].getValue();
                    if (tmp_value <= 0) {
                    }
                    else if (tmp_value == curr_value) { // 合并
                        if (test) {
                            return true;
                        }
                        score += this.combineBlocks(blocks, curr_tag, tmp_tag);
                        down = i;
                        success = true;
                        break;
                    }
                    else {
                        if (i + 1 == y) { // 相邻未移动
                            down = i;
                            break;
                        }
                        else {
                            if (test) {
                                return true;
                            }

                            tmp_tag = x + (i + 1) * this.block_number;
                            this.combineBlocks(blocks, curr_tag, tmp_tag);
                            down = i;
                            success = true;
                            break;
                        }
                    }
                }
                if (down == down_prev && down + 1 != y) {   // 未移动, 全部是free
                    if (test) {
                        return true;
                    }
                    tmp_tag = x + (down + 1) * this.block_number;
                    this.combineBlocks(blocks, curr_tag, tmp_tag);
                    success = true;
                }
            }
        }
        return {success: success, score: score};
    },
    snapshoot: function () {
        var board = [];
        for (var i = 0; i < this.block_number * this.block_number; ++i) {
            var b = this.getChildByTag(i);
            board.push(b.getValue());
        }
        return {
            board: board,
            game_over: this.game_over,
            number: this.block_number
        };
    },
    recover: function(info) {
        if (info.number != this.block_number) {
            console.log('block number not equal');
            return false;
        }
        if (info.board != undefined) {
            console.log(cc.formatStr('recover board to %s', info.board.toString()));
            this.free_blocks = [];
            for (var i = 0; i < info.board.length; ++i)
            {
                var b = this.getChildByTag(i);
                b.setValue(info.board[i]);
                if (info.board[i] == 0) {
                    this.free_blocks.push(i);
                }
            }
        }

        console.log(cc.formatStr('recover free block to %s', this.free_blocks.toString()));

        if (info.game_over != undefined) {
            this.game_over = Boolean(info.game_over);
            console.log(cc.formatStr('recover free block to %d', info.game_over));
        }
        return true;
    }
});