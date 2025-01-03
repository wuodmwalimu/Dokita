<?php
include('db_connection.php'); // Include the database connection

// Create tables if they do not already exist
$table_queries = [
    // DonorDemographics Table
    "CREATE TABLE IF NOT EXISTS DonorDemographics (
        donor_id INT AUTO_INCREMENT PRIMARY KEY,
        last_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        dob DATE,
        age INT,
        residence VARCHAR(255),
        donor_type VARCHAR(50)
    )",
    
    // MedicalHistory Table
    "CREATE TABLE IF NOT EXISTS MedicalHistory (
        medical_id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        medical_problems VARCHAR(255),
        pregnancy BOOLEAN,
        cancer_treatment BOOLEAN,
        allergies BOOLEAN,
        allergies_details TEXT,
        chronic_conditions BOOLEAN,
        chronic_conditions_details TEXT,
        recent_surgeries BOOLEAN,
        recent_surgeries_details TEXT,
        blood_disorders BOOLEAN,
        blood_disorders_details TEXT,
        current_medications BOOLEAN,
        current_medications_details TEXT,
        organ_transplant BOOLEAN,
        pregnant_breastfeeding BOOLEAN,
        recent_vaccinations BOOLEAN,
        recent_vaccinations_details TEXT,
        FOREIGN KEY (donor_id) REFERENCES DonorDemographics(donor_id) ON DELETE CASCADE
    )",

    // LifestyleRisks Table
    "CREATE TABLE IF NOT EXISTS LifestyleRisks (
        lifestyle_id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        hiv_hepatitis BOOLEAN,
        hiv_hepatitis_details TEXT,
        sexual_contact BOOLEAN,
        illicit_drugs BOOLEAN,
        contagious_contact BOOLEAN,
        FOREIGN KEY (donor_id) REFERENCES DonorDemographics(donor_id) ON DELETE CASCADE
    )",

    // DonationHistory Table
    "CREATE TABLE IF NOT EXISTS DonationHistory (
        donation_id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        previous_donation BOOLEAN,
        last_donation_date DATE,
        donation_reactions BOOLEAN,
        donation_reactions_details TEXT,
        current_health_status TEXT,
        FOREIGN KEY (donor_id) REFERENCES DonorDemographics(donor_id) ON DELETE CASCADE
    )",

    // Consent Table
    "CREATE TABLE IF NOT EXISTS Consent (
        consent_id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        voluntary_donation BOOLEAN,
        accuracy_confirmation BOOLEAN,
        FOREIGN KEY (donor_id) REFERENCES DonorDemographics(donor_id) ON DELETE CASCADE
    )"
];

