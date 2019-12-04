/// <reference path="WikitudePlugin.d.ts" />
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { HomePage } from '../pages/home/home';
import { FaqsPage } from '../pages/faqs/faqs';
import { ContactPage } from '../pages/contact/contact';
import { DownloadsPage } from '../pages/downloads/downloads';
import { ChangeLangPage } from '../pages/change-lang/change-lang';
import { NewsAndUpdatesPage } from '../pages/news-and-updates/news-and-updates';
import { MarkPage } from '../pages/mark/mark';
//import { SchedPage } from '../pages/sched/sched';
import { MerchPage } from '../pages/merch/merch';
//import { GeofenceService } from './services/geofence.service';
import { ConnectionService } from './services/connection.service';
import { NewslandingPage } from '../pages/newslanding/newslanding';
import { AskDatoPage } from '../pages/ask-dato/ask-dato';
import { SurveyPage } from '../pages/survey/survey';
import { Storage } from '@ionic/storage';
import { LANGUAGE_KEY, MERCH_FAVES } from './app.constants';
import { FavoritesPage } from '../pages/favorites/favorites';
import { FeedPage } from '../pages/feed/feed';
import { ExhibitorsPage } from '../pages/exhibitors/exhibitors';
import { NotesPage } from '../pages/notes/notes';
import { ArViewPage } from '../pages/ar-view/ar-view';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  rootPage: any;
  activePage: any = HomePage;
  pages: Array<{ title: string, component: any }>;
  isRTL: Boolean = false;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen:
    SplashScreen, private translateService: TranslateService,
    //private geofenceService: GeofenceService,
    private connectionService: ConnectionService,
    private alertCtrl:AlertController,
    private push:Push,
    private storage:Storage) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'SIDEMENU.HOME', component: HomePage },
      { title: 'SIDEMENU.FAVORITES', component: FavoritesPage },
      { title: 'SIDEMENU.VMAL_FEED', component: FeedPage },
      { title: 'SIDEMENU.EXHIBITORS', component: ExhibitorsPage },
      //{ title: 'SIDEMENU.DAILY_PROG', component: SchedPage },
      { title: 'SIDEMENU.NOTES', component: NotesPage },
     // { title: 'SIDEMENU.WE_ARE_ONE', component: WeAreOnePage },
      { title: 'SIDEMENU.NEWS_UPS', component: NewsAndUpdatesPage },
      { title: 'SIDEMENU.MERCH', component: MerchPage },
      { title: 'SIDEMENU.MARK', component: MarkPage },
      //{ title: 'SIDEMENU.DOWNLOAD', component: DownloadsPage },
      //{ title: 'SIDEMENU.CHAT', component: VoltChatPage },
      { title: 'SIDEMENU.ASK_DATO', component: AskDatoPage },
      { title: 'SIDEMENU.AR', component: ArViewPage }, //TODO: this is new!!!
      { title: 'SIDEMENU.SURVEY', component: SurveyPage },
      { title: 'SIDEMENU.FAQS', component: FaqsPage },
      { title: 'SIDEMENU.CONTACT', component: ContactPage },
      { title: 'SIDEMENU.SELECT_LANG', component: ChangeLangPage }
      //{ title: 'V-Con Superstar', component: ExhibitorsPage }
    ];
  }
  

  initializeApp() {
    //TODO: initial load, set MERCH_FAVES to []
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.get(LANGUAGE_KEY).then(lang=>{
        if(lang){
          this.translateService.setDefaultLang(lang);
          this.translateService.use(lang);
          this.rootPage = HomePage;
          this.segmentChanged(lang);
        }else{
          this.translateService.setDefaultLang('en');
          this.translateService.use('en');
          this.rootPage = ChangeLangPage;
        }
      });
      this.storage.get(MERCH_FAVES).then(merch=>{
        if(!merch){
          this.storage.set(MERCH_FAVES, []);
        }
      })
      this.connectionService.checkNetworkConnection();
      //this.geofenceService.setupEventGeofence();
      this.pushsetup();
      this.platform.setDir('ltr', true);
      this.platform.setDir('rtl', false);

      /////WIKITUDE SDK CODES//////
       /** Enter your Wikitude (trial) License Key here. You can register and download your free license key here: http://www.wikitude.com/developer/licenses */      
       WikitudePlugin._sdkKey = "YRFT5uZzRX4ZyOyqBgBqHq8tlzupuCh8Lz8EAkNr31+fBKBifvxC8HBxI7p19HoyoYjD4sYWYb6Ra1JxRrG4D/K5p3+gtsOPdWMCPHIf5GCyFLDwX3aC9/DVbTBOUX0PBzbsfQFFrKkZu5qGeP4H3KWkb8vMerHP+sGpGpYCiYBTYWx0ZWRfXz1dxnxVQR3wGJ4L6uSqVsUSDS/XiZsuutWIxpRICiIcfGpo9ksv6odjJRnMuYusCbk3m9OAs5lVdNY691cEHIjgjoFsJ8S5zYmrqB1/zZbwzww6kUJJuBilR7AeiptbYs7Bkbt5DeSgbDLkMkcYbvkay7O8/3svQOEC3XOXkhaYI5q+MTgmihqLoDNJGscMtfE7WCVsRRpy0iExMX3w9UxMDgxi2s6q04VQQlGTNewWw9NbCqzq3heWPHi/EBnON5QQK4Q5kv8Z7xeaLbzAYhHlOmL/jgcCzIKksuNLasA57AZV/NyPM/Kl3E5GbOJnIubY/7yBhYQEyDO7qJK/6PLogVJvKGm2ksaY7hBJdRaBMcOUpLxetxIsrm4b9JRelqsqAzWCO0Zg3fpXEEEOQwmVj2drFXooVJ1P0Le2aPS2dUC5OYdjhsXQUFzZ58FYYC8kzuUwtufcZMsXDlNnapTysrDLpF36N/xwE/X91s1M0pht8fSmz9DmkRg+sBDhzMgsWdwAun7+4DpHAlHpwdHbrZ2CM2zprG+4twFsDGSrm7nO8Bvw7hqzBdMv9DuA9DnKK89H6Ip5ShezDh2UoFbYFD07Nl8hKCEknY7jJ8z+mnpx1J31ZIQ=";
      
       /** Check if your device supports AR */
       WikitudePlugin.isDeviceSupported(
           function(success) {
             console.log("Your platform supports AR/Wikitude. Have fun developing!!");
           },
           function(fail) {
             console.log("Your platform failed to run AR/Wikitude: "+fail);
           },
           [WikitudePlugin.FeatureGeo] // or WikitudePlugin.Feature2DTracking 
       );                  
 
       /** The Wikitude AR View creates it's own context. Communication between the main Ionic App and Wikitude SDK works 
        * through the function below for the direction Ionic app --> Wikitude SDK 
        * For calls from Wikitude SDK --> Ionic app see the captureScreen example in 
        * WikitudeIonic3StarterApp/www/assets/07_3dModels_6_3dModelAtGeoLocation/js/3dmodelatgeolocation.js*/
       // set the function to be called, when a "communication" is indicated from the AR View  
       WikitudePlugin.setJSONObjectReceivedCallback(function(obj) {
 
         console.log("setOnUrlInvokeCallback ...");
         console.log(obj);
         //var resp// = JSON.parse(obj);
         // this an example of how to receive a call from a function in the Wikitude SDK (Wikitude SDK --> Ionic2)
         if (obj.action =='captureScreen') {
             WikitudePlugin.captureScreen(
                 (absoluteFilePath) => {
                     console.log("snapshot stored at:\n" + absoluteFilePath);
 
                     // this an example of how to call a function in the Wikitude SDK (Ionic2 app --> Wikitude SDK)
                     WikitudePlugin.callJavaScript("World.testFunction('Screenshot saved at: " + absoluteFilePath +"');");
                 },
                 (errorMessage) => {
                     console.log(errorMessage);
                 },
                 true, null
             );
         }
         else if(obj.action == 'close'){
           WikitudePlugin.close();
           //window.close();
         } else if(obj.action == 'openlink'){
                window.open(obj.data);
         }else {
             console.log("not handled");
         }
       });
 
       /**
        * Define the generic ok callback
        */
       WikitudePlugin.onWikitudeOK = function() {
           console.log("Things went ok.");
       }
       
       /**
        * Define the generic failure callback
        */
       WikitudePlugin.onWikitudeError = function() {
           console.log("Something went wrong");
       }
 
       // Just as an example: set the location within the Wikitude SDK, if you need this (You can get the geo coordinates by using ionic native 
       // GeoLocation plugin: http://ionicframework.com/docs/v2/native/geolocation/
       //WikitudePlugin.setLocation(47, 13, 450, 1);
 
       /* for Android only
       WikitudePlugin.setBackButtonCallback(
           () => {
               console.log("Back button has been pressed...");
           }
       );                  
       */
      /////END - WIKITUDE SDK CODES//////
    }, e => {
      console.log(JSON.stringify(e));
    }).catch(_ => {
      alert('Cannot load application!');
    });
    
  }
  segmentChanged(lang) {
    if(lang == "ar"){
      this.platform.setDir('rtl', true);
      this.platform.setDir('ltr', false); 
    }
    else
    {
      this.platform.setDir('ltr', true);
      this.platform.setDir('rtl', false);
    }
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage = page;
  }
  checkActive(p) {
    return p == this.activePage;
  }
  pushsetup() {
    const options: PushOptions = {
      android: {
        senderID: '597577788490',
        topics: ["VCON_ALL_USERS"]
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false',
        topics: ["VCON_ALL_USERS"]
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((data: any) => {
      if (!data.additionalData.coldstart) {
        if (data.additionalData.dataid) {
          let youralert = this.alertCtrl.create({
            title: data.title,
            message: data.message,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'View',
                handler: () => {
                  this.nav.push(NewslandingPage, {
                    id: data.additionalData.dataid
                  });
                }
              }
            ]
          });
          youralert.present();
        }
        else {
          let youralert = this.alertCtrl.create({
            title: data.title,
            message: data.message,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          youralert.present();
        }
      }
      else {
        if (data.additionalData.dataid) {
          this.nav.push(NewslandingPage, {
            id: data.additionalData.dataid
          });
        }
      }


    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log(registration);
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }
}
interface PagesMap {
  [lang: string]: [any];
}
