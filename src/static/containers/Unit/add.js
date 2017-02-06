import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import './style.scss';
import * as unitActionCreators from '../../actions/unit';
import * as buildingActionCreators from '../../actions/building';
import * as neighborhoodActionCreators from '../../actions/neighborhood';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

class AddUnitView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buildingID: null,
            neighborhoodID: null,
            number: '',
            numBeds: null,
            numBaths: null,
            title: null,
            selectedAmenities: [],
            customAmenities: [],
            description: null,
            rent: null,
            securityDeposit: null,
            contactInfoName: '',
            contactInfoPhoneNumber: '',
            contactInfoSecondaryPhoneNumber: '',
            contactInfoFacebook: '',
            contactInfoEmail: '',
            contactInfoWhatsapp: '',
            leaseType: '',
            contactInfoRelationshipProperty : ["Broker/Agent", "Owner", "Property Manager", "Student/Tenant"],
            selectedContactInfoRelationshipProperty : '',
            photos: []
        };
    }

    componentWillUnmount() { 
        $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('destroy');
        $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('destroy');
        $(ReactDOM.findDOMNode(this.refs.contactInfoRelationshipPropertyDropdown)).dropdown('destroy');
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this.refs.titleBubble)).popup();
        $(ReactDOM.findDOMNode(this.refs.unitNumberBubble)).popup();
        $(ReactDOM.findDOMNode(this.refs.leaseTypeBubble)).popup();
        $(ReactDOM.findDOMNode(this.refs.contactInfoBubble)).popup();

        $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown({
            'onChange': function(val, v){
                this.setState({buildingID: val});
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown({
            'onChange': function(val){
                this.setState({neighborhoodID: val});

                if (!this.props.location.query.buildingid && !this.props.location.query.neighborhoodid) {
                    $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('clear');
                    this.setState({buildingID: null});
                }
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.contactInfoRelationshipPropertyDropdown)).dropdown({
            'onChange': function(val){
                this.setState({selectedContactInfoRelationshipProperty: val});

            }.bind(this)
        });

        this.props.actions.listNeighborhoods(this.props.token);

        $(ReactDOM.findDOMNode(this.refs.createUnitForm))
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
                    leaseType: {
                        identifier  : 'leaseType',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a lease type'
                            },
                        ]
                    },
                    numBeds: {
                        identifier  : 'numBeds',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    numBaths: {
                        identifier  : 'numBaths',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    title: {
                        identifier  : 'title',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
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
                    },
                    rent: {
                        identifier  : 'rent',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
                            },
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    },
                    securityDeposit: {
                        identifier  : 'securityDeposit',
                        rules: [
                            {
                                type   : 'number',
                                prompt : 'Please enter a number'
                            },
                        ]
                    }
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasGottenList && nextProps.hasGottenNeighborhoodList && 
        this.props.location.query.buildingid && this.props.location.query.neighborhoodid) {

            // BUILDING 
            // THis will trigger an onChange which will change our component's state. 
            $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('set value', this.props.location.query.buildingid);

            // Still need to change the text though. First, get the text
            let buildingName = null;

            nextProps.buildingList.forEach(function(s,i) {
                if (s.uuid == this.props.location.query.buildingid) {
                    buildingName = s.title;
                }
            }, this)

            // Set the text
            $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('set text', buildingName);
            $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('set selected', this.props.location.query.buildingid);
            
            // NEIGHBORHOOD 
            // THis will trigger an onChange which will change our component's state. 
            $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('set value', this.props.location.query.neighborhoodid);

            // Still need to change the text though. First, get the text
            let neighborhoodName = null;

            nextProps.neighborhoodList.forEach(function(s,i) {
                if (s.uuid == this.props.location.query.neighborhoodid) {
                    neighborhoodName = s.title;
                }
            }, this)

            // Set the text
            $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('set text', neighborhoodName);
            $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('set selected', this.props.location.query.neighborhoodid);
        }
    }

    createUnit = (e) => {
        $(ReactDOM.findDOMNode(this.refs.createUnitForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.createUnitForm)).form('is valid')) {
            this.props.actions.createUnit(
                this.props.token,
                this.state.number, this.state.numBeds, this.state.numBaths, this.state.leaseType,
                this.state.title,
                JSON.stringify(this.state.selectedAmenities.concat(this.state.customAmenities)),
                this.state.description, this.state.contactInformation,
                this.state.rent, this.state.securityDeposit, this.state.buildingID, this.state.photos,
                this.state.contactInfoName, this.state.contactInfoPhoneNumber, this.state.contactInfoSecondaryPhoneNumber,
                this.state.contactInfoFacebook, this.state.contactInfoEmail, this.state.contactInfoWhatsapp,
                this.state.selectedContactInfoRelationshipProperty,
                '/map');
        }
    }

    onDrop = (files) => {
        let currentPhotos = this.state.photos;
        currentPhotos = currentPhotos.concat(files);
        this.setState({ photos: currentPhotos });
    }

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
        
        const formClass = classNames({
            loading: this.props.isGettingList || this.props.isGettingNeighborhoodList
        });

        const photoPreviewClass = classNames({
            hidden: this.state.photos.length == 0
        });

        const buildingDropdownClass = classNames({
            disabled: this.props.location.query.buildingid
        });

        const neighborhoodDropdownClass = classNames({
            disabled: this.props.location.query.neighborhoodid
        });

        let preview = (
            this.state.photos.map(function(s,i) {
                return (
                    <img key={i} className="ui tiny image" src={s.preview} />
                )
            })
        )

        let buildingList = null;

        if (this.props.hasGottenList == true) {
            buildingList = 
            this.props.buildingList.map(function(s, i) {
                if (this.state.neighborhoodID) {
                    if (s.neighborhood == this.state.neighborhoodID) {
                        return (
                            <div key={i} className="item" data-value={s.uuid}>{s.title}</div>
                        )
                    }
                }

                else {
                    return (
                        <div key={i} className="item" data-value={s.uuid}>{s.title}</div>
                    )
                }
            }, this);
        }

        let neighborhoodList = null;

        if (this.props.hasGottenNeighborhoodList == true) {
            neighborhoodList = 
            this.props.neighborhoodList.map(function(s, i){
                return (
                    <div key={i} className="item" data-value={s.uuid}>{s.name}</div>
                )
            });
        }

        let contactInfoRelationshipPropertyList = (
            this.state.contactInfoRelationshipProperty.map(function(s, i) {
                return (
                    <div key={i} className="item" data-value={s}>{s}</div>
                )
            })
        )

        return (
            <div id="add-unit-container">
                <DocumentTitle title='Add unit'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Add unit
                        </h2>
                        <form className={"ui form " + formClass} ref="createUnitForm" >
                            <div className="five wide field">
                                <label>Neighborhood</label>
                                <div className={"ui selection dropdown " + neighborhoodDropdownClass} ref="neighborhoodDropdown">
                                    <input type="hidden" name="neighborhoodID"/>
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select a neighborhood</div>
                                    <div className="menu">
                                        {neighborhoodList}
                                    </div>
                                </div>
                            </div>
                            <div className="five wide field">
                                <label>Building</label>
                                <div className={"ui selection dropdown " + buildingDropdownClass} ref="buildingDropdown">
                                    <input type="hidden" name="buildingID"/>
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select a building</div>
                                    <div className="menu">
                                        {buildingList}
                                    </div>
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="five wide field">
                                    <label>Title</label>
                                    <div className="ui input">
                                        <input type="text"
                                            name="title"
                                            onChange={(e) => { this.handleInputChange(e, 'title'); }}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <i ref="titleBubble" className="standard-bubble circular info icon " data-content="If this is a house, please type 'house'. If 2 bedroom, please type '2 bedroom'." data-variation="inverted" data-position="right center"></i>
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="two wide field">
                                    <label>Unit number</label>
                                    <div className="ui input">
                                        <input type="text"
                                            name="number"
                                            onChange={(e) => { this.handleInputChange(e, 'number'); }}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <i ref="unitNumberBubble" className="standard-bubble circular info icon " data-content="Example: 2A, Ground floor, or house." data-variation="inverted" data-position="right center"></i>
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Number of bedrooms</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="numBeds"
                                        onChange={(e) => { this.handleInputChange(e, 'numBeds'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Number of bathrooms</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="numBaths"
                                        onChange={(e) => { this.handleInputChange(e, 'numBaths'); }}
                                    />
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="four wide field">
                                    <label>Type of lease</label>
                                    <div className="ui input">
                                        <input type="text"
                                            name="leaseType"
                                            onChange={(e) => { this.handleInputChange(e, 'leaseType'); }}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <i ref="leaseTypeBubble" className="standard-bubble circular info icon " data-content="Long term (1 yr+), short term (less than 12 months or by term), or both." data-variation="inverted" data-position="right center"></i>
                                </div>
                            </div>
                            <h5 className="field-header" id="">Amenities</h5>
                            <div className="ui fields">
                                <div className="three wide field"> <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-ac" onChange={(e) => {this.handleCheckboxChange(e, 'A/C')}} />
                                        <label>A/C</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-microwave" onChange={(e) => {this.handleCheckboxChange(e, 'Microwave')}} />
                                        <label>Microwave</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-dishwasher" onChange={(e) => {this.handleCheckboxChange(e, 'Dishwasher')}} />
                                        <label>Dishwasher</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-electricityincluded" onChange={(e) => {this.handleCheckboxChange(e, 'Electricity included')}} />
                                        <label>Electricity included</label>
                                    </div>
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-furnished" onChange={(e) => {this.handleCheckboxChange(e, 'Furnished')}} />
                                        <label>Furnished</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-laundry" onChange={(e) => {this.handleCheckboxChange(e, 'Laundry: in unit')}} />
                                        <label>Laundry: in unit</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-petfriendly" onChange={(e) => {this.handleCheckboxChange(e, 'Pet friendly')}} />
                                        <label>Pet friendly</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="amenity-electricitynotincluded" onChange={(e) => {this.handleCheckboxChange(e, 'Electricity not included')}} />
                                        <label>Electricity not included</label>
                                    </div>
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="six wide field">
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Other amenities (separate by commas)"
                                            name="customAmenities"
                                            onChange={(e) => { this.handleCustomAmenities(e, 'customAmenities'); }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="eight wide field">
                                <label>Description</label>
                                <textarea 
                                    name="description"
                                    rows="2"
                                    onChange={(e) => { this.handleInputChange(e, 'description')}}
                                ></textarea> 
                            </div>
                            <div className="two wide field">
                                <label>Rent</label>
                                <div className="ui labeled input">
                                    <div className="ui label">$</div>
                                    <input type="text"
                                        name="rent"
                                        onChange={(e) => { this.handleInputChange(e, 'rent'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Security deposit</label>
                                <div className="ui labeled input">
                                    <div className="ui label">$</div>
                                    <input type="text"
                                        name="securityDeposit"
                                        onChange={(e) => { this.handleInputChange(e, 'securityDeposit'); }}
                                    />
                                </div>
                            </div>
                            <h5 id="contact-info-header" className="field-header">Contact information for the apartment, building, home, etc</h5>
                            <i ref="contactInfoBubble" id="contact-info-bubble" className="circular info icon " data-content="This is the contact information that will be displayed with the apartment, building, home, etc." data-variation="inverted" data-position="right center"></i>
                            <div className="ui fields">
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Name"
                                            name="ci-name"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoName'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Phone number"
                                            name="ci-phone"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoPhoneNumber'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Secondary phone number"
                                            name="ci-secondary-phone"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoSecondaryPhoneNumber'); }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Email"
                                            name="ci-email"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoEmail'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="WhatsApp phone"
                                            name="ci-whatsapp"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoWhatsapp'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Facebook name or page"
                                            name="ci-facebook"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoFacebook'); }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="four wide field">
                                <label>Contact information's relationship to property</label>
                                <div className="ui selection dropdown" ref="contactInfoRelationshipPropertyDropdown">
                                    <input type="hidden" name="relationship"/>
                                    <i className="dropdown icon"></i>
                                    <div className="default text">Select a relationship</div>
                                    <div className="menu">
                                        {contactInfoRelationshipPropertyList}
                                    </div>
                                </div>
                            </div>

                            <div className="sixteen wide field">
                                <label>Upload unit photos</label>
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
                                type="submit" onClick={this.createUnit}
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
        isCreated: state.unit.isCreated,
        isCreating: state.unit.isCreating,
        statusText: state.unit.statusText,
        isGettingList: state.building.isGettingList,
        hasGottenList: state.building.hasGottenList,
        buildingList: state.building.buildingList,
        isGettingNeighborhoodList: state.neighborhood.isGettingList,
        hasGottenNeighborhoodList: state.neighborhood.hasGottenList,
        neighborhoodList: state.neighborhood.neighborhoodList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({ ...unitActionCreators, ...buildingActionCreators, ...neighborhoodActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUnitView);
export { AddUnitView as AddUnitViewNotConnected };
