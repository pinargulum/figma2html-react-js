import { useState, useEffect } from 'react'
import NodeRenderer from './renderer/NodeRenderer.jsx'

import './App.css'


function App() {
 const [doc, setDoc] = useState();
useEffect(() => {
fetch("/figma.json")
.then(res => res.json())
.then(data => setDoc(data.document))
.catch(err => console.error(err));
}, []);

if (!doc) return <div>Loading...</div>;
  return (
    
      <div>
        <NodeRenderer node={doc} />
      </div>
      
   
  )
}

export default App
