import React from 'react';
import {Header, Image, Loader} from "semantic-ui-react";
import logo from "../../assets/logo.png"
import "./LoadingStyle.css"

const LoadingComponent = ({}) => {

    return (
        <div>
            <div className={'l2w-loading-component'}>
                <Image width={'200px'} src={logo}/>
                <Loader active inline='centered'/>
                <Header icon>
                </Header>
                <br/>
            </div>
        </div>

    );
};

export default LoadingComponent