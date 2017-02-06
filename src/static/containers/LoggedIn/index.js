import React from 'react';
import { connect } from 'react-redux';
import './style.scss';
import { authLogoutAndRedirect } from '../../actions/auth';
import { push } from 'react-router-redux';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';

class LoggedInView extends React.Component {

    static propTypes = {
        isAuthenticated: React.PropTypes.bool.isRequired,
        children: React.PropTypes.element.isRequired,
        dispatch: React.PropTypes.func.isRequired,
        pathName: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            favoritesCount: 0
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    logout = () => {
        this.props.dispatch(authLogoutAndRedirect());
    };

    jiggleFavorites = () => {
        $('#favorites-icon').transition('flash');
        this.setState({ favoritesCount: this.state.favoritesCount+1 });
    }

    render() {
        let upperRight = null;
        let mapItem = null;

        if (this.props.isAuthenticated) {
            upperRight = (
                <div className="right menu">
                    <a href="#" onClick={() => this.props.dispatch(push('/user/favorites'))} className="item">
                        <i id="favorites-icon" className="fa-heart icon" aria-hidden="true"></i>Favorites
                    </a>
                    <div className="ui simple dropdown item">
                        {this.props.firstName} <i className="dropdown icon"></i>
                        <div className="menu">
                            <a className="item" href="#" onClick={() => this.props.dispatch(push('/building/add'))}>
                                Add building
                            </a>
                            <a className="item" href="#" onClick={() => this.props.dispatch(push('/unit/add'))}>
                                Add unit
                            </a>
                            <a className="item" href="#" onClick={() => this.props.dispatch(push('/review/add'))}>
                                Add review
                            </a>
                            <a className="item" href="#" onClick={() => this.props.dispatch(push('/unit/list'))}>
                                My units
                            </a>
                            <a className="item" href="#" onClick={this.logout}>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            )

            mapItem = (
                <a href="#" onClick={() => this.props.dispatch(push('/map'))} className="item">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;Map
                </a>
            )
        }

        else {
            upperRight = (
                <div className="right menu">
                    <div className="item">
                        <a href="#" onClick={() => this.props.dispatch(push('/signup'))} className="ui primary button">Sign up</a>
                    </div>
                    <div className="item">
                        <a href="#" onClick={() => this.props.dispatch(push('/'))}  className="ui button">Log-in</a>
                    </div>
                </div>
            )
        }

        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                jiggleFavorites: this.jiggleFavorites
            })
        );

        return (
            <div>
                <div className="ui fixed menu">
                    <div className="ui container">
                        <a href="#" onClick={() => this.props.dispatch(push('/home'))} className="header item">
                            <img className="logo" src={require("./logo.jpg")}/>
                            gndapts
                        </a>
                        {mapItem}
                        {upperRight}
                    </div>
                </div>
                <div className="main">
                    {childrenWithProps}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        firstName: state.auth.firstName,
        isGettingFavoritesCount: state.user.isGettingFavoritesCount,
        hasGottenFavoritesCount: state.user.hasGottenFavoritesCount,
        pathName: ownProps.location.pathname
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInView);
export { LoggedInView as LoggedInNotConnected };
