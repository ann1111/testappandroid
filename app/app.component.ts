import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import * as app from "application";
import { RouterExtensions } from "nativescript-angular/router";
import { Router } from "@angular/router";
import * as ApplicationSettings from "application-settings";
import { parseString } from "nativescript-xml2js";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
	private _sideDrawerTransition: DrawerTransitionBase;

  constructor(private routerExtensions: RouterExtensions, private router: Router){
	  
  }
  
  onCloseDrawerTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }
  
   gethome(){
		this.router.navigate(["home"]);
		
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
  
  ngOnInit(): void {

      this._sideDrawerTransition = new SlideInOnTopTransition();
	  const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();

  }

  get sideDrawerTransition(): DrawerTransitionBase {
   
      return this._sideDrawerTransition;
  }
  
}
