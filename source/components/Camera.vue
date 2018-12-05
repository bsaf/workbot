<template>
  <div class="container">
    <!-- This is the canvas the snapshot gets drawn into -->
    <canvas
      width="320"
      height="240"
      id="snapCanvas"
      style="position: absolute;opacity:1;z-index: -1;left: 100px;"
    ></canvas>

    <!-- This is the canvas the cropped version gets drawn into -->
    <canvas
      width="300"
      height="300"
      id="cropCanvas"
      style="position: absolute;opacity:1;z-index: -1;left: 100px;"
    ></canvas>

    <!-- This is the big video used for display -->
    <video
      id="videoBig"
      v-bind:src="videoStreamURL"
      :class="{ blur : blurVideo }"
      preload
      autoplay
      loop
      muted
    ></video>
    <!-- This is the small video used for tracking.js -->
    <video id="videoSmall" ref="video" preload autoplay loop muted></video>

    <!-- The live face tracking circle (the v-if was 'faceLeft') -->
    <div v-if="faceRect" class="faceRect" :style="faceRectStyle"></div>

    <!-- The face target -->
    <transition name="fade">
      <div
        v-if="showFaceTarget"
        class="faceTarget"
        ref="faceTarget"
        :class="{ active : faceInTarget }"
        :style="targetStyle"
      >
        <transition name="fade">
          <FaceTargetCountdown
            v-if="showCountdown()"
            :state="state"
            @countdown-finished="snapAndSend()"
          ></FaceTargetCountdown>
        </transition>
      </div>
    </transition>

    <!-- The snapshot -->
    <img
      v-if="false"
      :src="snapshotUrl"
      id="snapshot"
      ref="snapshot"
      style="transform: scaleX(-1);position: absolute; top: 0; right: 0; bottom: 0;width: 100%;"
    >
  </div>
</template>

<script>
import oxford from "../js/oxford";
import Tracking from "../js/tracking/tracking.js";
import FaceTargetCountdown from "./FaceTargetCountdown";

const SNAPSHOT = {
  WIDTH: 320,
  HEIGHT: 240
};

const SCREEN = {
  WIDTH: 1920,
  HEIGHT: 1080
};

const TARGET = {
  WIDTH: 900,
  HEIGHT: 900,
  LEFT: 900,
  TOP: 80
};

var faceDetectURL =
  "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion";
var key = "";

