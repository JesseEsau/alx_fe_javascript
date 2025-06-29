// Initial quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];


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

function fetchMockServerQuotes() {
    // Simulate fetched server quotes
    const serverQuotes = [
        { text: "Creativity is intelligence having fun.", category: "Inspiration" }, // existing but may change
        { text: "Success is not in what you have, but who you are.", category: "Motivation" }, // new
        { text: "Life is short, and it is up to you to make it sweet.", category: "Life" } // new
    ];

    syncWithServer(serverQuotes);
}

function syncWithServer(serverQuotes) {
    let conflicts = 0;
    let newQuotes = 0;

    serverQuotes.forEach(serverQuote => {
        const matchIndex = quotes.findIndex(
            localQuote => localQuote.text.toLowerCase() === serverQuote.text.toLowerCase()
        );

        if (matchIndex !== -1) {
            const local = quotes[matchIndex];
            if (local.category !== serverQuote.category) {
                // Conflict detected: update category to match server
                quotes[matchIndex].category = serverQuote.category;
                conflicts++;
            }
        } else {
            // New quote from server
            quotes.push(serverQuote);
            newQuotes++;
        }
    });

    saveQuotes();
    populateCategories();

    // Notify user
    if (conflicts > 0 || newQuotes > 0) {
        alert(`🔄 Sync complete:\n${newQuotes} new quote(s) added.\n${conflicts} conflict(s) resolved (server version used).`);
    } else {
        console.log("✅ Sync complete: No changes detected.");
    }
}



// Event listener for button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Create form on page load
createAddQuoteForm();
// populate filter on load
populateCategories();

// Simulate periodic server sync every 30 seconds
setInterval(fetchMockServerQuotes, 30000);

// Optional: run once at page load
fetchMockServerQuotes();
