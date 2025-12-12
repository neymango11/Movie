// D3 Visualization functions
// This file contains all the chart creation functions

// Create a bar chart showing box office by genre
function createGenreBarChart(data, containerId) {
    // Clear previous chart
    d3.select(containerId).selectAll("*").remove();
    
    // Set up dimensions
    const margin = { top: 40, right: 30, bottom: 80, left: 80 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Get the SVG container
    const svg = d3.select(containerId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Group data by genre and calculate total box office
    const genreData = d3.rollup(
        data,
        v => d3.sum(v, d => d.boxOffice),
        d => d.genre
    );
    
    // Convert to array format
    const genreArray = Array.from(genreData, ([genre, total]) => ({
        genre: genre,
        total: total
    })).sort((a, b) => b.total - a.total);
    
    // Set up scales
    const xScale = d3.scaleBand()
        .domain(genreArray.map(d => d.genre))
        .range([0, width])
        .padding(0.2);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(genreArray, d => d.total)])
        .nice()
        .range([height, 0]);
    
    // Create bars
    svg.selectAll(".bar")
        .data(genreArray)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.genre))
        .attr("y", d => yScale(d.total))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.total))
        .attr("fill", "#2563eb")
        .on("mouseover", function(event, d) {
            // Show tooltip on hover
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.genre}<br/>Total: $${d.total.toFixed(1)}M`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.selectAll(".tooltip").remove();
        });
    
    // Add x-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    // Add y-axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickFormat(d => `$${d}M`));
    
    // Add axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Box Office (Millions $)");
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Genre");
}

// Create a line chart showing movies over time
function createTimelineChart(data, containerId) {
    // Clear previous chart
    d3.select(containerId).selectAll("*").remove();
    
    // Set up dimensions
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Get the SVG container
    const svg = d3.select(containerId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Group data by year and count movies
    const yearData = d3.rollup(
        data,
        v => v.length,
        d => d.year
    );
    
    // Convert to array and sort by year
    const yearArray = Array.from(yearData, ([year, count]) => ({
        year: year,
        count: count
    })).sort((a, b) => a.year - b.year);
    
    // Set up scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(yearArray, d => d.year))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yearArray, d => d.count)])
        .nice()
        .range([height, 0]);
    
    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.count))
        .curve(d3.curveMonotoneX);
    
    // Add the line
    svg.append("path")
        .datum(yearArray)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#2563eb")
        .attr("stroke-width", 3);
    
    // Add dots for each data point
    svg.selectAll(".dot")
        .data(yearArray)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.count))
        .attr("r", 5)
        .attr("fill", "#2563eb")
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`Year: ${d.year}<br/>Movies: ${d.count}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.selectAll(".tooltip").remove();
        });
    
    // Add x-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    
    // Add y-axis with whole numbers only
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(d3.max(yearArray, d => d.count) + 1).tickFormat(d3.format("d")));
    
    // Add axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Movies");
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Year");
}

// Create a scatter plot showing IMDB Score vs Box Office
function createScatterPlot(data, containerId) {
    // Clear previous chart
    d3.select(containerId).selectAll("*").remove();
    
    // Set up dimensions
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Get the SVG container
    const svg = d3.select(containerId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Filter data to only include movies with IMDB scores
    const filteredData = data.filter(d => d.imdbScore && !isNaN(d.imdbScore));
    
    // Set up scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.imdbScore))
        .nice()
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.boxOffice))
        .nice()
        .range([height, 0]);
    
    // Add dots
    svg.selectAll(".dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.imdbScore))
        .attr("cy", d => yScale(d.boxOffice))
        .attr("r", 6)
        .attr("fill", "#2563eb")
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.name}<br/>IMDB: ${d.imdbScore.toFixed(1)}<br/>Box Office: $${d.boxOffice.toFixed(1)}M`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            
            // Highlight this dot
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "#1e40af");
        })
        .on("mouseout", function(event, d) {
            d3.selectAll(".tooltip").remove();
            d3.select(this)
                .attr("r", 6)
                .attr("fill", "#2563eb");
        });
    
    // Add x-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    // Add y-axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).tickFormat(d => `$${d}M`));
    
    // Add axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Box Office (Millions $)");
    
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("IMDB Score");
}

// Create a horizontal bar chart for top movies
function createTopMoviesChart(data, containerId) {
    // Clear previous chart
    d3.select(containerId).selectAll("*").remove();
    
    // Set up dimensions
    const margin = { top: 40, right: 30, bottom: 60, left: 150 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Get the SVG container
    const svg = d3.select(containerId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Sort by box office and take top 10
    const topMovies = [...data]
        .sort((a, b) => b.boxOffice - a.boxOffice)
        .slice(0, 10);
    
    // Truncate long movie names for display
    const displayNames = topMovies.map(d => ({
        ...d,
        displayName: d.name.length > 25 ? d.name.substring(0, 22) + "..." : d.name
    }));
    
    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(topMovies, d => d.boxOffice)])
        .nice()
        .range([0, width]);
    
    const yScale = d3.scaleBand()
        .domain(displayNames.map(d => d.displayName))
        .range([0, height])
        .padding(0.2);
    
    // Create bars
    svg.selectAll(".bar")
        .data(displayNames)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.displayName))
        .attr("width", d => xScale(d.boxOffice))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#2563eb")
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.name} (${d.year})<br/>Box Office: $${d.boxOffice.toFixed(1)}M`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.selectAll(".tooltip").remove();
        });
    
    // Add labels on bars
    svg.selectAll(".bar-label")
        .data(displayNames)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.boxOffice) + 5)
        .attr("y", d => yScale(d.displayName) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("font-size", "11px")
        .style("fill", "#333")
        .text(d => `$${d.boxOffice.toFixed(1)}M`);
    
    // Add y-axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "10px");
    
    // Add x-axis with better spacing
    const maxValue = d3.max(topMovies, d => d.boxOffice);
    const tickCount = maxValue > 1000 ? 5 : 6;  // Fewer ticks for larger ranges
    
    const xAxis = d3.axisBottom(xScale)
        .ticks(tickCount)  // Limit number of ticks for better spacing
        .tickFormat(d => {
            // Format numbers - remove decimals for whole numbers
            if (d % 1 === 0) {
                return `$${d}M`;
            } else {
                return `$${d.toFixed(0)}M`;  // Round to whole numbers for cleaner display
            }
        });
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "11px");
    
    // Add axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Box Office (Millions $)");
}

// Function to display movie information
function showMovieInfo(movie) {
    const infoPanel = d3.select("#movie-info");
    infoPanel.html("");
    
    const info = [
        { label: "Name", value: movie.name },
        { label: "Year", value: movie.year },
        { label: "Genre", value: movie.genre },
        { label: "Rating", value: movie.rating },
        { label: "Box Office", value: `$${movie.boxOffice.toFixed(1)}M` },
        { label: "Budget", value: `$${movie.budget.toFixed(1)}M` },
        { label: "Director", value: movie.director },
        { label: "Country", value: movie.country },
        { label: "Runtime", value: `${movie.runtime} min` },
        { label: "IMDB Score", value: movie.imdbScore ? movie.imdbScore.toFixed(1) : "N/A" }
    ];
    
    info.forEach(item => {
        infoPanel.append("div")
            .attr("class", "info-item")
            .html(`<strong>${item.label}:</strong> <span>${item.value}</span>`);
    });
}

