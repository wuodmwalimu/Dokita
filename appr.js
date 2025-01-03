document.addEventListener('DOMContentLoaded', () => {
  // Shared Functions
  const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
  const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  // Initialize Requests
  (function initializeRequests() {
    loadRecentRequests();
    loadApprovedAndOnHoldRequests();
  })();

  // Recent Requests
  function loadRecentRequests() {
    const recentRequestsList = document.querySelector('#recentRequestsList tbody');
    const requests = getFromLocalStorage('bloodRequests');
    recentRequestsList.innerHTML = ''; // Clear the list
    requests.forEach((request, index) => addRequestToTable(request, recentRequestsList, 'recent', index + 1));
  }

  // Approved and On-Hold Requests
  function loadApprovedAndOnHoldRequests() {
    const approvedRequestsList = document.querySelector('#approvedRequestsList tbody');
    const onHoldRequestsList = document.querySelector('#onholdRequestsList tbody');

    const approvedRequests = getFromLocalStorage('approvedRequests');
    const onHoldRequests = getFromLocalStorage('onHoldRequests');

    approvedRequestsList.innerHTML = '';
    onHoldRequestsList.innerHTML = '';

    approvedRequests.forEach((request, index) =>
      addRequestToTable(request, approvedRequestsList, 'approved', index + 1)
    );
    onHoldRequests.forEach((request, index) =>
      addRequestToTable(request, onHoldRequestsList, 'onhold', index + 1)
    );
  }

  function addRequestToTable(request, tableBody, status, number) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${number}</td>
      <td>${request.recipientName}</td>
      <td>${request.bloodType}</td>
      <td>${request.units}</td>
      ${
        status === 'approved'
          ? `<td>${request.priceType || ''}</td><td>${request.anticipatedDate || ''}</td>`
          : ''
      }
      <td>
        ${
          status === 'recent'
            ? `
              <button class="view-btn" data-action="view">View</button>
              <button class="approve-btn" data-action="approve">Approve</button>
              <button class="onhold-btn" data-action="onhold">On Hold</button>
            `
            : status === 'onhold'
            ? `<button class="approve-btn" data-action="approve">Approve</button>`
            : ''
        }
      </td>
    `;

    row.addEventListener('click', (event) => {
      const action = event.target.dataset.action;
      if (!action) return;

      if (action === 'view') showRequestDetails(request);
      if (action === 'approve') approveRequest(request, row);
      if (action === 'onhold') putRequestOnHold(request, row);
    });

    tableBody.appendChild(row);
  }

  // Show Request Details
  function showRequestDetails(request) {
    alert(`
      Date: ${request.date}
      Recipient Name: ${request.recipientName}
      Recipient Age: ${request.age}
      Blood Type: ${request.bloodType}
      Units Needed: ${request.units}
      Gender: ${request.gender}
      Hospital: ${request.hospital}
      Doctor: ${request.doctor}
      Hospital Contact: ${request.contactHospital}
      Location: ${request.location}
      Urgency: ${request.urgency}
      Reason: ${request.reason}
    `);
  }

  // Handle Approval
  function approveRequest(request, row) {
    openApprovalModal(request, row);
  }

  // Put Request on Hold
  function putRequestOnHold(request, row) {
    const onHoldRequests = getFromLocalStorage('onHoldRequests');
    onHoldRequests.push(request);
    saveToLocalStorage('onHoldRequests', onHoldRequests);

    row.remove(); // Remove from current list
    loadRecentRequests();
    loadApprovedAndOnHoldRequests();
  }

  // Open Approval Modal
  function openApprovalModal(request, row) {
    const modalHtml = `
      <div id="approvalModal" class="modal">
        <div class="modal-content">
          <h2>Approve Request</h2>
          <label for="priceType">Price Type:</label>
          <select id="priceType">
            <option value="Related to Donor">Related to Donor</option>
            <option value="Not Related to Donor">Not Related to Donor</option>
          </select>
          <label for="anticipatedDate">Anticipated Date:</label>
          <input type="date" id="anticipatedDate" required />
          <button id="approveRequestBtn">Approve</button>
          <button id="cancelApprovalBtn">Cancel</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('approvalModal');

    modal.querySelector('#approveRequestBtn').addEventListener('click', () => {
      const priceType = modal.querySelector('#priceType').value;
      const anticipatedDate = modal.querySelector('#anticipatedDate').value;

      if (!anticipatedDate) {
        alert('Anticipated date is required.');
        return;
      }

      request.priceType = priceType;
      request.anticipatedDate = anticipatedDate;

      const approvedRequests = getFromLocalStorage('approvedRequests');
      approvedRequests.push(request);

      saveToLocalStorage('approvedRequests', approvedRequests);
      row.remove(); // Remove from current list
      loadRecentRequests();
      loadApprovedAndOnHoldRequests();

      modal.remove(); // Close modal
    });

    modal.querySelector('#cancelApprovalBtn').addEventListener('click', () => {
      modal.remove(); // Close modal
    });
  }
});