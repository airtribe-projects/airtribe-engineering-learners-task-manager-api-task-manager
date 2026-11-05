-- BookMyShow Database Schema and Sample Data (MySQL)
-- Part 1: Schema creation and sample data inserts

CREATE DATABASE IF NOT EXISTS bookmyshow_db;
USE bookmyshow_db;

-- 1. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Theatres Table
CREATE TABLE IF NOT EXISTS theatres (
    theatre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city_id INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Screens Table
CREATE TABLE IF NOT EXISTS screens (
    screen_id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    screen_name VARCHAR(50) NOT NULL,
    seating_capacity INT NOT NULL,
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_theatre_screen (theatre_id, screen_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Screen Features Table
-- A screen can have multiple features (e.g., '4K', 'Dolby 7.1', 'ATMOS', 'Playhouse')
CREATE TABLE IF NOT EXISTS screen_features (
    screen_id INT NOT NULL,
    feature_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (screen_id, feature_name),
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Movies Table
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    certification VARCHAR(10) NOT NULL, -- e.g., 'UA', 'A', 'U'
    duration_minutes INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Languages Table
CREATE TABLE IF NOT EXISTS languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- e.g., 'Telugu', 'Hindi', 'English'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Formats Table
CREATE TABLE IF NOT EXISTS formats (
    format_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE -- e.g., '2D', '3D', 'IMAX 3D'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Movie Languages & Formats Mapping Table (Validates language and format for a movie)
CREATE TABLE IF NOT EXISTS movie_languages_formats (
    movie_id INT NOT NULL,
    language_id INT NOT NULL,
    format_id INT NOT NULL,
    PRIMARY KEY (movie_id, language_id, format_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(language_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (format_id) REFERENCES formats(format_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Shows Table
-- Represents a specific screening of a movie in a language/format on a specific screen at a specific date and time.
CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT NOT NULL,
    movie_id INT NOT NULL,
    language_id INT NOT NULL,
    format_id INT NOT NULL,
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 150.00,
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (movie_id, language_id, format_id) REFERENCES movie_languages_formats(movie_id, language_id, format_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uq_screen_show_time (screen_id, show_date, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================
-- DML: Insert Sample Data based on image context
-- ==========================================

-- Insert City
INSERT INTO cities (city_id, name) VALUES 
(1, 'Bangalore');

-- Insert Theatre
INSERT INTO theatres (theatre_id, name, address, city_id) VALUES 
(1, 'PVR: Nexus (Forum Mall)', 'Hosur Road, Koramangala, Bangalore', 1);

-- Insert Screens for Theatre 1
INSERT INTO screens (screen_id, theatre_id, screen_name, seating_capacity) VALUES 
(1, 1, 'Screen 1', 150),
(2, 1, 'Screen 2', 200),
(3, 1, 'Playhouse Screen', 80);

-- Insert Screen Features
INSERT INTO screen_features (screen_id, feature_name) VALUES 
(1, '4K'),
(1, 'Dolby 7.1'),
(2, '4K'),
(2, 'ATMOS'),
(3, '4K'),
(3, 'Playhouse');

-- Insert Movies
INSERT INTO movies (movie_id, title, certification, duration_minutes) VALUES 
(1, 'Dasara', 'UA', 156),
(2, 'Kisi Ka Bhai Kisi Ki Jaan', 'UA', 144),
(3, 'Tu Jhoothi Main Makkaar', 'UA', 159),
(4, 'Avatar: The Way of Water', 'UA', 192);

-- Insert Languages
INSERT INTO languages (language_id, name) VALUES 
(1, 'Telugu'),
(2, 'Hindi'),
(3, 'English');

-- Insert Formats
INSERT INTO formats (format_id, name) VALUES 
(1, '2D'),
(2, '3D');

-- Map Movies to Languages and Formats
INSERT INTO movie_languages_formats (movie_id, language_id, format_id) VALUES 
(1, 1, 1), -- Dasara: Telugu, 2D
(2, 2, 1), -- Kisi Ka Bhai Kisi Ki Jaan: Hindi, 2D
(3, 2, 1), -- Tu Jhoothi Main Makkaar: Hindi, 2D
(4, 3, 2); -- Avatar: The Way of Water: English, 3D

-- Insert Shows for TUE 25 APR (Selected date in the screenshot: 2026-04-25)
INSERT INTO shows (show_id, screen_id, movie_id, language_id, format_id, show_date, start_time, price) VALUES 
-- Dasara shows: 12:15 PM 4K Dolby 7.1 (Screen 1 is 4K Dolby 7.1)
(1, 1, 1, 1, 1, '2026-04-25', '12:15:00', 250.00),

-- Kisi Ka Bhai Kisi Ki Jaan shows:
-- 01:00 PM 4K ATMOS (Screen 2)
(2, 2, 2, 2, 1, '2026-04-25', '13:00:00', 220.00),
-- 04:10 PM 4K ATMOS (Screen 2)
(3, 2, 2, 2, 1, '2026-04-25', '16:10:00', 220.00),
-- 06:20 PM 4K Dolby 7.1 (Screen 1)
(4, 1, 2, 2, 1, '2026-04-25', '18:20:00', 250.00),
-- 07:20 PM 4K ATMOS (Screen 2)
(5, 2, 2, 2, 1, '2026-04-25', '19:20:00', 250.00),
-- 10:30 PM 4K ATMOS (Screen 2)
(6, 2, 2, 2, 1, '2026-04-25', '22:30:00', 200.00),

-- Tu Jhoothi Main Makkaar shows:
-- 01:15 PM Dolby 7.1 (Screen 1 has Dolby 7.1)
(7, 1, 3, 2, 1, '2026-04-25', '13:15:00', 220.00),

-- Avatar: The Way of Water shows:
-- 01:20 PM Playhouse 4K (Screen 3 has Playhouse + 4K)
(8, 3, 4, 3, 2, '2026-04-25', '13:20:00', 350.00);
