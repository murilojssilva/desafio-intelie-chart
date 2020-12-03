import React from 'react';
import { Button, Navbar } from 'react-bootstrap';

export default function Editor(props){
    const editor = (
        <div>
            <div>
                <textarea id="textarea" className="text-area" value={props.json} onChange={props.onChange} />
            </div>
            <div className="fixed-bottom">  
            <Navbar className="footer">
                    <Button id="chartbutton" onClick={props.onClick}>GENERATE CHART</Button>
            </Navbar>
            </div>
        </div>
    )

    return editor;
}