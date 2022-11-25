import * as core from "@actions/core";
import {Dockerhub} from "./dockerhub/dockerhub";
import {CacheDo} from "./cache.do";
import fs from "fs";

async function run(){

    const image:string = core.getInput("image");
    let tag:string = core.getInput("tag");

    if (!tag){
        // Default tag is latest
        tag = "latest";
    }

    const dockerhub = new Dockerhub();
    const data = await dockerhub.getLastUpdateTime(image, tag);

    if (!data){
        core.setFailed("Cannot find the image in the dockerhub");
    }

    const lastUpdateTime = new Date(data);
    const cache = getCacheFile(image, tag);
    if (cache){
        const bool = lastUpdateTime.getTime() > cache.cacheUpdateTime.getTime();
        core.setOutput("has_update", bool);
    }else{
        core.setOutput("has_update", false);
    }
    core.setOutput("update_time", lastUpdateTime);
    saveCacheFile(image, tag, lastUpdateTime);
}
run();



/**
 * Read the possible cached file to check whether the image has update or not
 */
function getCacheFile(image: string, tag: string = 'latest') : CacheDo | null {

    const file = fs.readFileSync(image +"_"+tag+".json", 'utf-8');
    return JSON.parse(file);
}

function saveCacheFile(image: string, tag: string = 'latest', lastUpdateTime: Date) {

    const cache = new CacheDo(image, tag, lastUpdateTime)
    const json = JSON.stringify(cache);
    fs.writeFileSync(image +"_"+tag+".json", json);
}