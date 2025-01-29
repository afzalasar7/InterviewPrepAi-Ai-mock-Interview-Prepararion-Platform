import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSections({activeQuestionIndex,mockInterViewQuestion}) {
    
   const textToSpeach=(text)=>{
    if('speechSynthesis' in window){
      const speech= new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }else{
      alert('Sorry, Your browser does not sport text to speech (recommended browser Chrome)')
    }

   }
  return mockInterViewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center'>
            {mockInterViewQuestion&&mockInterViewQuestion?.map((question,index)=>(
                 <h2 key={index+1} className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex==index&&'!bg-primary text-white'}`}>Question #{index+1}</h2>
            ))}
        </div>
        <h2 className='my-5 text-sm md:text-lg'>
          <strong>Q.</strong>  {mockInterViewQuestion[activeQuestionIndex]?.question}
        </h2>
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterViewQuestion[activeQuestionIndex]?.question)} />
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
  <h2 className='flex gap-2 items-center text-blue-700'>
    <Lightbulb/>
    <strong>Note:</strong>
  </h2>
  <h2 className='my-2 text-sm text-blue-700'>
  We do not record your video. Webcam access is only enabled with your permission for a real interview feel, and you can disable it at any time.
  </h2>
  
  <div className="mt-4">
    <h2 className='flex gap-2 items-center text-blue-700'>
      <strong>Recording Instructions:</strong>
    </h2>
    <h2 className='my-2 text-sm text-blue-700'>
  1. <strong>Press the "Start Recording" button</strong> to begin speaking your answer.<br/>
  2. <strong>Speak your answer in one go</strong> without pausing, as the recording captures everything after you press the button.<br/>
  3. <strong>Press the button again</strong> to stop and save your response.<br/>
  4. After recording, a pop-up confirms with <strong>'Answer recorded successfully!'</strong>. If not, ensure your microphone is on and permissions are granted.<br/>
  5. After recording, <strong>move to the next question</strong>.<br/>
</h2>
  </div>
</div>

    </div>
  )
}

export default QuestionsSections