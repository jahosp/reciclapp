import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { MyHttpPostService } from "./http-post.service";

import { BarcodeScanner } from "nativescript-barcodescanner";



@Component({
    selector: "Scan",
    templateUrl: "./scan.component.html",
    providers: [MyHttpPostService]
})
export class ScanComponent implements OnInit {
    public message: string;
    private barcodeScanner: BarcodeScanner;
  
    constructor(private myPostService: MyHttpPostService) {
      this.barcodeScanner = new BarcodeScanner();

    }

    public submit(id, data) {
      this.makePostRequest(id, data);
    }

    private makePostRequest(id, data) {
        this.myPostService
            .postData({ "user_id": id, "qr_code": data })
            .subscribe(res => {
                this.message = (<any>res).json.data;
            });
    }

    public onScanResult(scanResult: any) {
      console.log(`onScanResult: ${scanResult.text} (${scanResult.format})`);
    }

    public doRequestCameraPermission() {
      this.barcodeScanner.requestCameraPermission()
          .then(() => console.log("Camera permission granted"))
          .catch(() => console.log("Camera permission not granted"));
    }

    public doScanWithBackCamera() {
      this.scan(false, true);
    }
  
    private scan(front: boolean, flip: boolean, torch?: boolean, orientation?: string) {
      this.barcodeScanner.scan({
        presentInRootViewController: true, // not needed here, but added it just for show
        cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        preferFrontCamera: front,     // Android only, default false
        showFlipCameraButton: flip,   // default false
        showTorchButton: torch,       // iOS only, default false
        torchOn: false,               // launch with the flashlight on (default false)
        resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        orientation: orientation,     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
        beepOnScan: true,             // Play or Suppress beep on scan (default true)
        fullScreen: true,             // iOS 13+ modal appearance changed so they can be swiped down when this is false (default false)
        openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
        closeCallback: () => {
          console.log("Scanner closed @ " + new Date().getTime());
        }
      }).then((result) => {
        try {
          this.submit( "5de345ea004e6f293f761c42" ,result.text)
        } catch(error) {console.log(error);}
        
      }) 
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }


}
