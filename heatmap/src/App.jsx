import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Creates Background
function CreateBackground({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-600 to-zinc-200">{children}</div>
  );
}

//Creates Basketball Court
function CreateCourtElement() {
  return (
    <div className="grid grid-cols-4 gap-4 min-h-screen p-6">
      <div className="bg-orange-400 border-4 border-black col-span-3 rounded-2xl p-6 shadow-lg">
        I NEED TO DRAW A BASKETBALL COURT HERE
      </div>

      <div className="bg-stone border-4 border-black rounded-2xl p-6 shadow-lg">
        COLUMNS WILL GO HERE THAT INTERACT WITH DATABASE
      </div>
    </div>
  );
}

function CreateListElements() {

}

function App() {
  return (
    <div>
      <CreateBackground>
        <CreateCourtElement />
      </CreateBackground>
    </div>
  );
}

export default App
