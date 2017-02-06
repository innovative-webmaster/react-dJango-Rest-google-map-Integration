import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActionCreators from '../../actions/auth';
import * as accountActionCreators from '../../actions/account';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

class ConfirmEmailView extends React.Component {
    static propTypes = {
        dispatch: React.PropTypes.func.isRequired,
        isAuthenticated: React.PropTypes.bool.isRequired,
        isAuthenticating: React.PropTypes.bool.isRequired,
        statusText: React.PropTypes.string,
        actions: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push('/home'));
        }
    }

    componentDidMount() {
        if (this.props.params.code != null) {
            this.props.actions.accountConfirmEmail(this.props.params.code);
        }
    }

    componentWillReceiveProps(nextProps) {
        // If the account has been confirmed, log them in
        if (nextProps.isConfirmed) {
        }
    }

    render() {
        let body = null;

        if (this.props.isConfirming) {
            body = (
                <div className="ui active inline loader"></div>
            )
        }

        else if (this.props.statusText != null) {
            body = (
                <div className="ui error message">
                    {this.props.statusText}
                </div>
            )
        }

        return (
            <DocumentTitle title='Confirm email'>
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui header">
                            Email confirmation
                        </h2>
                        { body }
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isAuthenticating: state.auth.isAuthenticating,
        isConfirmed: state.account.isConfirmed,
        isConfirming: state.account.isConfirming,
        statusText: state.account.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...authActionCreators, ...accountActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmailView);
export { ConfirmEmailView as ConfirmEmailViewNotConnected };
