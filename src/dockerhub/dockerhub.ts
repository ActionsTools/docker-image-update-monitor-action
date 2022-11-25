import axios from "axios";

export class Dockerhub {

    private async getImageDetail(image:string, tag:string = "latest"){
        const url = "https://hub.docker.com/v2/repositories/"+image+"/tags?name="+tag;
        const response  = await axios.get(url);
        return response.data;
    }

    async getLastUpdateTime(image: string, tag:string = "latest"): Promise<string> {
        const dto = await this.getImageDetail(image, tag);
        if (dto.results.length !== 0){
            return dto.results[0].last_updated;
        }
        return "";
    }
}