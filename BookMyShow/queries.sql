-- BookMyShow Database Queries
-- Part 2: Query to list down all the shows on a given date at a given theatre along with their respective show timings

USE bookmyshow_db;

-- Query for P2
-- Given Theatre ID: 1
-- Given Date: '2026-04-25'
SELECT 
    m.title AS movie_title,
    m.certification,
    l.name AS language,
    f.name AS format,
    TIME_FORMAT(s.start_time, '%r') AS show_time, -- Formats time as '12:15:00 PM' or similar
    scr.screen_name,
    GROUP_CONCAT(sf.feature_name ORDER BY sf.feature_name SEPARATOR ' ') AS screen_features,
    s.price AS ticket_price
FROM 
    shows s
INNER JOIN 
    screens scr ON s.screen_id = scr.screen_id
INNER JOIN 
    theatres t ON scr.theatre_id = t.theatre_id
INNER JOIN 
    movies m ON s.movie_id = m.movie_id
INNER JOIN 
    languages l ON s.language_id = l.language_id
INNER JOIN 
    formats f ON s.format_id = f.format_id
LEFT JOIN 
    screen_features sf ON scr.screen_id = sf.screen_id
WHERE 
    t.theatre_id = 1              -- Filtering for a specific theatre
    AND s.show_date = '2026-04-25' -- Filtering for a specific date
GROUP BY 
    s.show_id, 
    m.title, 
    m.certification, 
    l.name, 
    f.name, 
    s.start_time, 
    scr.screen_name,
    s.price
ORDER BY 
    m.title, 
    s.start_time;
