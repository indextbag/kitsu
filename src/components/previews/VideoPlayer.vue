<template>
<div ref="container" class="video-player">
  <div ref="video-wrapper" class="video-wrapper">
    <video
      id="annotation-movie"
      ref="movie"
      class="annotation-movie"
      style="display: none;"
      :src="moviePath"
      :poster="posterPath"
    >
    </video>
    <canvas
      id="annotation-canvas"
      ref="annotation-canvas"
      class="canvas"
    >
    </canvas>
  </div>

  <div class="video-progress pull-bottom">
    <progress
      ref="progress"
      value="0"
      min="0"
      @click="onProgressClicked"
    >
      <span
        id="progress-bar"
        ref="progress-bar"
      ></span>
    </progress>
  </div>

  <div
    class="video-annotation pull-bottom"
    ref="annotation-bar"
  >
    <span
      class="annotation-mark"
      :key="`annotation-${annotation.time}`"
      :style="{
        cursor: 'pointer',
        position: 'relative',
        display: 'inline-block',
        'left': getTimelinePosition(annotation.time, index) + 'px'
      }"
      @click="loadAnnotation(annotation.time)"
      v-for="(annotation, index) in annotations"
    >
    </span>
  </div>

  <div class="buttons flexrow pull-bottom">
    <div class="left flexrow">
      <button
        class="button flexrow-item"
        @click="onPlayPauseClicked"
      >
        <pause-icon class="icon" v-if="isPlaying" />
        <play-icon class="icon" v-else />
      </button>

      <button
        :class="{
          button: true,
          'flexrow-item': true,
          active: isRepeating
        }"
        @click="onRepeatClicked"
      >
        <repeat-icon class="icon smaller" />
      </button>

      <span class="flexrow-item time-indicator">
        {{ currentTime }} / {{ maxDuration }}
      </span>
    </div>

    <div class="right flexrow">
      <button
        class="button flexrow-item"
        @click="onDeleteClicked"
        v-if="isFullScreenEnabled"
      >
        <x-icon class="icon" />
      </button>

      <button
        class="button flexrow-item"
        @click="onAnnotateClicked"
        v-if="isFullScreenEnabled"
      >
        <square-icon class="icon" />
      </button>

      <button
        class="button flexrow-item"
        @click="onCircleAnnotateClicked"
        v-if="isFullScreenEnabled"
      >
        <circle-icon class="icon" />
      </button>

      <button
        :class="{
          button: true,
          'flexrow-item': true,
          active: isDrawing
        }"
        @click="onPencilAnnotateClicked"
        v-if="isFullScreenEnabled"
      >
        <edit-2-icon class="icon" />
      </button>

      <button
        class="button flexrow-item"
        @click="onFullscreenClicked"
        v-if="isFullScreenEnabled"
      >
        <maximize-icon class="icon" />
      </button>

      <a
        target="_blank"
        class="button flexrow-item"
        :href="moviePath"
      >
        <download-icon class="icon" />
      </a>
    </div>
  </div>
</div>
</template>

<script>
import { fabric } from 'fabric'
import {
  CircleIcon,
  DownloadIcon,
  Edit2Icon,
  MaximizeIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  SquareIcon,
  XIcon
} from 'vue-feather-icons'

