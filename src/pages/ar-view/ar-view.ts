/// <reference path="../../app/WikitudePlugin.d.ts" />
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LANGUAGE_KEY } from '../../app/app.constants';
import { GoogleAnalyticsService } from '../../app/services/analytics.service';

/**
 * Generated class for the ArViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ar-view',
  templateUrl: 'ar-view.html',
})
export class ArViewPage {
  currentLang;
  constructor(public navCtrl: NavController, public navParams: NavParams,storage:Storage,
    private ga:GoogleAnalyticsService) {
    storage.get(LANGUAGE_KEY).then(lang=>{
      this.currentLang = lang;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArViewPage');
    this.ga.gaTrackPageEnter('AR Experience');
  }
  startARView(){
    var startupConfiguration: any = {"camera_position": "back"};
      
      WikitudePlugin.loadARchitectWorld(
          ()=> {
            console.log("ARchitect World loaded successfully.");
            this.ga.gaEventTracker('AR Experience', 'AR Start', 'Opened AR Experience');
          },
          error=> {
            console.log(error);
          },          
         "www/assets/ARViewAsset/index.html", // (1) if you have a IR (Image Recognition) World, use this
         ["ir"], // (1) if you have a IR (Image Recognition) World, use this
          // "www/assets/07_3dModels_6_3dModelAtGeoLocation/index.html",  // (2) if you have a GeoLocation World, use this
          // ["geo"],  // (2) if you have a GeoLocation World, use this
          // you find other samples or Wikitude worlds in Wikitude Cordova Plugin
          // which can be downloaded from here: https://github.com/Wikitude/wikitude-cordova-plugin/archive/v5.3.1-3.3.2.zip
          <JSON>startupConfiguration
      );
  }

}
