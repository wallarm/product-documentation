document.querySelector('.md-feedback__icon.md-icon[data-md-value="0"]').addEventListener('click', function(event) {
    const feedbackDiv = document.getElementById('feedbackInput');
    feedbackDiv.style.display = 'flex';
    initializeForm();
});

function initializeForm() {
    window.feedbackSubmitButton = document.querySelector('.feedback-input input[type="submit"]');
    window.feedbackRadioButtons = document.querySelectorAll('.feedback-input input[type="radio"]');
    window.feedbackTextarea = document.querySelector('.feedback-input textarea');

    feedbackRadioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', checkFormState);
    });

    feedbackTextarea.addEventListener('input', checkFormState);
    
    feedbackSubmitButton.addEventListener('click', function() {
    // Hide the detailed negative feedback form when the Submit button is clicked

    document.getElementById('feedbackInput').style.display = 'none';

    // Get the selected radio button
    let selectedRadioButton = Array.from(feedbackRadioButtons).find(radioButton => radioButton.checked);

    // Get the text from the textarea
    let feedbackText = feedbackTextarea.value.trim();

    // Get the current page's path
    let currentPagePath = document.location.pathname;

    if (selectedRadioButton) {
        // Send the event to GA4
        gtag('event', 'negative.feedback_submitted', {
            'negative_feedback_value': selectedRadioButton.value,
            'feedback_text': feedbackText,
            'page_path': currentPagePath
        });
    }
    console.log("kfjfjkf")
});

    checkFormState();
}

function checkFormState() {
    let radioButtonChecked = Array.from(feedbackRadioButtons).some(radioButton => radioButton.checked);
    let textareaFilled = feedbackTextarea.value.trim() !== "";

    feedbackSubmitButton.disabled = !(radioButtonChecked || textareaFilled);
}

const feedbackTextarea = document.querySelector('.feedback-input textarea');
const charCount = document.querySelector(".character-count");
const maxCharCount = 240;

feedbackTextarea.addEventListener("input", function () {
    const currentCharCount = feedbackTextarea.value.length;
    
    // Update the info about number of symbols
    charCount.textContent = `${currentCharCount}/${maxCharCount}`;
    
    // Cut the text if the max symbol number is reached
    if (currentCharCount > maxCharCount) {
        feedbackTextarea.value = feedbackTextarea.value.substring(0, maxCharCount);
        charCount.textContent = `${maxCharCount}/${maxCharCount}`;
    }
});