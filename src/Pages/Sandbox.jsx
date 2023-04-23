import { useEffect } from "react";
import { useRef } from "react";
import css from "../Assets/css/Sandbox.module.css"
import img from "../Assets/images/Images/steve.png"

export default function Sandbox(){
  const circleRef = useRef(null);
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
      drawCircle();
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

  function drawCircle(){
    requestAnimationFrame(drawCircle);
    analyser.getByteFrequencyData(frequencyData);
    const frequencySum = frequencyData.reduce((a, b) => a + b);
    const minifedFrequency = frequencySum/8;
    console.log(minifedFrequency)
    let outputfrequency;
    if (minifedFrequency > 230) {
        outputfrequency = 230;
    } else if (minifedFrequency < 150) {
      outputfrequency = 150;
    } else {
        outputfrequency = minifedFrequency;
    }
    
    circleRef.current.style.height = outputfrequency + 'px';
    circleRef.current.style.width = outputfrequency + 'px';
    // circleRef.current.style.borderRadius = outputfrequency + 'px';
  }
  return (
    <>
    {/* <h1>This is the code sandbox</h1> */}
    <div className={css.body}>
      
    <div className={css.center}>
      <div className={css.circle} ref={circleRef}></div>
      <img src={img} className={css.userImage}/>
    </div>
    </div>
    </>
  )
}

