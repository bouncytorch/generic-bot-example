import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
var page;

class App extends React.Component {render() { return (
    <div className='app'>
        broooooo
    </div>
)} }



const setPage = (p) => {
    page = p;
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);