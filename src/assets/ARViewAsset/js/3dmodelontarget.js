var cID = "0ba43958da9c785823bfcb551dc86fd7";
var tcID = "5d3060f145f409389f6e962e";
var gID = "rkTwJJRWH";
var World = {
	tracker: null,
	loaded: false,
	cloudRecognitionService: null,
	imagedata: null,

	init: function initFn() {
		document.getElementById('loadingMessage').style.display = "none";
		this.createTracker();
		//this.createOverlays();
	},

	createTracker: function createTrackerFn() {
		World.cloudRecognitionService = new AR.CloudRecognitionService(cID, tcID, {
			onLoaded: this.trackerLoaded,
			onError: this.trackerError
		});
		World.tracker = new AR.ImageTracker(this.cloudRecognitionService, {
			onError: this.trackerError
		});
	},
	startContinuousRecognition: function startContinuousRecognitionFn(interval) {
		this.tracker.startContinuousRecognition(interval, this.onRecognition, this.onRecognitionError, this.onInterruption);
	},

	trackerError: function trackerErrorFn(errorMessage) {
		console.log(errorMessage);
	},

	createOverlays: function createOverlaysFn(data) {
		// Create overlay
		console.log(data);
		World.imagedata = data;
		console.log(World.imagedata.metadata.imageSrc.indexOf(".mp4") !== -1);
		if (World.trackable !== undefined) {
			World.trackable.destroy();
		}
		if (World.imagedata.metadata.imageSrc.indexOf(".mp4") !== -1 || World.imagedata.metadata.imageSrc.indexOf(".MP4") !== -1) {
			World.video = new AR.VideoDrawable(World.imagedata.metadata.imageSrc,Number(World.imagedata.metadata.imgSDU),{
				scale: {
					x: Number(World.imagedata.metadata.scale.x),
					y: Number(World.imagedata.metadata.scale.y)
				},
				translate: {
					x: Number(World.imagedata.metadata.translate.x),
					y: Number(World.imagedata.metadata.translate.y),
					z: Number(World.imagedata.metadata.translate.z)
				},
				rotate: {
					x: Number(World.imagedata.metadata.rotate.x),
					y: Number(World.imagedata.metadata.rotate.y),
					z: Number(World.imagedata.metadata.rotate.z)
				},
				onClick: function videoClicked () {
					//document.location.href = World.imagedata.metadata.imgLink, true;
					//document.open(World.imagedata.metadata.imgLink,'_system','location=yes');return false;
					//window.open(World.imagedata.metadata.imgLink, '_system');
					AR.platform.sendJSONObject({
						name: "button",
						action: "openlink",
						data:World.imagedata.metadata.imgLink
					})
				}
			});
			World.trackable = new AR.ImageTrackable(World.tracker, World.imagedata.targetInfo.name, {
				drawables: {
					cam: World.video
				},
				onImageRecognized: function onImageRecognizedFn() {
					if (!World.loaded) {
						document.getElementById('loadingMessage').style.display = "none";
						World.video.play();
						World.loaded = true;
					}
				},
				onImageLost: this.showLoadingBar
				// onEnterFieldOfVision: function onEnterFieldOfVision(targetName) {
				// 	document.getElementById('loadingMessage').innerHTML =
				// 		"<div>targetName: " + targetName + "</div>";
				// }
			});
		} 
		else {
			this.imageres = new AR.ImageResource(World.imagedata.metadata.imageSrc);
			this.imageOverlay = new AR.ImageDrawable(this.imageres, Number(World.imagedata.metadata.imgSDU), {
				//onLoaded: this.loadingStep,
				scale: {
					x: Number(World.imagedata.metadata.scale.x),
					y: Number(World.imagedata.metadata.scale.y)
				},
				translate: {
					x: Number(World.imagedata.metadata.translate.x),
					y: Number(World.imagedata.metadata.translate.y),
					z: Number(World.imagedata.metadata.translate.z)
				},
				rotate: {
					x: Number(World.imagedata.metadata.rotate.x),
					y: Number(World.imagedata.metadata.rotate.y),
					z: Number(World.imagedata.metadata.rotate.z)
				},
				onClick: function videoClicked () {
					//document.location.href = World.imagedata.metadata.imgLink, true;
					//document.open(World.imagedata.metadata.imgLink,'_system','location=yes');return false;
					//window.open(World.imagedata.metadata.imgLink, '_system');
					if(World.imagedata.metadata.imgLink!==""){
						AR.platform.sendJSONObject({
							name: "button",
							action: "openlink",
							data:World.imagedata.metadata.imgLink
						})
					}
				}
			});


			World.trackable = new AR.ImageTrackable(World.tracker, World.imagedata.targetInfo.name, {
				drawables: {
					cam: this.imageOverlay
				},
				onImageRecognized: this.removeLoadingBar,
				onImageLost: this.showLoadingBar
				// onEnterFieldOfVision: function onEnterFieldOfVision(targetName) {
				// 	document.getElementById('loadingMessage').innerHTML =
				// 		"<div>targetName: " + targetName + "</div>";
				// }
			});
		}
	},

	onRecognition: function onRecognitionFn(recognized, response) {
		if (recognized) {
			console.log(response);
			// var cssDivInstructions = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
			// document.getElementById('loadingMessage').innerHTML =
			// 	"<div" + cssDivInstructions + ">" + JSON.stringify(response) + "</div>";
			World.createOverlays(response);

		}
		else {
			document.getElementById('loadingMessage').style.display = "none";
		}
	},
	removeLoadingBar: function () {
		if (!World.loaded) {
			document.getElementById('loadingMessage').style.display = "none";
			World.loaded = true;
		}
	},
	showLoadingBar: function () {
		World.loaded = false;
		//World.worldLoaded();
	},
	onRecognitionError: function onRecognitionErrorFn(errorCode, errorMessage) {
		document.getElementById('loadingMessage').style.display = "none";
		alert("error code: " + errorCode + " error message: " + JSON.stringify(errorMessage));
	},

	onInterruption: function onInterruptionFn(suggestedInterval) {
		World.tracker.stopContinuousRecognition();
		World.tracker.startContinuousRecognition(suggestedInterval);
	},

	trackerLoaded: function trackerLoadedFn() {
		// World.startContinuousRecognition(5000);
		World.worldLoaded();
	},
	scan: function scanFn() {
		document.getElementById('loadingMessage').style.display = "block";
		World.cloudRecognitionService.recognize(this.onRecognition, this.onRecognitionError);
	},
	worldLoaded: function worldLoadedFn() {
		//var cssDivInstructions = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
		document.getElementById('loadingMessage').style.display = "none";
	},
	closeAR: function closeARFn() {
		console.log("AR closed clicked!")
		//World.tracker.stopContinuousRecognition();
		AR.platform.sendJSONObject({

			name: "button",

			action: "close"

		});
		//document.location = "architectsdk://button?action=close";
		//document.location = "architectsdk://button?action=hide";
	},
	screenshot: function screenshotFn() {
		AR.platform.sendJSONObject({
			name: "button",
			action: "captureScreen"
		})
	}
};

World.init();
