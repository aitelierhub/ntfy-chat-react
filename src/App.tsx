
import './App.css'
import { Chat } from '../lib/chat/chat'

function App() {

  return (
    <>
      <Chat room="ntfydemochatroom" title="test" user="test test" iconSource="initials" onHeaderClick={() => {}}></Chat>
    </>
  )
}

export default App
