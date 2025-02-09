document.addEventListener("DOMContentLoaded", function () {
    var buttonClicked = false; // Flag to track if the button has been clicked

    // Call the function to generate input fields when the page loads
    generateInputFields();

    // Add event listener to the number of people input
    document.getElementById("numPeople").addEventListener("input", function () {
        if (!buttonClicked) { // Allow changing the number of people only if the button hasn't been clicked
            // Save existing input values
            var existingNames = saveExistingInputValues(".nameInput");
            var existingEmails = saveExistingInputValues(".emailInput");

            // Clear any existing input fields and generate new ones
            generateInputFields();

            // Restore saved input values
            restoreExistingInputValues(existingNames, ".nameInput");
            restoreExistingInputValues(existingEmails, ".emailInput");
        }
    });

    // Add event listener to the button click
    document.getElementById("generateButton").addEventListener("click", function () {
        if (buttonClicked) return; // If the button has already been clicked, exit

        var names = [];
        var emails = [];
        var nameInputs = document.querySelectorAll(".nameInput");
        var emailInputs = document.querySelectorAll(".emailInput");

        // Check if any name or email input field is empty
        var isError = false;
        nameInputs.forEach(function (input) {
            if (!input.value.trim()) {
                isError = true;
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
            }
            names.push(input.value);
        });
        emailInputs.forEach(function (input) {
            if (!input.value.trim()) {
                isError = true;
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
            }
            emails.push(input.value);
        });

        if (isError) {
            showMessage("Please fill in all names and emails.", "red");
            return;
        }

        generatePairsAndSendEmails(names, emails);
        buttonClicked = true; // Set buttonClicked flag to true after successful click

        // Disable the number of people input after the button is clicked
        document.getElementById("numPeople").disabled = true;

        // Disable name and email inputs after the button is clicked
        nameInputs.forEach(function (input) {
            input.disabled = true;
        });
        emailInputs.forEach(function (input) {
            input.disabled = true;
        });
    });
});




function generateInputFields() {
    var numPeople = parseInt(document.getElementById("numPeople").value);
    var namesContainer = document.getElementById("namesContainer");
    namesContainer.innerHTML = ""; // Clear previous input fields

    for (var i = 0; i < numPeople; i++) {
        var inputContainer = document.createElement("div");
        inputContainer.className = "inputContainer";

        var nameLabel = document.createElement("label");
        nameLabel.textContent = "Name " + (i + 1) + ": ";
        inputContainer.appendChild(nameLabel);

        var nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "nameInput";
        inputContainer.appendChild(nameInput);

        var emailLabel = document.createElement("label");
        emailLabel.textContent = "Email " + (i + 1) + ": ";
        inputContainer.appendChild(emailLabel);

        var emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.className = "emailInput";
        emailInput.setAttribute("pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"); // Set pattern for email validation
        inputContainer.appendChild(emailInput);

        namesContainer.appendChild(inputContainer);
    }
}



function showMessage(message, color) {
    var messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.color = color;
    messageDiv.style.display = "block";
}

function generatePairsAndSendEmails(names, emails) {
    var finalPairs = [];
    var names2 = names.slice(); // Copy of the original names array

    while (names.length > 0) {
        var selectedName = names.pop();
        var selectedEmail = emails.pop();
        var selectedName2;

        if (names.length == 0) {
            selectedName2 = names2.pop();
            finalPairs.push([selectedName, selectedEmail, selectedName2]);
        } else {
            var selected_index;
            do {
                selected_index = Math.floor(Math.random() * names2.length);
                selectedName2 = names2[selected_index];
            } while (selectedName == selectedName2);

            names2.splice(selected_index, 1); // Remove selected name from names2
            finalPairs.push([selectedName, selectedEmail, selectedName2]);
        }
    }

    // Hide the button immediately after clicking
    document.getElementById("generateButton").style.display = "none";

    // Display success message
    showMessage("Check your email for your partner Name", "green");

    // Your existing code for sending emails goes here
    finalPairs.forEach(function (pair) {
        sendmail(pair[0], pair[1], pair[2]);
    });
}

function saveExistingInputValues(selector) {
    var existingValues = [];
    var inputs = document.querySelectorAll(selector);
    inputs.forEach(function (input) {
        existingValues.push(input.value);
    });
    return existingValues;
}

function restoreExistingInputValues(existingValues, selector) {
    var inputs = document.querySelectorAll(selector);
    inputs.forEach(function (input, index) {
        // Check if the existing value is not undefined or null
        if (existingValues[index] !== undefined && existingValues[index] !== null) {
            input.value = existingValues[index];
        }
    });
}


function sendmail(name, email, partnerInfo) {
    var emailContent = "مرحبا " + name + " 👋\n\n" +
    "🎁 لديك رسالة سرية بخصوص العيد! افتح البريد لمعرفة التفاصيل. 🤫✨\n\n" +
    "-------\n\n\n\n\n\n\n" +
    "✨  " + partnerInfo + " ✨ : شريكك السري هو\n\n" +
    "📝 ملاحظة:\n" +
    "- لا تخبر أحدًا! دَعها مفاجأة حتى يوم العيد! 😏🎉\n" +
    "- ابقَ مستعدًا للمفاجآت! 🎉\n\n" +
    "🎉 نتمنى لك عيدًا سعيدًا! 🎉";
 

    emailjs.init("i6KyGq-c2RNvzy5ez"); // Replace with your EmailJS User ID

    var templateParams = {
        message: emailContent,
        email: email
    };

    emailjs.send('service_fp3lmxi', 'template_m5006lp', templateParams) // Replace with your Service ID and Template ID
        .then(function (response) {
            console.log('Email sent successfully:', response);
        })
        .catch(function (error) {
            console.error('Error sending email:', error);
        });
}
