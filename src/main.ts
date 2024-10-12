import search from './config/search.json';
import spu from './config/spu.json';
import series from './config/series.json';
import * as path from 'path';
import * as fs from 'fs';
import dayjs from 'dayjs';

export interface Config {
    key: string;
    ids: string[];
}

interface SeriesConfig extends Config {
    date: string;
}

interface SPUInfo {
    name: string;
    count: number;
}

interface SKUInfo extends SPUInfo {
    id: number;
    price: string;
}

const alias: Record<string, number> = {
    '18443': 6432,
    '18569': 1179,
    '19026': 339906,
    '18075': 1535408,
    '17971': 1621871,
    '19185': 505158
};

export class Template {

    private readonly sku: SKUInfo[] = [];

    private readonly map: Record<string, SKUInfo> = {};

    private readonly old: Record<string, SKUInfo> = {};

    constructor() {
        const old = this.getOldSKU();
        old.forEach(item => this.old[item.id] = item);
    }

    public process(): Promise<string> {

        return this
            .getAllSKUFromCache()
            .then(sku => {
                this.sku.push(...sku);
                sku.forEach(item => this.map[item.id] = item);
                return sku;
            })
            .then(sku => {
                const dir = path.join(__dirname, '..', 'result');
                const date = dayjs().format('YYYY-MM-DD');
                const time = dayjs().format('YYYY-MM-DD HH:mm:ss');

                if (fs.existsSync(path.join(dir, date + '.json'))) {
                    fs.writeFileSync(path.join(dir, time + '.json'), JSON.stringify(sku, null, 4), 'utf-8');
                } else {
                    fs.writeFileSync(path.join(dir, date + '.json'), JSON.stringify(sku, null, 4), 'utf-8');
                }
            })
            .then(() => this.render());
    }

    private getSearchResult(key: string): Promise<SKUInfo[]> {

        const params = new URLSearchParams('client_id=180100031051&channel_id=&webp=1&query=Xiaomi+13&version=2&page_index=1&page_size=20&activity_id=&activity_type=');

        params.set('query', key.replace(/ /g, '+'));

        return fetch(
            'https://m.mi.com/v1/hisearch/query_v3',
            {
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
            }
        ).then(res => res.json()).then(data => data.data.list_v2.map((item: any) => ({
            id: item.body.product_id,
            name: item.body.name,
            price: item.body.price,
            count: item.body.comments_total
        }))).catch(e => {
            console.log(key);
            debugger
        });
    }

    private async getAllSKUFromCache(): Promise<SKUInfo[]> {

        const sku = await this.getAllSKU();
        const dir = path.join(__dirname, '..', 'result');
        const date = dayjs().format('YYYY-MM-DD');
        const files = fs.readdirSync(dir).filter(item => item.startsWith(date));

        files.forEach(file => {

            const p = path.join(dir, file);
            const content = fs.readFileSync(p, 'utf-8');
            const json: SKUInfo[] = JSON.parse(content);

            json.forEach(item => {

                const idx = sku.findIndex(s => s.id === item.id);

                if (idx === -1) {
                    sku.push(item);
                }
            });

        });

        return sku;
    }

    private async getAllSKU(): Promise<SKUInfo[]> {

        const data: SKUInfo[] = [];

        for (const config of search) {
            const list = await this.getSearchResult(config.key);
            data.push(...list.filter(item => config.ids.includes(String(item.id))));
        }

        return data;
    }

    private getOldSKU(): SKUInfo[] {
        const dir = path.join(__dirname, '..', 'result');
        const date = dayjs().add(-1, 'd').format('YYYY-MM-DD');

        if (fs.existsSync(path.join(dir, date + '.json'))) {
            return JSON.parse(fs.readFileSync(path.join(dir, date + '.json'), 'utf-8'));
        } else {
            return this.sku.map(item => ({...item, count: 0}));
        }
    }

    private getAllSPU(sku: SKUInfo[]): SPUInfo[] {
        const map: Record<string, SKUInfo> = {};
        sku.map(item => map[item.id] = item);

        return spu.map(item => ({
            name: item.key,
            count: item.ids.map(id => alias[id] || map[id].count).reduce((a, b) => a + b)
        }));
    }

    private getCount(config: Config): number {
        return config.ids.map(id => {
            try {
                return alias[id] || this.map[id].count;
            } catch (e) {
                console.log(id);
                throw e;
            }
        }).reduce((a, b) => a + b);
    }

    private getOldCount(config: Config): number {
        return config.ids.map(id => this.old[id]?.count || alias[id] || 0).reduce((a, b) => a + b);
    }

    private getSPUTemplateInfo(idx: number, config: Config): string {
        return `<p>（${idx}）${config.key} ${this.getCount(config)}</p>`;
    }

    private getSeriesTemplateInfo(config: SeriesConfig): string {
        const oldDate = dayjs(config.date, 'YYYY-MM-DD');
        const date = dayjs().add(-16, 'd');
        const d = date.diff(oldDate, 'd') + 1;
        const c = this.getCount(config);
        const oc = this.getOldCount(config);
        const dc = c - oc;

        if (d < 0) {
            return '<p>产品暂未发售</p>';
        }

        return `<p>今天是${config.key}确认收货的第 ${d} 天（购买日期大概${date.format('YYYY/MM/DD')} 附近，经过校对数据有16天延时），在小米商城评论总数：<b>${c}</b>，日新增 <b>${dc}</b></p>`;
    }

    private render() {

        const html: string[] = [
            `<h1>小米 2023年主流机型销量跟踪${dayjs().format('YYYY/MM/DD')}</h1>`
        ];

        html.push('<h2>一、小米 14 系列</h2>');
        html.push('<p> </p>');
        html.push(this.getSeriesTemplateInfo(series[9]));
        html.push('<p></p>');
        html.push(`<p>小米13系列总销量为 <b>${this.getCount(series[2])}</b></p>`);
        html.push('<h2>二、红米 K70 系列(不包括K70E)</h2>');
        html.push(this.getSeriesTemplateInfo(series[10]));
        html.push('<p></p>');
        html.push(`<p>红米 K60 系列 <b>${this.getCount(series[7])}</b></p>`);
        html.push('<h2>三、Xiaomi MIX Flip</h2>');
        html.push(this.getSeriesTemplateInfo(series[13]));
        html.push('<h2>四、Note 14系列</h2>');
        html.push(this.getSeriesTemplateInfo(series[13]));
        html.push('<p>--作为参考，Note 13 Pro系列销量${this.getCount(series[8])}, Note 12 Pro系列销量135万，不再统计基础版新增</p>');
        html.push('<h2>五、Note Turbo系列</h2>');
        html.push(this.getSeriesTemplateInfo(series[12]));
        html.push(`<p>--作为参考，上代系列销量<b>${this.getCount(series[4])}</b>。</p>`);
        html.push('<h2>五、单品数据</h2>');
        spu.forEach((item, idx) => html.push(this.getSPUTemplateInfo(idx + 1, item)));
        html.push('<p>🔥最后：数据整理不易，如果您觉得有价值，帮忙点个关注呗⭐️⭐️⭐️</p>');

        return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>监控</title></head><body>${html.join('\n')}</body></html>`;
    }
}

const t = new Template();

t.process().then(html => {
    const dir = path.join(__dirname, '..', 'template');
    const date = dayjs().format('YYYY-MM-DD');
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss');

    if (fs.existsSync(path.join(dir, date + '.html'))) {
        fs.writeFileSync(path.join(dir, time + '.html'), html, 'utf-8');
    } else {
        fs.writeFileSync(path.join(dir, date + '.html'), html, 'utf-8');
    }
});
