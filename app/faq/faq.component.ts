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
    selector: "Faq",
    moduleId: module.id,
    templateUrl: "./faq.component.html",
    styleUrls: ["./faq.component.css"]
})
export class FaqComponent implements OnInit {

	
	processing=false;
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
			
			"heading1":"",
			"paragraph1":"",
			"paragraph2":"",
			"heading2":"",
			"paragraph3":"",
			"paragraph4":"",
			"heading3":"",
			"paragraph5":"",
			"paragraph6":"",
			"heading4":"",
			"paragraph7":"",
			"paragraph8":"",
			"heading5":"",
			"paragraph9":"",
			"heading10":"",
			"heading6":"",
			"paragraph11":"",
			"paragraph12":"",
			"heading7":"",
			"paragraph13":"",
			"paragraph14":"",
			"heading8":"",
			"paragraph15":"",
			"paragraph16":"",
			"heading9":"",
			"paragraph17":"",
			"paragraph18":"",
			"imageurl1":"",
			"imageurl2":"",
			"status":""
			
		            }	
		

		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
		
		  /***** Webservice Intigration Start ***/
			this.processing = true ;
			request({
				url:"http://webshopapi.zwemmershop.nl/zwemschoolmobileapp/Faq?isapi=1",
				method: "POST",
				headers: { "isapi": "1" },
				content: JSON.stringify({
				device: 'DovL21vYmlsZWFwaTIuYmVlaGl2ZXNv'

				})
			  }).then((response) => {
				const result = response.content.toJSON();
				
				//console.log(result.id);
				this.input.heading1 = result.heading1;
				this.input.paragraph1 = result.paragraph1;
				this.input.paragraph2 = result.paragraph2;
				this.input.heading2 = result.heading2;
				this.input.paragraph3 = result.paragraph3;
				this.input.paragraph4 = result.paragraph4;
				this.input.heading3 = result.heading3;
				this.input.paragraph5 = result.paragraph5;
				this.input.paragraph6 = result.paragraph6;
				this.input.heading4 = result.heading4;
				this.input.paragraph7 = result.paragraph7;
				this.input.paragraph8 = result.paragraph8;
				this.input.heading5 = result.heading5;
				this.input.paragraph9 = result.paragraph9;
				this.input.paragraph10 = result.paragraph10;
				this.input.heading6 = result.heading6;
				this.input.paragraph11 = result.paragraph11;
				this.input.paragraph12 = result.paragraph12;
				this.input.heading7 = result.heading7;
				this.input.paragraph13 = result.paragraph13;
				this.input.paragraph14 = result.paragraph14;
				this.input.heading8 = result.heading8;
				this.input.paragraph15 = result.paragraph15;
				this.input.paragraph16 = result.paragraph16;
				this.input.heading9 = result.heading9;
				this.input.paragraph17 = result.paragraph17;
				this.input.paragraph18 = result.paragraph18;
				this.input.imageurl1 = result.imageurl1;
				this.input.imageurl2 = result.imageurl2;
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