"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
var search_json_1 = __importDefault(require("./config/search.json"));
var spu_json_1 = __importDefault(require("./config/spu.json"));
var series_json_1 = __importDefault(require("./config/series.json"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var dayjs_1 = __importDefault(require("dayjs"));
var alias = {
    '18443': 6432,
    '18569': 1179,
    '19026': 339906,
    '18075': 1535408
};
var Template = /** @class */ (function () {
    function Template() {
        var _this = this;
        this.sku = [];
        this.map = {};
        this.old = {};
        var old = this.getOldSKU();
        old.forEach(function (item) { return _this.old[item.id] = item; });
    }
    Template.prototype.process = function () {
        var _this = this;
        return this
            .getAllSKU()
            .then(function (sku) {
            var _a;
            (_a = _this.sku).push.apply(_a, sku);
            sku.forEach(function (item) { return _this.map[item.id] = item; });
            return sku;
        })
            .then(function (sku) {
            var dir = path.join(__dirname, '..', 'result');
            var date = (0, dayjs_1.default)().format('YYYY-MM-DD');
            var time = (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss');
            if (fs.existsSync(path.join(dir, date + '.json'))) {
                fs.writeFileSync(path.join(dir, time + '.json'), JSON.stringify(sku, null, 4), 'utf-8');
            }
            else {
                fs.writeFileSync(path.join(dir, date + '.json'), JSON.stringify(sku, null, 4), 'utf-8');
            }
        })
            .then(function () { return _this.render(); });
    };
    Template.prototype.getSearchResult = function (key) {
        var params = new URLSearchParams('client_id=180100031051&channel_id=&webp=1&query=Xiaomi+13&version=2&page_index=1&page_size=20&activity_id=&activity_type=');
        params.set('query', key.replace(/ /g, '+'));
        return fetch('https://m.mi.com/v1/hisearch/query_v3', {
            'headers': {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'content-type': 'application/x-www-form-urlencoded',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sentry-trace': '4d541bd796884b15b6c2b44256c84a85-be7fa8415af2f7ba-1',
                'x-requested-with': 'XMLHttpRequest',
                'x-user-agent': 'channel/mishop platform/mishop.m',
                'xmuuid': 'XMGUEST-90EC06F0-06C7-11EE-A486-912F957E2039',
                'cookie': 'mstuid=1672138670582_7472; xmuuid=XMGUEST-90EC06F0-06C7-11EE-A486-912F957E2039; xmUuid=XMGUEST-90EC06F0-06C7-11EE-A486-912F957E2039; _utm_data={"mtm":"","device_id":""}; deviceId=xmdevice_j7swgpc3w8dxnuan; Hm_lvt_c3e3e8b3ea48955284516b186acf0f4e=1686316447,1688698936; XM_agreement=0; Hm_lpvt_c3e3e8b3ea48955284516b186acf0f4e=1688698942; Hm_lvt_183aed755f0fd3efc9912dbf6550ec49=1686316499,1688698948; mishopDeviceId=BU8SOd0QlJazyCTB3KS1gGBt+fdau4SBUyIpGkUY82d0RuJCrOe/DvbkDez2UxCsEjgzU8lgxXUOmlPAjMq48cQ; lastsource=s1.mi.com; xm_vistor=1672138670582_7472_1688698941862-1688698953127; mstz=||2100808401.40||https%253A%252F%252Fs1.mi.com%252F|https%25253A%25252F%25252Fs1.mi.com%25252F; Hm_lpvt_183aed755f0fd3efc9912dbf6550ec49=1688698954; pageid=13c7dea5c88bfe74',
                'Referer': 'https://m.mi.com/search',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            'body': params.toString(),
            'method': 'POST'
        }).then(function (res) { return res.json(); })
            .then(function (data) { return data.data.list_v2.map(function (item) { return ({
            id: item.body.product_id,
            name: item.body.name,
            price: item.body.price,
            count: item.body.comments_total
        }); }); });
    };
    Template.prototype.getAllSKU = function () {
        var _this = this;
        return Promise
            .all(search_json_1.default.map(function (config) {
            return _this.getSearchResult(config.key)
                .then(function (list) {
                return list.filter(function (item) { return config.ids.includes(String(item.id)); });
            });
        }))
            .then(function (data) { return data.flat(1); });
    };
    Template.prototype.getOldSKU = function () {
        var dir = path.join(__dirname, '..', 'result');
        var date = (0, dayjs_1.default)().add(-1, 'd').format('YYYY-MM-DD');
        if (fs.existsSync(path.join(dir, date + '.json'))) {
            return JSON.parse(fs.readFileSync(path.join(dir, date + '.json'), 'utf-8'));
        }
        else {
            return this.sku.map(function (item) { return (__assign(__assign({}, item), { count: 0 })); });
        }
    };
    Template.prototype.getAllSPU = function (sku) {
        var map = {};
        sku.map(function (item) { return map[item.id] = item; });
        return spu_json_1.default.map(function (item) { return ({
            name: item.key,
            count: item.ids.map(function (id) { return alias[id] || map[id].count; }).reduce(function (a, b) { return a + b; })
        }); });
    };
    Template.prototype.getCount = function (config) {
        var _this = this;
        return config.ids.map(function (id) {
            try {
                return alias[id] || _this.map[id].count;
            }
            catch (e) {
                console.log(id);
                throw e;
            }
        }).reduce(function (a, b) { return a + b; });
    };
    Template.prototype.getOldCount = function (config) {
        var _this = this;
        return config.ids.map(function (id) { var _a; return ((_a = _this.old[id]) === null || _a === void 0 ? void 0 : _a.count) || alias[id] || 0; }).reduce(function (a, b) { return a + b; });
    };
    Template.prototype.getSPUTemplateInfo = function (idx, config) {
        return "<p>\uFF08".concat(idx, "\uFF09").concat(config.key, " ").concat(this.getCount(config), "</p>");
    };
    Template.prototype.getSeriesTemplateInfo = function (config) {
        var oldDate = (0, dayjs_1.default)(config.date, 'YYYY-MM-DD');
        var date = (0, dayjs_1.default)().add(-16, 'd');
        var d = date.diff(oldDate, 'd') + 1;
        var c = this.getCount(config);
        var oc = this.getOldCount(config);
        var dc = c - oc;
        if (d < 0) {
            return '<p>产品暂未发售</p>';
        }
        return "<p>\u4ECA\u5929\u662F".concat(config.key, "\u786E\u8BA4\u6536\u8D27\u7684\u7B2C ").concat(d, " \u5929\uFF08\u8D2D\u4E70\u65E5\u671F\u5927\u6982").concat(date.format('YYYY/MM/DD'), " \u9644\u8FD1\uFF0C\u7ECF\u8FC7\u6821\u5BF9\u6570\u636E\u670916\u5929\u5EF6\u65F6\uFF09\uFF0C\u5728\u5C0F\u7C73\u5546\u57CE\u8BC4\u8BBA\u603B\u6570\uFF1A<b>").concat(c, "</b>\uFF0C\u65E5\u65B0\u589E <b>").concat(dc, "</b></p>");
    };
    Template.prototype.render = function () {
        var _this = this;
        var html = [
            "<h1>\u5C0F\u7C73 2023\u5E74\u4E3B\u6D41\u673A\u578B\u9500\u91CF\u8DDF\u8E2A".concat((0, dayjs_1.default)().format('YYYY/MM/DD'), "</h1>")
        ];
        html.push('<h2>一、小米 14 系列</h2>');
        html.push('<p> </p>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[9]));
        html.push('<p></p>');
        html.push("<p>\u5C0F\u7C7313\u7CFB\u5217\u603B\u9500\u91CF\u4E3A <b>".concat(this.getCount(series_json_1.default[2]), "</b></p>"));
        html.push('<h2>二、红米 K70 系列(不包括K70E)</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[10]));
        html.push('<p></p>');
        html.push("<p>\u7EA2\u7C73 K60 \u7CFB\u5217 <b>".concat(this.getCount(series_json_1.default[7]), "</b></p>"));
        html.push('<h2>三、Xiaomi MIX Flip</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[12]));
        html.push('<h2>四、Note 13系列</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[8]));
        html.push('<p>--作为参考，Note 12 Pro系列销量135万，基础版85万，总计206万。</p>');
        html.push('<h2>五、Note Turbo系列</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[13]));
        html.push("<p>--\u4F5C\u4E3A\u53C2\u8003\uFF0C\u4E0A\u4EE3\u7CFB\u5217\u9500\u91CF<b>".concat(this.getCount(series_json_1.default[4]), "</b>\u3002</p>"));
        html.push('<h2>五、单品数据</h2>');
        spu_json_1.default.forEach(function (item, idx) { return html.push(_this.getSPUTemplateInfo(idx + 1, item)); });
        html.push('<p>🔥最后：数据整理不易，如果您觉得有价值，帮忙点个关注呗⭐️⭐️⭐️</p>');
        return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>\u76D1\u63A7</title></head><body>".concat(html.join('\n'), "</body></html>");
    };
    return Template;
}());
exports.Template = Template;
var t = new Template();
t.process().then(function (html) {
    var dir = path.join(__dirname, '..', 'template');
    var date = (0, dayjs_1.default)().format('YYYY-MM-DD');
    var time = (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss');
    if (fs.existsSync(path.join(dir, date + '.html'))) {
        fs.writeFileSync(path.join(dir, time + '.html'), html, 'utf-8');
    }
    else {
        fs.writeFileSync(path.join(dir, date + '.html'), html, 'utf-8');
    }
});
