import request1 from "./request";

class CoreApi {
    constructor() {
      this.http = request1
    }

  findAllGet(url) {
    return this.http.get(url);
  }

  findAllPost(url, data) {
    return this.http.post(url, data);
  }

  findAllDelete(url, data) {
    return this.http.delete(url, { data });
  }
}

export default CoreApi;