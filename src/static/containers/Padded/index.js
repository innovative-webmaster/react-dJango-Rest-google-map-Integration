import React from 'react';
import { connect } from 'react-redux';
import './style.scss';


class PaddedContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        children: React.PropTypes.element.isRequired,
    };

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                jiggleFavorites: this.props.jiggleFavorites
            })
        );

        return (
            <div id="padded-container">
                {childrenWithProps}
            </div>
        )
    }

}

export default connect()(PaddedContainer);
export { PaddedContainer as PaddedHolderNotConnected };

