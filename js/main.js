// Main application file
// This file initializes the visualization and handles user interactions

// Global variables
let dataLoader;
let allData = [];
let currentData = [];

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Create data loader instance
    dataLoader = new DataLoader();
    
    // Load the data
    allData = await dataLoader.loadData();
    currentData = allData;
    
    // Check if we got sample data (indicates CSV didn't load)
    if (allData.length === 50 && allData[0].name && allData[0].name.includes(' ') && !allData[0].name.includes(',')) {
        // Likely sample data - show warning
        showDataWarning();
    }
    
    // Set up filters
    setupFilters();
    
    // Create initial visualizations
    updateVisualizations();
});

// Show warning if CSV data didn't load
function showDataWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = 'background: #fef3c7; border: 2px solid #f59e0b; border-radius: 10px; padding: 15px; margin: 20px auto; max-width: 800px; color: #92400e;';
    warning.innerHTML = `
        <strong>⚠️ Warning: CSV file not loaded</strong><br>
        The visualization is using sample data. To load the actual movie data:<br>
        1. Run a local web server: <code>python -m http.server 8000</code><br>
        2. Open <code>http://localhost:8000</code> in your browser<br>
        <small>Opening the HTML file directly (file://) doesn't work due to browser security restrictions.</small>
    `;
    document.querySelector('.container').insertBefore(warning, document.querySelector('.controls'));
}

// Set up filter controls
function setupFilters() {
    // Get unique genres and ratings
    const genres = [...new Set(allData.map(d => d.genre))].sort();
    const ratings = [...new Set(allData.map(d => d.rating))].sort();
    
    // Populate genre filter
    const genreSelect = d3.select("#genre-filter");
    genres.forEach(genre => {
        genreSelect.append("option")
            .attr("value", genre)
            .text(genre);
    });
    
    // Populate rating filter
    const ratingSelect = d3.select("#rating-filter");
    ratings.forEach(rating => {
        ratingSelect.append("option")
            .attr("value", rating)
            .text(rating);
    });
    
    // Set up year range
    const yearExtent = d3.extent(allData, d => d.year);
    const yearRange = d3.select("#year-range");
    yearRange.attr("min", yearExtent[0])
             .attr("max", yearExtent[1])
             .attr("value", yearExtent[1]);
    
    d3.select("#year-display").text(yearExtent[1]);
    
    // Add event listeners
    d3.select("#genre-filter").on("change", function() {
        applyFilters();
    });
    
    d3.select("#rating-filter").on("change", function() {
        applyFilters();
    });
    
    d3.select("#year-range").on("input", function() {
        const year = +this.value;
        d3.select("#year-display").text(year);
        applyFilters();
    });
    
    d3.select("#reset-btn").on("click", function() {
        resetFilters();
    });
}

// Apply filters to the data
function applyFilters() {
    const genreFilter = d3.select("#genre-filter").property("value");
    const ratingFilter = d3.select("#rating-filter").property("value");
    const maxYear = +d3.select("#year-range").property("value");
    
    // Filter the data directly
    let filtered = [...allData];
    
    if (genreFilter && genreFilter !== 'all') {
        filtered = filtered.filter(d => d.genre === genreFilter);
    }
    
    if (ratingFilter && ratingFilter !== 'all') {
        filtered = filtered.filter(d => d.rating === ratingFilter);
    }
    
    if (maxYear) {
        filtered = filtered.filter(d => d.year <= maxYear);
    }
    
    currentData = filtered;
    updateVisualizations();
}

// Reset all filters
function resetFilters() {
    d3.select("#genre-filter").property("value", "all");
    d3.select("#rating-filter").property("value", "all");
    
    const yearExtent = d3.extent(allData, d => d.year);
    d3.select("#year-range").property("value", yearExtent[1]);
    d3.select("#year-display").text(yearExtent[1]);
    
    currentData = allData;
    updateVisualizations();
}

// Update all visualizations with current data
function updateVisualizations() {
    if (currentData.length === 0) {
        // Show message if no data
        d3.selectAll(".chart-container svg").html("");
        d3.selectAll(".chart-container p").remove(); // Remove any existing messages
        d3.selectAll(".chart-container").append("p")
            .style("text-align", "center")
            .style("color", "#666")
            .style("padding", "20px")
            .text("No data available for selected filters");
        return;
    }
    
    // Remove any "no data" messages
    d3.selectAll(".chart-container p").remove();
    
    // Create all charts
    createGenreBarChart(currentData, "#genre-chart");
    createTimelineChart(currentData, "#timeline-chart");
    createScatterPlot(currentData, "#scatter-chart");
    createTopMoviesChart(currentData, "#top-movies-chart");
}

