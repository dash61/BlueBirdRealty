import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoadingIndicator from 'react-loading-indicator';
import generateFakeData from './generateFakeData';
import NavHdrFtr from './Components/NavHdrFtr';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import MapPage from './Pages/MapPage';
import SellPage from './Pages/SellPage';
import './index.css'; // include this *after* semantic.css

export const FakeDataContext = React.createContext([]);

export default function App() {
  const [fakeData, setFakeData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const data = generateFakeData();
    setFakeData(data);
    setLoading(false);
  }, []);

  return (
    loading ? (
      <div className="spinnerDiv" style={{display: "flex", flexDirection: "column"}}>
        <LoadingIndicator segmentWidth={40} segmentLength={40}/>
      </div>
    ) : (
      <FakeDataContext.Provider value={fakeData}>
        <BrowserRouter>
          <NavHdrFtr>
            <Routes>
              <Route path="" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/auth/:type" element={<AuthPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/map1" element={<MapPage />} />
              <Route path="/map2" element={<MapPage />} />
            </Routes>
          </NavHdrFtr>
        </BrowserRouter>
      </FakeDataContext.Provider>
    )
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
