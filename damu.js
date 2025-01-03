document.addEventListener('DOMContentLoaded', () => {
  const donors = JSON.parse(localStorage.getItem('donors')) || [];
  const donatedBlood = JSON.parse(localStorage.getItem('donatedBlood')) || [];
  const archives = JSON.parse(localStorage.getItem('archives')) || [];
  let donationCounter = parseInt(localStorage.getItem('donationCounter')) || 1;

  const donorTableBody = document.querySelector('#donorTable tbody');
  const unprocessedTableBody = document.querySelector('#unprocessedTable tbody');
  const archivesTableBody = document.querySelector('#archivesTable tbody');

  const searchUnprocessed = document.querySelector('#searchUnprocessed');
  const searchArchives = document.querySelector('#searchArchives');

  // Toggle collapse functionality
  document.querySelectorAll('.collapsible-header').forEach((header) => {
    header.addEventListener('click', () => {
      const tableSection = header.nextElementSibling;
      tableSection.style.display =
        tableSection.style.display === 'none' ? 'block' : 'none';
    });
  });

  // Populate the Donor List table
  const populateDonorTable = () => {
    donorTableBody.innerHTML = '';
    if (donors.length === 0) {
      donorTableBody.innerHTML = `<tr><td colspan="4">No donors available. Please register donors.</td></tr>`;
      return;
    }
    donors.forEach((donor, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donor.firstName || 'N/A'} ${donor.lastName || 'N/A'}</td>
        <td>${donor.bloodGroup || 'N/A'}</td>
        <td><button class="donate-btn" data-index="${index}"><i class="fas fa-hand-holding-heart"></i> Donate</button></td>
      `;
      donorTableBody.appendChild(row);
    });
  };

  // Populate the Unprocessed Donations table
  const populateUnprocessedTable = () => {
    unprocessedTableBody.innerHTML = '';
    if (donatedBlood.length === 0) {
      unprocessedTableBody.innerHTML = `<tr><td colspan="5">No donations recorded yet.</td></tr>`;
      return;
    }
    donatedBlood.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.id}</td>
        <td>${donation.donor}</td>
        <td>${donation.bloodGroup || 'N/A'}</td>
        <td>${donation.date}</td>
        <td>${donation.time}</td>
      `;
      unprocessedTableBody.appendChild(row);
    });
  };

  // Populate the Archives table
  const populateArchivesTable = () => {
    archivesTableBody.innerHTML = '';
    if (archives.length === 0) {
      archivesTableBody.innerHTML = `<tr><td colspan="5">No archived records available.</td></tr>`;
      return;
    }
    archives.forEach((archive, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${archive.id}</td>
        <td>${archive.donor}</td>
        <td>${archive.bloodGroup || 'N/A'}</td>
        <td>${archive.date}</td>
        <td>${archive.time}</td>
      `;
      archivesTableBody.appendChild(row);
    });
  };

  // Add a donation (unprocessed + archive concurrently)
  const addDonation = (donorIndex) => {
    const donor = donors[donorIndex];
    const now = new Date();
    const formattedID = `DON-${String(donationCounter).padStart(5, '0')}`; // Sequential ID
    const donation = {
      id: formattedID,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      donor: `${donor.firstName || 'N/A'} ${donor.lastName || 'N/A'}`,
      bloodGroup: donor.bloodGroup || 'N/A',
    };

    donationCounter += 1; // Increment counter
    localStorage.setItem('donationCounter', donationCounter);

    // Add to unprocessed and archive
    donatedBlood.push(donation);
    archives.push(donation);

    // Save to localStorage
    localStorage.setItem('donatedBlood', JSON.stringify(donatedBlood));
    localStorage.setItem('archives', JSON.stringify(archives));

    // Refresh tables
    populateUnprocessedTable();
    populateArchivesTable();
  };

  // Event listener for Donate button in Donor List
  donorTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('donate-btn') || e.target.closest('.donate-btn')) {
      const donorIndex = e.target.closest('.donate-btn').getAttribute('data-index');
      addDonation(donorIndex);
    }
  });

  // Search functionality for Unprocessed Donations table
  searchUnprocessed.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredDonations = donatedBlood.filter(
      (donation) =>
      donation.id.toLowerCase().includes(query) ||
      donation.date.toLowerCase().includes(query)
    );

    unprocessedTableBody.innerHTML = '';
    filteredDonations.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.id}</td>
        <td>${donation.donor}</td>
        <td>${donation.bloodGroup || 'N/A'}</td>
        <td>${donation.date}</td>
        <td>${donation.time}</td>
      `;
      unprocessedTableBody.appendChild(row);
    });
  });

  // Search functionality for Archives table
  searchArchives.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredArchives = archives.filter(
      (archive) =>
      archive.id.toLowerCase().includes(query) ||
      archive.date.toLowerCase().includes(query)
    );

    archivesTableBody.innerHTML = '';
    filteredArchives.forEach((archive, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${archive.id}</td>
        <td>${archive.donor}</td>
        <td>${archive.bloodGroup || 'N/A'}</td>
        <td>${archive.date}</td>
        <td>${archive.time}</td>
      `;
      archivesTableBody.appendChild(row);
    });
  });

  // Populate all tables on page load
  populateDonorTable();
  populateUnprocessedTable();
  populateArchivesTable();
});