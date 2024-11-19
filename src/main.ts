import { ICharacters, ICharactersResult } from './interfaces/ICharacters';
import { IFilms, IFilmsResult } from './interfaces/IFilms';
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
async function fetchFilms(url: string): Promise<IFilmsResult[]> {
  const response = await fetch(url);
  const films: IFilms = await response.json();
  return films.results.map((film) => film);
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

//| -------------------- Display data --------------------
async function displayFilms(data: Promise<IFilmsResult[]>): Promise<void> {
  const filmsContainer = document.createElement('div') as HTMLDivElement;
  const ulElement = document.createElement('ul') as HTMLUListElement;

  (await data).forEach((film: IFilmsResult) => {
    const liElement = document.createElement('li') as HTMLLIElement;
    liElement.textContent = `Star Wars: ${film.title}`;
    ulElement.appendChild(liElement);
  })

  filmsContainer.appendChild(ulElement);
  showResults.appendChild(filmsContainer);
}

async function displayCharacters(data: Promise<ICharactersResult[]>): Promise <void> {
  const characterContainer = document.createElement('div') as HTMLDivElement;
  const ulElement = document.createElement('ul') as HTMLUListElement;

  (await data).forEach((character: ICharactersResult) => {
    const liElement = document.createElement('li') as HTMLLIElement;
    liElement.textContent = `${character.name}`;
    ulElement.appendChild(liElement);
  })

  characterContainer.appendChild(ulElement);
  showResults.appendChild(characterContainer);
}
async function displayPlanets(data: Promise<IPlanetsResult[]>): Promise <void> {
  const planetsContainer = document.createElement('div') as HTMLDivElement;
  const ulElement = document.createElement('ul') as HTMLUListElement;

  (await data).forEach((planet: IPlanetsResult) => {
    const liElement = document.createElement('li') as HTMLLIElement;
    liElement.textContent = `${planet.name}`;
    ulElement.appendChild(liElement);
  })

  planetsContainer.appendChild(ulElement);
  showResults.appendChild(planetsContainer);
}

//* -------------------- Events --------------------
buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    switch(button.value) {
      case 'films':
        (await displayFilms(fetchFilms(`${BASE_URL}${button.value}`)));
        break;
      case 'people':
        (await displayCharacters(fetchCharacters(`${BASE_URL}${button.value}`)));
        break;
      case 'planets':
        (await displayPlanets(fetchPlanets(`${BASE_URL}${button.value}`)));
        break;
    }
  })
})