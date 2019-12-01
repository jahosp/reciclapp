import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable(
    // Instead of providers array you can use provideIn
    // Learn more https://angular.io/guide/providers
    // {
    //     providedIn: "root"
    // }
)
export class MyHttpPostService {
    private blockchainUrl = "http://192.168.1.199:2002/veureMoney";
    private serverUrl = "";

    constructor(private http: HttpClient) { }

    postData(data: any) {
        let options = this.createRequestOptions();
        return this.http.post(this.serverUrl, { data }, { headers: options });
    }

    postDataChain(data: any) {
        let options = this.createRequestOptions();
        return this.http.post(this.blockchainUrl, { data }, { headers: options });
    }

    private createRequestOptions() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return headers;
    }
}
