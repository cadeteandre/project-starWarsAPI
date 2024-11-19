import { ICharacters, ICharactersResult } from './interfaces/ICharacters';
import { IFilms } from './interfaces/IFilms';
import { IPlanets, IPlanetsResult } from './interfaces/IPlanets';
import './style.css'

//* -------------------- Saving endpoints --------------------
const BASE_URL = 'https://swapi.dev/api/';
// const PEOPLE_URL = `${BASE_URL}people`;
// const PLANETS_URL = `${BASE_URL}planets`;
// const FILMS_URL = `${BASE_URL}films`;

//* -------------------- Selecting HTML elements --------------------
const buttons = document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const searchSelect = document.querySelector('#searchSelect') as HTMLSelectElement;
const showResults = document.querySelector('#showResults') as HTMLDivElement;

//* -------------------- Declaring functions --------------------
//| -------------------- Fetch requests --------------------
async function fetchFilms(url: string): Promise<string[]> {
  const response = await fetch(url);
  const films: IFilms = await response.json();
  return films.results.map((film) => film.title);
}

async function fetchCharacters(url: string): Promise<ICharactersResult[]> {
  const response = await fetch(url);
  const characters: ICharacters = await response.json();
  let pagesCount: number = 1;
  const allCharacters: ICharactersResult[] = [];

  do {
    const response = await fetch(`${url}/?page=${pagesCount}`);
    const data: ICharacters = await response.json();
    data.results.forEach((character) => allCharacters.push(character));
    pagesCount++;
  } while(pagesCount <= Math.ceil(characters.count / 10));

  return allCharacters;
}

async function fetchPlanets(url: string): Promise<IPlanetsResult[]> {
  const response = await fetch(url);
  const planets: IPlanets = await response.json();
  let pagesCount: number = 1;
  const allPlanets: IPlanetsResult[] = [];

  do {
    const response = await fetch(`${url}/?page=${pagesCount}`);
    const data: IPlanets = await response.json();
    data.results.forEach((planet) => allPlanets.push(planet));
    pagesCount++;
  } while(pagesCount <= Math.ceil(planets.count / 10));

  return allPlanets;
}

//* -------------------- Events --------------------
buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    switch(button.value) {
      case 'films':
        (await fetchFilms(`${BASE_URL}${button.value}`)).forEach((title) => console.log(title));
        break;
      case 'people':
        (await fetchCharacters(`${BASE_URL}${button.value}`)).forEach((character) => {
          console.log(character.name);
        });
        break;
      case 'planets':
        (await fetchPlanets(`${BASE_URL}${button.value}`)).forEach((planet) => {
          console.log(planet.name);
        });
        break;
    }
  })
})