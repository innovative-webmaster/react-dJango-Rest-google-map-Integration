import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/auth';
import classNames from 'classnames';
import { push } from 'react-router-redux';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import './style.scss';
import DocumentTitle from 'react-document-title';
import BodyClassName from 'react-body-classname';

class LoginView extends React.Component {

    static propTypes = {
        dispatch: React.PropTypes.func.isRequired,
        isAuthenticated: React.PropTypes.bool.isRequired,
        isAuthenticating: React.PropTypes.bool.isRequired,
        statusText: React.PropTypes.string,
        actions: React.PropTypes.object.isRequired,
        location: React.PropTypes.object // this comes from react-router, not required
    };

    constructor(props) {
        super(props);

        const redirectRoute = this.props.location ? this.props.location.query.next || '/home' : '/home';
        this.state = {
            email: '',
            password: '',
            redirectTo: redirectRoute
        };
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.loginForm))
            .form({
                fields: {
                    email: {
                        identifier  : 'email',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your e-mail'
                            },
                            {
                                type   : 'email',
                                prompt : 'Please enter a valid e-mail'
                            }
                        ]
                    },
                    password: {
                        identifier  : 'password',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your password'
                            },
                            {
                                type   : 'length[6]',
                                prompt : 'Your password must be at least 6 characters'
                            }
                        ]
                    }
                }
            });

        // To prevent the redirect on form submission
        $(ReactDOM.findDOMNode(this.refs.loginForm)).submit(function(e) {
            this.login();
            return false;
        }.bind(this));
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push('/home'));
        }
    }

    // This runs when props come in. If the status text came back with an auth error,
    // say so in the error field
    componentWillReceiveProps(nextProps) {
        if (nextProps.statusText && 
            nextProps.statusText.indexOf('Authentication Error') === 0) {
            $(ReactDOM.findDOMNode(this.refs.loginForm)).form('add errors', ["Wrong email and/or password. Try again."]);
        }
    }

    login = (e) => {
        $(ReactDOM.findDOMNode(this.refs.loginForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.loginForm)).form('is valid')) {
            this.props.actions.authLoginUser(this.state.email, this.state.password, this.state.redirectTo);
        }
    };


    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.currentTarget.value
        });
    };

    render() {
        const buttonClass = classNames({
            loading: this.props.isAuthenticating,
        });

        return (
            <BodyClassName className='body-background'>
                <DocumentTitle title='Login'>
                    <div id="login-container" className="ui middle aligned center aligned grid">
                        <div className="column">
                            <div className="ui segment">
                                <img className="ui centered medium image" src={require("./images/logo.png")}/>
                                <h1 className="ui header">
                                    Log in
                                </h1>
                            </div>
                            <form className="ui large form" ref="loginForm" >
                                <div className="ui stacked segment">
                                    <div className="field">
                                        <div className="ui big left icon input">
                                            <i className="user icon"></i>
                                            <input type="text"
                                                name="email"
                                                placeholder="E-mail address"
                                                onChange={(e) => { this.handleInputChange(e, 'email'); }}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui big left icon input">
                                            <i className="lock icon"></i>
                                            <input type="password"
                                                name="password"
                                                placeholder="Password"
                                                onChange={(e) => { this.handleInputChange(e, 'password'); }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={"ui fluid large green submit button " + buttonClass}
                                    type="submit" onClick={this.login}
                                >
                                    Log in
                                </div>

                                <div className="ui error message">sdsd</div>

                            </form>

                            <div className="ui message">
                                <Link to="signup">Sign up</Link>
                                <br/>
                                <Link to="forgotpassword">Forgot your password?</Link>
                                &nbsp;• <a href="mailto: wklaine@mac.com">Contact us</a>
                            </div>
                        </div>
                    </div>
                </DocumentTitle>
            </BodyClassName>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
export { LoginView as LoginViewNotConnected };
