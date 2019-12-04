import { Component, Sanitizer } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Toast, DateTime } from 'ionic-angular';
import { NewslandingPage } from '../newslanding/newslanding';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { GoogleAnalyticsService } from '../../app/services/analytics.service';
import { Storage } from '@ionic/storage';
import { LANGUAGE_KEY } from '../../app/app.constants';
import { FavoritesService } from '../../app/services/favorites.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the NewsAndUpdatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-news-and-updates',
  templateUrl: 'news-and-updates.html',
})
export class NewsAndUpdatesPage {
  private currentLang;
  myNews: any[];
  private isLeaving: boolean = false;
  toastReload: Toast;
  type: string = 'articles';
  vids: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingController: LoadingController, private toastCtrl: ToastController,
    private http: Http, private gaSvc: GoogleAnalyticsService, private storage: Storage,
    private favCtrl: FavoritesService, private sanitizer: DomSanitizer) {
    this.storage.get(LANGUAGE_KEY).then(lang => {
      this.currentLang = lang;
    })

  }

  ionViewDidLoad() {
    this.gaSvc.gaTrackPageEnter('News and Videos Page');
    this.getNews();
  }
  sanitize(URL) {
    return this.sanitizer.bypassSecurityTrustUrl(URL);
  }
  ionViewDidLeave() {
    this.isLeaving = true;
    if (this.toastReload)
      this.toastReload.dismiss();
  }
  GoToNews(id: String) {
    this.navCtrl.push(NewslandingPage, {
      id: id
    });
  }
  setVids(val) {
    this.vids.push(val);
  }
  pushToVids(val) {
    val.map(e => {
      this.favCtrl.checkIfFave(e.Id, 'Vid').then(val=>{
        var test = e.Description.toString().indexOf("http://the-v.net/vtube/video?id=");
        if (test > 1) {
          e.VidLink = "vtube://vtube-app.com/vid/" + e.Description.toString().substring(test + 32, test + 45);
          e.fave = val;
          this.setVids(e);
        }
      })
    });
  }
  getNews() {
    this.myNews = [];
    let loadingPopup = this.loadingController.create({
      content: 'Verifying...'
    });
    loadingPopup.present();
    this.storage.get(LANGUAGE_KEY).then(lang => {
      let body = new URLSearchParams();
      body.set('action', 'getNews');
      body.set('count', '10');
      body.set('tag', 'V-Malaysia 2019');
      body.set('lang', lang);

      let options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
      this.http.post('http://bt.the-v.net/service/api.aspx', body, options)
        .timeout(20000)
        .subscribe(response => {
          try {
            this.pushToVids(response.json());
            let proms = response.json().map(e => {
              return this.favCtrl.checkIfFave(e.Id, 'News').then(val => {
                e.fave = val;
                return e;
              })
            })
            Promise.all(proms).then(val => {
              this.setValue(val);
              //console.log(val);
            })
            loadingPopup.dismiss();
          } catch (e) {
            let toast = this.toastCtrl.create({
              message: 'Something went wrong! Reload and Try again.',
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: 'Reload'
            });
            toast.onDidDismiss(() => {
              if (!this.isLeaving)
                this.getNews();
            })
            toast.present();
            this.toastReload = toast;
            loadingPopup.dismiss();
            console.log(response.json());
          }
        }, e => {
          let toast = this.toastCtrl.create({
            message: 'Something went wrong! Reload and Try again.',
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Reload'
          });
          toast.onDidDismiss(() => {
            if (!this.isLeaving)
              this.getNews();
          })
          toast.present();
          this.toastReload = toast;
          loadingPopup.dismiss();
        }, () => {
        });
    });
  }
  private setValue(value) {
    this.myNews = value;
  }
  //TODO: Favorite feature
  addVidFaves(item, index) {
    this.favCtrl.addFavorite(item, 'Vid').then(added => {
      if (added) {
        console.log(this.vids)
        this.vids[index].fave = added;
        //this.cd.markForCheck();
      }
    });
  }
  addToFaves(item, index, type?) {
    this.favCtrl.addFavorite(item, 'News').then(added => {
      if (added) {
        // console.log(this.myNews[index])
        this.myNews[index].fave = added;
        //this.cd.markForCheck();
      }
    })
  }
  removeVidFaves(item, index) {
    this.favCtrl.removeFavorite(item, 'Vid').then(removed => {
      if (removed) {
        this.vids[index].fave = !removed;
      }
    })
  }
  removeToFaves(item, index, type?) {
    this.favCtrl.removeFavorite(item, 'News').then(removed => {
      if (removed) {
        this.myNews[index].fave = !removed;
      }
    })
  }

}
