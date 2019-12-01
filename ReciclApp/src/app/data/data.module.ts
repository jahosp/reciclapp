import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { DataRoutingModule } from "./data-routing.module";
import { DataComponent } from "./data.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        DataRoutingModule
    ],
    declarations: [
        DataComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DataModule { }
