document.addEventListener('DOMContentLoaded', () => {
  // IDs for blood availability elements
  const bloodGroupIds = {
    "A+": "A-plus-units",
    "A-": "A-minus-units",
    "B+": "B-plus-units",
    "B-": "B-minus-units",
    "O+": "O-plus-units",
    "O-": "O-minus-units",
    "AB+": "AB-plus-units",
    "AB-": "AB-minus-units",
  };

  // Load cleared donations from localStorage
  const loadClearedDonations = () => {
    return JSON.parse(localStorage.getItem('clearedDonations')) || [];
  };

  // Calculate blood availability
  const calculateBloodAvailability = () => {
    const clearedDonations = loadClearedDonations();
    const bloodAvailability = {};

    // Initialize blood group counts
    for (const bloodGroup in bloodGroupIds) {
      bloodAvailability[bloodGroup] = 0;
    }

    // Count donations per blood group
    clearedDonations.forEach((donation) => {
      if (donation.bloodType && bloodAvailability.hasOwnProperty(donation.bloodType)) {
        bloodAvailability[donation.bloodType]++;
      }
    });

    return bloodAvailability;
  };

  // Render blood availability in the UI
  const renderBloodAvailability = () => {
    const bloodAvailability = calculateBloodAvailability();

    for (const bloodGroup in bloodGroupIds) {
      const elementId = bloodGroupIds[bloodGroup];
      const element = document.getElementById(elementId);

      if (element) {
        element.textContent = bloodAvailability[bloodGroup] || 0; // Set count or default to 0
      }
    }
  };

  // Initial render
  renderBloodAvailability();
});
