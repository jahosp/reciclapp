import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ScanRoutingModule } from "./scan-routing.module";
import { ScanComponent } from "./scan.component";

import { registerElement } from "nativescript-angular/element-registry";
import { BarcodeScanner } from "nativescript-barcodescanner";

registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);

@NgModule({
    imports: [
        NativeScriptCommonModule,
        ScanRoutingModule,
    ],
    declarations: [
        ScanComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [BarcodeScanner]
})
export class ScanModule { }
