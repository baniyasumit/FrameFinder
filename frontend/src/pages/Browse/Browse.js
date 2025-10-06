import React, { useEffect, useRef, useState } from 'react'
import './Browse.css'
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaStar } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';
import { GoStar, GoStarFill } from 'react-icons/go';
import { getBrowsePortfolio, getLocation, getSearchedLocations } from '../../services/PortfolioServices';
import { MdOutlineMyLocation } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';
import Mapbox from '../../components/Mapbox/Mapbox';

const Browse = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        photographerType: '',
        minBudget: '0',
        maxBudget: '',
        sortBy: 'rating',
        sortByAsc: false
    })

    const [portfolios, setPortfolios] = useState([])

    const navigate = useNavigate();

    const [locationResults, setLocationResults] = useState('');
    const [location, setLocation] = useState({
        name: '',
        coordinates: [],
    });
    const [currentLocationLoading, setCurrentLocationLoading] = useState(false)
    const [showMapboxModal, setShowMapboxModal] = useState(false)
    const locationRef = useRef();

    useEffect(() => {
        const loadLocation = async () => {
            const params = new URLSearchParams(window.location.search);
            const longitude = params.get("long");
            const latitude = params.get("lat");

            if (!longitude || !latitude) return;

            try {
                const data = await getLocation(Number(longitude), Number(latitude));
                if (data.features.length > 0) {
                    const placeName = data.features[0].place_name;
                    const coordinates = data.features[0].geometry.coordinates;

                    setLocation((prev) => ({
                        ...prev,
                        name: placeName,
                        coordinates,
                    }));
                    setLocationResults([]);
                }
            } catch (error) {
                console.error("Load Location Error: ", error);
            }
        };

        loadLocation();
    }, []);



    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            long: searchParams.get('long') || '',
            lat: searchParams.get('lat') || '',
            photographerType: searchParams.get('photographerType') || '',
            minBudget: searchParams.get('minBudget') || '0',
            maxBudget: searchParams.get('maxBudget') || '',
            sortBy: searchParams.get('sortBy') || 'rating',
            sortByAsc: searchParams.get('sortByAsc') === 'true',

        }));
    }, [searchParams])

    useEffect(() => {
        const loadPortfolios = async () => {
            try {
                const results = await getBrowsePortfolio(searchParams.toString());
                setPortfolios(results)
            } catch (error) {
                console.error("Load Photohrapher Portfolio Error: ", error)

            }
        };
        loadPortfolios();
    }, [searchParams]);

    const handleFilterChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setParams({ ...params, [name]: value });
    };

    const handleFilter = () => {
        setSearchParams({ ...params, long: location.coordinates[0] || '', lat: location.coordinates[1] || '' });
    };

    const handleFilterNav = (e) => {
        const { name, value } = e.target;
        const updatedParams = { ...params, [name]: value }
        setParams(updatedParams);
        setSearchParams({ ...updatedParams });
    };

    const handleSort = (field) => {
        const updatedParams = { ...params, sortBy: field };
        setParams(updatedParams);
        setSearchParams({ ...updatedParams });
    };

    const handleSortOrder = () => {
        const updatedParams = { ...params, sortByAsc: !params.sortByAsc };
        setParams(updatedParams);
        setSearchParams({ ...updatedParams })
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (locationRef.current && !locationRef.current.contains(e.target)) {
                setLocationResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setLocationResults]);

    const handleLocationChange = async (e) => {
        const value = e.target.value;
        setLocation({ ...location, name: value });

        if (value.length < 3) {
            setLocationResults([]);
            return;
        }

        const data = await getSearchedLocations(value);
        setLocationResults(data.features);
    };

    const handleLocationClick = (e) => {
        handleLocationChange(e);
    }

    const handleCoordinatesLocationChange = async (longitude, latitude) => {
        try {
            setCurrentLocationLoading(true);
            const data = await getLocation(longitude, latitude);
            if (data.features.length > 0) {
                const placeName = data.features[0].place_name;
                const coordinates = data.features[0].geometry.coordinates;

                setLocation({
                    ...location,
                    name: placeName,
                    coordinates: coordinates,
                });
                setLocationResults([]);
            }
        } catch (err) {
            console.error("Error fetching address:", err);
        }
        finally {
            setCurrentLocationLoading(false);
        }
    }

    const handleCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setCurrentLocationLoading(true);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    handleCoordinatesLocationChange(longitude, latitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setCurrentLocationLoading(false); // only stop if error occurs
                }
            );
        }
    };


    const handleLocationStore = (place) => {
        setLocation({
            ...location,
            name: place.place_name,
            coordinates: [
                place.center[0],
                place.center[1]
            ],
        });
        setLocationResults([]);
    }

    return (<>
        {showMapboxModal && <Mapbox setShowMapboxModal={setShowMapboxModal} location={location} handleLocationChangeFromMap={handleCoordinatesLocationChange} />}
        <section className='browse-main filter'>
            <div className='browse-container '>
                <h1 className='filter-heading'>Find Your Perfect Photographer</h1>
                <p>Browse through 500+ verified professionals.</p>
                <div className='filter-container'>

                    <div className='filter-types-line'>
                        <div className='filter-type'>
                            <label className='filter-label'>Location</label>
                            <div className='filter-input-container'>
                                <input className='filter-input' name='eventLocation' placeholder="Enter city or zip code"
                                    value={location.name}
                                    onChange={handleLocationChange}
                                    onClick={handleLocationClick}
                                    disabled={currentLocationLoading} />
                                {locationResults.length > 0 && (
                                    <ul className="portfolio-suggestions">
                                        <>
                                            <li onClick={handleCurrentLocation} className='current-location'>Current Location <span><MdOutlineMyLocation /></span></li>
                                            <li onClick={() => setShowMapboxModal(true)} className='current-location choose'>Choose on Map <span><GrMapLocation /></span></li>
                                            {locationResults.map((place) => (
                                                <li
                                                    key={place.id}
                                                    onClick={() => {
                                                        handleLocationStore(place)
                                                    }}
                                                >
                                                    {place.place_name}
                                                </li>
                                            ))}
                                        </>
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className='filter-type'>
                            <label className='filter-label'>Photographer Type</label>
                            <select className='filter-input dropdown' name='photographerType' value={params.photographerType} onChange={handleFilterChange}>
                                <option value="">All Types</option>
                                <option value="wedding">Wedding</option>
                                <option value="portrait">Portrait</option>
                            </select>
                        </div>


                    </div>
                    <div className='filter-types-line'>
                        <div className='filter-type'>
                            <label className='filter-label'>Min Budget</label>
                            <input className='filter-input' name='minBudget' type='number' value={params.minBudget} onChange={handleFilterChange} min={0} />
                        </div>
                        <div className='filter-type'>
                            <label className='filter-label'>Max Budget</label>
                            <input className='filter-input' name='maxBudget' type='number' value={params.maxBudget} placeholder="∞" onChange={handleFilterChange} min={1} />

                        </div>
                        <div className='filter-type'>
                            <button type='submit' className='filter-button' onClick={handleFilter}><span><FaSearch /></span>Search</button>
                        </div>
                    </div>

                </div>
            </div>
        </section >
        <section className='browse-main filter-nav-container'>
            <div className='browse-container filter-nav-container'>
                <div className='filter-nav'>
                    <div className='filter-nav-items'>
                        <span>Filters: </span>
                        <button className='filter-nav-button'><FaStar />  Top Rated</button>
                        <button className='filter-nav-button'>Available Today</button>
                        <button className={`filter-nav-button ${params.maxBudget === '500' && 'active'}`} name='maxBudget' value={500} onClick={handleFilterNav}>Under $500</button>
                    </div>
                    <div className='sort-order-container'>
                        <span>{portfolios.length} photographer found</span>
                        <select name='sortBy' className='filter-input dropdown' value={params.sortBy}
                            onChange={(e) => handleSort(e.target.value)}>
                            <option value="rating">Sort By Rating</option>
                            <option value="price">Sort By Price</option>
                        </select>
                        <button onClick={handleSortOrder}>
                            {params.sortByAsc ? <FaSortAmountUp /> : <FaSortAmountDown />}
                        </button>
                    </div>
                </div>

            </div>
        </section >
        {portfolios?.length === 0 ? (<>NotFound</>) : (
            <section className='browse-main photographer-listings-container'>
                <div className='browse-container photographer-listings-container'>
                    <div className='photographers-listings'>
                        {portfolios?.map((portfolio, index) => (
                            <div className='photographer-listing-card' key={index}>
                                <div className='listing-image-container'>
                                    <div>Available</div>
                                    <img src={portfolio.picture} alt='Portfolio' />
                                </div>
                                <div className='listing-information-container'>
                                    <div className='photographer-profile-information'>
                                        <div className='photographer-profile-picture'>
                                            <img src={portfolio.user.picture} alt="Profile" />
                                        </div>
                                        <div className='photographer-profile-basic-information' >
                                            <h3 className='photographer-full-name'>{portfolio.user.firstname} {portfolio.user.lastname}</h3>
                                            <div className='photographer-rating-stats'>
                                                <Rating
                                                    className='photographer-rating-stat'
                                                    initialValue={portfolio.ratingStats.averageRating}
                                                    size={16}
                                                    allowFraction
                                                    emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={15} />}
                                                    fillIcon={<GoStarFill color="#FACC15" size={15} />}
                                                    readonly
                                                />
                                                <span>{portfolio.ratingStats.averageRating} ({portfolio.ratingStats.totalReviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='photographer-message'>
                                        {portfolio.bio}
                                    </p>
                                    <p className='photographer-price-container'>
                                        <span className='price'>
                                            {portfolio.minPrice === portfolio.maxPrice ? <>${portfolio.minPrice}</> : <>${portfolio.minPrice} - ${portfolio.maxPrice}</>}
                                        </span>
                                        <span >(incl. pkg)</span>
                                    </p>
                                    <div className='photographer-specializations-container'>
                                        {portfolio.serviceTypes?.map((type, index) => (
                                            <button key={index} className={`photographer-specialization ${type.toLowerCase()}`}>{type}</button>
                                        ))}
                                    </div>
                                    <button className='photographer-profile-button' onClick={() => { navigate(`/view-portfolio/${portfolio._id}`) }}>View Profile</button>
                                </div>
                            </div>
                        ))}
                        <div className='photographer-listing-card'>
                            <div className='listing-image-container'>
                                <div>Available</div>
                                <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt='Portfolio' />
                            </div>
                            <div className='listing-information-container'>
                                <div className='photographer-profile-information'>
                                    <div className='photographer-profile-picture'>
                                        <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                                    </div>
                                    <div className='photographer-profile-basic-information' >
                                        <h3 className='photographer-full-name'>Aayusha Lmaichhane</h3>
                                        <div className='photographer-rating-stats'>
                                            <Rating
                                                className='photographer-rating-stat'
                                                initialValue={4.9}
                                                size={16}
                                                allowFraction
                                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={15} />}
                                                fillIcon={<GoStarFill color="#FACC15" size={15} />}
                                                readonly
                                            />
                                            <span>{4.9} (127 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className='photographer-message'>
                                    Capturing timeless moments for couples around the world.
                                </p>
                                <p className='photographer-price-container'>
                                    <span className='price'>$800</span>
                                    <span >per session</span>
                                </p>
                                <div className='photographer-specializations-container'>

                                    <button className="photographer-specialization wedding">Wedding</button>
                                    <button className="photographer-specialization potrait">Potrait</button>

                                </div>
                                <button className='photographer-profile-button'>View Profile</button>
                            </div>
                        </div>
                        <div className='photographer-listing-card'>
                            <div className='listing-image-container'>
                                <div>Available</div>
                                <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt='Portfolio' />
                            </div>
                            <div className='listing-information-container'>
                                <div className='photographer-profile-information'>
                                    <div className='photographer-profile-picture'>
                                        <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1754678707/portfolio-pictures/gbrq8ieigcokh2ozciag.jpg' alt="Profile" />
                                    </div>
                                    <div className='photographer-profile-basic-information' >
                                        <h3 className='photographer-full-name'>Aayusha Lmaichhane</h3>
                                        <div className='photographer-rating-stats'>
                                            <Rating
                                                className='photographer-rating-stat'
                                                initialValue={4.9}
                                                size={16}
                                                allowFraction
                                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={15} />}
                                                fillIcon={<GoStarFill color="#FACC15" size={15} />}
                                                readonly
                                            />
                                            <span>{4.9} (127 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className='photographer-message'>
                                    Capturing timeless moments for couples around the world.
                                    Capturing timeless moments for couples around the world.
                                    Capturing timeless moments for couples around the world.
                                </p>
                                <p className='photographer-price-container'>
                                    <span className='price'>$800</span>
                                    <span >per session</span>
                                </p>
                                <div className='photographer-specializations-container'>

                                    <button className="photographer-specialization wedding">Wedding</button>
                                    <button className="photographer-specialization portrait">Potrait</button>

                                </div>
                                <button className='photographer-profile-button'>View Profile</button>
                            </div>
                        </div>

                    </div>
                </div >
            </section >)
        }

    </>)
}

export default Browse;