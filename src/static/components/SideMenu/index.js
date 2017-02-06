import React from 'react';
import classNames from 'classnames';
import { Marker, Popup} from 'react-leaflet';
import 'drmonty-leaflet-awesome-markers';
import 'drmonty-leaflet-awesome-markers/css/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';

class BuildingMarker extends React.Component {

    static propTypes = {
    };

    render() {
        return (
            <Marker key={this.props.key} position={this.props.position}
                icon={
                    L.AwesomeMarkers.icon({
                        prefix: 'fa',
                        shadowSize: [0,0],
                        icon: 'fa-building',
                        markerColor: 'red'
                    })
                }
            > 
                <Popup>
                    <span>go lakers!!</span>
                </Popup>
            </Marker>
        );
    }
}

export default (BuildingMarker);
