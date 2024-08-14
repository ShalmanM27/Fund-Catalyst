import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import {ThirdwebProvider} from '@thirdweb-dev/react';

import {StateContextProvider} from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ThirdwebProvider activeChain = {11155111}>
        <Router>
           <StateContextProvider>
            <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)