export default {
  name: 'video-player',

  components: {
    CircleIcon,
    DownloadIcon,
    Edit2Icon,
    MaximizeIcon,
    PauseIcon,
    PlayIcon,
    RepeatIcon,
    SquareIcon,
    XIcon
  },

  props: {
    preview: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      annotations:
        this.preview.annotations ? [...this.preview.annotations] : [],
      currentTime: '00:00.00',
      fabricCanvas: null,
      isDrawing: false,
      isPlaying: false,
      isRepeating: false,
      maxDuration: '00:00.00',
      videoDuration: 0
    }
  },

  mounted () {
    setTimeout(() => {
      if (this.video) {
        this.video.addEventListener('loadedmetadata', () => {
          this.reloadAnnotations()
          if (this.video.currentTime === 0) {
            this.clearCanvas()
            setTimeout(() => {
              this.mountVideo()
            }, 100)
          }
          this.video.addEventListener('timeupdate', this.updateProgressBar)
          this.video.onended = this.onVideoEnd
        })

        window.addEventListener('keydown', (event) => {
          if (event.keyCode === 46 && this.fabricCanvas) {
            this.deleteSelection()
          }
        }, false)

        window.removeEventListener('resize', this.onWindowResize)
        window.addEventListener('resize', this.onWindowResize)
      }
    }, 0)
  },

  computed: {
    container () {
      return this.$refs.container
    },

    canvas () {
      return this.$refs.canvas
    },

    video () {
      return this.$refs.movie
    },

    videoWrapper () {
      return this.$refs['video-wrapper']
    },

    progress () {
      return this.$refs.progress
    },

    progressBar () {
      return this.$refs['progress-bar']
    },

    moviePath () {
      return `/api/movies/originals/preview-files/${this.preview.id}.mp4`
    },

    posterPath () {
      return `/api/pictures/previews/preview-files/${this.preview.id}.png`
    },

    isVideo () {
      return this.$refs.movie && this.videoDuration && this.videoDuration > 0
    },

    isFullScreen () {
      return !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      )
    },

    isFullScreenEnabled () {
      return !!(
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled ||
        document.webkitSupportsFullscreen ||
        document.webkitFullscreenEnabled ||
        document.createElement('video').webkitRequestFullScreen
      )
    }
  },

  beforeDestroy () {
    this.clearCanvas()
  },

  methods: {
    updateProgressBar () {
      if (!this.progress.getAttribute('max')) {
        this.progress.setAttribute('max', this.video.duration)
      }
      this.progress.value = this.video.currentTime * 1
      this.progressBar.style.width = Math.floor(
        (this.video.currentTime / this.video.duration) * 100
      ) + '%'
      this.currentTime = this.formatTime(this.video.currentTime)
    },

    mountVideo () {
      this.isResizing = true
      this.clearCanvas()

      setTimeout(() => {
        this.video.mute = true
        this.videoDuration = this.video.duration
        this.progress.setAttribute('max', this.videoDuration)
        this.maxDuration = this.formatTime(this.videoDuration)
        this.isPlaying = false
        this.isRepeating = false

        if (this.container) {
          const dimensions = this.getDimensions()
          const width = dimensions.width
          const height = dimensions.height

          this.video.style.width = width + 'px'
          this.video.style.height = height + 'px'
          this.videoWrapper.style.width = width + 'px'
          this.videoWrapper.style.height = height + 'px'

          this.fabricCanvas = this.setupFabricVideo(width, height)
          this.fabricCanvas.on('object:moved', this.saveAnnotations)
          this.fabricCanvas.on('object:scaled', this.saveAnnotations)
          this.fabricCanvas.on('mouse:up', () => {
            if (this.isDrawing) this.saveAnnotations()
          })
          this.isResizing = false
        }
      }, 100)
    },

    clearCanvas () {
      try {
        if (this.fabricCanvas) this.fabricCanvas.dispose()
      } catch (err) { }
      if (this.$refs['annotation-canvas']) {
        this.$refs['annotation-canvas'].innerHTML = ''
        this.$refs['annotation-canvas'].innerText = ''
        this.$refs['annotation-canvas'].html = ''
      }
    },

    getDimensions () {
      const ratio = this.video.videoHeight / this.video.videoWidth
      let width = this.container.offsetWidth - 1
      let height = width * ratio

      const maxHeight = screen.width > 1300 ? 500 : 300
      if (height > maxHeight) {
        height = maxHeight
        width = Math.round(height / ratio)
      }

      const isFullScreen = !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      )

      if (isFullScreen) {
        width = screen.width - 1
        height = width * ratio

        if (height + 50 > screen.height) {
          height = screen.height - 50
          width = height / ratio
        }
      }

      return { width, height }
    },

    setupFabricVideo (width, height, update = false) {
      let fabricCanvas = this.fabricCanvas
      if (!update) {
        fabricCanvas = new fabric.Canvas('annotation-canvas')
        fabricCanvas.setDimensions({
          width: width,
          height: height
        })
      }
      const fabricVideo = new fabric.Image(this.video, {
        left: 0,
        top: 0,
        width: this.video.videoWidth,
        height: this.video.videoHeight,
        objectCaching: false,
        selectable: false
      })
      fabricVideo.scaleToWidth(width)
      fabricVideo.scaleToHeight(height)
      fabricCanvas.add(fabricVideo)
      fabricVideo.sendToBack()

      fabricCanvas.freeDrawingBrush.color = '#ff3860'
      fabricCanvas.freeDrawingBrush.width = 4

      fabric.util.requestAnimFrame(function render () {
        try {
          fabricCanvas.renderAll()
        } catch (err) { }
        fabric.util.requestAnimFrame(render)
      })

      fabricCanvas.off('object:scaling', this.onScaled)
      fabricCanvas.on('object:scaling', this.onScaled)
      fabricCanvas.off('object:scaled', this.onScaled)
      fabricCanvas.on('object:scaled', this.onScaled)
      return fabricCanvas
    },

    play () {
      this.clearAnnotations()
      this.isPlaying = true
      this.video.play()
    },

    pause () {
      this.isPlaying = false
      this.video.pause()
    },

    onVideoEnd () {
      this.isPlaying = false
      if (this.isRepeating) {
        this.video.currentTime = 0
        this.progress.value = 0
        this.play()
      }
    },

    onPlayPauseClicked () {
      if (this.video.paused || this.video.ended) {
        this.play()
      } else {
        this.pause()
      }
    },

    onRepeatClicked () {
      if (this.isRepeating) {
        this.isRepeating = false
      } else {
        this.isRepeating = true
      }
    },

    onProgressClicked (e) {
      var pos =
        (e.pageX - this.progress.offsetLeft) / this.progress.offsetWidth
      const currentTime = pos * this.video.duration
      this.progress.value = currentTime
      this.progressBar.style.width = Math.floor(
        (currentTime / this.video.duration) * 100
      ) + '%'

      this.video.currentTime = currentTime
    },

    onFullscreenClicked () {
      const isFullScreen = !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      )

      if (isFullScreen) {
        this.exitFullScreen()
      } else {
        this.setFullScreen()
      }
      setTimeout(() => {
        this.emitResizeEvent()
      }, 100)
    },

    onScaled (event) {
      const obj = event.target
      if (obj) obj.set({ strokeWidth: 8 / (obj.scaleX + obj.scaleY) })
    },

    exitFullScreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      this.container.setAttribute('data-fullscreen', !!false)
    },

    setFullScreen () {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen()
      } else if (this.container.mozRequestFullScreen) {
        this.container.mozRequestFullScreen()
      } else if (this.container.webkitRequestFullScreen) {
        this.container.webkitRequestFullScreen()
      } else if (this.container.msRequestFullscreen) {
        this.container.msRequestFullscreen()
      }
      this.container.setAttribute('data-fullscreen', !!true)
    },

    emitResizeEvent () {
      const evt = window.document.createEvent('UIEvents')
      evt.initUIEvent('resize', true, false, window, 0)
      window.dispatchEvent(evt)
    },

    onDeleteClicked () {
      this.deleteSelection()
    },

    onAnnotateClicked () {
      this.fabricCanvas.isDrawingMode = false
      this.isDrawing = false

      const rect = new fabric.Rect({
        left: this.fabricCanvas.width / 2 - 25,
        top: this.fabricCanvas.height / 2 - 25,
        fill: 'transparent',
        strokeWidth: 4,
        stroke: '#ff3860',
        width: 50,
        height: 50
      })

      this.fabricCanvas.add(rect)
      this.fabricCanvas.setActiveObject(rect)
      this.saveAnnotations()
    },

    onCircleAnnotateClicked () {
      this.fabricCanvas.isDrawingMode = false
      this.isDrawing = false

      const circle = new fabric.Circle({
        left: this.fabricCanvas.width / 2 - 25,
        top: this.fabricCanvas.height / 2 - 25,
        radius: 20,
        fill: 'transparent',
        strokeWidth: 4,
        stroke: '#ff3860',
        width: 50,
        height: 50
      })

      this.fabricCanvas.add(circle)
      this.fabricCanvas.setActiveObject(circle)
      this.saveAnnotations()
    },

    onPencilAnnotateClicked () {
      if (this.fabricCanvas.isDrawingMode) {
        this.fabricCanvas.isDrawingMode = false
        this.isDrawing = false
      } else {
        this.fabricCanvas.isDrawingMode = true
        this.isDrawing = true
      }
    },

    onWindowResize () {
      setTimeout(() => {
        if (!this.isResizing) this.mountVideo()
        this.reloadAnnotations()
      }, 1)
    },

    saveAnnotations () {
      const currentTime = this.video.currentTime
      const annotation = this.getAnnotation(currentTime)
      if (annotation) {
        annotation.drawing = this.fabricCanvas.toJSON()
        annotation.width = this.fabricCanvas.width
        if (annotation.drawing && annotation.drawing.objects.length === 1) {
          const index = this.annotations.findIndex(
            (annotation) => annotation.time === currentTime
          )
          this.annotations.splice(index, 1)
        }
      } else {
        this.annotations.push({
          time: currentTime,
          width: this.fabricCanvas.width,
          drawing: this.fabricCanvas.toJSON()
        })
      }
      this.$emit('annotationchanged', {
        preview: this.preview,
        annotations: [...this.annotations]
      })
    },

    getAnnotation (time) {
      return [...this.annotations].find(
        (annotation) => annotation.time === time
      )
    },

    clearAnnotations () {
      this.fabricCanvas.getObjects().forEach((obj) => {
        if (['rect', 'circle', 'path'].includes(obj.type)) {
          this.fabricCanvas.remove(obj)
        }
      })
    },

    loadAnnotation (time) {
      const annotation = this.getAnnotation(time)

      this.video.pause()
      this.video.currentTime = time

      this.clearAnnotations()

      let scaleMultiplier = 1
      if (annotation.width) {
        scaleMultiplier = this.fabricCanvas.width / annotation.width
      }

      annotation.drawing.objects.forEach((obj) => {
        const base = {
          left: obj.left * scaleMultiplier,
          top: obj.top * scaleMultiplier,
          fill: 'transparent',
          stroke: '#ff3860',
          strokeWidth: 4,
          radius: obj.radius,
          width: obj.width,
          height: obj.height,
          scaleX: obj.scaleX * scaleMultiplier,
          scaleY: obj.scaleY * scaleMultiplier
        }
        if (obj.type === 'rect') {
          const rect = new fabric.Rect({
            ...base
          })
          this.fabricCanvas.add(rect)
          rect.set({strokeWidth: 4})
        } else if (obj.type === 'circle') {
          const circle = new fabric.Circle({
            ...base
          })
          this.fabricCanvas.add(circle)
          circle.set({strokeWidth: 2})
        } else if (obj.type === 'path') {
          const path = new fabric.Path(
            obj.path,
            {
              ...base
            }
          )
          this.fabricCanvas.add(path)
        }
      })
    },

    deleteSelection () {
      this.fabricCanvas.remove(this.fabricCanvas.getActiveObject())
      this.saveAnnotations()
    },

    formatTime (seconds) {
      let milliseconds = `.${Math.round((seconds % 1) * 100)}`
      if (milliseconds.length === 2) milliseconds += '0'
      return new Date(1000 * seconds)
        .toISOString()
        .substr(14, 5) + milliseconds
    },

    getTimelinePosition (time, index) {
      if (this.$refs.movie) {
        let position = Math.round(
          (time / this.$refs.movie.duration) * this.progress.offsetWidth
        )
        position = position - index * 10 - 5
        if (position < 0) position = 0
        return position
      } else {
        return 0
      }
    },

    reloadAnnotations () {
      if (this.preview.annotations) {
        this.annotations = [...this.preview.annotations].sort((a, b) => {
          return a.time < b.time
        }) || []
      } else {
        return []
      }
    }
  },

  watch: {
    preview () {
      this.maxDuration = '00:00.00'
      this.reloadAnnotations()
    }
  }
}
</script>

