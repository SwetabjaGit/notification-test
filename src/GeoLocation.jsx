import React, { useState } from "react";

const GeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch geolocation data
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // Request location permission and get coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Use a geocoding API to get ZIP code and other data
        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
        );

        if (!geocodeResponse.ok) {
          setError("Failed to fetch geolocation data.");
          return;
        }

        const geocodeData = await geocodeResponse.json();

        const addressComponents =
          geocodeData.results[0]?.address_components || [];
        const zipcode = addressComponents.find((comp) =>
          comp.types.includes("postal_code")
        )?.long_name;

        setLocation({
          latitude,
          longitude,
          zipcode,
          address: geocodeData.results[0]?.formatted_address || "Unknown",
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation}>Get Location</button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>ZIP Code: {location.zipcode}</p>
          <p>Address: {location.address}</p>
        </div>
      )}
    </div>
  );
};

export default GeoLocation;
