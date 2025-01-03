document.addEventListener('DOMContentLoaded', function () {
  // Get the form, submit button, and message element
  const form = document.getElementById('demographicForm');
  const submitBtn = document.getElementById('submitBtn');
  const message = document.getElementById('message');  // for displaying messages

  // Event listener for form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get values from the form fields
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const age = document.getElementById('age').value;
    const residence = document.getElementById('residence').value;
    const donorType = document.getElementById('donorType').value;

    // Validate form fields
    if (!lastName || !firstName || !phone || !dob || !age || !residence || !donorType) {
      message.textContent = 'Please fill in all fields before submitting.';
      message.style.color = 'red';
      return;
    }

    // Validate phone number (example: basic validation)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      message.textContent = 'Please enter a valid 10-digit phone number.';
      message.style.color = 'red';
      return;
    }

    // Validate age (should be a number)
    if (isNaN(age) || age <= 0) {
      message.textContent = 'Please enter a valid age.';
      message.style.color = 'red';
      return;
    }

    // Prepare data to be stored in localStorage
    const demographicData = {
      lastName,
      firstName,
      phone,
      dob,
      age,
      residence,
      donorType
    };

    // Save to localStorage
    localStorage.setItem('demographicData', JSON.stringify(demographicData));

    // Show success message
    message.textContent = 'Data successfully saved!';
    message.style.color = 'green';

    // Clear the form fields after saving
    form.reset();
  });

  // Dynamic form interactions (e.g., showing/hiding sections based on user input)
  const previousDonationYes = document.getElementById("previousDonationYes");
  const previousDonationNo = document.getElementById("previousDonationNo");
  const lastDonationDate = document.getElementById("lastDonationDate");

  previousDonationYes.addEventListener('change', function () {
    lastDonationDate.style.display = 'block';
  });

  previousDonationNo.addEventListener('change', function () {
    lastDonationDate.style.display = 'none';
  });

  const donationReactionsYes = document.getElementById("donationReactionsYes");
  const donationReactionsNo = document.getElementById("donationReactionsNo");
  const donationReactionsDetails = document.getElementById("donationReactionsDetails");

  donationReactionsYes.addEventListener('change', function () {
    donationReactionsDetails.style.display = 'block';
  });

  donationReactionsNo.addEventListener('change', function () {
    donationReactionsDetails.style.display = 'none';
  });
});
