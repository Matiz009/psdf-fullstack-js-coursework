import React from 'react'
import Home from './components/Home'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import About from './components/About'
import Contact from './components/Contact'
import Posts from './components/Posts'
import PostDetails from './components/PostDetails'
import UseRef from './components/Use_Ref'

const App = () => {
  return (
  
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/posts' element={<Posts/>} />
      <Route path='/posts/:id' element={<PostDetails/>} />
      <Route path='/useref' element={<UseRef/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App