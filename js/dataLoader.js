// Data loading and parsing utilities

class DataLoader {
    constructor() {
        this.rawData = null;
        this.processedData = null;
    }

    async loadData() {
        // Always use embedded data first (works without server and avoids CORS)
        if (typeof MOVIE_DATA !== 'undefined' && MOVIE_DATA.length > 0) {
            this.rawData = MOVIE_DATA;
            this.processedData = this.processData(MOVIE_DATA);
            console.log('Data loaded from embedded source:', this.processedData.length, 'movies');
            console.log('Sample movie:', this.processedData[0]);
            return this.processedData;
        }
        
        // Fallback to CSV file (requires web server) - only if embedded data not available
        try {
            const response = await d3.csv('data/movie_data.csv');
            if (!response || response.length === 0) {
                throw new Error('CSV file is empty');
            }
            this.rawData = response;
            this.processedData = this.processData(response);
            console.log('Data loaded from CSV file:', this.processedData.length, 'movies');
            return this.processedData;
        } catch (error) {
            console.error('Error loading CSV file:', error);
            // Fallback to sample data if file not found
            console.warn('Using sample data as fallback');
            return this.getSampleData();
        }
    }

    processData(data) {
        return data.map(d => {
            return {
                name: d.Name || d.name,
                year: d.Year ? +d.Year : null,
                genre: d.Genre || d.genre,
                rating: d.Rating || d.rating,
                boxOffice: d.BoxOffice ? +d.BoxOffice : 0,
                budget: d.Budget ? +d.Budget : 0,
                director: d.Director || d.director,
                country: d.Country || d.country,
                runtime: d.Runtime ? +d.Runtime : null,
                imdbScore: d.IMDB_Score ? +d.IMDB_Score : null
            };
        }).filter(d => d.boxOffice > 0 && d.year && !isNaN(d.year));
    }

    getSampleData() {
        // Sample dataset with movie data
        const genres = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Animation', 'Fantasy', 'Crime', 'War', 'Musical'];
        const directors = ['Christopher Nolan', 'Steven Spielberg', 'Quentin Tarantino', 'Martin Scorsese', 'James Cameron'];
        const countries = ['USA', 'UK', 'Australia', 'New Zealand'];
        
        const sampleData = [];
        const movieNames = [
            'The Dark Knight', 'Inception', 'Interstellar', 'The Matrix', 'Pulp Fiction',
            'Forrest Gump', 'Titanic', 'Avatar', 'Jurassic Park', 'Star Wars',
            'The Avengers', 'Black Panther', 'The Lion King', 'Toy Story', 'Frozen'
        ];

        for (let i = 0; i < 50; i++) {
            const year = 1970 + Math.floor(Math.random() * 50);
            const boxOffice = 50 + Math.random() * 2000;
            const budget = 10 + Math.random() * 200;
            
            sampleData.push({
                name: movieNames[Math.floor(Math.random() * movieNames.length)] + ' ' + (i + 1),
                year: year,
                genre: genres[Math.floor(Math.random() * genres.length)],
                rating: ['G', 'PG', 'PG-13', 'R'][Math.floor(Math.random() * 4)],
                boxOffice: boxOffice,
                budget: budget,
                director: directors[Math.floor(Math.random() * directors.length)],
                country: countries[Math.floor(Math.random() * countries.length)],
                runtime: 90 + Math.floor(Math.random() * 90),
                imdbScore: 6 + Math.random() * 3
            });
        }

        return sampleData;
    }

    getFilteredData(filters) {
        let filtered = [...this.processedData];

        if (filters.genre && filters.genre !== 'all') {
            filtered = filtered.filter(d => d.genre === filters.genre);
        }

        if (filters.rating && filters.rating !== 'all') {
            filtered = filtered.filter(d => d.rating === filters.rating);
        }

        if (filters.maxYear) {
            filtered = filtered.filter(d => d.year <= filters.maxYear);
        }

        return filtered;
    }
}

