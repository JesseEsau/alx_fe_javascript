// Initial quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

async function fetchServerQuotes() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();

        // Turn post titles into quote objects
        const serverQuotes = data.map(post => ({
            text: post.title,
            category: "External" // since JSONPlaceholder doesn't have categories
        }));

        syncWithServer(serverQuotes);
    } catch (error) {
        console.error("Failed to fetch from server:", error);
    }
}

function syncWithServer(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let updated = false;

    serverQuotes.forEach(serverQuote => {
        const matchIndex = localQuotes.findIndex(
            local => local.text.toLowerCase() === serverQuote.text.toLowerCase()
        );

        if (matchIndex === -1) {
            localQuotes.push(serverQuote); // new quote
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem("quotes", JSON.stringify(localQuotes));
        quotes = localQuotes; // update in-memory
        alert("Quotes synced from server!");
        displayQuotes(); // your function to re-render
    }
}


function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
    const categorySet = new Set(quotes.map(q => q.category));
    const dropdown = document.getElementById("categoryFilter");

    // Clear current options (except 'All')
    dropdown.innerHTML = '<option value="all">All Categories</option>';

    categorySet.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });

    // Restore last selected filter from localStorage
    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
        dropdown.value = savedFilter;
        filterQuotes(); // Automatically filter
    }
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
        quoteDisplay.innerHTML = "No quotes available in this category.";
    } else {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        const quote = filtered[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>Quote:</strong> ${quote.text}</p>
        <p><em>Category:</em> ${quote.category}</p>`;
    }

    // Also save to sessionStorage
    if (filtered.length > 0) {
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(filtered[0]));
    }
}



// Get DOM element
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Function to display random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>`;

    // save to sessionStorage
    sessionStorage.setItem("lastviewedQuote", JSON.stringify(quote));
}


// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!quoteText || !quoteCategory) {
        alert("Please fill in both fields.");
        return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes(); // save to localStorage
    populateCategories(); // update the filter dropdown with the new categories

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
}

// function to add a new quote Form dynamically
function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");

    const heading = document.createElement("h2");
    heading.textContent = "Add a New Quote";

    const inputQuote = document.createElement("input");
    inputQuote.id = "newQuoteText";
    inputQuote.placeholder = "Enter a new quote";
    inputQuote.type = "text";

    inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.placeholder = "Enter quote category";
    inputCategory.type = "text";

    const addButton = document.createElement("button");
    addButton.textContent = "ADD Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(heading);
    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
}

// load last viewes quote from sessionStorage
const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    quoteDisplay.innerHTML = `<p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>`;
}

function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (err) {
            alert("Error importing JSON: " + err.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}


// Event listener for button
newQuoteBtn.addEventListener("click", showRandomQuote);

setInterval(fetchServerQuotes, 30000); // every 30 seconds
fetchServerQuotes(); // also run once at load


// Create form on page load
createAddQuoteForm();
// populate filter on load
populateCategories();