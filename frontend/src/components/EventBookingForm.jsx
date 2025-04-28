import React, { useEffect,useState } from 'react';
import '../styles/EventBookingForm.css'; // Include CSS for bubble styles
import { useNavigate } from 'react-router-dom';

const EventBookingForm = () => {
    const navigate = useNavigate(); // Initialize navigate hook

    const [formData, setFormData] = useState({
        eventType: '',
        startDate: '',
        endDate: '',
        venue: '',
        city: '',
        state: '',
        numberOfAttendees: '',
        paymentMethod: '',
        organizerDetails: {
            organizerName: '',
            contactNumber: '',
            email: '',
        },
        weddingDetails: {
            brideName: '',
            groomName: '',
            weddingTheme: '',
            cateringPreferences: '',
            price: 0,
        },
        birthdayDetails: {
            birthdayPersonName: '',
            age: '',
            partyTheme: '',
            cakeSize: '',
            entertainmentOptions: '',
            price: 0,
        },
        socialEventDetails: {
            eventPurpose: '',
            sponsors: '',
            entertainment: '',
            price: 0,
        },
        corporateEventDetails: {
            companyName: '',
            agenda: '',
            equipmentRequired: '',
            cateringServices: false,
            specialGuests: '',
            price: 0,
        },
        totalPrice: 0,
        isPriceCalculated: false,
        employeeEmail:''
    });

    const [allEmployees, setAllEmployees] = useState([]); // Store all employees
    const [employeeError, setEmployeeError] = useState(null); // Store errors
    const [availableEmployees,setAvailableEmployees] = useState([]);

    // Fetch all employees on component mount
    useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/manageEmployees`);
            if (!response.ok) {
              throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            console.log(data);
            setAllEmployees(data);
          } catch (error) {
            setEmployeeError('Error fetching employee data');
            console.error(employeeError);
          }
        };
    
        fetchEmployees();
      }, []);
    
      const handleEmployeeChange = (e) => {
        setFormData({
          ...formData,
          employeeEmail: e.target.value, // Update selected employee email
        });
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Update form data
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      
        // If the changed field is startDate or endDate, recalculate available employees
        if (name === "startDate" || name === "endDate") {
          const startDate = name === "startDate" ? new Date(value) : new Date(formData.startDate);
          const endDate = name === "endDate" ? new Date(value) : new Date(formData.endDate);
      
          // Ensure valid dates before filtering
          if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
            const filteredEmployees = allEmployees.filter((employee) => {
              // Employees with no employment periods are available
              if (!employee.employmentPeriods || employee.employmentPeriods.length === 0) {
                return true;
              }
      
              // Check employment periods for overlap
              return employee.employmentPeriods.every((period) => {
                const periodStart = new Date(period.startDate);
                const periodEnd = new Date(period.endDate);
      
                // No overlap condition
                return endDate <= periodStart || startDate >= periodEnd;
              });
            });
      
            // Update the available employees
            setAvailableEmployees(filteredEmployees);
          } else {
            setAvailableEmployees([]); // Reset available employees if dates are invalid
          }
        }
      };
      
// -------------------------------------------

    const handleBubbleSelect = (eventType) => {
        setFormData((prevData) => ({
            ...prevData,
            eventType,
        }));
    };

    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [city, setCity] = useState(''); // State for city
    const [state, setState] = useState(''); // State for state
    const [isPriceCalculated, setIsPriceCalculated] = useState(false);
   

    const handleOrganizerChange = (e) => {
        const { name, value } = e.target;

        // Contact number validation
        if (name === 'contactNumber') {
            const isValid = /^\d{10}$/.test(value); // Validation for 10 digits
            if (!isValid) {
                setError('Contact number must be exactly 10 digits.');
            } else {
                setError('');
            }
        }

        // Email validation
        if (name === 'email') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i; // Regex for @gmail.com emails
            if (!emailPattern.test(value)) {
                setEmailError('Please enter a valid @gmail.com email address.');
            } else {
                setEmailError('');
            }
        }

        // Update formData with the updated organizer details
        setFormData((prevData) => ({
            ...prevData,
            organizerDetails: {
                ...prevData.organizerDetails,
                [name]: value,
            },
        }));
    };

    const handleAgeChange = (event) => {
        const value = event.target.value;
        if (value <= 0 || value > 130) {
            setAgeError('Enter a valid age');
        } else {
            setAgeError('');
        }
        // Update formData with the new age
        setFormData((prevData) => ({
            ...prevData,
            birthdayDetails: {
                ...prevData.birthdayDetails,
                age: value,
            },
        }));
    };
    const handleCityChange = (event) => {
        const selectedCity = event.target.value;
        let correspondingState = ''; // Variable to hold the corresponding state

        // Logic to automatically update state based on selected city
        if (selectedCity === "Hyderabad") {
            correspondingState = "Telangana";
        } else if (selectedCity === "Amaravathi") {
            correspondingState = "Andhra Pradesh";
        } else if (selectedCity === "Chennai") {
            correspondingState = "Tamil Nadu";
        } else if (selectedCity === "Bengaluru") {
            correspondingState = "Karnataka";
        }

        // Update both city and state in the local state and formData
        setCity(selectedCity);
        setState(correspondingState);

        setFormData((prevData) => ({
            ...prevData,
            city: selectedCity,
            state: correspondingState,
        }));
    };

    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        let correspondingCity = ''; // Variable to hold the corresponding city

        // Logic to automatically update city based on selected state
        if (selectedState === "Telangana") {
            correspondingCity = "Hyderabad";
        } else if (selectedState === "Andhra Pradesh") {
            correspondingCity = "Amaravathi";
        } else if (selectedState === "Tamil Nadu") {
            correspondingCity = "Chennai";
        } else if (selectedState === "Karnataka") {
            correspondingCity = "Bengaluru";
        }

        // Update both state and city in the local state and formData
        setState(selectedState);
        setCity(correspondingCity);

        setFormData((prevData) => ({
            ...prevData,
            state: selectedState,
            city: correspondingCity,
        }));
    };

    const [paymentMethod, setPaymentMethod] = useState('');
    const handlePaymentMethodChange = (event) => {
        const selectedPaymentMethod = event.target.value;
        setPaymentMethod(selectedPaymentMethod);

        // Update formData with the new payment method
        setFormData((prevData) => ({
            ...prevData,
            paymentMethod: selectedPaymentMethod,
        }));
    };

    const handleEventDetailsChange = (e) => {
        const { name, value } = e.target;
        const eventType = formData.eventType;

        if (eventType === 'Wedding') {
            setFormData((prevData) => ({
                ...prevData,
                weddingDetails: {
                    ...prevData.weddingDetails,
                    [name]: value,
                },
            }));
        } else if (eventType === 'Birthday') {
            setFormData((prevData) => ({
                ...prevData,
                birthdayDetails: {
                    ...prevData.birthdayDetails,
                    [name]: value,
                },
            }));
        }
        else if (eventType === 'Social') {
            setFormData((prevData) => ({
                ...prevData,
                socialEventDetails: {
                    ...prevData.socialEventDetails,
                    [name]: value,
                },
            }));
        } else if (eventType === 'Corporate') {
            setFormData((prevData) => ({
                ...prevData,
                corporateEventDetails: {
                    ...prevData.corporateEventDetails,
                    [name]: value,
                },
            }));
        }
    };

    const calculatePrice = () => {
        const { 
            numberOfAttendees, 
            eventType, 
            weddingDetails, 
            birthdayDetails, 
            socialEventDetails, 
            corporateEventDetails, 
            startDate, 
            endDate 
        } = formData;
        
        let price = 0;
    
        // Ensure numberOfAttendees is set and parse it correctly
        const attendees = numberOfAttendees ? numberOfAttendees.split('-') : [];
    
        // Assign prices based on the number of attendees selected
        if (attendees.length > 0) {
            if (numberOfAttendees === "<500") {
                price += 50000;
            } else if (numberOfAttendees === "500-1000") {
                price += 100000;
            } else if (numberOfAttendees === "1000-1500") {
                price += 150000;
            } else if (numberOfAttendees === "1500-2000") {
                price += 200000;
            } else if (numberOfAttendees === "2000-2500") {
                price += 250000;
            } else if (numberOfAttendees === "2500-3000") {
                price += 300000;
            }
        } else {
            alert('Please select a valid number of attendees.');
            return;
        }
    
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const dayDiff = timeDiff / (1000 * 3600 * 24);
    
        // Add additional costs based on the number of days
        if (dayDiff > 10) {
            alert('The event can only last for a maximum of 10 days.');
            return;
        }
        if (dayDiff >= 1 && dayDiff <= 10) {
            price += dayDiff * 10000;
        }
    
        // Calculate additional costs based on event type
        switch (eventType) {
            case 'Wedding':
                if (weddingDetails.weddingTheme) {
                    const themePrices = {
                        'classic': 300000,
                        'rustic': 250000,
                        'vintage': 350000,
                        'bohemian': 280000,
                        'beach': 400000,
                        'garden': 230000,
                        'fairytale': 500000,
                        'modern': 450000,
                        'cultural': 600000,
                        'destination': 800000,
                        'industrial': 700000,
                    };
                    price += themePrices[weddingDetails.weddingTheme] || 0;
                }
                if (weddingDetails.cateringPreferences) {
                    const cateringPrices = {
                        'veg': 150000,
                        'nonVeg': 200000,
                        'both': 250000,
                    };
                    price += cateringPrices[weddingDetails.cateringPreferences] || 0;
                }
                break;
    
            case 'Birthday':
                if (birthdayDetails.cakeSize) {
                    const cakePrices = {
                        '5kg': 5000,
                        '10kg': 10000,
                        '15kg': 15000,
                        '20kg': 20000,
                        '25kg': 25000,
                        '30kg': 30000,
                    };
                    price += cakePrices[birthdayDetails.cakeSize] || 0;
                }
    
                if (birthdayDetails.entertainmentOptions) {
                    const entertainmentPrices = {
                        'liveMusic': 150000,
                        'dj': 75000,
                        'dancePerformance': 100000,
                        'magicShow': 50000,
                        'photoBooth': 30000,
                        'karaoke': 40000,
                        'comedyShow': 100000,
                        'gamesAndActivities': 60000,
                        'themedEntertainment': 125000,
                        'fireworks': 200000,
                    };
                    price += entertainmentPrices[birthdayDetails.entertainmentOptions] || 0;
                }
                break;
    
            case 'Social':
                if (socialEventDetails.eventPurpose) {
                    const purposePrices = {
                        'celebration': 100000,
                        'networking': 50000,
                        'education': 75000,
                        'fundraising': 150000,
                        'promotion': 200000,
                        'awareness': 50000,
                        'communityBuilding': 70000,
                        'entertainment': 200000,
                        'ceremony': 150000,
                        'reunion': 100000,
                    };
                    price += purposePrices[socialEventDetails.eventPurpose] || 0;
                }
    
                if (socialEventDetails.entertainment) {
                    const entertainmentPrices = {
                        'liveMusic': 150000,
                        'dj': 75000,
                        'dancePerformance': 100000,
                        'magicShow': 50000,
                        'photoBooth': 30000,
                        'karaoke': 40000,
                        'comedyShow': 100000,
                        'gamesAndActivities': 60000,
                        'themedEntertainment': 125000,
                        'fireworks': 200000,
                    };
                    price += entertainmentPrices[socialEventDetails.entertainment] || 0;
                }
                break;
    
            case 'Corporate':
                if (corporateEventDetails.agenda) {
                    const agendaPrices = {
                        'welcomeSpeech': 50000,
                        'keynotePresentation': 75000,
                        'workshop': 100000,
                        'panelDiscussion': 125000,
                        'networking': 50000,
                        'productLaunch': 150000,
                        'awardCeremony': 200000,
                    };
                    price += agendaPrices[corporateEventDetails.agenda] || 0;
                }
    
                if (corporateEventDetails.equipmentRequired) {
                    const equipmentPrices = {
                        'soundSystem': 50000,
                        'projector': 25000,
                        'microphones': 10000,
                        'lighting': 40000,
                        'tablesAndChairs': 30000,
                        'staging': 100000,
                        'tents': 75000,
                        'cateringEquipment': 50000,
                        'decorativeItems': 20000,
                        'videoRecording': 60000,
                    };
                    price += equipmentPrices[corporateEventDetails.equipmentRequired] || 0;
                }
    
                if (corporateEventDetails.cateringServices) {
                    const cateringPrices = {
                        'veg': 150000,
                        'nonVeg': 200000,
                        'both': 250000,
                    };
                    price += cateringPrices[corporateEventDetails.cateringServices] || 0;
                }
                break;
    
            default:
                break;
        }
    
        // Set the total price in the form data state
        setFormData((prevData) => ({
            ...prevData,
            totalPrice: price,
            isPriceCalculated: true,
        }));
        setIsPriceCalculated(true);

    };
    
    const handleBookNow = () => {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        // Check if the end date is less than the start date
        if (endDate < startDate) {
            alert('End date must be greater than or equal to the start date.');
            return; // Exit the function if the date check fails
        }
        const bookingData = {
            ...formData,
            eventTime: {
                startDate: formData.startDate,
                endDate: formData.endDate,
            },
            totalPrice: formData.totalPrice,
        };

        fetch(`${process.env.REACT_APP_API_URL}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(bookingData),
        })
        .then(response => {
            if (!response.ok) {
                // If the response is not OK, we can parse the error message
                return response.json().then(err => {
                    throw new Error(err.error || 'An unknown error occurred');
                });
            }
        
            return response.json();
        })
            .then(data => {
                navigate('/animate'); 
                // Reset form after booking
                setFormData({
                    eventType: '',
                    startDate: '',
                    endDate: '',
                    venue: '',
                    city: '',
                    state: '',
                    numberOfAttendees: '',
                    paymentMethod: '',
                    organizerDetails: {
                        organizerName: '',
                        contactNumber: '',
                        email: '',
                    },
                    weddingDetails: {
                        brideName: '',
                        groomName: '',
                        weddingTheme: '',
                        cateringPreferences: '',
                        price: 0,
                    },
                    birthdayDetails: {
                        birthdayPersonName: '',
                        age: '',
                        partyTheme: '',
                        cakeSize: '',
                        entertainmentOptions: '',
                        price: 0,
                    },
                    socialEventDetails: {
                        eventPurpose: '',
                        sponsors: '',
                        entertainment: '',
                        price: 0,
                    },
                    corporateEventDetails: {
                        companyName: '',
                        agenda: '',
                        equipmentRequired: '',
                        cateringServices: false,
                        specialGuests: '',
                        price: 0,
                    },
                    totalPrice: 0,
                    isPriceCalculated: false,
                    employeeEmail:''

                });
            })
            .catch(error => {
                alert('Error registering event: ' + error.message);
            });
    };

    return (
        <div className="container">
            <h2 id='h2'>Event Booking Form</h2>
            <div className="bubble-container">
                {['Wedding', 'Birthday', 'Social', 'Corporate'].map((type) => (
                    <div
                        key={type}
                        className={`bubble ${formData.eventType === type ? 'active' : ''}`}
                        onClick={() => handleBubbleSelect(type)}
                    >
                        {type}
                    </div>
                ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); calculatePrice(); }}>
                <label className='label'>
                    Event Type:
                    <input className='input-field ' type="text" value={formData.eventType} readOnly />
                </label>
                <label className='label'>
                    Event Start Date:
                    <input className='input-field ' type="date" name="startDate" onChange={handleChange} required />
                </label>
                <label className='label'>
                    Event End Date:
                    <input className='input-field ' type="date" name="endDate" onChange={handleChange} required />
                </label>
                <label className='label'>
                    Venue:
                    <select
                        className='select-field'
                        name="venue"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a venue</option>
                        <option value="Convention Center">Convention Center</option>
                        <option value="Community Hall">Community Hall</option>
                        <option value="Outdoor Park">Outdoor Park</option>
                        <option value="Hotel Ballroom">Hotel Ballroom</option>
                    </select>
                </label>

                <label className='label'>
                    City:
                    <select
                        className='select-field'
                        name="city"
                        value={city}
                        onChange={handleCityChange}
                        required
                    >
                        <option value="">Select a city</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Amaravathi">Amaravathi</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Bengaluru">Bengaluru</option>
                    </select>
                </label>

                <label className='label'>
                    State:
                    <select
                        className='select-field'
                        name="state"
                        value={state}
                        onChange={handleStateChange}
                        required
                    >
                        <option value="">Select a state</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                    </select>
                </label>

                <label className='label'>
                    Number of Attendees:
                    <select className='select-field' name="numberOfAttendees" onChange={handleChange} required>
                        <option value="">Select number of attendees</option>
                        <option value="<500">100- 500 - ₹50,000</option>
                        <option value="500-1000">500 - 1000 - ₹1,00,000</option>
                        <option value="1000-1500">1000 - 1500 - ₹1,50,000</option>
                        <option value="1500-2000">1500 - 2000 - ₹2,00,000</option>
                        <option value="2000-2500">2000 - 2500 - ₹2,50,000</option>
                        <option value="2500-3000">2500 - 3000 - ₹3,00,000</option>
                    </select>
                </label>

                <h3>Organizer Details</h3>
                <label className='label'>
                    Organizer Name:
                    <input className='input-field ' type="text" name="organizerName" onChange={handleOrganizerChange} required />
                </label>
                <label className='label'>
                    Contact Number:
                    <input
                        className='input-field'
                        type="text"
                        name="contactNumber"
                        value={formData.organizerDetails.contactNumber}
                        onChange={handleOrganizerChange}
                        required
                    />
                    {error && <span style={{ color: 'red', marginLeft: '10px' }}>{error}</span>}
                </label>
                <label className='label'>
                    Email:
                    <input
                        className='input-field'
                        type="email"
                        name="email"
                        value={formData.organizerDetails.email}
                        onChange={handleOrganizerChange}
                        required
                    />
                    {emailError && <span style={{ color: 'red', marginLeft: '10px' }}>{emailError}</span>}
                </label>
                {formData.eventType === 'Wedding' && (
                    <>
                        <h3>Wedding Details</h3>
                        <label className='label'>
                            Bride's Name:
                            <input className='input-field ' type="text" name="brideName" onChange={handleEventDetailsChange} required />
                        </label>
                        <label className='label'>
                            Groom's Name:
                            <input className='input-field ' type="text" name="groomName" onChange={handleEventDetailsChange} required />
                        </label>
                        <label className='label'>
                            Wedding Theme:
                            <select className='select-field' name="weddingTheme" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="classic">Classic/Traditional - ₹3,00,000</option>
                                <option value="rustic">Rustic - ₹2,50,000</option>
                                <option value="vintage">Vintage - ₹3,50,000</option>
                                <option value="bohemian">Bohemian - ₹2,80,000</option>
                                <option value="beach">Beach - ₹4,00,000</option>
                                <option value="garden">Garden - ₹2,30,000</option>
                                <option value="fairytale">Fairytale - ₹5,00,000</option>
                                <option value="modern">Modern/Contemporary - ₹4,50,000</option>
                                <option value="cultural">Cultural/Themed - ₹6,00,000</option>
                                <option value="destination">Destination - ₹8,00,000</option>
                                <option value="industrial">Industrial - ₹7,00,000</option>
                            </select>
                        </label>
                        <label className='label'>
                            Catering Preferences:
                            <select className='select-field' name="cateringPreferences" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="veg">Veg - ₹1,50,000</option>
                                <option value="nonVeg">Non-Veg - ₹2,00,000</option>
                                <option value="both">Both - ₹2,50,000</option>
                            </select>
                        </label>
                    </>
                )}

                {formData.eventType === 'Birthday' && (
                    <>
                        <h3>Birthday Details</h3>
                        <label className='label'>
                            Birthday Person's Name:
                            <input className='input-field ' type="text" name="birthdayPersonName" onChange={handleEventDetailsChange} required />
                        </label>
                        <label className='label'>
                            Age:
                            <input
                                className='input-field'
                                type="number"
                                name="age"
                                value={formData.birthdayDetails.age}
                                onChange={handleAgeChange}
                                required
                            />
                            {ageError && <span style={{ color: 'red', marginLeft: '10px' }}>{ageError}</span>}
                        </label>
                        <label className='label'>
                            Party Theme:
                            <input className='input-field ' type="text" name="partyTheme" placeholder='Example: Superhero, Game theme' onChange={handleEventDetailsChange} />
                        </label>
                        <label className='label'>
                            Cake Size:
                            <select className='select-field' name="cakeSize" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="5kg">5 kg - ₹5,000</option>
                                <option value="10kg">10 kg - ₹10,000</option>
                                <option value="15kg">15 kg - ₹15,000</option>
                                <option value="20kg">20 kg - ₹20,000</option>
                                <option value="25kg">25 kg - ₹25,000</option>
                                <option value="30kg">30 kg - ₹30,000</option>
                            </select>
                        </label>
                        <label className="label">
                            Entertainment Options:
                            <select className="select-field" name="entertainmentOptions" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="liveMusic">Live Music - ₹1,50,000</option>
                                <option value="dj">DJ - ₹75,000</option>
                                <option value="dancePerformance">Dance Performance - ₹1,00,000</option>
                                <option value="magicShow">Magic Show - ₹50,000</option>
                                <option value="photoBooth">Photo Booth - ₹30,000</option>
                                <option value="karaoke">Karaoke - ₹40,000</option>
                                <option value="comedyShow">Comedy Show - ₹1,00,000</option>
                                <option value="gamesAndActivities">Games and Activities - ₹60,000</option>
                                <option value="themedEntertainment">Themed Entertainment (e.g., characters) - ₹1,25,000</option>
                                <option value="fireworks">Fireworks Display - ₹2,00,000</option>
                            </select>
                        </label>

                    </>
                )}

                {formData.eventType === 'Social' && (
                    <>
                        <h3>Social Event Details</h3>
                        <label className='label'>
                            Purpose of Event:
                            <select className='select-field' name="eventPurpose" onChange={handleEventDetailsChange}>
                                <option value="">Select Purpose of Event</option>
                                <option value="celebration">Celebration (e.g., anniversaries) - ₹1,00,000</option>
                                <option value="networking">Networking - ₹50,000</option>
                                <option value="education">Education (e.g., workshops, seminars) - ₹75,000</option>
                                <option value="fundraising">Fundraising - ₹1,50,000</option>
                                <option value="promotion">Promotion (e.g., product launches) - ₹2,00,000</option>
                                <option value="awareness">Awareness (e.g., campaigns) - ₹50,000</option>
                                <option value="communityBuilding">Community Building - ₹70,000</option>
                                <option value="entertainment">Entertainment (e.g., concerts, shows) - ₹2,00,000</option>
                                <option value="ceremony">Ceremony (e.g., award ceremonies) - ₹1,50,000</option>
                                <option value="reunion">Reunion - ₹1,00,000</option>
                            </select>
                        </label>
                        <label className='label'>
                            Sponsors:
                            <input type="text" className='input-field ' name="sponsors" onChange={handleEventDetailsChange} />
                        </label>
                        <label>
                            Entertainment Options:
                            <select className="select-field" name="entertainment" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="liveMusic">Live Music - ₹1,50,000</option>
                                <option value="dj">DJ - ₹75,000</option>
                                <option value="dancePerformance">Dance Performance - ₹1,00,000</option>
                                <option value="magicShow">Magic Show - ₹50,000</option>
                                <option value="photoBooth">Photo Booth - ₹30,000</option>
                                <option value="karaoke">Karaoke - ₹40,000</option>
                                <option value="comedyShow">Comedy Show - ₹1,00,000</option>
                                <option value="gamesAndActivities">Games and Activities - ₹60,000</option>
                                <option value="themedEntertainment">Themed Entertainment (e.g., characters) - ₹1,25,000</option>
                                <option value="fireworks">Fireworks Display - ₹2,00,000</option>
                            </select>

                        </label>

                    </>
                )}

                {formData.eventType === 'Corporate' && (
                    <>
                        <h3>Corporate Event Details</h3>
                        <label className="label">
                            Company Name:
                            <input className="input-field" type="text" name="companyName" onChange={handleEventDetailsChange} required />
                        </label>

                        <label className='label'>
                            Agenda:
                            <select className='select-field' name="agenda" onChange={handleEventDetailsChange} required>
                                <option value="">Select Agenda</option>
                                <option value="welcomeSpeech">Welcome Speech - ₹50,000</option>
                                <option value="keynotePresentation">Keynote Presentation - ₹75,000</option>
                                <option value="workshop">Workshop Session - ₹1,00,000</option>
                                <option value="panelDiscussion">Panel Discussion - ₹1,25,000</option>
                                <option value="networking">Networking Session - ₹50,000</option>
                                <option value="productLaunch">Product Launch - ₹1,50,000</option>
                                <option value="awardCeremony">Award Ceremony - ₹2,00,000</option>
                            </select>
                        </label>
                        <label className="label">
                            Equipment Required:
                            <select className="select-field" name="equipmentRequired" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="soundSystem">Sound System - ₹50,000</option>
                                <option value="projector">Projector - ₹25,000</option>
                                <option value="microphones">Microphones - ₹10,000</option>
                                <option value="lighting">Lighting Equipment - ₹40,000</option>
                                <option value="tablesAndChairs">Tables and Chairs - ₹30,000</option>
                                <option value="staging">Staging - ₹1,00,000</option>
                                <option value="tents">Tents - ₹75,000</option>
                                <option value="cateringEquipment">Catering Equipment - ₹50,000</option>
                                <option value="decorativeItems">Decorative Items - ₹20,000</option>
                                <option value="videoRecording">Video Recording Equipment - ₹60,000</option>
                                <option value="other">Other - Price Varies</option>
                            </select>
                        </label>

                        <label className='label'>
                            Catering Preferences:
                            <select className='select-field' name="cateringServices" onChange={handleEventDetailsChange}>
                                <option value="">Select</option>
                                <option value="veg">Veg - ₹1,50,000</option>
                                <option value="nonVeg">Non-Veg - ₹2,00,000</option>
                                <option value="both">Both - ₹2,50,000</option>
                            </select>
                        </label>

                        <label className="label">
                            Special Guests:
                            <input className="input-field" type="text" name="specialGuests" onChange={handleEventDetailsChange} />
                        </label>

                    </>
                )}
                <h3>Payment Method</h3>
               
                <label className='label'>
                  <select className="select-field" value={paymentMethod} onChange={handlePaymentMethodChange}>
                     <option value="">Select Payment Method</option>
                     <option value="Credit Card">Credit Card</option>
                     <option value="Debit Card">Debit Card</option>
                     <option value="PayPal">PayPal</option>
                     <option value="Net Banking">Net Banking</option>
                  </select>
                </label>

                <h3>Employee</h3>
                
                <label className='label'>
                  <select
                  name="employeeEmail"
                  value={formData.employeeEmail}
                  onChange={handleEmployeeChange}
                  className="select-field"
                  >

                 <option value="">-- Select an Employee --</option>
                    {availableEmployees.map((employee) => {
                    // Extract name from email (before the '@')
                    const name = employee.email.split("@")[0];

                     // Calculate average rating (if rateCount is zero, display "No rating")
                 const averageRating =
                  employee.rateCount > 0 ? (employee.rating / employee.rateCount).toFixed(1) : "No rating";

               return (
              <option key={employee._id} value={employee.email}>
              {name} - {averageRating}
              </option>
             );
              })}
        
              </select>
 
          </label>


        <h3>Total Price: {formData.isPriceCalculated ? `₹${formData.totalPrice}` : 'Not yet calculated'}</h3>
                <button className='button' type="submit">Calculate Price</button>
                <button className='button' type="button" onClick={handleBookNow} disabled={!isPriceCalculated}>Book Now</button>
            </form>
        </div>
    );
}

export default EventBookingForm;