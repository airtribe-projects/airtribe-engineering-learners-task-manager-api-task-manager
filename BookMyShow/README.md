# BookMyShow Database Design & Query Assignment

This directory contains the database design for BookMyShow, illustrating how theatres, screens, movies, and shows are modeled to handle date-specific schedules. The design conforms to **1NF, 2NF, 3NF, and BCNF** rules.

---

## 1. Entity-Relationship Design

### Entities and Attributes

| Entity | Primary Key | Foreign Key(s) | Other Attributes | Description |
| :--- | :--- | :--- | :--- | :--- |
| **City** | `city_id` | *None* | `name` | Location of theatres |
| **Theatre** | `theatre_id` | `city_id` | `name`, `address` | Multiplex or cinema hall |
| **Screen** | `screen_id` | `theatre_id` | `screen_name`, `seating_capacity` | Physical auditorium in a theatre |
| **Screen Feature** | `(screen_id, feature_name)` | `screen_id` | *None* | Special tech equipment (e.g., 4K, ATMOS, Dolby 7.1) |
| **Movie** | `movie_id` | *None* | `title`, `certification`, `duration_minutes` | Movie details |
| **Language** | `language_id` | *None* | `name` | Movie languages (e.g., Hindi, English, Telugu) |
| **Format** | `format_id` | *None* | `name` | Projection formats (e.g., 2D, 3D) |
| **Movie Language Format** | `(movie_id, language_id, format_id)` | `movie_id`, `language_id`, `format_id` | *None* | Defines valid language and format options for a movie |
| **Show** | `show_id` | `screen_id`, `(movie_id, language_id, format_id)` | `show_date`, `start_time`, `price` | Individual schedule instance |

---

## 2. Normalization Analysis

### First Normal Form (1NF)
- **Rules**: Attributes must contain only atomic values. There can be no repeating groups or lists in a single field.
- **Compliance**:
  - We did not store formats and languages in a single column like "Hindi, 2D". Instead, they are represented as distinct primary entities (`languages`, `formats`) and mapped atomically in `movie_languages_formats`.
  - Multiple show timings are not stored as a list (e.g., "01:00 PM, 04:10 PM"). Each individual showtime is an independent row in the `shows` table.

### Second Normal Form (2NF)
- **Rules**: Must be in 1NF and have no partial dependencies (every non-prime attribute must be fully functionally dependent on the entire primary key).
- **Compliance**:
  - Tables with single-attribute primary keys (`cities`, `theatres`, `screens`, `movies`, `languages`, `formats`, `shows`) automatically satisfy 2NF because no part of the key can be subsetted.
  - For composite key tables like `movie_languages_formats` or `screen_features`, there are no non-prime attributes, eliminating partial dependencies.

### Third Normal Form (3NF)
- **Rules**: Must be in 2NF and have no transitive dependencies (no non-prime attribute should determine another non-prime attribute).
- **Compliance**:
  - In `theatres`, the city name is not stored directly to avoid transitive dependency (`theatre_id` -> `city_id` -> `city_name`). Instead, it links to `cities` via `city_id`.
  - In `shows`, we store only the `screen_id`. The screen features, seating capacities, and theatre details are fetched via joins. There are no transitive attributes stored.

### Boyce-Codd Normal Form (BCNF)
- **Rules**: Must be in 3NF and for every functional dependency $X \rightarrow Y$, $X$ must be a superkey.
- **Compliance**:
  - In `shows`, candidate keys are `show_id` and the composite key `(screen_id, show_date, start_time)`. Since a screen can only run one show at a given start time, both candidate keys uniquely identify a show.
  - The functional dependencies are:
    1. $show\_id \rightarrow screen\_id, movie\_id, language\_id, format\_id, show\_date, start\_time, price$
    2. $(screen\_id, show\_date, start\_time) \rightarrow show\_id, movie\_id, language\_id, format\_id, price$
  - In both cases, the left-hand side is a candidate key. Thus, BCNF is satisfied.

---

## 3. Example Rows

### `cities`
| city_id | name |
| :--- | :--- |
| 1 | Bangalore |

### `theatres`
| theatre_id | name | address | city_id |
| :--- | :--- | :--- | :--- |
| 1 | PVR: Nexus (Forum Mall) | Hosur Road, Koramangala, Bangalore | 1 |

### `screens`
| screen_id | theatre_id | screen_name | seating_capacity |
| :--- | :--- | :--- | :--- |
| 1 | 1 | Screen 1 | 150 |
| 2 | 1 | Screen 2 | 200 |
| 3 | 1 | Playhouse Screen | 80 |

