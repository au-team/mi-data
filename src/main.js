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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    '18075': 1535408,
    '17971': 1621871,
    '19185': 505158,
    '18268': 1265875
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
            .getAllSKUFromCache()
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
        }).then(function (res) { return res.json(); }).then(function (data) { return data.data.list_v2.map(function (item) { return ({
            id: item.body.product_id,
            name: item.body.name,
            price: item.body.price,
            count: item.body.comments_total
        }); }); }).catch(function (e) {
            console.log(key);
            debugger;
        });
    };
    Template.prototype.getAllSKUFromCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sku, dir, date, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllSKU()];
                    case 1:
                        sku = _a.sent();
                        dir = path.join(__dirname, '..', 'result');
                        date = (0, dayjs_1.default)().format('YYYY-MM-DD');
                        files = fs.readdirSync(dir).filter(function (item) { return item.startsWith(date); });
                        files.forEach(function (file) {
                            var p = path.join(dir, file);
                            var content = fs.readFileSync(p, 'utf-8');
                            var json = JSON.parse(content);
                            json.forEach(function (item) {
                                var idx = sku.findIndex(function (s) { return s.id === item.id; });
                                if (idx === -1) {
                                    sku.push(item);
                                }
                            });
                        });
                        return [2 /*return*/, sku];
                }
            });
        });
    };
    Template.prototype.getAllSKU = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, _loop_1, this_1, _i, search_1, config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        _loop_1 = function (config) {
                            var list;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this_1.getSearchResult(config.key)];
                                    case 1:
                                        list = _b.sent();
                                        data.push.apply(data, list.filter(function (item) { return config.ids.includes(String(item.id)); }));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, search_1 = search_json_1.default;
                        _a.label = 1;
                    case 1:
                        if (!(_i < search_1.length)) return [3 /*break*/, 4];
                        config = search_1[_i];
                        return [5 /*yield**/, _loop_1(config)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, data];
                }
            });
        });
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
            "<h1>\u5C0F\u7C73".concat((0, dayjs_1.default)().format('YYYY'), "\u5E74\u4E3B\u6D41\u673A\u578B\u9500\u91CF\u8DDF\u8E2A").concat((0, dayjs_1.default)().format('YYYY/MM/DD'), "</h1>")
        ];
        html.push('<h2>一、小米 15 系列</h2>');
        html.push('<p> </p>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[16]));
        html.push('<p></p>');
        html.push("<p>\u5C0F\u7C7314\u7CFB\u5217\u603B\u9500\u91CF\u4E3A <b>".concat(this.getCount(series_json_1.default[9]), "</b>, \u5C0F\u7C7313\u7CFB\u5217\u603B\u9500\u91CF\u4E3A <b>").concat(this.getCount(series_json_1.default[2]), "</b></p>"));
        html.push('<h2>二、红米 K80 系列</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[17]));
        html.push('<p></p>');
        html.push("<p>\u7EA2\u7C73 K70 \u7CFB\u5217 <b>".concat(this.getCount(series_json_1.default[10]), "</b>\uFF0C \u7EA2\u7C73 K60 \u7CFB\u5217 <b>2124040</b></p>"));
        html.push('<h2>三、Xiaomi MIX Flip</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[13]));
        html.push('<h2>四、Note 14系列</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[14]));
        html.push("<p>--\u4F5C\u4E3A\u53C2\u8003\uFF0CNote 13 Pro\u7CFB\u5217\u9500\u91CF <b>".concat(this.getCount(series_json_1.default[8]), " </b>, Note 12 Pro\u7CFB\u5217\u9500\u91CF135\u4E07</p>"));
        html.push(this.getSeriesTemplateInfo(series_json_1.default[15]));
        html.push("<p>--\u4F5C\u4E3A\u53C2\u8003\uFF0CNote 13\u57FA\u7840\u7248\u9500\u91CF <b>".concat(this.getCount(spu_json_1.default[14]), " </b>, Note 12 \u57FA\u7840\u7248\u9500\u91CF 85\u4E07</p>"));
        html.push('<h2>五、Note Turbo系列</h2>');
        html.push(this.getSeriesTemplateInfo(series_json_1.default[12]));
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
