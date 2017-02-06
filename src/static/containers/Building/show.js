import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as buildingActionCreators from '../../actions/building';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipeGallery} from 'react-photoswipe';
import Review from '../../components/Review';

class ShowBuildingView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() { 
        this.props.actions.resetGetBuilding();
        this.props.actions.resetCreateFavorite();
    }

    componentDidMount() {
        this.props.actions.getBuilding(this.props.token, this.props.params.id);
        
        // Photoswipe brings in buttons without type=button. This causes
        // clicking on any of their buttons to submit the form it's in.
        $(ReactDOM.findDOMNode(this.refs.buildingForm)).submit(function(e) {
            return false;
        }.bind(this));
    }

    componentDidUpdate() {
        // Needs to run in componentDidUpdate() because the reviews are dynamically added
        if (this.props.hasGottenBuilding) {
            $(ReactDOM.findDOMNode(this.refs.settingsDropdown)).dropdown();
        }
    }

    favorite = () => {
        this.props.jiggleFavorites();
        this.props.actions.createFavorite(this.props.token, this.props.params.id);
    }

    delete = () => {
        this.props.actions.deleteBuilding(this.props.token, this.props.params.id,'/unit/list');
    }

    getThumbnailContent = (item) => {
        if (item.primary) {
            return (
                <img src={item.src} id="primary-img" />
            );
        }

        else {
            return (
                <img src={item.thumbnail} width={90} height={67.5}/>
            );
        }
    }

    render() {
        const formClass = classNames({
            loading: this.props.isGettingBuilding
        });

        let buildingInformation = null;
        let favoriteClass = null;
        let actionMenu = null;

        if (this.props.hasGottenBuilding) {
            favoriteClass = classNames({
                disabled: this.props.hasCreatedFavorite || this.props.building.is_favorite
            });

            if (this.props.isAuthenticated) {
                let deleteBuilding, editBuilding = null;

                if (this.props.userID == this.props.building.creator) {
                    deleteBuilding = (
                        <div onClick={this.delete} className={"item " }>
                            Delete
                        </div>
                    )

                    editBuilding = (
                        <div onClick={() => {this.props.dispatch(push('/building/edit/' + this.props.building.uuid)) }} className={"item " }>
                            Edit
                        </div>
                    )
                }

                actionMenu = (
                    <div>
                        <div onClick={this.favorite} className={"ui icon top right pointing green button " + favoriteClass} ref="favoriteButton">
                            <i className="heart icon"></i>
                        </div>
                        <div className="ui icon top right pointing blue dropdown button" ref="settingsDropdown">
                            <i className="wrench icon"></i>
                            <div className="menu">
                                {editBuilding}
                                {deleteBuilding}
                                <div onClick={() => this.props.dispatch(push('/review/add'))}  className="item">
                                    Add review 
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            let center = [parseFloat(this.props.building.latitude), parseFloat(this.props.building.longitude)];

            let photos = [];
            if (this.props.building.photos != null) {
                this.props.building.photos.map(function(s,i) {
                    photos.push(
                        {
                            src: s.full,
                            thumbnail: s.thumb,
                            w: s.full_width,
                            h: s.full_height,
                            primary: i==0 ? true : false
                        }
                    )
                });
            }

            let opts = {
                history: false
            }

            let unitList = (
                this.props.building.unit_set.map(function(s,i) {
                    return (
                        <tr key={i}>
                            <td>{s.number ? s.number : "-"}</td>
                            <td><b><Link to={`/unit/show/${s.uuid}`}>{s.title}</Link></b></td>
                            <td>${s.rent}</td>
                            <td>{s.num_beds}</td>
                            <td>{s.num_baths}</td>
                        </tr>
                    )
                })
            )

            let reviews = (
                this.props.building.review_set.map(function(s,i) {
                    return (
                        <Review index={i} key={i} data={s}/>
                    )
                })
            )

            let amenities = null;

            if (this.props.building.amenities) {
                let left, right = null;

                left = (
                    this.props.building.amenities.map(function(s,i) {
                        if (i%2 == 0) {
                            return (
                              <div key={i} className="item">{s}</div>
                            )
                        }
                    })
                )

                right = (
                    this.props.building.amenities.map(function(s,i) {
                        if (i%2 == 1) {
                            return (
                              <div key={i} className="item">{s}</div>
                            )
                        }
                    })
                )

                amenities = (
                    <div className="ui grid">
                        <div className="eight wide column">
                            <div className="ui bulleted list">
                                {left}
                            </div>
                        </div>
                        <div className="eight wide column">
                            <div className="ui bulleted list">
                                {right}
                            </div>
                        </div>
                    </div>
                )
            }

            buildingInformation = (
                <div className="ui grid">
                    <div className="ui row">
                        <div className="five wide column">
                            <div className="ui images">
                                <PhotoSwipeGallery items={photos} options={opts} thumbnailContent={this.getThumbnailContent}/>
                            </div>
                            <Map zoomControl={false} center={center} zoom={14} maxZoom={17} ref="map">
                                <TileLayer
                                    url='https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'
                                    attribution='<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>'
                                />
                                <Marker position={center}
                                    icon={
                                        L.AwesomeMarkers.icon({
                                            prefix: 'fa',
                                            shadowSize: [0,0],
                                            icon: 'fa-home',
                                            markerColor: 'red'
                                        })
                                    }
                                > 
                                </Marker>
                            </Map>
                        </div>
                        <div className="seven wide column">
                            <h1 id="title-header" className="ui header">
                                {this.props.building.title}
                            </h1>
                            <h3 className="ui header" id="neighborhood-header">
                                {this.props.building.neighborhood.name}
                                <div className="sub header">
                                    {this.props.building.unit_set.length} unit(s)
                                </div>
                            </h3>
                            <div className="ui divider"></div>
                            <h3 id="building-desc-header" className="ui header">
                                Building description
                            </h3>
                            <p>
                                {this.props.building.description}
                            </p>
                            <h3 className="ui header">
                                Building amenities
                            </h3>
                            {amenities}
                            <table id="units-table" className="ui fixed table">
                                <thead>
                                    <tr>
                                        <th>Unit</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Bedrooms</th>
                                        <th>Bathrooms</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitList}
                                </tbody>
                            </table>
                        </div>
                        <div className="four wide column">
                            <div className="ui right aligned grid">
                                <div className="sixteen wide column">
                                    {actionMenu}
                                </div>
                            </div>
                            {reviews}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div id="show-building-container">
                <DocumentTitle title='Building'>
                    <div className="ui container">
                        <form className={"ui form " + formClass} ref="buildingForm" >
                            {buildingInformation}
                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isGettingBuilding: state.building.isGettingBuilding,
        hasGottenBuilding: state.building.hasGottenBuilding,
        building: state.building.building,
        isCreatingFavorite: state.user.isCreatingFavorite,
        hasCreatedFavorite: state.user.hasCreatedFavorite,
        favoriteID: state.user.favoriteID,
        isAuthenticated: state.auth.isAuthenticated,
        userID: state.auth.userID,
        token: state.auth.token // We usually get this from requireAuthentication wrapper but this does not go through that
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({...buildingActionCreators, ... userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowBuildingView);
export { ShowBuildingView as ShowBuildingViewNotConnected };
