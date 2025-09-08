import React, { useEffect, useRef, useState } from 'react';
import './Mapbox.css'
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';


const Mapbox = ({ setShowMapboxModal, location, handleLocationChangeFromMap }) => {
    const modelRef = useRef();
    const mapboxToken = process.env.REACT_APP_MAP_TOKEN

    const [viewState, setViewState] = useState({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
        zoom: 12,
    });

    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modelRef.current && !modelRef.current.contains(e.target)) {
                setShowMapboxModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowMapboxModal]);


    useEffect(() => {
        if (location?.coordinates.length !== 0) {
            return
        }
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await fetch(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
                        );
                        const data = await res.json();
                        if (data.features.length > 0) {
                            const coordinates = data.features[2].geometry.coordinates;

                            setViewState((prev) => ({
                                ...prev,
                                latitude: coordinates[1],
                                longitude: coordinates[0],
                            }));
                        }
                    } catch (err) {
                        console.error("Error fetching address:", err);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, [mapboxToken, location]);



    const handleLocationChange = (evt) => {
        const newLocation = evt.viewState;
        setViewState(newLocation);

        if (debounceRef.current) clearTimeout(debounceRef.current);


        debounceRef.current = setTimeout(() => {
            handleLocationChangeFromMap(newLocation.longitude, newLocation.latitude);
        }, 500);
    };

    return (
        <div className="mapbox-overlay">
            <div className="mapbox-modal" ref={modelRef}>
                <button className="close-icon" onClick={() => { setShowMapboxModal(false) }}>
                    ×
                </button>
                <Map
                    initialViewState={viewState}
                    mapboxAccessToken={mapboxToken}
                    className='map'
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    onMove={(evt) => handleLocationChange(evt)}
                >
                    <NavigationControl position="top-right" />
                    <Marker latitude={viewState.latitude} longitude={viewState.longitude} color="red" />
                </Map>
            </div>
        </div>
    );
}

export default Mapbox;