### `screen_features`
| screen_id | feature_name |
| :--- | :--- |
| 1 | 4K |
| 1 | Dolby 7.1 |
| 2 | 4K |
| 2 | ATMOS |
| 3 | 4K |
| 3 | Playhouse |

### `movies`
| movie_id | title | certification | duration_minutes |
| :--- | :--- | :--- | :--- |
| 1 | Dasara | UA | 156 |
| 2 | Kisi Ka Bhai Kisi Ki Jaan | UA | 144 |
| 3 | Tu Jhoothi Main Makkaar | UA | 159 |
| 4 | Avatar: The Way of Water | UA | 192 |

### `languages`
| language_id | name |
| :--- | :--- |
| 1 | Telugu |
| 2 | Hindi |
| 3 | English |

### `formats`
| format_id | name |
| :--- | :--- |
| 1 | 2D |
| 2 | 3D |

### `movie_languages_formats`
| movie_id | language_id | format_id |
| :--- | :--- | :--- |
| 1 (Dasara) | 1 (Telugu) | 1 (2D) |
| 2 (Kisi Ka...) | 2 (Hindi) | 1 (2D) |
| 3 (Tu Jhoothi...) | 2 (Hindi) | 1 (2D) |
| 4 (Avatar) | 3 (English) | 2 (3D) |

### `shows`
| show_id | screen_id | movie_id | language_id | format_id | show_date | start_time | price |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 1 | 1 | 1 | 2026-04-25 | 12:15:00 | 250.00 |
| 2 | 2 | 2 | 2 | 1 | 2026-04-25 | 13:00:00 | 220.00 |
| 3 | 2 | 2 | 2 | 1 | 2026-04-25 | 16:10:00 | 220.00 |
| 4 | 1 | 2 | 2 | 1 | 2026-04-25 | 18:20:00 | 250.00 |
| 5 | 2 | 2 | 2 | 1 | 2026-04-25 | 19:20:00 | 250.00 |
| 6 | 2 | 2 | 2 | 1 | 2026-04-25 | 22:30:00 | 200.00 |
| 7 | 1 | 3 | 2 | 1 | 2026-04-25 | 13:15:00 | 220.00 |
| 8 | 3 | 4 | 3 | 2 | 2026-04-25 | 13:20:00 | 350.00 |

---

## 4. SQL Scripts

1. **P1 Schema & Sample Data**: Refer to [schema.sql](file:///d:/Airtribe/NewAir/task-manager-api-swdsm100040/BookMyShow/schema.sql)
2. **P2 Showtimes Query**: Refer to [queries.sql](file:///d:/Airtribe/NewAir/task-manager-api-swdsm100040/BookMyShow/queries.sql)

### Executing the query locally:
```sql
-- Select database
USE bookmyshow_db;

-- Run query to get all shows on 2026-04-25 at Theatre 1 (PVR Nexus Forum Mall)
SELECT 
    m.title AS movie_title,
    m.certification,
    l.name AS language,
    f.name AS format,
    TIME_FORMAT(s.start_time, '%r') AS show_time,
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
    t.theatre_id = 1
    AND s.show_date = '2026-04-25'
GROUP BY 
    s.show_id, m.title, m.certification, l.name, f.name, s.start_time, scr.screen_name, s.price
ORDER BY 
    m.title, s.start_time;
```

---

## 5. Sample Query Result

Running the query retrieves the exact layout mapped to the design:

| movie_title | certification | language | format | show_time | screen_name | screen_features | ticket_price |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Avatar: The Way of Water | UA | English | 3D | 01:20:00 PM | Playhouse Screen | 4K Playhouse | 350.00 |
| Dasara | UA | Telugu | 2D | 12:15:00 PM | Screen 1 | 4K Dolby 7.1 | 250.00 |
| Kisi Ka Bhai Kisi Ki Jaan | UA | Hindi | 2D | 01:00:00 PM | Screen 2 | 4K ATMOS | 220.00 |
| Kisi Ka Bhai Kisi Ki Jaan | UA | Hindi | 2D | 04:10:00 PM | Screen 2 | 4K ATMOS | 220.00 |
| Kisi Ka Bhai Kisi Ki Jaan | UA | Hindi | 2D | 06:20:00 PM | Screen 1 | 4K Dolby 7.1 | 250.00 |
| Kisi Ka Bhai Kisi Ki Jaan | UA | Hindi | 2D | 07:20:00 PM | Screen 2 | 4K ATMOS | 250.00 |
| Kisi Ka Bhai Kisi Ki Jaan | UA | Hindi | 2D | 10:30:00 PM | Screen 2 | 4K ATMOS | 200.00 |
| Tu Jhoothi Main Makkaar | UA | Hindi | 2D | 01:15:00 PM | Screen 1 | 4K Dolby 7.1 | 220.00 |
