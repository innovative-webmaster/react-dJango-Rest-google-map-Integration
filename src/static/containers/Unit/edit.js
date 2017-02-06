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

class EditUnitView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unitID: null,
            buildingID: null,
            neighborhoodID: null,
            number: null,
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
            contactInfoFacebook: '',
            contactInfoEmail: '',
            contactInfoWhatsapp: '',
            leaseType: '',
            contactInfoRelationshipProperty : ["Broker/Agent", "Owner", "Property Manager", "Student/Tenant"],
            selectedContactInfoRelationshipProperty : '',
            photos: [],
            existingPhotos: [],
            populatedForm: false
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
                this.setState({neighborhoodID: val, buildingID: null});
                $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('clear');
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.contactInfoRelationshipPropertyDropdown)).dropdown({
            'onChange': function(val){
                this.setState({selectedContactInfoRelationshipProperty: val});

            }.bind(this)
        });

        this.props.actions.listNeighborhoods(this.props.token);
        this.props.actions.getUnit(this.props.token, this.props.params.id);

        $(ReactDOM.findDOMNode(this.refs.editUnitForm))
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
                    number: {
                        identifier  : 'number',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter a value'
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

    componentDidUpdate() {
        if (this.props.hasGottenUnit == true && this.props.hasGottenNeighborhoodList == true && 
            this.props.hasGottenList == true && this.state.populatedForm == false) {
            $(ReactDOM.findDOMNode(this.refs.unitTitle)).val(this.props.unit.title);
            $(ReactDOM.findDOMNode(this.refs.unitNumber)).val(this.props.unit.number);
            $(ReactDOM.findDOMNode(this.refs.unitNumBeds)).val(this.props.unit.num_beds);
            $(ReactDOM.findDOMNode(this.refs.unitNumBaths)).val(this.props.unit.num_baths);
            $(ReactDOM.findDOMNode(this.refs.unitLeaseType)).val(this.props.unit.type_lease);
            $(ReactDOM.findDOMNode(this.refs.unitDescription)).val(this.props.unit.description);
            $(ReactDOM.findDOMNode(this.refs.unitRent)).val(this.props.unit.rent);
            $(ReactDOM.findDOMNode(this.refs.unitSecurityDeposit)).val(this.props.unit.security_deposit);
            $(ReactDOM.findDOMNode(this.refs.unitContactInfoName)).val(this.props.unit.contact_name);
            $(ReactDOM.findDOMNode(this.refs.unitContactInfoPhone)).val(this.props.unit.contact_phone);
            $(ReactDOM.findDOMNode(this.refs.unitContactInfoFacebook)).val(this.props.unit.contact_facebook);
            $(ReactDOM.findDOMNode(this.refs.unitContactInfoEmail)).val(this.props.unit.contact_email);
            $(ReactDOM.findDOMNode(this.refs.unitContactInfoWhatsApp)).val(this.props.unit.contact_whatsapp);
            $(ReactDOM.findDOMNode(this.refs.neighborhoodDropdown)).dropdown('set selected', this.props.unit.building_data.neighborhood);
            $(ReactDOM.findDOMNode(this.refs.contactInfoRelationshipPropertyDropdown)).dropdown('set selected', this.props.unit.contact_relation_property);

            // THIS IS A HACK. Should find out why it doesn't work.
            // Related to the filtering based on neighborhood
            setTimeout(function() {
                $(ReactDOM.findDOMNode(this.refs.buildingDropdown)).dropdown('set selected', this.props.unit.building);
            }.bind(this), 200);

            let selectedAmenities = [];
            let customAmenities = [];
            let customAmenitiesStr = '';

            this.props.unit.amenities.forEach(function(s,i) {
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

            this.setState({
                populatedForm: true, title: this.props.unit.title,
                number: this.props.unit.number, numBeds: this.props.unit.num_beds,
                numBaths: this.props.unit.num_baths, leaseType: this.props.unit.type_lease,
                description: this.props.unit.description, rent: this.props.unit.rent,
                securityDeposit: this.props.unit.security_deposit, contactInfoName: this.props.unit.contact_name,
                contactInfoPhoneNumber: this.props.unit.contact_phone, contactInfoFacebook: this.props.unit.contact_facebook,
                contactInfoEmail: this.props.unit.contact_email, contactInfoWhatsapp: this.props.unit.contact_whatsapp,
                neighborhoodID: this.props.unit.building_data.neighborhood, selectedContactInfoRelationshipProperty : this.props.unit.contact_relation_property,
                selectedAmenities: selectedAmenities,
                unitID: this.props.unit.uuid,
                customAmenities: customAmenities, existingPhotos: this.props.unit.photos
            });
        }
    }

    handleInputChange = (e, state) => {
        this.setState({
            [state]: e.target.value
        });
    }

    editUnit = (e) => {
        $(ReactDOM.findDOMNode(this.refs.editUnitForm)).form('validate form');
        if ($(ReactDOM.findDOMNode(this.refs.editUnitForm)).form('is valid')) {
            this.props.actions.editUnit(
                this.props.token,
                this.state.unitID,
                this.state.number, this.state.numBeds, this.state.numBaths, this.state.leaseType,
                this.state.title,
                JSON.stringify(this.state.selectedAmenities.concat(this.state.customAmenities)),
                this.state.description, this.state.contactInformation,
                this.state.rent, this.state.securityDeposit, this.state.buildingID, this.state.photos,
                JSON.stringify(this.state.existingPhotos),
                this.state.contactInfoName, this.state.contactInfoPhoneNumber, this.state.contactInfoFacebook,
                this.state.contactInfoEmail, this.state.contactInfoWhatsapp,
                this.state.selectedContactInfoRelationshipProperty,
                '/unit/show/' + this.state.unitID);
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

    removeExistingPicture = (i) => {
        let existingPhotos = this.state.existingPhotos;
        existingPhotos.splice(i, 1);
        this.setState({existingPhotos: existingPhotos});
    }

    render() {
        const buttonClass = classNames({
            loading: this.props.isEditing
        });

        const existingPhotosClass = classNames({
            hidden: this.state.existingPhotos.length == 0
        });
        
        const formClass = classNames({
            loading: this.props.isGettingList || this.props.isGettingNeighborhoodList
        });

        const photoPreviewClass = classNames({
            hidden: this.state.photos.length == 0
        });

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
            <div id="edit-unit-container">
                <DocumentTitle title='Edit unit'>
                    <div className="ui container">
                        <h2 className="ui header">
                            Edit unit
                        </h2>
                        <form className={"ui form " + formClass} ref="editUnitForm" >
                            <div className="five wide field">
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
                            <div className="five wide field">
                                <label>Building</label>
                                <div id="xxx" className="ui selection dropdown" ref="buildingDropdown">
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
                                            ref="unitTitle"
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
                                            ref="unitNumber"
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
                                        ref="unitNumBeds"
                                        onChange={(e) => { this.handleInputChange(e, 'numBeds'); }}
                                    />
                                </div>
                            </div>
                            <div className="two wide field">
                                <label>Number of bathrooms</label>
                                <div className="ui input">
                                    <input type="text"
                                        name="numBaths"
                                        ref="unitNumBaths"
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
                                            ref="unitLeaseType"
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
                                <div className="three wide field">
                                    <div ref="A/C" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'A/C')}}>
                                        <input type="checkbox" name="amenity-ac"  />
                                        <label>A/C</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div ref="Microwave" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Microwave')}} >
                                        <input type="checkbox" name="amenity-microwave"/>
                                        <label>Microwave</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div ref="Dishwasher" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Dishwasher')}} >
                                        <input type="checkbox" name="amenity-dishwasher" />
                                        <label>Dishwasher</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div ref="Electricity included" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Electricity included')}} >
                                        <input type="checkbox" name="amenity-electricityincluded" />
                                        <label>Electricity included</label>
                                    </div>
                                </div>
                            </div>
                            <div className="ui fields">
                                <div className="three wide field">
                                    <div ref="Furnished" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Furnished')}} >
                                        <input type="checkbox" name="amenity-furnished" />
                                        <label>Furnished</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div ref="Laundry: in unit" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Laundry: in unit')}}>
                                        <input type="checkbox" name="amenity-laundry"  />
                                        <label>Laundry: in unit</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div ref="Pet friendly" className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Pet friendly')}} >
                                        <input type="checkbox" name="amenity-petfriendly" />
                                        <label>Pet friendly</label>
                                    </div>
                                </div>
                                <div className="three wide field">
                                    <div className="ui checkbox" onChange={(e) => {this.handleCheckboxChange(e, 'Electricity not included')}}>
                                        <input type="checkbox" name="amenity-electricitynotincluded"  />
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
                                            ref="customAmenities"
                                            onChange={(e) => { this.handleCustomAmenities(e, 'customAmenities'); }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="eight wide field">
                                <label>Description</label>
                                <textarea 
                                    name="description"
                                    ref="unitDescription"
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
                                        ref="unitRent"
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
                                        ref="unitSecurityDeposit"
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
                                            ref="unitContactInfoName"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoName'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Phone number"
                                            name="ci-phone"
                                            ref="unitContactInfoPhone"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoPhoneNumber'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="Facebook name or page"
                                            name="ci-facebook"
                                            ref="unitContactInfoFacebook"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoFacebook'); }}
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
                                            ref="unitContactInfoEmail"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoEmail'); }}
                                        />
                                    </div>
                                </div>
                                <div className="three wide field"> 
                                    <div className="ui input">
                                        <input type="text"
                                            placeholder="WhatsApp phone"
                                            name="ci-whatsapp"
                                            ref="unitContactInfoWhatsApp"
                                            onChange={(e) => { this.handleInputChange(e, 'contactInfoWhatsapp'); }}
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
                            <div className={"sixteen wide field " + existingPhotosClass}>
                                <label>Existing photos</label>
                                {existingPhotos}
                            </div>

                            <div className={"ui green button " + buttonClass }
                                type="submit" onClick={this.editUnit}
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
        isEditing: state.unit.isEditingUnit,
        hasEdited: state.unit.hasEditedUnit,
        isGettingUnit: state.unit.isGettingUnit,
        hasGottenUnit: state.unit.hasGottenUnit,
        unit: state.unit.unit,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditUnitView);
export { EditUnitView as EditUnitViewNotConnected };
