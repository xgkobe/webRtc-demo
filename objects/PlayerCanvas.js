class PlayerCanvas {
    constructor(width, height) {
        this._canvas = document.createElement('canvas');
        this._canvasWidth = width;
        this._canvasHeight = height;
        this._CANMERA_VIDEO_WIDTH = 200;
        this._CAMERA_VIDEO_HEIGHT = 150;

        this._context2d = this._canvas.getContext('2d');
        requestAnimationFrame(() => {
            this.animationFramehander();
        })
    }

    /**
     * 
     * @param {HTMLVideoElement} video 
     */
    setScreenVideo(video) {
        this._screenVideo = video;
    }

    setCameraVideo(video) {
        this._cameraVideo = video;
    }

    animationFramehander() {
        if (this._screenVideo) {
            this._context2d.drawImage(this._screenVideo, 0, 0, 400, 200);
        }
        if (this._cameraVideo) {
            // 将头像绘制到右下角
            this._context2d.drawImage(  this._cameraVideo, 
                                        this._canvasWidth - this._CANMERA_VIDEO_WIDTH, 
                                        this._canvasHeight - this._CAMERA_VIDEO_HEIGHT,
                                        this._CANMERA_VIDEO_WIDTH,
                                        this._CAMERA_VIDEO_HEIGHT,
                                    )
            
        }
        requestAnimationFrame(() => {
            this.animationFramehander();
        });
    }

    get canvas() {
        return this._canvas;
    }
}

module.exports = PlayerCanvas;