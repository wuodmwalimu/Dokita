document.addEventListener('DOMContentLoaded', () => {
  const addDonationBtn = document.getElementById('addDonationBtn');
  const closeFormBtn = document.getElementById('closeFormBtn');
  const donationFormModal = document.getElementById('donationFormModal');
  const closeBloodTypeModalBtn = document.getElementById('closeBloodTypeModalBtn');
  const bloodTypeModal = document.getElementById('bloodTypeModal');
  const donorSelect = document.getElementById('donorSelect');
  const donationDateInput = document.getElementById('donationDate');
  const donationForm = document.getElementById('donationForm');
  const donationsInProcessingList = document.getElementById('donationsInProcessingList');
  const clearedDonationsList = document.getElementById('clearedDonationsList');
  const bloodTypeSelect = document.getElementById('bloodTypeSelect');
  const confirmBloodTypeBtn = document.getElementById('confirmBloodTypeBtn');

  // Load data from localStorage or return empty arrays if not available
  const loadData = (key) => JSON.parse(localStorage.getItem(key)) || [];

  // Save data to localStorage
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Show the donation form modal and populate the donor dropdown
  const showDonationFormModal = () => {
    donationDateInput.value = '';
    donorSelect.innerHTML = '';

    loadData('donors').forEach((donor, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${donor.firstName} ${donor.lastName}`;
      donorSelect.appendChild(option);
    });

    donationFormModal.style.display = 'block';
  };

  // Hide the donation form modal
  const hideDonationFormModal = () => {
    donationFormModal.style.display = 'none';
  };

  // Show the blood type modal
  const showBloodTypeModal = (donationIndex) => {
    bloodTypeModal.style.display = 'block';
    confirmBloodTypeBtn.onclick = () => confirmDonationBloodType(donationIndex);
  };

  // Hide the blood type modal
  const hideBloodTypeModal = () => {
    bloodTypeModal.style.display = 'none';
  };

  // Confirm the blood type and move the donation to cleared donations
  const confirmDonationBloodType = (donationIndex) => {
    const bloodType = bloodTypeSelect.value;
    const donationsInProcessing = loadData('donationsInProcessing');
    const donation = donationsInProcessing[donationIndex];

    // Add blood type to donation and move it to cleared donations
    donation.bloodType = bloodType;
    const clearedDonations = loadData('clearedDonations');
    clearedDonations.push(donation);

    // Update localStorage
    saveData('donationsInProcessing', donationsInProcessing.filter((_, index) => index !== donationIndex));
    saveData('clearedDonations', clearedDonations);

    // Re-render lists
    renderDonationsInProcessing();
    renderClearedDonations();

    // Hide the blood type modal
    hideBloodTypeModal();
  };

  // Add donation form submission handler
  donationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedDonorIndex = donorSelect.value;
    const donationDate = donationDateInput.value;

    if (!selectedDonorIndex || !donationDate) {
      alert("Please fill in all fields.");
      return;
    }

    const donors = loadData('donors');
    const donor = donors[selectedDonorIndex];

    // Create new donation object
    const newDonation = {
      donorName: `${donor.firstName} ${donor.lastName}`,
      donationDate: donationDate,
      donorIndex: selectedDonorIndex,
    };

    // Save the new donation
    const donationsInProcessing = loadData('donationsInProcessing');
    donationsInProcessing.push(newDonation);
    saveData('donationsInProcessing', donationsInProcessing);

    // Re-render donations
    renderDonationsInProcessing();

    // Hide the donation form modal
    hideDonationFormModal();
  });

  // Render donations in processing list
  const renderDonationsInProcessing = () => {
    const donations = loadData('donationsInProcessing');
    donationsInProcessingList.innerHTML = '';

    donations.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.donorName}</td>
        <td>${donation.donationDate}</td>
        <td><button class="btn btn-secondary" onclick="processDonation(${index})">Process</button></td>
      `;
      donationsInProcessingList.appendChild(row);
    });
  };

  // Render cleared donations list
  const renderClearedDonations = () => {
    const clearedDonations = loadData('clearedDonations');
    clearedDonationsList.innerHTML = '';

    clearedDonations.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.donorName}</td>
        <td>${donation.donationDate}</td>
        <td>${donation.bloodType}</td>
      `;
      clearedDonationsList.appendChild(row);
    });
  };

  // Handle the processing of donations
  window.processDonation = (donationIndex) => {
    showBloodTypeModal(donationIndex);
  };

  // Event listeners for buttons
  addDonationBtn.addEventListener('click', showDonationFormModal);
  closeFormBtn.addEventListener('click', hideDonationFormModal);
  closeBloodTypeModalBtn.addEventListener('click', hideBloodTypeModal);

  // Initial render
  renderDonationsInProcessing();
  renderClearedDonations();
});
