import { useState } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker } from '@vis.gl/react-google-maps';
import busIcon from '../../assets/svg/bus-green.svg';

export default function UnitMap({ lat, lon, stationLat, stationLon }) {
  const [bouncing, setBouncing] = useState(false);

  const busAnimation =
    typeof window !== 'undefined' && window.google && bouncing
      ? window.google.maps.Animation.BOUNCE
      : undefined;

  return (
    <div style={{ height: '320px', width: '100%' }}>
      <Map
        defaultCenter={{ lat, lng: lon }}
        defaultZoom={16}
        gestureHandling="greedy"
        disableDefaultUI
        id="unit-map"
      >
        <Marker
          position={{ lat, lng: lon }}
          icon={busIcon}
          animation={busAnimation}
          onClick={() => setBouncing((prev) => !prev)}
        />

        {stationLat && stationLon && (
          <Marker
            position={{ lat: stationLat, lng: stationLon }}
          />
        )}
      </Map>
    </div>
  );
}

UnitMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  stationLat: PropTypes.number,
  stationLon: PropTypes.number,
};

