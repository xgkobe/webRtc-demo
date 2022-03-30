(async function(name){
    const a = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    const xg = document.querySelector('#xg');
    
    xg.srcObject = a;
})(21)