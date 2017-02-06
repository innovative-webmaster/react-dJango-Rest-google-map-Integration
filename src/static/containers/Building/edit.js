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


class EditBuildingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buildingID: null,
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
            existingPhotos: [],
            populatedForm: false
        };
    }

    componentWillUnmount() { 
        $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('destroy');
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.nameBubble)).popup();
        $(ReactDOM.findDOMNode(this.refs.descriptionBubble)).popup();

        this.props.actions.getBuilding(this.props.token, this.props.params.id);

        $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown({
            'onChange': function(val){
                this.setState({neighborhoodID: val});
            }.bind(this)
        });

        this.props.actions.listNeighborhoods(this.props.token);

        $(ReactDOM.findDOMNode(this.refs.editBuildingForm))
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

    componentDidUpdate() {
        if (this.props.hasGottenBuilding == true && this.props.hasGottenNeighborhoodList == true && this.state.populatedForm == false) {
            $(ReactDOM.findDOMNode(this.refs.buildingTitle)).val(this.props.building.title);
            $(ReactDOM.findDOMNode(this.refs.buildingDescription)).val(this.props.building.description);
            $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('set selected', this.props.building.neighborhood.uuid);

            let selectedAmenities = [];
            let customAmenities = [];
            let customAmenitiesStr = '';

            this.props.building.amenities.forEach(function(s,i) {
                if (this.refs[s] != null) {
                    $(ReactDOM.findDOMNode(this.refs[s])).checkbox('check');
                    selectedAmenities.push(s);
                }

                else {
                    customAmenities.push(s);

                    let str = '';
                    if (customAmenitiesStr.length > 0) {
                        str = ', ';
                    }
                
                    customAmenitiesStr += str + s;
                }
            }, this);

            $(ReactDOM.findDOMNode(this.refs.customAmenities)).val(customAmenitiesStr);

            this.setState({'title': this.props.building.title, 'description': this.props.building.description, 
                'neighborhoodID': this.props.building.neighborhood.uuid, 'selectedAmenities': selectedAmenities,
                'customAmenities': customAmenities, 'existingPhotos': this.props.building.photos,
                'marker': {'lat': parseFloat(this.props.building.latitude), 'lng': parseFloat(this.props.building.longitude)},
                'buildingID': this.props.building.uuid, 'populatedForm': true});
        }
    }

    updatePosition = () => {
      const { lat, lng } = this.refs.marker.getLeafletElement().getLatLng()
      this.setState({
          marker: {lat, lng},
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

    editBuilding = (e) => {
        $(ReactDOM.findDOMNode(this.refs.editBuildingForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.editBuildingForm)).form('is valid')) {
            this.props.actions.editBuilding(
                this.props.token,
                this.state.buildingID,
                this.state.neighborhoodID,
                this.state.title, this.state.description,
                this.state.marker.lat, this.state.marker.lng, this.state.photos,
                JSON.stringify(this.state.existingPhotos),
                JSON.stringify(this.state.selectedAmenities.concat(this.state.customAmenities)),
                '/building/show/' + this.state.buildingID);
        }
    }

    onDrop = (files) => {
        let currentPhotos = this.state.photos;
        currentPhotos = currentPhotos.concat(files);
        this.setState({ photos: currentPhotos });
    }

    handleCheckboxChange = (e, item) => {
        let currentAmenities = this.state.selectedAmenities;
        let i = currentAmenities.indexOf(item);

        // Found so checked->unchecked
        if (i > -1) {
            currentAmenities.splice(i, 1);
            this.setState({selectedAmenities: currentAmenities});
        }

        // Not found so unchecked->checked
        else {
            currentAmenities.push(item);
            this.setState({selectedAmenities: currentAmenities});
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

    removeExistingPicture = (i) => {
        let existingPhotos = this.state.existingPhotos;
        existingPhotos.splice(i, 1);
        this.setState({existingPhotos: existingPhotos});
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isEditing
        });

        const photoPreviewClass = classNames({
            hidden: this.state.photos.length == 0
        });

        const existingPhotosClass = classNames({
            hidden: this.state.existingPhotos.length == 0
        });

        const formClass = classNames({
            loading: this.props.isGettingNeighborhoodList || this.props.isGettingBuilding
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

        let existingPhotos = (
            this.state.existingPhotos.map(function(s,i) {
                return (
                    <div key={i} className="existing-image-div">
                        <img className="ui middle aligned tiny image" src={s.thumb} />
                        <span>
                            <i onClick={() => this.removeExistingPicture(i)} className="big link remove icon"></i>
                        </span>
                    </div>
                )
            }, this)
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
            <div id="edit-building-container">
                <DocumentTitle title='Edit building'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Edit building
                        </h2>
                        <form className={"ui form " + formClass} ref="editBuildingForm" >
                            <div className="ui grid">
                                <div className="nine wide column">
                                    <div className="eight wide field">
                                        <label>Neighborhood</label>
                                        <div id="xxx" className="ui selection dropdown" ref="neighborhoodDropdown">
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
                                                <input ref="buildingTitle" type="text"
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
                                                ref="buildingDescription"
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
                                        <div className="four wide field">
                                            <div ref="Pool" className="ui checkbox" onClick={(e) => {this.handleCheckboxChange(e, 'Pool')}}>
                                                <input type="checkbox" name="amenity-pool" />
                                                <label>Pool</label>
                                            </div>
                                        </div>
                                        <div className="four wide field">
                                            <div ref="Elevator" className="ui checkbox" onClick={(e) => {this.handleCheckboxChange(e, 'Elevator')}}>
                                                <input type="checkbox" name="amenity-elevator"/>
                                                <label>Elevator</label>
                                            </div>
                                        </div>
                                        <div className="four wide field">
                                            <div ref="Fitness center" className="ui checkbox" onClick={(e) => {this.handleCheckboxChange(e, 'Fitness center')}}>
                                                <input type="checkbox" name="amenity-fitnesscenter"/>
                                                <label>Fitness center</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui fields">
                                        <div className="four wide field">
                                            <div ref="Security guard" className="ui checkbox" onClick={(e) => {this.handleCheckboxChange(e, 'Security guard')}}>
                                                <input type="checkbox" name="amenity-securityguard"/>
                                                <label>Security guard</label>
                                            </div>
                                        </div>
                                        <div className="four wide field">
                                            <div ref="Parking" className="ui checkbox" onClick={(e) => {this.handleCheckboxChange(e, 'Parking')}}>
                                                <input type="checkbox" name="amenity-parking"/>
                                                <label>Parking</label>
                                            </div>
                                        </div>
                                        <div className="five wide field">
                                            <div ref="Laundry: in building" className="ui checkbox" onClick={(e) => {this.handleCheckboxChange(e, 'Laundry: in building')}} >
                                                <input type="checkbox" name="amenity-laundry" />
                                                <label>Laundry: in building</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui fields">
                                        <div className="ten wide field">
                                            <div className="ui input">
                                                <input type="text"
                                                    placeholder="Other amenities (separate by commas)"
                                                    ref="customAmenities"
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
                                            center={center} zoom={this.state.zoom}>
                                            <TileLayer
                                                url='https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'
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
                            <div className={"sixteen wide field " + existingPhotosClass}>
                                <label>Existing photos</label>
                                {existingPhotos}
                            </div>
                            <div className={"ui green button " + buttonClass }
                                type="submit" onClick={this.editBuilding}
                            >
                                Update
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
        isGettingBuilding: state.building.isGettingBuilding,
        hasGottenBuilding: state.building.hasGottenBuilding,
        building: state.building.building,
        isEditing: state.building.isEditingBuilding,
        hasEdited: state.building.hasEditedBuilding,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditBuildingView);
export { EditBuildingView as EditBuildingViewNotConnected };
