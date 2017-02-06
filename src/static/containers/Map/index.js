import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { authLogoutAndRedirect } from '../../actions/auth';
import DocumentTitle from 'react-document-title';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import './style.scss';
import * as buildingActionCreators from '../../actions/building';
import * as userActionCreators from '../../actions/user';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import './range.js';
import './range.css';
import { push } from 'react-router-redux';


class MapView extends React.Component {
    

    static propTypes = {
        statusText: React.PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            maximumRent: 6000,
            numberBedrooms: 0,
            numberBathrooms: 0,
            mapSatelliteMode: "streets",
            flag: false,
            favoriteBuildings: {},
            busRoutes: {
                "True Blue Inn": [
                    { lat:12.001585614764185, lng:-61.7732048034668 },
                    { lat:12.001543637466856, lng:-61.77191734313965 },
                    { lat:12.004062263733703, lng:-61.77088737487793 },
                    { lat:12.00414621753719, lng:-61.76856994628906 },
                    { lat:12.002425159337749, lng:-61.7688274383545 },
                    { lat:12.000767056287035, lng:-61.76786184310914 },
                    { lat:12.000221349254534, lng:-61.76766872406006 },
                    { lat:11.999612674722625, lng:-61.76766872406006 },
                ],
                "Lance Aux Epines": [
                    { lat:12.001585614764185, lng:-61.7732048034668 },
                    { lat:12.001543637466856, lng:-61.77191734313965 },
                    { lat:12.004062263733703, lng:-61.77088737487793 },
                    { lat:12.00414621753719, lng:-61.76856994628906 },
                    { lat:12.007000631291351, lng:-61.766209602355964 },
                    { lat:12.00897351723973, lng: -61.76535129547119},
                    { lat:12.009938966799593, lng:-61.76539421081543 },
                    { lat:12.015731591472251, lng:-61.75788402557372 },
                    { lat:12.016025416938797, lng:-61.75655364990234 },
                    { lat:12.014262459328963, lng:-61.7570686340332},
                    { lat:12.01210072174153, lng: -61.75711154937744},
                    { lat:12.009141421759594, lng: -61.757969856262214},
                    { lat:12.00506970764919, lng: -61.758613586425774},


                    { lat:12.000830022411998, lng:-61.757798194885254},

                    { lat:11.99952871950692, lng:-61.757755279541016},
                    { lat:11.998689165911738, lng:-61.75719738006591},

                    { lat:11.998101476839421, lng: -61.75719738006591},
                    { lat:11.996254445700899, lng:-61.75869941711426},
                    { lat:11.995456860161474, lng:-61.7590856552124},
                    { lat:11.992140558150458, lng:-61.759042739868164},

                    { lat:11.99184670663858, lng: -61.758484840393066},
                    { lat:11.992980132134765, lng:-61.75814151763916},
                    { lat:11.993022110765395, lng:-61.75792694091796},
                    { lat:11.992476388057783, lng:-61.75771236419678},

                    { lat:11.992560345469279, lng: -61.756510734558105},
                    { lat:11.993399918146912, lng:-61.756510734558105},

                    { lat:11.993777724999212, lng:-61.75440788269043},
                    { lat:11.994365423495244, lng:-61.754322052001946},

                    { lat:11.994533337116026, lng:-61.755609512329094},
                    { lat:11.995918620498161, lng:-61.75646781921387},

                    { lat:11.996401369095569, lng:-61.756317615509026},
                    { lat:11.99736686369752, lng:-61.75666093826295},
                    { lat:11.998500265992499, lng:-61.75638198852539},
                    { lat:11.998563232646948, lng:-61.75530910491943},
                    
                    { lat:11.99933982017597, lng:-61.755545139312744},
                    { lat:12.001249796202496, lng:-61.75537347793579},
                    { lat:12.001501660162988, lng:-61.7561674118042},

                    { lat:12.003453597876147, lng:-61.757562160491936},
                    { lat:12.003684471294305, lng:-61.75833463668823},
                ],
                "Point Saline / Frequente": [
                    { lat:12.001585614764185, lng:-61.7732048034668 },
                    { lat:12.001543637466856, lng:-61.77191734313965 },
                    { lat:12.004062263733703, lng:-61.77088737487793 },
                    { lat:12.00414621753719, lng:-61.76856994628906 },
                    { lat:12.007000631291351, lng:-61.766209602355964 },
                    { lat:12.00897351723973, lng: -61.76535129547119},
                    { lat:12.009938966799593, lng:-61.76539421081543 },

                    { lat:12.014052582654038, lng: -61.76011562347412},
                    { lat:12.015248877509546, lng: -61.76108121871948},
                    { lat:12.014787150300496, lng: -61.76170349121094},
                    { lat:12.013842705815494, lng:-61.761982440948486},
                    { lat:12.013926656570547, lng: -61.76217555999755},
                    { lat:12.01495505119542, lng: -61.76294803619385},
                    { lat:12.011974794745182, lng: -61.76541566848755},

                    { lat:12.012310599937917, lng: -61.765823364257805},
                    { lat:12.013003196825313, lng: -61.766231060028076},
                    { lat:12.013863693506716, lng: -61.767261028289795},
                    { lat:12.013066160090373, lng: -61.76869869232178},
                    { lat:12.013213074318264, lng: -61.77103757858276},
                    { lat:12.008343874358022, lng: -61.771359443664544}, //111
                    
                    { lat:12.00796608792253, lng: -61.770522594451904},
                    { lat:12.00987600280335, lng: -61.76539421081543},
                   
                    { lat:12.00796608792253, lng: -61.770522594451904},
                    { lat:12.008343874358022, lng: -61.771359443664544}, //111

                    { lat:12.008763636442705, lng: -61.772089004516594},
                    { lat:12.012961221307098, lng: -61.77380561828613},
                    { lat:12.013548877966688, lng: -61.77440643310546},
                    { lat:12.013548877966688, lng: -61.775050163269036},
                    { lat:12.013380976194835, lng: -61.77545785903931},
                    { lat:12.012037758250717, lng: -61.776766777038574},
                    { lat:12.010925400818866, lng: -61.77788257598877},
                    { lat:12.009896990803735, lng: -61.779470443725586}
                ],
                "Grande Anse": [
                    { lat:12.001585614764185, lng:-61.7732048034668 },
                    { lat:12.001543637466856, lng:-61.77191734313965 },
                    { lat:12.004062263733703, lng:-61.77088737487793 },
                    { lat:12.00414621753719, lng:-61.76856994628906 },
                    { lat:12.007000631291351, lng:-61.766209602355964 },
                    { lat:12.00897351723973, lng: -61.76535129547119},
                    { lat:12.009938966799593, lng:-61.76539421081543 },

                    { lat:12.013003196825313, lng: -61.76140308380127},
                    { lat:12.015773566558535, lng: -61.75784111022949},
                    { lat:12.01791428727967, lng: -61.758785247802734},
                    
                    { lat:12.01791428727967, lng: -61.758785247802734},
                    { lat:12.018271072411203, lng: -61.75912857055664},
                    { lat:12.020013016555325, lng: -61.75942897796631},

                    { lat:12.021859884778037, lng: -61.75910711288452},
                    { lat:12.022636405131504, lng: -61.758956909179695},
                    { lat:12.021859884778037, lng: -61.75910711288452},

                    { lat:12.021566065681482, lng: -61.75956845283508},
                    { lat:12.020632138565185, lng: -61.76283001899719},
                    { lat:12.020443254035214, lng: -61.76479339599609},

                    { lat:12.020684606466663, lng: -61.76589846611023},
                    { lat:12.021534585044956, lng: -61.76567316055298},
                    { lat:12.022248145234927, lng: -61.76247596740722}
                ],
                "Mont Tout": [
                    { lat:12.001585614764185, lng:-61.7732048034668 },
                    { lat:12.001543637466856, lng:-61.77191734313965 },
                    { lat:12.004062263733703, lng:-61.77088737487793 },
                    { lat:12.00414621753719, lng:-61.76856994628906 },
                    { lat:12.007000631291351, lng:-61.766209602355964 },
                    { lat:12.00897351723973, lng: -61.76535129547119},
                    { lat:12.009938966799593, lng:-61.76539421081543 },
                    { lat:12.009938966799593, lng:-61.76539421081543 },

                    { lat:12.013003196825313, lng: -61.76140308380127},
                    { lat:12.015836529175688, lng: -61.7577338218689},

                    { lat:12.017746388230574, lng: -61.75633907318116},
                    { lat:12.019677220971108, lng: -61.75522327423095},
                    { lat:12.02177593649748, lng: -61.75417184829712},
                    { lat:12.022426534986717, lng: -61.754096746444695},

                    { lat:12.022877755595616, lng: -61.75440788269043},
                    { lat:12.02325552110475, lng: -61.755062341690056},
                    { lat:12.024011050531607, lng: -61.755695343017585},
                    { lat:12.02473509757444, lng: -61.756070852279656}
                ]
            },
            selectedBusRoute: null
        };
    }

    updateBuildings() {
        this.props.actions.listBuildings(this.props.token, this.state.maximumRent, this.state.numberBedrooms, this.state.numberBathrooms);
    }

    componentDidMount() {
        this.updateBuildings();

        $(ReactDOM.findDOMNode(this.refs.busRouteDropdown)).dropdown({
            'onChange': function(val){
                this.setState({selectedBusRoute: val});
            }.bind(this),
            'forceSelection': false
        });

        // Set a flag to true if they are dragging a slider.
        $(ReactDOM.findDOMNode(this.refs.rentSlider)).mousedown(function() {
            this.setState({flag: true});
        }.bind(this));

        $(ReactDOM.findDOMNode(this.refs.bedroomSlider)).mousedown(function() {
            this.setState({flag: true});
        }.bind(this));

        $(ReactDOM.findDOMNode(this.refs.bathroomSlider)).mousedown(function() {
            this.setState({flag: true});
        }.bind(this));

        // If they release the mouse button and the flag is set, that means
        // they just finished dragging the rent slider
        $('body').mouseup(function(e) {
            if (this.state.flag) {
                this.setState({flag: false});
                this.updateBuildings();
            }
        }.bind(this));

        $(ReactDOM.findDOMNode(this.refs.rentSlider)).range({
            min: 0,
            max: 60,
            start: 60,
            onChange: function(val) { 
                this.setState({maximumRent: val*100});
            }.bind(this)
        });
        
        $(ReactDOM.findDOMNode(this.refs.bedroomSlider)).range({
            min: 0,
            max: 5,
            start: 0,
            onChange: function(val) { 
                this.setState({numberBedrooms: val});
            }.bind(this)
        });

        $(ReactDOM.findDOMNode(this.refs.bathroomSlider)).range({
            min: 0,
            max: 5,
            start: 0,
            onChange: function(val) { 
                this.setState({numberBathrooms: val});
            }.bind(this)
        });
    }

    componentDidUpdate() {
    }

    favorite = (buildingID) => {
        // Keep track of the buildings we favorite so that we can disable the button down below
        const favoriteBuildings = this.state.favoriteBuildings;
        favoriteBuildings[buildingID] = "true";
        this.setState({
            favoriteBuildings: favoriteBuildings,
        });

        this.props.jiggleFavorites();
        this.props.actions.createFavorite(this.props.token, buildingID);
    }

    clearBusRoutes = () => {
        $(ReactDOM.findDOMNode(this.refs.busRouteDropdown)).dropdown('restore defaults');
        this.setState({selectedBusRoute: null});
    }
    
    render() {
        const centerPosition = [12.0000325,-61.7738056];
        const stGeorgeUniversityPosition = [12.000933,-61.773806];
        
        // parent div is 4em padding - header height
        const mapStyle = {height: window.innerHeight-42}

        const formClass = classNames({
            loading: this.props.isGettingBuildingList
        });

        let buildingList = null;

        if (this.props.hasGottenBuildingList == true) {
            buildingList = 
            this.props.buildingList.map(function(s, i){
                const favoriteClass = classNames({
                    disabled: s.is_favorite || (s.uuid in this.state.favoriteBuildings)
                });

                const p = [parseFloat(s.latitude), parseFloat(s.longitude)]
                const lt = 
                    s.unit_summary.lease_types.map(function(t,j) {
                        return <span key={j}>{t}{j==s.unit_summary.lease_types.length-1 ? "" : ", "}</span>
                    }); 

                let photos, thumbContainer = null;

                if (s.photos != null) {
                    const maxThumbs = 6;
                    photos = (
                        s.photos.map(function(t,j) {
                            if (j < maxThumbs-1) {
                                return <img className="ui image" key={j} src={t.thumb} />
                            }
                        })
                    )
                    thumbContainer = (
                        <div id="thumb-container" className="sixteen wide column">
                            <div className="ui tiny images">
                                {photos}
                            </div>
                        </div>
                    )
                }

                return (
                    <Marker key={i} position={p}
                        icon={
                            L.AwesomeMarkers.icon({
                                prefix: 'fa',
                                shadowSize: [0,0],
                                icon: 'fa-home',
                                markerColor: 'red'
                            })
                        }
                    > 
                        <Popup closeButton={false} maxWidth="256" minWidth="256">
                            <div className="ui info-window grid">
                                <div className="name sixteen wide column">
                                    <h4 className="ui header">
                                        {s.title}
                                    </h4>
                                </div>
                                <div className="details-left eight wide column">
                                    <div className="ui list">
                                        <div className="item">
                                            <div className="header">Rent</div>
                                            ${s.unit_summary.rent__min} - ${s.unit_summary.rent__max}
                                        </div>
                                        <div className="item">
                                            <div className="header">Bedroom</div>
                                            {s.unit_summary.num_beds__min} - {s.unit_summary.num_beds__max}
                                        </div>
                                    </div>
                                </div>
                                <div className="details-right eight wide column">
                                    <div className="ui list">
                                        <div className="item">
                                            <div className="header">Lease type</div>
                                            {lt}
                                        </div>
                                    </div>
                                </div>
                                {thumbContainer}
                                <div id="button-group" className="sixteen wide column center aligned">
                                    <div className="ui small labeled icon buttons">
                                        <button onClick={() => this.props.dispatch(push('/building/show/' + s.uuid))} className="small ui primary button">
                                          <i className="building icon"></i>
                                            Building
                                        </button>
                                        <div onClick={() => { this.favorite(s.uuid) }} className={"small ui green button " + favoriteClass}>
                                          <i className="heart icon"></i>
                                            Favorite
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            }.bind(this));
        }

        const busRoutes = (
            Object.keys(this.state.busRoutes).map(function(k,v) {
                return (
                    <option key={k} value={k}>{k}</option>
                )
            })
        )

        let polyLine = null;

        if (this.state.selectedBusRoute != null) {
            polyLine = 
                <Polyline positions={this.state.busRoutes[this.state.selectedBusRoute]} />
        }

        return (
            <div id="map-view-container">
                <form className={"ui form " + formClass}>
                    <DocumentTitle title='Map'>
                        <Map style={mapStyle} center={centerPosition} zoom={14} maxZoom={17} >
                            <TileLayer
                                url={'https://api.mapbox.com/styles/v1/mapbox/' + this.state.mapSatelliteMode + '-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ25kYXB0cyIsImEiOiJjaXN5enVjenEwZzdrMnlraDFkZzYwb2V1In0.V6HJ--BCJ9LjC-iJtIeuKA'}
                                attribution='<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>'
                            />
                            {polyLine}
                            <Marker position={stGeorgeUniversityPosition}
                                icon={
                                    L.AwesomeMarkers.icon({
                                        prefix: 'fa',
                                        shadowSize: [0,0],
                                        icon: 'fa-hospital-o',
                                        markerColor: 'purple'
                                    })
                                }
                            > 
                            </Marker>
                            {buildingList}
                        </Map>
                    </DocumentTitle>
                </form>
                <div id="filter-box" className="ui raised segments">
                    <div className="ui horizontal segments">
                        <div className="ui half-width segment">
                            <p>Rent <span className="info-text"><b>&lt;${this.state.maximumRent}</b></span></p>
                            <div className="ui range" ref="rentSlider"></div>
                        </div>
                    </div>
                    <div className="ui horizontal segments">
                        <div className="ui half-width segment">
                            <p>Bedrooms <span className="info-text"><b>&gt;{this.state.numberBedrooms}</b></span></p>
                            <div className="ui red range" ref="bedroomSlider"></div>
                        </div>
                    </div>
                    <div className="ui horizontal segments">
                        <div className="ui half-width segment">
                            <p>Bathrooms <span className="info-text"><b>&gt;{this.state.numberBathrooms}</b></span></p>
                            <div className="ui green range" ref="bathroomSlider"></div>
                        </div>
                    </div>
                    <div className="ui horizontal segments">
                        <div className="ui half-width segment">
                            <p>Bus route</p>
                            <select ref="busRouteDropdown" className="ui compact dropdown">
                                <option value="">Select route</option>
                                {busRoutes}
                            </select>
                            <a href="#" onClick={this.clearBusRoutes} className="ui icon button">
                                <i className="remove icon"></i>
                            </a>
                        </div>
                    </div>
                    <div className="ui horizontal segments">
                        <div className="ui half-width segment">
                            <div id="map-mode-controls" className="two ui buttons">
                                <button className={"ui button " + (this.state.mapSatelliteMode == "streets" ? "active" : "")} onClick={() => this.setState({mapSatelliteMode: "streets"})}>Street</button>
                                <div className="or"></div>
                                <button className={"ui button " + (this.state.mapSatelliteMode == "satellite" ? "active" : "")} onClick={() => this.setState({mapSatelliteMode: "satellite"})}>Satellite</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        statusText: state.auth.statusText,
        isGettingBuildingList: state.building.isGettingList,
        hasGottenBuildingList: state.building.hasGottenList,
        buildingList: state.building.buildingList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        actions: bindActionCreators({... buildingActionCreators, ... userActionCreators}, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
export { MapView as MapViewNotConnected };
