function likePost(button, postId) {
    const likeCountSpan = button.querySelector("span");
    const likeIcon = button.closest('.blog').querySelector('.like-icon');
    
    const userId = 'user_' + Date.now(); // This is a placeholder; use a real user/session ID if possible
    
    let likes = JSON.parse(localStorage.getItem('likes')) || {};
    let userLikes = JSON.parse(localStorage.getItem('userLikes')) || {};

    // Check if the user has already liked the post
    if (userLikes[userId] && userLikes[userId].includes(postId)) {
        alert("You already liked this post!");
        return;
    }

    // Update like count and store it in localStorage
    const currentCount = parseInt(likeCountSpan.textContent, 10) || 0;
    likeCountSpan.textContent = currentCount + 1;
    button.disabled = true;
    likeIcon.style.display = "inline";

    likes[postId] = currentCount + 1;
    localStorage.setItem('likes', JSON.stringify(likes));

    // Mark this post as liked by the user in userLikes
    userLikes[userId] = userLikes[userId] || [];
    userLikes[userId].push(postId);
    localStorage.setItem('userLikes', JSON.stringify(userLikes));

    console.log('Updated likes in localStorage:', likes);
}

function addComment(button, postId) {
    const commentSection = button.closest(".comment-section");
    const commentInput = commentSection.querySelector("textarea");
    const commentsDiv = commentSection.querySelector(".comments");

    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentElement = document.createElement("p");
        commentElement.textContent = commentText;
        commentsDiv.appendChild(commentElement);

        commentInput.value = ""; // Clear input after submitting

        let comments = JSON.parse(localStorage.getItem('comments')) || {};
        comments[postId] = comments[postId] || [];
        comments[postId].push(commentText);
        localStorage.setItem('comments', JSON.stringify(comments));

        console.log('Updated comments in localStorage:', comments);
    } else {
        alert("Please enter a comment before submitting!");
    }
}

function loadStoredData(postId, likeButton, likeCountSpan, commentsDiv, saveButton) {
    let likes = JSON.parse(localStorage.getItem('likes')) || {};
    if (likes[postId] !== undefined) {
        likeCountSpan.textContent = likes[postId];
        likeButton.disabled = true; // Disable like button if already liked
    } else {
        likeCountSpan.textContent = "0"; // Show 0 if no likes exist
    }

    let comments = JSON.parse(localStorage.getItem('comments')) || {};
    if (comments[postId]) {
        comments[postId].forEach(commentText => {
            const commentElement = document.createElement("p");
            commentElement.textContent = commentText;
            commentsDiv.appendChild(commentElement);
        });
    }

    let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || {};
    if (savedPosts[postId]) {
        saveButton.textContent = "Saved";
        saveButton.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.blog').forEach(blog => {
        const postId = blog.dataset.postId;
        const likeButton = blog.querySelector(".like-button");
        const likeCountSpan = likeButton.querySelector("span");
        const commentsDiv = blog.querySelector(".comments");
        const saveButton = blog.querySelector(".save-button");

        loadStoredData(postId, likeButton, likeCountSpan, commentsDiv, saveButton);
    });
});


