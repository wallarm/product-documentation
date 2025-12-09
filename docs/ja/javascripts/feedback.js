// Inject the google tag

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-3Z9P1Z18D8');

// If the disappointed icon is clicked, show the detailed feedback form

document.querySelector('.md-feedback__icon.md-icon[data-md-value="0"]').addEventListener('click', function(event) {
    var feedbackDiv = document.getElementById('feedbackInput');
    feedbackDiv.style.display = 'flex';
    initializeForm();
});

function initializeForm() {
    window.feedbackSubmitButton = document.querySelector('.feedback-submit-button');
    window.feedbackRadioButtons = document.querySelectorAll('.feedback-input input[type="radio"]');
    window.feedbackTextarea = document.querySelector('.feedback-input textarea');

    feedbackRadioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', checkFormState);
    });

    feedbackTextarea.addEventListener('input', checkFormState);
    
    feedbackSubmitButton.addEventListener('click', function() {

        // Prevent the button from the default behavior like adding query params to URL and page reload
        
        event.preventDefault();
    
        // Hide the detailed negative feedback form when the Submit button is clicked

        document.getElementById('feedbackInput').style.display = 'none';

        // Get the selected radio button and the text from the textarea
        
        let selectedRadioButton = Array.from(feedbackRadioButtons).find(radioButton => radioButton.checked);
        let feedbackText = feedbackTextarea.value.trim();

        // Send the detailed feedback params to GA

        if (selectedRadioButton || feedbackText) {
            // Send the event to GA4
            gtag('event', 'negative_feedback_submitted', {
                'negative_feedback_reason': selectedRadioButton ? selectedRadioButton.value : null,
                'negative_feedback_text': feedbackText ? feedbackText : null
            });
            console.log("success")
        }
        else {
            console.log("smth went wrong while sending data to GA")
        }
});

    checkFormState();
}

// Check the detailed feedback form state to either activate/disable the form submission button

function checkFormState() {
    let radioButtonChecked = Array.from(feedbackRadioButtons).some(radioButton => radioButton.checked);
    let textareaFilled = feedbackTextarea.value.trim() !== "";

    feedbackSubmitButton.disabled = !(radioButtonChecked || textareaFilled);
}

// Limit the character number to 240

var feedbackTextarea = document.querySelector('.feedback-input textarea');
var charCount = document.querySelector(".character-count");
var maxCharCount = 240;

feedbackTextarea.addEventListener("input", function () {
    var currentCharCount = feedbackTextarea.value.length;
    
    // Update the info about number of symbols
    charCount.textContent = `${currentCharCount}/${maxCharCount}`;
    
    // Cut the text if the max symbol number is reached
    if (currentCharCount > maxCharCount) {
        feedbackTextarea.value = feedbackTextarea.value.substring(0, maxCharCount);
        charCount.textContent = `${maxCharCount}/${maxCharCount}`;
    }
});