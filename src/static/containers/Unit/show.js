import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';
import './style.scss';
import * as unitActionCreators from '../../actions/unit';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipeGallery} from 'react-photoswipe';
import Review from '../../components/Review';

class ShowUnitView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showContactInformationFlag: false
        };
    }

    componentWillUnmount() { 
        this.props.actions.resetGetUnit();
    }

    componentDidMount() {
        this.props.actions.getUnit(this.props.token, this.props.params.id);
        
        // Photoswipe brings in buttons without type=button. This causes
        // clicking on any of their buttons to submit the form it's in.
        $(ReactDOM.findDOMNode(this.refs.unitForm)).submit(function(e) {
            return false;
        }.bind(this));
    }

    componentDidUpdate() {
        // Needs to run in componentDidUpdate() because the reviews are dynamically added
        if (this.props.hasGottenUnit) {
            $(ReactDOM.findDOMNode(this.refs.settingsDropdown)).dropdown();
        }
    }

    showContactInformation = (e) => {
        this.setState({showContactInformationFlag:true});
    }
    
    favorite = () => {
        this.props.jiggleFavorites();
        this.props.actions.createFavorite(this.props.token, null, this.props.unit.uuid);
    }

    delete = () => {
        this.props.actions.deleteUnit(this.props.token, this.props.params.id,'/unit/list');
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
            loading: this.props.isGettingUnit
        });

        let favoriteClass = null;
        let unitInformation = null;
        let actionMenu = null;

        if (this.props.hasGottenUnit) {
            favoriteClass = classNames({
                disabled: this.props.hasCreatedFavorite || this.props.unit.is_favorite
            });

            if (this.props.isAuthenticated) {
                let deleteUnit, editUnit = null;
                console.log(this.props.userID);
               console.log(this.props.unit.creator); 
                if (this.props.userID == this.props.unit.creator) {
                    deleteUnit = (
                        <div onClick={this.delete} className={"item " }>
                            Delete
                        </div>
                    )

                    editUnit = (
                        <div onClick={() => {this.props.dispatch(push('/unit/edit/' + this.props.unit.uuid)) }} className={"item " }>
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
                                {editUnit}
                                {deleteUnit}
                                <div onClick={() => this.props.dispatch(push('/review/add'))}  className="item">
                                    Add review 
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            
            let center = [parseFloat(this.props.unit.building_data.latitude), parseFloat(this.props.unit.building_data.longitude)];

            let photos = [];
            if (this.props.unit.photos != null) {
                this.props.unit.photos.map(function(s,i) {
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

            let reviews = (
                this.props.unit.building_reviews.map(function(s,i) {
                    return (
                        <Review index={i} key={i} data={s}/>
                    )
                })
            )

            let contactBlock = null;

            if (!this.state.showContactInformationFlag) {
                contactBlock = (
                    <a onClick={this.showContactInformation} className="">
                        Show contact information
                    </a>
                )
            }

            else {
                let contactInfoRelationProperty, contactInfoName, contactInfoPhone, contactInfoSecondaryPhone, contactInfoWhatsapp, contactInfoEmail, contactInfoFacebook = null;

                if (this.props.unit.contact_relation_property) {
                    contactInfoRelationProperty = (
                        <div>
                            Relationship to unit: {this.props.unit.contact_relation_property}
                        </div>
                    )
                }

                if (this.props.unit.contact_name) {
                    contactInfoName = (
                        <div>
                            Name: {this.props.unit.contact_name}
                        </div>
                    )
                }

                if (this.props.unit.contact_phone) {
                    contactInfoPhone = (
                        <div>
                            Phone: {this.props.unit.contact_phone}
                        </div>
                    )
                }

                if (this.props.unit.contact_secondary_phone) {
                    contactInfoSecondaryPhone = (
                        <div>
                            Secondary phone: {this.props.unit.contact_secondary_phone}
                        </div>
                    )
                }

                if (this.props.unit.contact_whatsapp) {
                    contactInfoWhatsapp = (
                        <div>
                            WhatsApp: {this.props.unit.contact_whatsapp}
                        </div>
                    )
                }

                if (this.props.unit.contact_email) {
                    contactInfoEmail = (
                        <div>
                            Email: <a href={"mailto:" + this.props.unit.contact_email}>{this.props.unit.contact_email}</a>
                        </div>
                    )
                }

                if (this.props.unit.contact_facebook) {
                    contactInfoFacebook = (
                        <div>
                            Facebook: {this.props.unit.contact_facebook}
                        </div>
                    )
                }

                if (!contactInfoRelationProperty && !contactInfoName && !contactInfoPhone && !contactInfoSecondaryPhone && !contactInfoWhatsapp
                    && !contactInfoEmail && !contactInfoFacebook) {
                        contactBlock = (
                            <div>
                                None
                            </div>
                        )
                    }

                else {
                    contactBlock = (
                        <div>
                            {contactInfoRelationProperty}
                            {contactInfoName}
                            {contactInfoPhone}
                            {contactInfoSecondaryPhone}
                            {contactInfoWhatsapp}
                            {contactInfoEmail}
                            {contactInfoFacebook}
                        </div>
                    )
                }
            }

            let opts = {
                history: false
            }

            let amenities = null;

            if (this.props.unit.amenities) {
                let left, right = null;

                left = (
                    this.props.unit.amenities.map(function(s,i) {
                        if (i%2 == 0) {
                            return (
                              <div key={i} className="item">{s}</div>
                            )
                        }
                    })
                )

                right = (
                    this.props.unit.amenities.map(function(s,i) {
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

            unitInformation = (
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
                            <h1 id="building-header" className="ui header">
                                <Link to={`/building/show/${this.props.unit.building}`}>
                                    {this.props.unit.building_data.title}
                                </Link>
                            </h1>
                            <h3 className="ui header" id="title-header">
                                {this.props.unit.title}
                            </h3>
                            <h3 className="ui header" id="rent-header">
                                <b>${this.props.unit.rent}</b> / month
                            </h3>
                            <div className="ui list">
                                <div className="item">
                                    <i className="icon fa-bed"></i>
                                    <div className="content">
                                        {this.props.unit.num_beds} bedrooms / {this.props.unit.num_baths} bathrooms
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="icon fa-gavel"></i>
                                    <div className="content">
                                        {this.props.unit.type_lease}
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="icon fa-map-signs"></i>
                                    <div className="content">
                                        {this.props.unit.building_data.neighborhood_name}
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="icon fa-phone"></i>
                                    <div className="content">
                                        {contactBlock}
                                    </div>
                                </div>
                            </div>
                            <div className="ui divider"></div>
                            <h3 id="unit-desc-header" className="ui header">
                                Unit description
                            </h3>
                            <p>
                                {this.props.unit.description}
                            </p>
                            <h3 className="ui header">
                                Unit amenities
                            </h3>
                            {amenities}
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
            <div id="show-unit-container">
                <DocumentTitle title='Unit'>
                    <div className="ui container">
                        <form className={"ui form " + formClass} ref="unitForm" >
                            {unitInformation}
                        </form>
                    </div>
                </DocumentTitle>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        isGettingUnit: state.unit.isGettingUnit,
        hasGottenUnit: state.unit.hasGottenUnit,
        unit: state.unit.unit,
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
        actions: bindActionCreators({... unitActionCreators, ... userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowUnitView);
export { ShowUnitView as ShowUnitViewNotConnected };
