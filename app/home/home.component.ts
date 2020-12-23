import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { SegmentedBar, SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";
import { RouterExtensions } from 'nativescript-angular/router';
import { screen } from "tns-core-modules/platform";
import { AndroidData, ShapeEnum } from "../nativescript-ngx-shadow";
import { request } from "tns-core-modules/http";
import { parseString } from "nativescript-xml2js";
import * as ApplicationSettings from "application-settings";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";




@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

    fabShadow: AndroidData = {
        elevation: 6,
        bgcolor: "#ff1744",
        shape: ShapeEnum.OVAL
    };
    
    public viewHeigth: number = 0;

    constructor(private route: ActivatedRoute,page: Page,private routerExtensions: RouterExtensions, private router: Router) {
        page.actionBarHidden = true;
		
		
    }
	
	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.showDrawer();
	}
	
	getzwemschool(){
		this.router.navigate(["zwemschool"]);
		
	}
	
	getcontactinfo(){
		this.router.navigate(["contactinfo"]);
		
	}
	
	getfaq(){
		this.router.navigate(["faq"]);
		
	}
	
	getfreetriallesson(){
		this.router.navigate(["freetriallesson"]);
		
	}
	
	getparentslogin(){
		this.router.navigate(["parentslogin"]);
		
	}
	
	getrequestinfo(){
		this.router.navigate(["requestinfo"]);
		
	}
	
	getswimminglesson(){
		this.router.navigate(["swimminglesson"]);
		
	}
	
	onCloseDrawerTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
	}
	

    ngOnInit(): void {
        this.viewHeigth = screen.mainScreen.heightDIPs * 0.6;
		
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
    }
}
