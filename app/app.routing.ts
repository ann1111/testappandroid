import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeComponent } from "./home/home.component"; 
import { ZwemschoolComponent } from "./zwemschool/zwemschool.component"; 
import { ContactinfoComponent } from "./contactinfo/contactinfo.component"; 
import { FaqComponent } from "./faq/faq.component"; 
import { FreetriallessonComponent } from "./freetriallesson/freetriallesson.component"; 
import { ParentsloginComponent } from "./parentslogin/parentslogin.component"; 
import { RequestinfoComponent } from "./requestinfo/requestinfo.component"; 
import { SwimminglessonComponent } from "./swimminglesson/swimminglesson.component"; 

export const routes = [

    { path: "", component: HomeComponent },
	{ path: "home", component: HomeComponent },
	{ path: "zwemschool", component: ZwemschoolComponent },
	{ path: "contactinfo", component: ContactinfoComponent },
	{ path: "faq", component: FaqComponent },
	{ path: "freetriallesson", component: FreetriallessonComponent },
	{ path: "parentslogin", component: ParentsloginComponent },
	{ path: "requestinfo", component: RequestinfoComponent },
	{ path: "swimminglesson", component: SwimminglessonComponent }
	
	
];

export const navigatableComponents = [

	HomeComponent,
	ZwemschoolComponent,
	ContactinfoComponent,
	FaqComponent,
	FreetriallessonComponent,
	ParentsloginComponent,
	RequestinfoComponent,
	SwimminglessonComponent
	
	
	
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRouting { }
