DROP TABLE IF EXISTS times CASCADE;
CREATE TABLE times (
  id SERIAL PRIMARY KEY NOT NULL,
  event_id INTEGER REFERENCES event(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
);
