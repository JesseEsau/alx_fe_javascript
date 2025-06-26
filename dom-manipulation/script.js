// Initial quotes array
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Creativity is intelligence having fun.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

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

// Event listener for button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Create form on page load
createAddQuoteForm();