export default {
  components: { FaceTargetCountdown },

  props: {
    state: {
      type: String,
      default: "idle"
    }
  },

  created() {
    this.$bus.$on("startTracking", event => {
      this.needsToMove = 0; // don't start tracking until the ring is clear
      this.trackingTask.run();
      console.log("[TRACKING] Starting tracking from the bus");
    });
    this.$bus.$on("stopTracking", event => {
      this.trackingTask.stop();
      console.log("[TRACKING] Stopping tracking from the bus");
    });
  },

  mounted() {
    this.startTracking();
    this.updateWebcamsList();
    this.setupVideoStream();
  },

  data() {
    return {
      tracker: null, // holds the tracker.js instance
      trackingTask: null,
      faceRect: {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      },
      stream: null, // the video stream
      facePresent: false,
      facePresentTime: 0, // time when a face was last recorded as being present
      needsToMove: 0,
      detectBuffer: 0,
      webcams: [],
      selectedDeviceId: [
        "f4677c8643662e486837954d2817c1c180126f025b6ddee95fd84bf29ef97524", // Logitech
        "382ed1a6fc1d7cb70d4913834b17652f86b1714f17adf137923d4ac48de45796" // Other Logitech
      ],
      selectedDeviceIndex: 1, // which camera in the above array to use
      snapshotUrl: null,
      videoWidth: null,
      videoHeight: null
    };
  },

  methods: {
    startTracking() {
      // Set up the tracker
      console.log("[TRACKING] Starting tracking from mounted() hook");
      this.tracker = new Tracking.ObjectTracker("face");
      this.tracker.setInitialScale(2); // default was 4, this works better for small faces
      this.tracker.setStepSize(2);
      this.tracker.setEdgesDensity(0.1);
      var vid = document.getElementById("videoSmall");
      this.videoWidth = vid.clientWidth;
      this.videoHeight = vid.clientHeight;
      this.trackingTask = Tracking.track(vid, this.tracker, { camera: true });
      this.tracker.on("track", event => {
        if (event.data.length > 0) {
          const rect = event.data[0];
          this.faceRect.top = rect.y;
          this.faceRect.left = rect.x;
          this.faceRect.height = rect.height;
          this.faceRect.width = rect.width;
          this.facePresent = true;
          this.facePresentTime = Date.now();
        }
      });
    },
    updateWebcamsList() {
      this.webcams = [];
      navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
          if (device.kind == "videoinput") this.webcams.push(device);
        });
      });
    },
    // this video stream is only used for display, not tracking
    // tracking.js sets up its own stream
    setupVideoStream() {
      navigator.mediaDevices
        .getUserMedia(this.webcamConstraints)
        .then(stream => {
          this.stream = stream;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    getSnapshotAsCanvas() {
      var canvas = document.getElementById("snapCanvas");
      var context = canvas.getContext("2d");
      var video = document.getElementById("videoSmall");
      context.drawImage(video, 0, 0, SNAPSHOT.WIDTH, SNAPSHOT.HEIGHT);
      return canvas;
    },
    getSnapshotAsUrl() {
      var canvas = this.getSnapshotAsCanvas();
      var snapshotUrl = canvas.toDataURL("image/jpeg");
      return snapshotUrl;
    },
    cropImageAndReturnUrl(imageUrl, rect) {
      const cropSize = 300;
      const padding = 50;
      var original = document.getElementById("snapCanvas");
      var cropped = document.getElementById("cropCanvas");
      var context = cropped.getContext("2d");
      context.drawImage(
        original,
        rect.left - padding,
        rect.top - padding, // top left corner of source image you want to snap
        rect.width + 2 * padding,
        rect.height + 2 * padding, // width/height of the sub-rectangle in the source image
        0,
        0, // top left corner of destination canvas
        cropSize,
        cropSize
      ); // width/height of destination drawing
      return cropped.toDataURL("image/jpeg");
    },
    snapAndSend() {
      this.$emit("contacting");
      var snapshotUrl = this.getSnapshotAsUrl();
      this.snapshotUrl = snapshotUrl; // set the big image
      this.faceDetect(snapshotUrl); // send the image to Microsoft to detect
    },
    faceDetect(dataUrl) {
      fetch(faceDetectURL, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/octet-stream"
        },
        body: oxford.makeBuffer(dataUrl)
      })
        .then(response => {
          return response.json();
        })
        .then(body => {
          if (body.length) {
            const rect = body[0].faceRectangle;
            const croppedImageUrl = this.cropImageAndReturnUrl(dataUrl, rect);
            this.$emit("employeeDataReceived", {
              body: body,
              imageUrl: croppedImageUrl
            });
          } else {
            this.$emit("api-error");
            console.log("No face detected from API");
          }
        });
    },
    // needs to be a method, not computed, because we want to
    // check against the updated Date.now() each time, which
    // does not get updated in computed
    showCountdown() {
      if (!this.faceInTarget) return false;
      else if (this.faceLastSeen() < 1000) return true;
      else return;
    },
    faceLastSeen() {
      return Date.now() - this.facePresentTime;
    }
  },

  computed: {
    showFaceTarget() {
      if (this.state === "idle") return true;
      else return false;
    },
    blurVideo() {
      if (this.state === "idle") return false;
      else if (this.state === "end") return false;
      else return true;
    },
    targetStyle() {
      var style = {
        top: TARGET.TOP + "px",
        left: TARGET.LEFT + "px",
        width: TARGET.WIDTH + "px",
        height: TARGET.HEIGHT + "px"
      };
      return style;
    },
    adjustedFaceRect() {
      var adjusted = {};
      if (this.videoWidth && this.videoHeight) {
        var widthMultiplier = SCREEN.WIDTH / this.videoWidth;
        var heightMultiplier = SCREEN.HEIGHT / this.videoHeight;
        var faceRectMinDimension = Math.min(
          this.faceRect.width,
          this.faceRect.height
        );
        adjusted = {
          top: this.faceRect.top * heightMultiplier,
          right: this.faceRect.left * widthMultiplier,
          width: faceRectMinDimension * widthMultiplier,
          height: faceRectMinDimension * widthMultiplier
        };
        adjusted.left = SCREEN.WIDTH - adjusted.right - adjusted.width;
        adjusted.bottom = adjusted.top + adjusted.height;
      }
      return adjusted;
    },
    faceInTarget() {
      var boundry = {
        top: TARGET.TOP - 20,
        bottom: TARGET.TOP + TARGET.HEIGHT + 20,
        left: TARGET.LEFT - 20,
        right: TARGET.LEFT + TARGET.WIDTH + 20
      };

      console.log("needs to move", this.needsToMove);
      // no face but there's a buffer
      if (!this.facePresent && this.detectBuffer > 0) {
        console.log("there's a buffer:", this.detectBuffer);
        this.detectBuffer--;
        this.$emit("face-detected");
        return true;
      }
      // no face present or not in target
      else if (
        !this.facePresent ||
        this.adjustedFaceRect.top < boundry.top ||
        this.adjustedFaceRect.bottom > boundry.bottom ||
        this.adjustedFaceRect.left < boundry.left ||
        this.adjustedFaceRect.left + this.adjustedFaceRect.width > boundry.right
      ) {
        if (this.needsToMove > 0) this.needsToMove--;
        this.$emit("face-lost");
        return false;
      }
      // needs to move!
      else if (this.needsToMove) return false;
      else {
        this.detectBuffer++;
        if (this.detectBuffer > 3) this.detectBuffer = 3;
        console.log("face in target", true);
        this.$emit("face-detected");
        return true;
      }
    },
    webcamConstraints() {
      // uses the selected device ID if set
      return {
        audio: false,
        video: {
          optional: [
            { sourceId: this.selectedDeviceId[this.selectedDeviceIndex] }
          ]
        }
      };
    },
    videoStreamURL() {
      if (this.stream) return window.URL.createObjectURL(this.stream);
    },
    faceRectStyle() {
      var style;
      style = {
        top: this.adjustedFaceRect.top + "px",
        left: this.adjustedFaceRect.left + "px",
        width: this.adjustedFaceRect.width + "px",
        height: this.adjustedFaceRect.height + "px"
      };
      return style;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../sass/variables";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
}

.mask {
  background-image: url(../img/mask.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
  transition: opacity 1s ease-in-out;
}

.mask.active {
  opacity: 1;
}

#videoSmall {
  position: absolute;
  width: 300px;
  height: 240px;
  z-index: 0;
  opacity: 0;
}

#videoBig {
  position: absolute;
  transform: scaleX(-1);
  width: 100%; // height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s filter ease-in-out;
}

#videoBig.blur {
  filter: blur(40px);
}

.faceTarget {
  // position and size defined in computed prop
  position: absolute;
  border: 20px solid rgba(black, 0.1);
  border-radius: 500px;
  padding: 10px;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: 0.3s all ease-in-out;
}

.faceTarget.active {
  border: 20px solid rgba($yellow, 1);
}

.faceRect {
  position: absolute;
  // border: 6px solid red;
  border-radius: 5000px;
  padding: 10px;
  z-index: 1000000000;
  pointer-events: none;
}

.trackingMonitor {
  display: block;
  position: absolute;
  right: 10px;
  top: 10px;
  opacity: 0;
}
</style>