// Execute each table creation query
foreach ($table_queries as $query) {
    if ($conn->query($query) === TRUE) {
        echo "Table created or already exists.<br>";
    } else {
        echo "Error creating table: " . $conn->error . "<br>";
    }
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get donor demographic details
    $lastName = $_POST['lastName'];
    $firstName = $_POST['firstName'];
    $phone = $_POST['phone'];
    $dob = $_POST['dob'];
    $age = $_POST['age'];
    $residence = $_POST['residence'];
    $donorType = $_POST['donorType'];

    // Insert data into DonorDemographics table
    $sql = "INSERT INTO DonorDemographics (last_name, first_name, phone, dob, age, residence, donor_type) 
            VALUES ('$lastName', '$firstName', '$phone', '$dob', '$age', '$residence', '$donorType')";

    if ($conn->query($sql) === TRUE) {
        $donor_id = $conn->insert_id; // Get the inserted donor_id for further use

        // Get medical history details
        $medicalProblems = $_POST['medicalProblems'];
        $pregnancy = $_POST['pregnancy'];
        $cancerTreatment = $_POST['cancerTreatment'];
        $allergies = $_POST['allergies'];
        $allergiesDetails = $_POST['allergiesDetails'];
        $chronicConditions = $_POST['chronicConditions'];
        $chronicConditionsDetails = $_POST['chronicConditionsDetails'];
        $recentSurgeries = $_POST['recentSurgeries'];
        $recentSurgeriesDetails = $_POST['recentSurgeriesDetails'];
        $bloodDisorders = $_POST['bloodDisorders'];
        $bloodDisordersDetails = $_POST['bloodDisordersDetails'];
        $currentMedications = $_POST['currentMedications'];
        $currentMedicationsDetails = $_POST['currentMedicationsDetails'];
        $organTransplant = $_POST['organTransplant'];
        $pregnantBreastfeeding = $_POST['pregnantBreastfeeding'];
        $recentVaccinations = $_POST['recentVaccinations'];
        $recentVaccinationsDetails = $_POST['recentVaccinationsDetails'];

        $sql_medical = "INSERT INTO MedicalHistory (donor_id, medical_problems, pregnancy, cancer_treatment, allergies, allergies_details, 
                        chronic_conditions, chronic_conditions_details, recent_surgeries, recent_surgeries_details, blood_disorders, 
                        blood_disorders_details, current_medications, current_medications_details, organ_transplant, 
                        pregnant_breastfeeding, recent_vaccinations, recent_vaccinations_details) 
                        VALUES ('$donor_id', '$medicalProblems', '$pregnancy', '$cancerTreatment', '$allergies', '$allergiesDetails', 
                                '$chronicConditions', '$chronicConditionsDetails', '$recentSurgeries', '$recentSurgeriesDetails', 
                                '$bloodDisorders', '$bloodDisordersDetails', '$currentMedications', '$currentMedicationsDetails', 
                                '$organTransplant', '$pregnantBreastfeeding', '$recentVaccinations', '$recentVaccinationsDetails')";

        if ($conn->query($sql_medical) === TRUE) {

            // Get lifestyle risk details
            $hivHepatitis = $_POST['hivHepatitis'];
            $hivHepatitisDetails = $_POST['hivHepatitisDetails'];
            $sexualContact = $_POST['sexualContact'];
            $illicitDrugs = $_POST['illicitDrugs'];
            $contagiousContact = $_POST['contagiousContact'];

            $sql_lifestyle = "INSERT INTO LifestyleRisks (donor_id, hiv_hepatitis, hiv_hepatitis_details, sexual_contact, illicit_drugs, contagious_contact) 
                            VALUES ('$donor_id', '$hivHepatitis', '$hivHepatitisDetails', '$sexualContact', '$illicitDrugs', '$contagiousContact')";

            if ($conn->query($sql_lifestyle) === TRUE) {

                // Get donation history details
                $previousDonation = $_POST['previousDonation'];
                $lastDonationDate = $_POST['lastDonationDate'];
                $donationReactions = $_POST['donationReactions'];
                $donationReactionsDetails = $_POST['donationReactionsDetails'];
                $currentHealthStatus = $_POST['currentHealthStatus'];

                $sql_donation = "INSERT INTO DonationHistory (donor_id, previous_donation, last_donation_date, donation_reactions, donation_reactions_details, current_health_status) 
                                VALUES ('$donor_id', '$previousDonation', '$lastDonationDate', '$donationReactions', '$donationReactionsDetails', '$currentHealthStatus')";

                if ($conn->query($sql_donation) === TRUE) {

                    // Get consent details
                    $voluntaryDonation = $_POST['voluntaryDonation'];
                    $accuracyConfirmation = $_POST['accuracyConfirmation'];

                    $sql_consent = "INSERT INTO Consent (donor_id, voluntary_donation, accuracy_confirmation) 
                                    VALUES ('$donor_id', '$voluntaryDonation', '$accuracyConfirmation')";

                    if ($conn->query($sql_consent) === TRUE) {
                        echo "Donor data saved successfully!";
                    } else {
                        echo "Error: " . $sql_consent . "<br>" . $conn->error;
                    }
                } else {
                    echo "Error: " . $sql_donation . "<br>" . $conn->error;
                }
            } else {
                echo "Error: " . $sql_lifestyle . "<br>" . $conn->error;
            }
        } else {
            echo "Error: " . $sql_medical . "<br>" . $conn->error;
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>