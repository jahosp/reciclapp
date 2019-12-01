import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { MyHttpPostService } from "./http-post.service";


@Component({
    selector: "Data",
    templateUrl: "./data.component.html",
    providers: [MyHttpPostService]
})
export class DataComponent implements OnInit {

    coins : string 
    correct :string
    idle : string
    wrong :string 
    total : string

    constructor(private myPostService: MyHttpPostService) {
        // Use the component constructor to inject providers.
    }

    ngOnInit() {
        try {
            this.submitChain("0x15d4e6Ce281F9Eb3A9273d3a8cb2807FBA07DA7e")
            this.submit("5de345ea004e6f293f761c42")
          } catch(error) {console.log(error);}
    }

    public submitChain(address) {
        this.makePostChainRequest(address);
    }

    public submit(id) {
        this.makePostRequest(id);
    }
    
    private makePostRequest(id) {
        this.myPostService
            .postData({ "user_id": id})
            .subscribe(res => {
                console.log(res);
                this.correct = res["correct"];
                this.idle = res["idle"];
                this.wrong = res["wrong"];
                this.total = res["total"];
        });
    }

    private makePostChainRequest(address) {
          this.myPostService
              .postDataChain({ "address": address})
              .subscribe(res => {
                  this.coins = res.toString();
              });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
