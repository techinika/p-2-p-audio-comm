import { useEffect, useRef } from 'react';
import css from '../Assets/css/roomScreen.module.css';
import displayImage from "../Assets/images/Images/default_dp.jpg";

export default function Singlespeaker(props){
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    let frequencyData = [];
    let bufferLength = 0;
    let analyser;
    let width;
    let height
    
    useEffect(()=>{
      const canvas = canvasRef.current;
      width = 224;
      height = 224;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      contextRef.current = context;
    }, []);

    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = createAnalyser(audioCtx, source);
        bufferLength = analyser.frequencyBinCount;
        frequencyData = new Uint8Array(bufferLength);
        drawBar();
    })
    .catch(err => {
        alert(err)
    });

    function createAnalyser(context, dataSource) {
        const analyser = context.createAnalyser();
        analyser.fftSize = 32;
        dataSource.connect(analyser);
        return analyser;
    }

    function drawBar(){
      requestAnimationFrame(drawBar);
      analyser.getByteFrequencyData(frequencyData);
      contextRef.current.clearRect(0, 0, width, height);
      const frequencySum = frequencyData.reduce((a, b) => a + b);
      const minifedFrequency = frequencySum/20;
      let outputfrequency;
      if (minifedFrequency > 110) {
          outputfrequency = 110;
      } else if (minifedFrequency < 70) {
        outputfrequency = 74;
      } else {
          outputfrequency = minifedFrequency;
      }
      contextRef.current.beginPath();
      contextRef.current.arc(112, 112, outputfrequency, 0, 2 * Math.PI);
      contextRef.current.fillStyle= "#6A6B70";
      contextRef.current.fill();
    }
    return(
        <>
        <div className={css.speaker}>
            <div className={css.top}>
                <div className={css.smallmiccont}>
                    <div className={css.smallmic}/>
                </div>
            </div>
            <div className={css.center}>
                <canvas ref={canvasRef} className={css.canvas}></canvas>
                <img src={props.profileimg==null ? displayImage : props.profileimg} className={css.userImage}/>
            </div>
            <div className={css.bottom}>
                <p className={css.username}>{props.name}</p>
            </div>
        </div>
        </>
    );   
}