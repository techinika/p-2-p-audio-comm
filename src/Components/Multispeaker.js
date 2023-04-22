import { useRef } from 'react';
import css from '../Assets/css/roomScreen.module.css';
import displayImage from "../Assets/images/Images/default_dp.jpg";

export default function Multispeaker(props){
    const leftRef = useRef(null);
    const centerRef = useRef(null);
    const rightRef = useRef(null);
    let frequencyData = [];
    let bufferLength = 0;
    let analyser;
  
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
        analyser.fftSize = 64;
        dataSource.connect(analyser);
        return analyser;
    }
    
    function drawBar(){
      requestAnimationFrame(drawBar);
      let outputfrequency;
      let sideDots;
      analyser.getByteFrequencyData(frequencyData);
      const frequencySum = frequencyData.reduce((a, b) => a + b);
      const minifedFrequency = frequencySum/300;
      if (minifedFrequency > 18){
          outputfrequency = 18;
      }else if(minifedFrequency < 5){
          outputfrequency = 4;
      }else{
          outputfrequency = minifedFrequency;
      }
      let sideFrequency = outputfrequency-3
      if(sideFrequency > 10){
        sideDots = 10;
      }else if(sideFrequency < 5){
        sideDots = 4;
      }else{
        sideDots = sideFrequency;
      }
      leftRef.current.style.height = sideDots + 'px';
      centerRef.current.style.height = outputfrequency + 'px';
      rightRef.current.style.height = sideDots + 'px';
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
            <img src={props.peerImg==null ? displayImage : props.peerImg} className={css.userImage}/>
        </div>
        <div className={css.bottom}>
            <p className={css.username}>{props.peerName}</p>
            <div className={css.smallspeaker}>
                <div className={css.youdiv}>
                <img src={!props.profileimg ? displayImage : props.profileimg} className={css.smalluserImg}/>
                  <div className={css.smallVisualizer}>
                    <div className={css.dots} ref={leftRef}></div>
                    <div className={css.dots} ref={centerRef}></div>
                    <div className={css.dots} ref={rightRef}></div>
                  </div>
                </div>
                <p className={css.you}>You</p>
            </div>
        </div>
        </div>
        </>
    );
}