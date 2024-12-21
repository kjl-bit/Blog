function likePost(button, postId) {
    const likeCountSpan = button.querySelector("span");
    const likeIcon = button.closest('.blog').querySelector('.like-icon');

    if (!button.disabled) {
        const currentCount = parseInt(likeCountSpan.textContent, 10);
        likeCountSpan.textContent = currentCount + 1;
        button.disabled = true;
        likeIcon.style.display = "inline"; // Show the like icon

        // Update likes in localStorage
        const likes = JSON.parse(localStorage.getItem('likes')) || {};
        likes[postId] = currentCount + 1;
        localStorage.setItem('likes', JSON.stringify(likes));
        
        // Debugging: Check if localStorage is updating
        console.log('Updated likes in localStorage:', likes);
    }
}

// Function to save a post
function savePost(button) {
    if (!button.disabled) {
        button.textContent = "Saved"; // Change button text
        button.disabled = true; // Disable button to prevent multiple clicks
    }
}

// Function to add a comment to a post
function addComment(button, postId) {
    const commentSection = button.closest(".comment-section");
    const commentInput = commentSection.querySelector("textarea");
    const commentsDiv = commentSection.querySelector(".comments");

    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentElement = document.createElement("p");
        commentElement.textContent = commentText;

        commentsDiv.appendChild(commentElement); // Add comment to UI
        commentInput.value = ""; // Clear the input field

        // Update comments in localStorage
        const comments = JSON.parse(localStorage.getItem('comments')) || {};
        comments[postId] = comments[postId] || [];
        comments[postId].push(commentText); // Add new comment to the post's list
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // Debugging: Check if localStorage is updating
        console.log('Updated comments in localStorage:', comments);
    } else {
        alert("Please enter a comment before submitting!");
    }
}

// Load stored likes and comments from localStorage on page load
function loadStoredData(postId, likeCountSpan, commentsDiv) {
    // Load likes
    const likes = JSON.parse(localStorage.getItem('likes')) || {};
    if (likes[postId]) {
        likeCountSpan.textContent = likes[postId]; // Set the stored like count
    }

    // Load comments
    const comments = JSON.parse(localStorage.getItem('comments')) || {};
    if (comments[postId]) {
        comments[postId].forEach(commentText => {
            const commentElement = document.createElement("p");
            commentElement.textContent = commentText; // Display each stored comment
            commentsDiv.appendChild(commentElement);
        });
    }
}

