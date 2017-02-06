import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import './style.scss';

class FavoritesView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emails: [],
            count: 1,
            favoriteShareSuccess: false
        };
    }

    componentWillUnmount() { 
    }

    componentDidMount() {
        this.props.actions.getCurrentUser(this.props.token);
    }

    componentDidUpdate() {
        if (this.props.hasGottenCurrentUser) {
            $(ReactDOM.findDOMNode(this.refs.favoritesForm)).form({
                fields: {
                    email: {
                        identifier  : 'email',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter an e-mail'
                            },
                            {
                                type   : 'email',
                                prompt : 'Please enter a valid e-mail'
                            }
                        ]
                    },
                },
                inline:false
            });
        }

        if (this.props.hasDeletedFavorite) {
            this.props.actions.resetDeleteFavorite();
            this.props.actions.getCurrentUser(this.props.token);
        }

        if (this.props.hasClearedFavorites) {
            this.props.actions.resetClearFavorite();
            this.props.actions.getCurrentUser(this.props.token);
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        this.props.actions.resetCurrentUser();
        this.props.actions.resetShareFavorite();
    }

    handleEmailInputChange = (e, index) => {
        const emails = this.state.emails;
        emails[index] = e.currentTarget.value;
        this.setState({
            emails: emails
        });
    };

    shareFavorites = (index) => {
        $(ReactDOM.findDOMNode(this.refs.favoritesForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.favoritesForm)).form('is valid')) {
            this.props.actions.shareFavorite(this.props.token, this.state.emails);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.statusText != null) {
            $(ReactDOM.findDOMNode(this.refs.favoritesForm)).form('add errors', [nextProps.statusText]);
        }
    }

    removeEmailBox = (index) => {
        if (this.state.count != 1) {
            let newEmailList = this.state.emails.splice(index, 1);
            this.setState({count: this.state.count-1, emails: newEmailList});
        }
    }

    addEmailBox = () => {
        this.setState({count: this.state.count+1});
    }

    render() {
        const formClass = classNames({
            loading: this.props.isGettingCurrentUser
        });

        let favoriteList, clearButton = null;
        let emailBoxContainer = null;

        const buttonClass = classNames({
            loading: this.props.isSendingFavorites
        });

        const clearFavoriteButtonClass = classNames({
            loading: this.props.isClearingFavorites
        });

        if (this.props.hasGottenCurrentUser) {
            if (this.props.user.active_favorites.length == 0) {
                favoriteList = (
                    <span>No favorites</span>
                )
            }

            else {
                favoriteList = (
                    this.props.user.active_favorites.map(function(s,i) {
                        const path = s.building ? "/building/show/" + s.building :
                            "/unit/show/" + s.unit; 
                        return (
                            <div key={i} className="item">
                                <div className="content">
                                    <Link to={path}>{s.title}</Link>
                                    <i onClick={() => this.props.actions.deleteFavorite(this.props.token, s.uuid) } className="link remove icon"></i>
                                </div>
                            </div>
                        )
                    }, this)
                )

                clearButton = (
                    <div className={"ui red submit button tiny " + clearFavoriteButtonClass }
                        type="submit" onClick={() => this.props.actions.clearFavorites(this.props.token)}
                    >
                        Clear
                    </div>
                )

                // Probably a better way to do this?
                let emailBoxes = (
                    Array.from(Array(this.state.count)).map(function(s,i) {
                        return (
                            <div key={i} className="six wide field">
                                <div className="ui left icon action input">
                                    <i className="mail icon"></i>
                                    <input type="text"
                                        name="email"
                                        placeholder="Enter email address"
                                        onChange={(e) => { this.handleEmailInputChange(e, i); }}
                                    />
                                    <a className="ui button" onClick={() => this.removeEmailBox(i)}>
                                        Remove
                                    </a>
                                </div>
                            </div>
                        )
                    }, this)
                )


                emailBoxContainer = (
                    <div id="share-container">
                        <h1 className="ui sub header">Share</h1>
                        <span>Share your favorites with up to three friends via email. You will receive a copy too.</span>
                        <br/>
                        <a id="add-email-btn" className="ui button tiny purple" onClick={() => this.addEmailBox()}>
                            Add email
                        </a>
                        {emailBoxes}
                        <div className={"ui green submit button " + buttonClass }
                            type="submit" onClick={this.shareFavorites}
                        >
                            Share
                        </div>
                    </div>
                )
            }
        }

        let body = null;

        if (this.props.hasSentFavorites) {
            body = (
                <p>Your favorites have been shared. Check your email and tell your friends to check theirs.</p>
            )
        }

        else {
            body = (
                <div>
                    <div className="ui list">
                        {favoriteList}
                    </div>
                    {clearButton}
                    <br/>
                    {emailBoxContainer}
                    <div className="ui error message">
                    </div>
                </div>
            )
        }

        return (
            <div id="favorites-container">
                <DocumentTitle title='Favorites'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Favorites
                        </h2>
                        <form className={"ui form " + formClass} ref="favoritesForm" >
                            {body}
                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isGettingCurrentUser: state.user.isGettingCurrentUser,
        hasGottenCurrentUser: state.user.hasGottenCurrentUser,
        isSendingFavorites: state.user.isSendingFavorites,
        hasSentFavorites: state.user.hasSentFavorites,
        isDeletingFavorite: state.user.isDeletingFavorite,
        hasDeletedFavorite: state.user.hasDeletedFavorite,
        isClearingFavorites: state.user.isClearingFavorites,
        hasClearedFavorites: state.user.hasClearedFavorites,
        user: state.user.user,
        statusText: state.user.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesView);
export { FavoritesView as FavoritesViewNotConnected };
