export interface IFilms {
    count:    number;
    next:     null;
    previous: null;
    results:  IFilmsResult[];
}

export interface IFilmsResult {
    title:         string;
    episode_id:    number;
    opening_crawl: string;
    director:      string;
    producer:      string;
    release_date:  Date;
    characters:    string[];
    planets:       string[];
    starships:     string[];
    vehicles:      string[];
    species:       string[];
    created:       Date;
    edited:        Date;
    url:           string;
}
