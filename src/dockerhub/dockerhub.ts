import axios from "axios";

export class Dockerhub {

    private async getImageDetail(image:string, tag:string = "latest") : Promise<string>{
        const url = "https://hub.docker.com/v2/repositories/"+image+"/tags?name="+tag;
        const response  = await axios.get(url);
        return response.data;
    }

    async getLastUpdateTime(image: string, tag:string = "latest"): Promise<string> {
        const data = await this.getImageDetail(image, tag);
        const dto = JSON.parse(data);
        if (dto.results.length != 0){
            return dto.results[0].last_updated;
        }
        return "";
    }
}