
export class CacheDo {

    constructor(name: string, tag: string, cacheUpdateTime: Date) {
        this.name = name;
        this.tag = tag;
        this.cacheUpdateTime = cacheUpdateTime;
    }

    name: string;

    tag: string;

    cacheUpdateTime: Date;
}