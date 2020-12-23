import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { request } from "tns-core-modules/http";
import { parseString } from "nativescript-xml2js";
import * as ApplicationSettings from "application-settings";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "application";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import * as dialogs from "tns-core-modules/ui/dialogs";

@Component({
    selector: "Requestinfo",
    moduleId: module.id,
    templateUrl: "./requestinfo.component.html",
    styleUrls: ["./requestinfo.component.css"]
})
export class RequestinfoComponent implements OnInit {

	
	processing=true;
	public openingCompany: string;
	public openingCreatedDate: string;
	public openingDesignation: string;
	public openingDetails: string;
	public openingExperience: string;
	public openingLocation: string;
	public openingModifiedDate: string;
	public openingNoOfPositions: string;
	public openingOpeningCode: string;
	public openingOpeningName: string;
	public openingDay: string;
	public openingMonth: string;
	public input: any;
	
	public constructor(private route: ActivatedRoute,page: Page,private routerExtensions: RouterExtensions, private router: Router) {

			page.actionBarHidden = true;
			
					page.actionBarHidden = true;
			
		    this.input = {			
			
			"logoimage":"",
			"heading1":"",
			"image1":"",
			"paragraph1":"",
			"paragraph2":"",
			"paragraph3":"",
			"paragraph4":"",
			"image2":"",
			"heading2":"",
			"subheading":"",
			"paragraph5":"",
		    "status":""
			
		            }
		
	 
	    const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
		
		
		/***** Webservice Intigration Start ***/
			this.processing = true ;
			request({
				url:"	http://webshopapi.zwemmershop.nl/zwemschoolmobileapp/Requestinfo?isapi=1",
				method: "POST",
				headers: { "isapi": "1" },
				content: JSON.stringify({
				device: 'DovL21vYmlsZWFwaTIuYmVlaGl2ZXNv'

				})
			  }).then((response) => {
				const result = response.content.toJSON();
				
				//console.log(result.id);
				this.input.logoimage = result.logoimage;
				this.input.heading1 = result.heading1;
				this.input.image1 = result.image1;
				this.input.paragraph1 = result.paragraph1;
				this.input.paragraph2 = result.paragraph2;
				this.input.paragraph3 = result.paragraph3;
				this.input.paragraph4 = result.paragraph4;
				this.input.image2 = result.image2;
				this.input.heading2 = result.heading2;
				this.input.subheading = result.subheading;
				this.input.paragraph5 = result.paragraph5;
				
			    this.processing = false;
			    }, (e) => {
				
					dialogs.alert({
					title: "",
					message: 'Unable to connect with the server, Plz check the URL or contact with the administrator.',
					okButtonText: "Ok"
						}).then(() => {
						
					});
					this.processing = false;
			});
			
			/***** Webservice Intigration End */


	}

	ngOnInit(): void {
	}
	
	gethome() {
		this.router.navigate(["home"]);
	}
	
	getdashboard() {
		this.router.navigate(["dashboard"]);
	}

	
	getmedashboard() {
		this.router.navigate(["medashboard"]);
	}

	getmydashboard() {
		this.router.navigate(["mydashboard"]);
	}

	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.showDrawer();
	}

	onCloseDrawerTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
	}
}