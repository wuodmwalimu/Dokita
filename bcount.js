document.addEventListener('DOMContentLoaded', () => {
  const donatedBlood = JSON.parse(localStorage.getItem('donatedBlood')) || [];

  // Function to count unprocessed donations
  const countUnprocessedDonations = () => {
    const unprocessedCount = donatedBlood.length;
    // Display the count in a specific element
    const countElement = document.getElementById('unprocessedCount');
    if (countElement) {
      countElement.textContent = unprocessedCount;
    }
  };

  // Call the function on page load
  countUnprocessedDonations();
});