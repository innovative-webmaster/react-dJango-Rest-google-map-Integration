import React from 'react';
import { connect } from 'react-redux';
import ReactDom from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import './style.scss';
import { push } from 'react-router-redux';


class HomeView extends React.Component {

    static propTypes = {
        statusText: React.PropTypes.string
    };

    componentDidMount() {
    }

    componentDidUpdate() {
    }
    
    render() {
        return (
            <div id="home-view-container" className="">
            <DocumentTitle title='Home'></DocumentTitle>
                <div className="ui vertical masthead center aligned segment">
                        <div className="ui text container">
                            <div onClick={() => this.props.dispatch(push('/map'))} className={"ui massive green button"}>
                                <i className="fa fa-map-marker" aria-hidden="true"></i> Map
                            </div>
                        </div>
                </div>
                <div className="ui vertical stripe segment">
                    <div className="ui middle aligned stackable grid container">
                        <div className="centered row">
                            <h1 className="ui huge header">SEARCH. RENT. REVIEW.</h1>
                        </div>
                        <div id="three-benefits" className="row">
                            <div className="third column">
                                <img className="ui centered medium circular image" src={require("./images/search.png")}/>
                                <h3 className="ui header centered">SEARCH FOR YOUR PERFECT HOME</h3>
                            </div>
                            <div className="third column">
                                <img className="ui centered medium circular image" src={require("./images/contact.png")}/>
                                <h3 className="ui header centered">CONTACT OWNERS DIRECTLY</h3>
                            </div>
                            <div className="third column">
                                <img className="ui centered medium circular image" src={require("./images/review.png")}/>
                                <h3 className="ui header centered">REVIEW YOUR STAY</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="pitch" className="ui vertical stripe segment">
                    <div className="ui middle aligned stackable grid container">
                        <div className="centered row">
                            <h1 className="ui huge header">STUDENT ACCOMODATION IN THE SPICE ISLAND</h1>
                        </div>
                        <div id="selling-points" className="centered row">
                            <h2 className="ui header">
                                GNDAPTS aims to be the island's most comprehensive resource for all available apartments and rental properties. Whether you are searching for beach-side living, affordable accomodation, or close proximity to campus, you'll find it all on GNDAPTS.<br/>Also new is the ability to help out your colleagues, classmates, and friends by reviewing your living experiences!<br/><br/>The information for renting in Grenada is now in your hands...
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusText: state.auth.statusText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators(actionCreators, dispatch)
    };
};

export default connect(mapStateToProps)(HomeView);
export { HomeView as HomeViewNotConnected };
