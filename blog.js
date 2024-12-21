import { generateContent } from './ai.js'; // Ensure generateContent is imported properly

const blogContent = document.getElementById('blog-content');
const saveButton = document.querySelector('.save-btn');
const deleteButton = document.querySelector('.upload-btn');
const blogList = document.getElementById('blog-list');
const BLOG_STORAGE_KEY = 'blogs';

document.addEventListener('DOMContentLoaded', renderBlogs);

saveButton.addEventListener('click', () => {
    const content = blogContent.value.trim();
    if (content) {
        const blogs = getBlogs();
        const newBlog = { id: Date.now(), content, titles: [] }; // Added titles array to each blog
        blogs.push(newBlog);
        saveBlogs(blogs);
        renderBlogs();
        
        // Send the blog content to generate titles
        const prompt = `Please provide me with three short titles for the following blog content: ${content}`;
        
        generateContent(prompt).then(responseText => {
            // Assuming the response is a list of titles separated by new lines
            const titles = responseText.split('\n').map(title => title.trim()).filter(title => title.length > 0);
            
            // Save the generated titles to the blog
            if (titles.length >= 3) {
                newBlog.titles = titles.slice(0, 3);  // Save only the first 3 titles
                saveBlogs(blogs);
                renderBlogs();  // Re-render the blogs to include the new titles
            } else {
                console.error("Error: Could not generate three titles.");
            }
        }).catch(error => {
            console.error("Error generating content:", error);
        });

        blogContent.value = '';
        alert('Blog saved successfully!');
    } else {
        alert('Please write something before saving.');
    }
});

deleteButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all blogs?')) {
        localStorage.removeItem(BLOG_STORAGE_KEY);
        renderBlogs();
        blogContent.value = ''; 
        alert('All blogs deleted.');
    }
});

blogList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = parseInt(e.target.dataset.id, 10);
        editBlog(id);
    } else if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id, 10);
        deleteBlog(id);
    }
});

function editBlog(id) {
    const blogs = getBlogs();
    const blogToEdit = blogs.find(blog => blog.id === id);
    if (blogToEdit) {
        blogContent.value = blogToEdit.content;
        deleteBlog(id);
    }
}

function deleteBlog(id) {
    const blogs = getBlogs().filter(blog => blog.id !== id);
    saveBlogs(blogs);
    renderBlogs();
}

function renderBlogs() {
    const blogs = getBlogs();
    blogList.innerHTML = blogs.map(blog => `
        <li>
            <span>${blog.content}</span>
            <ul>
                ${Array.isArray(blog.titles) && blog.titles.length > 0 ? 
                  blog.titles.map(title => `<li>${title}</li>`).join('') : 
                  '<li>No titles generated yet</li>'
                }
            </ul>
            <div class="actions">
                <button class="action-btn edit-btn" data-id="${blog.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${blog.id}">Delete</button>
            </div>
        </li>
    `).join('');
}

function getBlogs() {
    return JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY)) || [];
}

function saveBlogs(blogs) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
}
