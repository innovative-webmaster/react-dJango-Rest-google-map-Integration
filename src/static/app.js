import React from 'react';
import { connect } from 'react-redux';

// More needed here
import './styles/semantic/dist/semantic.min.css';
import './styles/semantic/dist/components/transition';
import './styles/semantic/dist/components/dropdown';
import './styles/semantic/dist/components/form';
import './styles/semantic/dist/components/rating';
import './styles/semantic/dist/components/checkbox';
import './styles/semantic/dist/components/popup';

class App extends React.Component {

    static propTypes = {
        isAuthenticated: React.PropTypes.bool.isRequired,
        children: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        pathName: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="full-size-container">
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        pathName: ownProps.location.pathname
    };
};

export default connect(mapStateToProps)(App);
export { App as AppNotConnected };
