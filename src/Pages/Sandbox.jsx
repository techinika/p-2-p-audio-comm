export default function Sandbox(){
  const audioTest = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
    const audioCtx = new AudioContext();
    const audioSrc = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser(audioSrc);
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var frequencyArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequencyArray);
    console.log(analyser.getByteFrequencyData(frequencyArray))
  }
  audioTest();
  return (
    <>
    <h1>This is the code sandbox</h1>
    </>
  )
}

