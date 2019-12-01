import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { PayRoutingModule } from "./pay-routing.module";
import { PayComponent } from "./pay.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        PayRoutingModule
    ],
    declarations: [
        PayComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PayModule { }
