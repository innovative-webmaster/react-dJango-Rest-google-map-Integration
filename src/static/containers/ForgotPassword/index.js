import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActionCreators from '../../actions/auth';
import * as userActionCreators from '../../actions/user';
import classNames from 'classnames';
import { push } from 'react-router-redux';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import BodyClassName from 'react-body-classname';
import './style.scss';

class ForgotPasswordView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
        };
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.recoverForm))
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
                },
                onSuccess: function(e) {
                    e.preventDefault();
                    this.props.actions.sendPasswordRecoveryInstructions(this.state.email);
                }.bind(this)
            });
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push('/home'));
        }
    }

    componentWillUnmount() {
        this.props.actions.resetPasswordRecoveryInstructions();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.statusText != null) {
            $(ReactDOM.findDOMNode(this.refs.recoverForm)).form('add errors', [nextProps.statusText]);
        }
    }

    sendPasswordRecoveryInstructions = (e) => {
        $(ReactDOM.findDOMNode(this.refs.recoverForm)).submit()
    };


    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.currentTarget.value
        });
    };

    render() {
        const buttonClass = classNames({
            loading: this.props.isSendingPasswordRecoveryInstructions,
        });


        let body = null;

        if (!this.props.hasSentPasswordRecoveryInstructions) {
            body =  (
                <form className="ui large form" ref="recoverForm" >
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
                    </div>

                    <div className={"ui fluid large green submit button " + buttonClass}
                        type="submit" onClick={this.sendPasswordRecoveryInstructions}
                    >
                        Email recovery instructions
                    </div>

                    <div className="ui error message"></div>
                </form>
            )
        }

        else {
            body = (
                <div id="confirm-text">Password recovery instructions sent. Check your email.</div>
            )
        }

        return (
            <BodyClassName className='body-background'>
                <DocumentTitle title='Recover password'>
                    <div id="forgot-password-container" className="ui middle aligned center aligned grid">
                        <div className="column">
                            <h2 className="ui header">
                                Recover password
                            </h2>
                            {body}
                            <div className="ui message">
                                Already have an account? Log in <Link to="/">here.</Link>
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
        isSendingPasswordRecoveryInstructions: state.user.isSendingPasswordRecoveryInstructions,
        hasSentPasswordRecoveryInstructions: state.user.hasSentPasswordRecoveryInstructions,
        statusText: state.user.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...authActionCreators, ...userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordView);
export { ForgotPasswordView as ForgotPasswordViewNotConnected };
