import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

class Review extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    static propTypes = {
        index: React.PropTypes.number,
        data: React.PropTypes.object
    };

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs["review-" + this.props.index])).rating('disable');
    }

    toggleVisibility = () => {
        this.setState({expand: !this.state.expand});
    }

    render() {
        let comments = null;
        let showMoreLink = null;

        if (this.state.expanded == false) {
            let string = this.props.data.comments.slice(0,100);

            if (this.props.data.comments.length > 100) {
                string += "...";
                showMoreLink = (
                    <a onClick={() => this.setState({expanded: !this.state.expanded})}>Show more</a>
                )
            }

            comments = (
                <div>
                    {string}
                    <br/>
                    <div class="show-more-container">
                        {showMoreLink}
                    </div>
                </div>
            )
        }

        else {
            showMoreLink = (
                <a onClick={() => this.setState({expanded: !this.state.expanded})}>Hide</a>
            )

            comments = (
                <div>
                    {this.props.data.comments}
                    <br/>
                    <div class="show-more-container">
                        {showMoreLink}
                    </div>
                </div>
            )
        }

        return (
            <div className="review-component ui relaxed divided list">
                <div className="item">
                    <i className="middle aligned fa-comment icon"></i>
                    <div className="content">
                        <a className="header">
                            <div data-max-rating="5" className="ui huge star rating" ref={"review-" + this.props.index} data-rating={this.props.data.rating}></div>
                        </a>
                        <div className="description">
                            {comments}
                            <i className="reviewee">{this.props.data.anonymous == true ? "anonymous" : this.props.data.reviewee.first_name + " " + this.props.data.reviewee.last_name[0]}.</i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (Review);
