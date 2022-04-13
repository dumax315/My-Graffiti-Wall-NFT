import './App.css';
// import Minter from './Minter'
// import WallCollectionViewer from './viewer'
import { Route, Routes } from 'react-router-dom';

import newWallPage from './newWall.js';
import graffitiWallWraper from './graffitiWall.js';

const newWallPageCom = newWallPage()
const graffitiWallCom = graffitiWallWraper()


function App() {
	return (
		<Routes>
			<Route exact path='/' element={newWallPageCom}></Route>
			<Route exact path='/graffitiWall' element={graffitiWallCom}></Route>
		</Routes>
  );
}

export default App;
