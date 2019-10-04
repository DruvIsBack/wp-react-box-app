import React, {Component} from 'react';

import Layout from './components/Layout';
import SimpleLayout from './components/LayoutSimple';

import SelfService from './components/Pages/SelfService';
import QuoteSelection from './components/Pages/QuoteSelection';
import ContactPage from './components/Pages/ContactPage';
import Page404 from './components/Pages/404';
import { MemoryRouter, Route, Switch } from "react-router-dom";
import history from './history';

export default class Routes extends Component {
    render(){
        return (
            <MemoryRouter history={history}>
                <SimpleLayout>
                    <Switch>
                        <Route path="/" exact component={QuoteSelection} />
                        <Route path="/self-service" exact component={SelfService} />
                        <Route path="/contact" exact component={ContactPage} />
                        <Route component={Page404} />
                    </Switch>
                </SimpleLayout>
            </MemoryRouter>
        );
    }
}
