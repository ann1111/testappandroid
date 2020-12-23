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
import * as email from "nativescript-email";
import { compose } from "nativescript-email";
import { compose as composeEmail } from "nativescript-email";
import * as TNSPhone from 'nativescript-phone';
import * as dialogs from "tns-core-modules/ui/dialogs";



@Component({
    selector: "Contactinfo",
    moduleId: module.id,
    templateUrl: "./contactinfo.component.html",
    styleUrls: ["./contactinfo.component.css"]
})
export class ContactinfoComponent implements OnInit {

	
	processing=true;
	composeOptions: email.ComposeOptions;
	public input: any;
	
	public constructor(private route: ActivatedRoute,page: Page,private routerExtensions: RouterExtensions, private router: Router) {

			
			page.actionBarHidden = true;
			
					page.actionBarHidden = true;
			
			this.input = {			
			
			"heading":"",
			"heading2":"",
			"address1":"",
			"address2":"",
			"phoneno":"",
			"email":"",
			"webviewurl":"",
			"status":""
			
		            }	
	

		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
		
		/***** Webservice Intigration Start ***/
			this.processing = true ;
			request({
				url:"http://webshopapi.zwemmershop.nl/zwemschoolmobileapp/Contactinfo?isapi=1",
				method: "POST",
				headers: { "isapi": "1" },
				content: JSON.stringify({
				device: 'DovL21vYmlsZWFwaTIuYmVlaGl2ZXNv'

				})
			  }).then((response) => {
				const result = response.content.toJSON();
				
				//console.log(result.id);
				this.input.heading = result.heading;
				this.input.heading2 = result.heading2;
				this.input.address1 = result.address1;
				this.input.address2 = result.address2;
				this.input.phoneno = result.phoneno;
				this.input.email = result.email;
				this.input.webviewurl = result.webviewurl;
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
	
	public callHome(phoneno) {
	console.log("phoneno " + phoneno);
		const phoneNumber = phoneno;
		TNSPhone.requestCallPermission('You should accept the permission to be able to make a direct phone call.')
			.then(() => TNSPhone.dial(phoneNumber, false))
			.catch(() => TNSPhone.dial(phoneNumber, true));
	}
	
	public sendemail(EmailWork): void {
console.log("EmailWork " + EmailWork);
		this.composeOptions = {
			to: [EmailWork],
			subject: 'Hi',
			body: 'Hi...',

		}

		email.available().then(available => {
			if (available) {
				email.compose(this.composeOptions).then(result => {
					console.log(result);
				})
			}
		}).catch(error => console.error(error));

	}


	ngOnInit(): void {
	}
	
	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.showDrawer();
	}

	onCloseDrawerTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
	}
	
	gethome() {
		this.router.navigate(["home"]);
	}
	
	
}