<style scoped>
.icon {
  margin-top: -4px;
  height: 20px;
}

.smaller {
  height: 16px;
}

.right {
  margin-left: auto;
}

.video-player {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  height: 100%;
}

.video-wrapper {
  flex: 1;
  display: flex;
  background: black;
}

.annotation-movie {
  margin: auto;
}

.pull-bottom {
}

.time-indicator {
  color: #CCC;
  padding-left: 0.8em;
}

#annotation-canvas {
  width: 100%;
  display: block;
}

#annotation-movie {
  width: 100%;
}

.video-player {
  width: 100%;
  text-align: center;
  background: #36393F;
}

.video-wrapper {
  text-align: center;
  margin: auto;
}

.progress {
  padding: 0;
  margin: 0;
  height: 8px;
}

.video-progress {
  cursor: pointer;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: #999;
  height: 8px;
}

progress::-moz-progress-bar {
  background-color: #43B581;
}

progress::-webkit-progress-value {
  background-color: #43B581;
}

progress {
  width: 100%;
  border-radius: 0;
  margin: 0;
  padding: 0;
  border: 0;
  background: #999;
  height: 8px;
  display: block;
}

.progress progress#progress span#progress-bar {
  border-radius: 0;
  margin: 0;
  padding: 0;
  background-color: #43B581;
}

.video-annotation {
  background: #26292F;
  height: 12px;
  text-align: left;
  margin-top: 0px;
  padding: 0;
}

.annotation-mark {
  display: flex;
  background: #ff3860;
  width: 8px;
  height: 8px;
  display: inline-block;
  top: -6px;
}

.buttons .button {
  background: #26292F;
  border-radius: 0;
  color: #BBB;
  border: 0;
  margin: 0;
}

.buttons .button.active,
.buttons .button:hover {
  color: #43B581;
}
</style>