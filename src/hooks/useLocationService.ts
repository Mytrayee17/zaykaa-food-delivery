import { useState, useEffect } from 'react';

// Hard-coded service area
const SERVICE_AREA = "Guntur, Andhra Pradesh";

// Mock user location (in production, this would come from geolocation API)
const MOCK_USER_LOCATION = "Guntur, Andhra Pradesh"; // Change this to test restrictions

export const useLocationService = () => {
  const [userLocation, setUserLocation] = useState<string>(MOCK_USER_LOCATION);
  const [isInServiceArea, setIsInServiceArea] = useState<boolean>(false);

  useEffect(() => {
    // Simple check if user location includes service area
    // In production, you'd use proper geolocation and distance calculation
    const isInArea = userLocation.toLowerCase().includes("guntur");
    setIsInServiceArea(isInArea);
  }, [userLocation]);

  const checkLocationForOrder = (): boolean => {
    if (!isInServiceArea) {
      alert("Sorry, we only deliver within Guntur, Andhra Pradesh.");
      return false;
    }
    return true;
  };

  return {
    serviceArea: SERVICE_AREA,
    userLocation,
    isInServiceArea,
    checkLocationForOrder,
    setUserLocation // For testing different locations
  };
};