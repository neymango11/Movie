# Movie Data Visualization - D3.js Interactive Dashboard

An interactive data visualization project using D3.js to explore movie data including box office performance, ratings, genres, and more.

## Features

- **Bar Chart**: Box office revenue by genre
- **Line Chart**: Movies released over time
- **Scatter Plot**: IMDB Score vs Box Office relationship
- **Top Movies Chart**: Top 10 movies by box office revenue
- **Interactive Filters**: Filter by genre, rating, and year range
- **Hover Tooltips**: Detailed information on hover
- **Responsive Design**: Works on different screen sizes

## Technologies Used

- D3.js v7
- HTML5
- CSS3
- JavaScript (ES6+)

## Dataset

The project uses a dataset of 60 movies with 10 attributes:
- Name, Year, Genre, Rating, BoxOffice, Budget, Director, Country, Runtime, IMDB_Score

## Getting Started

1. Clone this repository
2. Open `index.html` in a web browser (Chrome recommended)

## Project Structure

```
├── index.html          # Main visualization page
├── documentation.html  # Project documentation
├── css/
│   └── style.css       # Styling
├── js/
│   ├── dataLoader.js   # Data loading and processing
│   ├── visualizations.js # D3 chart creation functions
│   └── main.js         # Application initialization
├── data/
│   └── movie_data.csv  # Dataset
└── *.png               # Screenshot images for documentation
```

## Author

Aman Mohamed

## License

This project is for educational purposes.

