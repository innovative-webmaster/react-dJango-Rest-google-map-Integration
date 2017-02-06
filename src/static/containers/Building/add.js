import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import { Map, Marker, Popup, TileLayer, setIconDefaultImagePath } from 'react-leaflet';
import DocumentTitle from 'react-document-title';
import './style.scss';
import redMarkerIcon from '../../images/marker-icons/marker-icon-red.png';
import * as buildingActionCreators from '../../actions/building';
import * as neighborhoodActionCreators from '../../actions/neighborhood';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import Dropzone from 'react-dropzone';


class AddBuildingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            neighborhoodID: null,
            marker: {
                lat: 12.0000325,
                lng: -61.7738056
            },
            zoom: 15,
            title: null,
            description: null,
            photos: [],
            selectedAmenities: [],
            customAmenities: [],
            mapMoved: ''
        };
    }

    componentWillUnmount() { 
        $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('destroy');
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.nameBubble)).popup();
        $(ReactDOM.findDOMNode(this.refs.descriptionBubble)).popup();

        $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown({
            'onChange': function(val){
                this.setState({neighborhoodID: val});
            }.bind(this)
        });

        this.props.actions.listNeighborhoods(this.props.token);

        $(ReactDOM.findDOMNode(this.refs.createBuildingForm))
            .form({
                fields: {
                    neighborhoodID: {
                        identifier  : 'neighborhoodID',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please select a neighborhood'
                            },
                        ]
                    },
                    mapMoved: {
                        identifier  : 'mapMoved',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please move the pin on the map'
                            },
                        ]
                    },
                    title: {
                        identifier  : 'title',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a title'
                            },
                        ]
                    },
                    description: {
                        identifier  : 'description',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a description'
                            },
                        ]
                    }
                },
                inline:true
            });
    }

    updatePosition = () => {
      const { lat, lng } = this.refs.marker.getLeafletElement().getLatLng()
      this.setState({
          marker: {lat, lng},
          mapMoved: true
      })
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    updateZoom = (e) => {
        this.setState({zoom: e.target._zoom});
    }

    createBuilding = (e) => {
        $(ReactDOM.findDOMNode(this.refs.createBuildingForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.createBuildingForm)).form('is valid')) {
            this.props.actions.createBuilding(
                this.props.token,
                this.state.neighborhoodID,
                this.state.title, this.state.description,
                this.state.marker.lat, this.state.marker.lng, this.state.photos,
                JSON.stringify(this.state.selectedAmenities.concat(this.state.customAmenities)),
                '/unit/add');
        }
    }

    onDrop = (files) => {
        let currentPhotos = this.state.photos;
        currentPhotos = currentPhotos.concat(files);
        this.setState({ photos: currentPhotos });
    }

    // NOTE: these handlers are done differently in the edit view. As a TODO, 
    // this view should do it the same way as the other one does
    handleCheckboxChange = (e, item) => {
        let currentAmenities = this.state.selectedAmenities;

        if (e.target.checked) {
            currentAmenities.push(item);
            this.setState({selectedAmenities: currentAmenities});
        }

        else {
            let i = currentAmenities.indexOf(item);

            if (i > -1) {
                currentAmenities.splice(i, 1);
                this.setState({selectedAmenities: currentAmenities});
            }
        }
    }

    // Break text by comma
    // Push it to array
    handleCustomAmenities = (e) => {
        let currentCustomAmenities = [];
        let splitAmenities = e.target.value.split(',');

        splitAmenities.forEach(function(e) {
            let trimmed = e.trim();
            if (trimmed.length > 0) {
                currentCustomAmenities.push(trimmed);
            }
        });

        this.setState({customAmenities: currentCustomAmenities});
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isCreating
        });

        const photoPreviewClass = classNames({
            hidden: this.state.photos.length == 0
        });

        const formClass = classNames({
            loading: this.props.isGettingNeighborhoodList
        });

        const center = [this.state.marker.lat, this.state.marker.lng];
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]

        let preview = (
            this.state.photos.map(function(s,i) {
                return (
                    <img key={i} className="ui tiny image" src={s.preview} />
                )
            })
        )

        let neighborhoodList = null;

        if (this.props.hasGottenNeighborhoodList == true) {
            neighborhoodList = 
            this.props.neighborhoodList.map(function(s, i){
                return (
                    <div key={i} className="item" data-value={s.uuid}>{s.name}</div>
                )
            });
        }

        return (
            <div id="add-building-container">
                <DocumentTitle title='Add building'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Add building
                        </h2>
                        <form className={"ui form " + formClass} ref="createBuildingForm" >
                            <div className="ui grid">
                                <div className="nine wide column">
                                    <div className="eight wide field">
                                        <label>Neighborhood</label>
                                        <div className="ui selection dropdown" ref="neighborhoodDropdown">
                                            <input type="hidden" name="neighborhoodID"/>
                                            <i className="dropdown icon"></i>
                                            <div className="default text">Select a neighborhood</div>
                                            <div className="menu">
                                                {neighborhoodList}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui fields">
                                        <div className="eight wide field">
                                            <label>Building name / address</label>
                                            <div className="ui input">
                                                <input type="text"
                                                    name="title"
                                                    onChange={(e) => { this.handleInputChange(e, 'title'); }}
                                                />
                                            </div>
                                        </div>
                                        <div className="field">
                                            <i ref="nameBubble" className="standard-bubble circular info icon " data-content="Name of the building or house." data-variation="inverted" data-position="right center"></i>
                                        </div>
                                    </div>
                                    <div className="ui fields">
                                        <div className="fourteen wide field">
                                            <label>Description</label>
                                            <textarea 
                                                name="description"
                                                rows="2"
                                                onChange={(e) => { this.handleInputChange(e, 'description')}}
                                            ></textarea> 
                                        </div>
                                        <div className="field">
                                            <i ref="descriptionBubble" className="textarea-bubble circular info icon " data-content="Example: The Christopher House is situated on BBC beach. Offering 3 bedrooms, spectacular views, and walking distance to the bus." data-variation="inverted" data-position="right center"></i>
                                        </div>
                                    </div>
                                    <h5 id="amenities-header">Amenities</h5>
                                    <div className="ui fields">
                                        <div className="four wide field"> <div className="ui checkbox">
                                                <input type="checkbox" name="amenity-pool" onChange={(e) => {this.handleCheckboxChange(e, 'Pool')}} />
                                                <label>Pool</label>
                                            </div>
                                        </div>
                                        <div className="four wide field">
                                            <div className="ui checkbox">
                                                <input type="checkbox" name="amenity-elevator" onChange={(e) => {this.handleCheckboxChange(e, 'Elevator')}} />
                                                <label>Elevator</label>
                                            </div>
                                        </div>
                                        <div className="four wide field">
                                            <div className="ui checkbox">
                                                <input type="checkbox" name="amenity-fitnesscenter" onChange={(e) => {this.handleCheckboxChange(e, 'Fitness center')}} />
                                                <label>Fitness center</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui fields">
                                        <div className="four wide field">
                                            <div className="ui checkbox">
                                                <input type="checkbox" name="amenity-securityguard" onChange={(e) => {this.handleCheckboxChange(e, 'Security guard')}} />
                                                <label>Security guard</label>
                                            </div>
                                        </div>
                                        <div className="four wide field">
                                            <div className="ui checkbox">
                                                <input type="checkbox" name="amenity-parking" onChange={(e) => {this.handleCheckboxChange(e, 'Parking')}} />
                                                <label>Parking</label>
                                            </div>
                                        </div>
                                        <div className="five wide field">
                                            <div className="ui checkbox">
                                                <input type="checkbox" name="amenity-laundry" onChange={(e) => {this.handleCheckboxChange(e, 'Laundry: in building')}} />
                                                <label>Laundry: in building</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui fields">
                                        <div className="ten wide field">
                                            <div className="ui input">
                                                <input type="text"
                                                    placeholder="Other amenities (separate by commas)"
                                                    name="customAmenities"
                                                    onChange={(e) => { this.handleCustomAmenities(e, 'customAmenities'); }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="seven wide column">
                                    <div className="sixteen wide field">
                                        <label>Location (drag the pin)</label>
                                        <Map 
                                            OnZoomend={this.updateZoom}
                                            center={center} zoom={this.state.zoom} maxZoom={17}>
                                            <TileLayer
                                                url='https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'
                                                attribution='<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>'
                                            />
                                            <Marker 
                                                position={markerPosition}
                                                onDragend={this.updatePosition}
                                                draggable="true"
                                                icon={
                                                    L.AwesomeMarkers.icon({
                                                        prefix: 'fa',
                                                        shadowSize: [0,0],
                                                        icon: 'fa-home',
                                                        markerColor: 'red'
                                                    })
                                                }
                                                ref="marker"
                                                >
                                            </Marker>
                                        </Map>
                                        <input value={this.state.mapMoved} type="hidden" name="mapMoved"/>
                                    </div>
                                </div>
                            </div>
                            <div className="sixteen wide field">
                                <label>Upload building photos</label>
                                <Dropzone maxSize={10000000} accept={"image/jpeg,image/png,image/gif"} className="dropzone-style" onDrop={this.onDrop}>
                                    <div>Drag your photos into this box or click here.</div>
                                </Dropzone>
                            </div>
                            <div className={"sixteen wide field " + photoPreviewClass}>
                                <label>Photo preview</label>
                                <div className="ui tiny images">
                                    {preview}
                                </div>
                            </div>
                            <div className={"ui green button " + buttonClass }
                                type="submit" onClick={this.createBuilding}
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
        isCreated: state.building.isCreated,
        isCreating: state.building.isCreating,
        statusText: state.building.statusText,
        isGettingNeighborhoodList: state.neighborhood.isGettingList,
        hasGottenNeighborhoodList: state.neighborhood.hasGottenList,
        neighborhoodList: state.neighborhood.neighborhoodList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({... buildingActionCreators, ... neighborhoodActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBuildingView);
export { AddBuildingView as AddBuildingViewNotConnected };
