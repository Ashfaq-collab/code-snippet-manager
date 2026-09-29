const API_URL = "http://localhost:8080/api/snippets";

let snippets = [];

const searchInput = document.getElementById("searchInput");

const languageFilter = document.getElementById("languageFilter");

const snippetCount = document.getElementById("snippetCount");

const submitButton = document.getElementById("submitButton");

let editingSnippetId = null;

const titleError = document.getElementById("titleError");

const languageError = document.getElementById("languageError");

const codeError = document.getElementById("codeError");

// Get the form
const snippetForm = document.getElementById("snippetForm");

// Get the snippet container
const snippetContainer = document.getElementById("snippetContainer");

// const searchInput = document.getElementById("searchInput");

function showMessage(message, type) {

    const messageElement = document.getElementById("message");

    messageElement.textContent = message;

    messageElement.className = `alert alert-${type} mt-3`;

    setTimeout(function () {
        messageElement.textContent = "";
        messageElement.className = "";
    }, 3000);
}

// Listen for form submission
snippetForm.addEventListener("submit", async function (event) {

    // Prevent page refresh
    event.preventDefault();


    // Get values from the form

    const title = document.getElementById("snippetTitle").value;

    const language = document.getElementById("snippetLanguage").value;

    const code = document.getElementById("snippetCode").value;

    if (!validateSnippet(title, language, code)) {
        return;
    }


    // Create a new snippet object

    if (editingSnippetId === null) {

        try {

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    language: language,
                    code: code
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create snippet");
            }

            const savedSnippet = await response.json();

            snippets.push(savedSnippet);

            renderSnippets();

            snippetForm.reset();

            submitButton.textContent = "Add Snippet";

            showMessage("Snippet added successfully!", "success");

        } catch (error) {

            console.error("Error creating snippet:", error);

            showMessage("Failed to create snippet.", "danger");

        }

    } else {

        try {

            const response = await fetch(`${API_URL}/${editingSnippetId}`, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    language: language,
                    code: code
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update snippet");
            }

            const updatedSnippet = await response.json();

            const index = snippets.findIndex(function (snippet) {
                return snippet.id === editingSnippetId;
            });

            if (index !== -1) {
                snippets[index] = updatedSnippet;
            }

            renderSnippets();

            snippetForm.reset();

            editingSnippetId = null;

            submitButton.textContent = "Add Snippet";

            showMessage("Snippet updated successfully!", "success");

        } catch (error) {

            console.error("Error updating snippet:", error);

            showMessage("Failed to update snippet.", "danger");

        }

    }


    // Save updated array

    localStorage.setItem(
        "snippets",
        JSON.stringify(snippets)
    );


    // Refresh the page

    renderSnippets();


    // Clear form

    snippetForm.reset();

    submitButton.textContent = "Add Snippet";

});


// Function to display a snippet

function addSnippetToPage(snippet) {

    const snippetHTML = `
    
        <div class="col-md-6 mb-4">

            <div class="card h-100 shadow-sm">

                <div class="card-body">

                    <h5 class="card-title">
                         🔥${snippet.title}
                    </h5>

                    <span class="badge bg-primary mb-3">
                        ${snippet.language}
                    </span>

                    <pre class="bg-light p-3 rounded"><code>${snippet.code}</code></pre>
                    
                    <button class="btn btn-warning btn-sm me-2" onclick="editSnippet(${snippet.id})">
                    Edit
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="deleteSnippet(${snippet.id})">
                        Delete
                    </button>

                </div>

            </div>

        </div>`;

    // Add the snippet to the page

    snippetContainer.innerHTML += snippetHTML;
}

// Render all saved snippets

function renderSnippets(snippetsToRender = snippets) {

    snippetContainer.innerHTML = "";

    snippetCount.textContent =
        `${snippetsToRender.length} Snippets`;


    if (snippetsToRender.length === 0) {

        snippetContainer.innerHTML = `
        
            <div class="col-12">

                <div class="alert alert-info text-center">

                    No snippets found.

                    <br>

                    Start by adding your first code snippet!

                </div>

            </div>
        
        `;

        return;
    }

    snippetsToRender.forEach(function (snippet) {

        addSnippetToPage(snippet);

    });
}


// Load saved snippets when page opens

renderSnippets();

async function deleteSnippet(id) {
    const confirmed = confirm("Are you sure you want to delete this snippet?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete snippet");
        }

        snippets = snippets.filter(function (snippet) {
            return snippet.id !== id;
        });

        renderSnippets();

        showMessage("Snippet deleted successfully!", "success");

    } catch (error) {

        console.error("Error deleting snippet:", error);

        showMessage("Failed to delete snippet.", "danger");

    }
}

// searchInput.addEventListener("input", function () {

//     const searchText = searchInput.value.toLowerCase();


//     const filteredSnippets = snippets.filter(function (snippet) {

//         return (
//             snippet.title.toLowerCase().includes(searchText) ||
//             snippet.language.toLowerCase().includes(searchText)
//         );

//     });


//     renderSnippets(filteredSnippets);

// });
function filterSnippets() {

    const searchText = searchInput.value.toLowerCase();
    const selectedLanguage = languageFilter.value;

    const filteredSnippets = snippets.filter(function (snippet) {

        const matchesSearch =
            snippet.title.toLowerCase().includes(searchText) ||
            snippet.code.toLowerCase().includes(searchText);

        const matchesLanguage =
            selectedLanguage === "" ||
            snippet.language === selectedLanguage;

        return matchesSearch && matchesLanguage;
    });

    renderSnippets(filteredSnippets);
}

searchInput.addEventListener("input", filterSnippets);

languageFilter.addEventListener("change", filterSnippets);

function editSnippet(id) {

    const snippet = snippets.find(function (snippet) {

        return snippet.id === id;

    });


    if (!snippet) {
        return;
    }

    editingSnippetId = id;

    submitButton.textContent = "Update Snippet";

    document.getElementById("snippetTitle").value = snippet.title;

    document.getElementById("snippetLanguage").value = snippet.language;

    document.getElementById("snippetCode").value = snippet.code;

    document.getElementById("snippetTitle").focus();

}


function validateSnippet(title, language, code) {

    let isValid = true;


    // Clear previous errors

    titleError.textContent = "";

    languageError.textContent = "";

    codeError.textContent = "";

    document.getElementById("snippetTitle")
        .classList.remove("is-invalid");

    document.getElementById("snippetLanguage")
        .classList.remove("is-invalid");

    document.getElementById("snippetCode")
        .classList.remove("is-invalid");


    // Validate title

    if (title.trim() === "") {

        titleError.textContent = "Title is required.";


        document.getElementById("snippetTitle")
            .classList.add("is-invalid");

        isValid = false;
    }


    // Validate language

    if (language === "") {

        languageError.textContent = "Please select a language.";


        document.getElementById("snippetLanguage")
            .classList.add("is-invalid");

        isValid = false;
    }


    // Validate code

    if (code.trim() === "") {

        codeError.textContent = "Code is required.";

        document.getElementById("snippetCode")
            .classList.add("is-invalid");

        isValid = false;
    }


    return isValid;
}

async function loadSnippets() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load snippets");
        }

        snippets = await response.json();

        renderSnippets();

    } catch (error) {

        console.error("Error loading snippets:", error);

    }
}
loadSnippets();
