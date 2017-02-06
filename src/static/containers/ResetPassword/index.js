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

class ResetPasswordView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: '',
        };
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.resetForm))
            .form({
                fields: {
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
                },
                onSuccess: function(e) {
                    e.preventDefault();
                    this.props.actions.resetPassword(this.state.password, this.props.location.query.code);
                }.bind(this)
            });
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push('/home'));
        }
    }

    componentWillUnmount() {
        this.props.actions.resetPasswordResetState();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.statusText != null) {
            $(ReactDOM.findDOMNode(this.refs.resetForm)).form('add errors', [nextProps.statusText]);
        }
    }

    resetPassword = (e) => {
        $(ReactDOM.findDOMNode(this.refs.resetForm)).submit()
    };


    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.currentTarget.value
        });
    };

    render() {
        const buttonClass = classNames({
            loading: this.props.isResettingPassword,
        });

        let body = null;

        if (!this.props.hasResetPassword) {
            body =  (
                <form className="ui large form" ref="resetForm" >
                    <div className="ui stacked segment">
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

                    <div className={"ui submit fluid large green button " + buttonClass}
                       type="submit" onClick={this.resetPassword}
                    >
                        Reset
                    </div>

                    <div className="ui error message"></div>
                </form>
            )
        }

        else {
            body = (
                <div>Your password has been reset. Click <Link to="/">here</Link> to login.</div>
            )
        }

        return (
            <BodyClassName className='body-background'>
                <DocumentTitle title='Reset password'>
                    <div id="reset-password-container" className="ui middle aligned center aligned grid">
                        <div className="column">
                            <h2 className="ui header">
                                Reset password
                            </h2>
                            {body}
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
        isResettingPassword: state.user.isResettingPassword,
        hasResetPassword: state.user.hasResetPassword,
        statusText: state.user.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...authActionCreators, ...userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordView);
export { ResetPasswordView as ResetPasswordViewNotConnected };
