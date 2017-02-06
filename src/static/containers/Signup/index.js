import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as accountActionCreators from '../../actions/account';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import BodyClassName from 'react-body-classname';
import './style.scss';

class SignupView extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            'firstname': '',
            'lastname': '',
            'email': '',
            'password': ''
        }
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push('/home'));
        }
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.signupForm)).form({
            fields: {
                firstname: {
                    identifier  : 'firstname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your firstname'
                        },
                    ]
                },
                lastname: {
                    identifier  : 'lastname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your lastname'
                        },
                    ]
                },
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

        // To prevent the redirect on form subactionCreators2mission
        $(ReactDOM.findDOMNode(this.refs.signupForm)).submit(function(e) {
            this.signup();
            return false;
        }.bind(this));
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.statusText != null) {
            $(ReactDOM.findDOMNode(this.refs.signupForm)).form('add errors', [nextProps.statusText]);
        }
    }

    signup = (e) => {
        $(ReactDOM.findDOMNode(this.refs.signupForm)).form('validate form');

        if ($(ReactDOM.findDOMNode(this.refs.signupForm)).form('is valid')) {
            this.props.actions.accountCreateUser(this.state.firstname, this.state.lastname, this.state.email, this.state.password);
        }
    }

    render() {
        let body = null;

        if (this.props.isCreated == false) {
            const buttonClass = classNames({
                loading: this.props.isCreating || this.props.isAuthenticating
            });

            body = (
                <div className="column">
                    <h2 className="ui header">
                        Sign up
                    </h2>
                    <form className="ui large form" ref="signupForm" >
                        <div className="ui stacked segment">
                            <div className="field">
                                <div className="ui big input">
                                    <input type="text"
                                        name="firstname"
                                        placeholder="First name"
                                        onChange={(e) => { this.handleInputChange(e, 'firstname'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui big input">
                                    <input type="text"
                                        name="lastname"
                                        placeholder="Last name"
                                        onChange={(e) => { this.handleInputChange(e, 'lastname'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui big input">
                                    <input type="text"
                                        name="email"
                                        placeholder="E-mail address"
                                        onChange={(e) => { this.handleInputChange(e, 'email'); }}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui big input">
                                    <input type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={(e) => { this.handleInputChange(e, 'password'); }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"ui fluid large green submit button " + buttonClass }
                            type="submit" onClick={this.signup}
                        >
                            Create account
                        </div>

                        <div className="ui error message">
                        </div>

                    </form>
                </div>
            )
        }
        
        else {
            body = (
                <div className="column">
                    <h2 className="ui inverted header">
                        Confirmation email sent
                    </h2>
                    <div>
                        Please check your email.
                    </div>
                </div>
            )
        }

        return (
            <BodyClassName className='body-background'>
                <DocumentTitle title='Sign up'>
                    <div id="signup-container" className="ui middle aligned center aligned grid">
                        { body }
                    </div>
                </DocumentTitle>
            </BodyClassName>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        isCreating: state.account.isCreating,
        isCreated: state.account.isCreated,
        isAuthenticating: state.auth.isAuthenticating,
        isAuthenticated: state.auth.isAuthenticated,
        statusText: state.account.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        //actions: bindActionCreators({ ...authActionCreators, ...accountActionCreators}, dispatch)
        actions: bindActionCreators({ ...accountActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupView);
export { SignupView as SignupViewNotConnected };
