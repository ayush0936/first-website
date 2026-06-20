document.addEventListener("DOMContentLoaded", function() {
    const favoriteColorInput = document.getElementById('favoriteColor');
    const displayColor = document.getElementById('displayColor');
    const saveButton = document.getElementById('saveButton');
    const retrieveButton = document.getElementById('retrieveButton');
    const updateButton = document.getElementById('updateButton');
    const deleteButton = document.getElementById('deleteButton');
    const message = document.getElementById('message');

    const updateModal = document.getElementById('updateModal');
    const closeModal = document.querySelector('.close');
    const newFavoriteColorInput = document.getElementById('newFavoriteColor');
    const confirmUpdateButton = document.getElementById('confirmUpdateButton');

    // Save favorite color to localStorage
    saveButton.addEventListener('click', function() {
        const favoriteColor = favoriteColorInput.value;
        if (favoriteColor) {
            localStorage.setItem('favoriteColor', favoriteColor);
            message.textContent = 'Favorite color saved!';
        } else {
            message.textContent = 'Please enter a color.';
        }
    });

    // Retrieve favorite color from localStorage
    retrieveButton.addEventListener('click', function() {
        const favoriteColor = localStorage.getItem('favoriteColor');
        if (favoriteColor) {
            displayColor.textContent = `Your favorite color is: ${favoriteColor}`;
            message.textContent = '';
        } else {
            displayColor.textContent = '';
            message.textContent = 'No favorite color found. Please save one first.';
        }
    });

    // Open the modal for updating favorite color
    updateButton.addEventListener('click', function() {
        updateModal.style.display = 'block';
    });

    // Close the modal
    closeModal.addEventListener('click', function() {
        updateModal.style.display = 'none';
    });

    // Update favorite color in localStorage
    confirmUpdateButton.addEventListener('click', function() {
        const newColor = newFavoriteColorInput.value;
        if (newColor) {
            localStorage.setItem('favoriteColor', newColor);
            message.textContent = 'Favorite color updated!';
            updateModal.style.display = 'none';
        } else {
            message.textContent = 'Please enter a new color.';
        }
    });

    // Delete favorite color from localStorage
    deleteButton.addEventListener('click', function() {
        localStorage.removeItem('favoriteColor');
        displayColor.textContent = '';
        message.textContent = 'Favorite color deleted!';
    });

    // Close the modal if user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target == updateModal) {
            updateModal.style.display = 'none';
        }
    });
});