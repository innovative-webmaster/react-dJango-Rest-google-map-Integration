import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as reviewActionCreators from '../../actions/review';
import * as buildingActionCreators from '../../actions/building';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';

class AddReviewView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buildingID: null,
            rating: 0,
            comments: null,
            anonymous: false,
        };
    }

    componentWillUnmount() { 
        $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('destroy');
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.ratingStars)).rating('setting', 'onRate', function(value) {
            this.setState({rating: value});
            $(ReactDOM.findDOMNode(this.refs.ratingHiddenInput)).val(value);
        }.bind(this));
        
        $(ReactDOM.findDOMNode(this.refs.anonymousCheckbox)).checkbox({
            onChecked   : function() {
                this.setState({anonymous: true});
            }.bind(this),
            onUnchecked   : function() {
                this.setState({anonymous: false});
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown({
            'onChange': function(val){
                this.setState({buildingID: val});
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.createReviewForm))
            .form({
                fields: {
                    buildingID: {
                        identifier  : 'buildingID',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please select a building'
                            },
                        ]
                    },
                    rating: {
                        identifier  : 'rating',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a rating'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    comments: {
                        identifier  : 'comments',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                        ]
                    },
                },
                inline:true
            });
            this.props.actions.listBuildings(this.props.token);
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    createReview = (e) => {
        $(ReactDOM.findDOMNode(this.refs.createReviewForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.createReviewForm)).form('is valid')) {
            this.props.actions.createReview(
                this.props.token,
                this.state.rating, this.state.comments, this.state.anonymous,
                this.state.buildingID,
                '/building/show/' + this.state.buildingID);
        }
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isCreating
        });
        
        const formClass = classNames({
            loading: this.props.isGettingList
        });

        let buildingList = null;

        if (this.props.hasGottenList == true) {
            buildingList = 
            this.props.buildingList.map(function(s, i){
                return (
                    <div key={i} className="item" data-value={s.uuid}>{s.title}</div>
                )
            });
        }

        return (
            <div id="add-review-container">
                <DocumentTitle title='Add review'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Add review
                        </h2>
                        <form className={"ui form " + formClass} ref="createReviewForm" >
                            <div className="eight wide field">
                                <label>Building</label>
                                <div className="ui selection dropdown" ref="buildingDropdown">
                                    <input type="hidden" name="buildingID"/>
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select a building</div>
                                    <div className="menu">
                                        {buildingList}
                                    </div>
                                </div>
                            </div>
                            <div className="six wide field">
                                <label>Rating</label>
                                <input type="hidden" name="rating" ref="ratingHiddenInput"/>
                                <div className="ui huge star rating" data-max-rating="5" ref="ratingStars"></div>
                            </div>
                            <div className="eight wide field">
                                <label>Comments</label>
                                <textarea 
                                    name="comments"
                                    rows="2"
                                    onChange={(e) => { this.handleInputChange(e, 'comments')}}
                                ></textarea> 
                            </div>

                            <div className="six wide field">
                                <div className="ui checkbox" ref="anonymousCheckbox">
                                    <input type="checkbox" name="anonymous"/>
                                    <label>Add anonymously</label>
                                </div>
                            </div>

                            <div className={"ui green button " + buttonClass }
                                type="submit" onClick={this.createReview}
                            >
                                Submit
                            </div>

                            <div className="ui error message">
                            </div>

                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isCreated: state.review.isCreated,
        isCreating: state.review.isCreating,
        statusText: state.review.statusText,
        isGettingList: state.building.isGettingList,
        hasGottenList: state.building.hasGottenList,
        buildingList: state.building.buildingList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...reviewActionCreators, ...buildingActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddReviewView);
export { AddReviewView as AddReviewViewNotConnected };
