import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { PetitionsRoutingModule } from "./petitions-routing.module";
import { PetitionsComponent } from "./petitions.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        PetitionsRoutingModule
    ],
    declarations: [
        PetitionsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PetitionsModule { }
