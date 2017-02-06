import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from '../../routes';

export default class Root extends React.Component {

    static propTypes = {
        store: React.PropTypes.object.isRequired,
        history: React.PropTypes.object.isRequired
    };

    updateGA = () => {
        ga('set', 'page', window.location.pathname);
        ga('send', 'pageview');
    }

    render() {
        return (
            <div>
                <Provider store={this.props.store}>
                    <div>
                        <Router onUpdate={this.updateGA} history={this.props.history}>
                            {routes}
                        </Router>
                    </div>
                </Provider>
            </div>
        );
    }
}
