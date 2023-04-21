import { useEffect } from "react";
import { useRef } from "react";

export default function Sandbox(){
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  let frequencyData = [];
  let bufferLength = 0;
  let analyser;
  
  useEffect(()=>{
    const canvas = canvasRef.current;
    canvas.width = 200;
    canvas.height = 200;
    const context = canvas.getContext("2d");
    contextRef.current = context;
  }, []);

  const audioTest = async () => {

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
      analyser.getByteFrequencyData(frequencyData);
      contextRef.current.clearRect(0, 0, 200, 200);
      const frequencySum = frequencyData.reduce((a, b) => a + b);
      const minifedFrequency = frequencySum/50;
      let outputfrequency;
      if (minifedFrequency > 98) {
          outputfrequency = 98;
      } else {
          outputfrequency = minifedFrequency;
      }
      console.log(outputfrequency);
      contextRef.current.beginPath();
      contextRef.current.arc(100, 100, outputfrequency, 0, 2 * Math.PI);
      contextRef.current.fillStyle= "#414245";
      contextRef.current.fill();
    }
  }
  audioTest();
  return (
    <>
    <h1>This is the code sandbox</h1>
    <canvas ref={canvasRef}></canvas>
    </>
  )
}

