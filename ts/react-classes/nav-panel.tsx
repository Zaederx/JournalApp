// import * as React from 'react';
class Navigation extends React.Component {
    
    element = (
    < div id="nav">
        <div>
            <img src="../img/icons/folder.svg" alt=""/>
            <img src="../../img/icons/document.svg" alt=""/>
        </div>
        <div>
            <img src="../img/icons/add-file.svg" alt=""/>
            <img src="../img/icons/settings-slider.svg" alt=""/>
        </div>
    </div>
);
    render() {
        return this.element;
    }
} 