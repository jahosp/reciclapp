import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: () => import("~/app/home/home.module").then((m) => m.HomeModule) },
    { path: "scan", loadChildren: () => import("~/app/scan/scan.module").then((m) => m.ScanModule) },
    { path: "pay", loadChildren: () => import("~/app/pay/pay.module").then((m) => m.PayModule) },
    { path: "data", loadChildren: () => import("~/app/data/data.module").then((m) => m.DataModule) },
    { path: "petitions", loadChildren: () => import("~/app/petitions/petitions.module").then((m) => m.PetitionsModule) },
    { path: "featured", loadChildren: () => import("~/app/featured/featured.module").then((m) => m.FeaturedModule) },
    { path: "settings", loadChildren: () => import("~/app/settings/settings.module").then((m) => m.SettingsModule) }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
