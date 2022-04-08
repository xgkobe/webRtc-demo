import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
// import remote from '@electron/remote';
// console.log(remote);
// const { dialog } = require('@electron/remote');
// const remote = require('@electron/remote');
import { contextBridge, ipcRenderer } from 'electron';

import * as fs from 'fs';
// console.log(fs);
import PlayerCanvas from '../../objects/PlayerCanvas';
const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 640;


new Vue({
    el: "#root",
    data: {
        recording: false,
    },
    created() {
        console.log('哈哈吧')
    },
    mounted() {
        console.log('啦啦');
        this._playerCanvas = new PlayerCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    },
    methods: {
        async btnStartRecord() {
            console.log('啦啦');
            this._stream = new MediaStream();
            // 声音数据,添加到stream里面
            this._audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            this._audioStream.getAudioTracks().forEach(value => this._stream.addTrack(value));
            // 视频数据
            this._cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });


            this._screenStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        minWidth: SCREEN_WIDTH,
                        maxWidth: SCREEN_WIDTH,
                        minHeight: SCREEN_HEIGHT,
                        maxHeight: SCREEN_HEIGHT,
                    }
                }
            });

            this._playerCanvas.setCameraVideo(this.createVideoElementWithStream(this._cameraStream));
            this._playerCanvas.setScreenVideo(this.createVideoElementWithStream(this._screenStream));

            let playerCanvasStream = this._playerCanvas.canvas.captureStream();
            playerCanvasStream.getTracks().forEach(t => this._stream.addTrack(t));
            this.$refs.preview.srcObject = this._stream;
            this.startRecord();
        },

        createVideoElementWithStream(stream) {
            let video = document.createElement('video');
            video.autoplay = true;
            video.srcObject = stream;
            return video;
        },

        // 开始录制
        startRecord() {
            this._recorder = new MediaRecorder(this._stream, { mimeType: 'video/webm;codecs=h264' });
            this._recorder.ondataavailable = async (e: any) => {
                window.electron.ipcRenderer.openDialog();
                window.electron.ipcRenderer.on('open-dialog', async (path: string) => {
                    window.electron.fs.writeFileSync(path, new Uint8Array(await e.data.arrayBuffer()))
                });
            };
            this._recorder.start();
            this.recording = true;
        },
        // 停止录制
        bunStopRecord(e: any) {
            this.recording = false;
            this._recorder.stop();
        }
    }
})
// import { render } from 'react-dom';
// import * as fs from 'fs';
// console.log(fs)
// render(<div>哈哈1</div>, document.getElementById('root'));
