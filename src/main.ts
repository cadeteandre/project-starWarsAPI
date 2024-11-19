import { ICharacters, ICharactersResult } from './interfaces/ICharacters';
import { IFilms, IFilmsResult } from './interfaces/IFilms';
import { IPlanets, IPlanetsResult } from './interfaces/IPlanets';
import './style.css'

//* -------------------- Saving endpoints --------------------
const BASE_URL = 'https://swapi.dev/api/';

//* -------------------- Selecting HTML elements --------------------
const buttons = document.querySelectorAll('.show__data') as NodeListOf<HTMLButtonElement>;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const searchSelect = document.querySelector('#searchSelect') as HTMLSelectElement;
const showResults = document.querySelector('#showResults') as HTMLDivElement;
const searchBtn = document.querySelector('#searchBtn') as HTMLButtonElement;

//* -------------------- Declaring functions --------------------

//| -------------------- Fetch requests --------------------
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

async function fetchFilmCharacters(locationCharacters: string[]): Promise<string> {
  const allCharactersName: string[] = [];
  for(const character of locationCharacters) {
    try {
      const response = await fetch(character);
      const data: ICharactersResult = await response.json();
      allCharactersName.push(data.name);
    } catch(error) {
      console.error(error);
    }
  }

  return allCharactersName.join(', ');
}

async function fetchPlanetResidents(locationResidents: string[]): Promise<string> {
  const allResidents: string[] = [];
  for(const character of locationResidents) {
    try {
      const response = await fetch(character);
      const data: ICharactersResult = await response.json();
      allResidents.push(data.name);
    } catch(error) {
      console.error(error);
    }
  }

  return allResidents.join(', ');
}

//| -------------------- Display data --------------------
async function displayFilms(data: IFilmsResult): Promise<string> {
    const characters = await fetchFilmCharacters(data.characters)
    const resultAsString = `
        <p>Star Wars: ${data.title}</p>
        <p>Episode: ${data.episode_id}</p>
        <p>Director: ${data.director}</p>
        <p>Producer: ${data.producer}</p>
        <p>Release Date: ${data.release_date}</p>
        <p>Characters: ${characters}</p>
    `;
    return resultAsString;
}

async function displayCharacters(data: Promise<ICharactersResult[]>): Promise <void> {
  (await data).forEach(async (character: ICharactersResult) => {
    const characterContainer = document.createElement('div') as HTMLDivElement;
    characterContainer.classList.add('container');
    characterContainer.innerHTML = `
        <p>Name: ${character.name}</p>
        <p>Height: ${character.height} cm</p>
        <p>Mass: ${character.mass} Kg</p>
        <p>Birth Year: ${character.birth_year}</p>
        <p>Gender: ${character.gender}</p>
        <p>Homeworld: ${await fetchHomeworld(character.homeworld)}</p>
    `;
    showResults.appendChild(characterContainer);
  })
}

async function fetchHomeworld(url: string): Promise<string> {
  const response = await fetch(url);
  const data: any = await response.json();
  console.log(data);
  return data.name;
}

async function displayPlanets(data: IPlanetsResult): Promise <string> {
  const residents = await fetchPlanetResidents(data.residents);
  const resultAsString = `
      <p>Name: ${data.name}</p>
      <p>Population: ${data.population}</p>
      <p>Climate: ${data.climate}</p>
      <p>Gravity: ${data.gravity}</p>
      <p>Rotation Period: ${data.rotation_period}</p>
      <p>Orbital Period: ${data.orbital_period}</p>
      <p>Residents: ${residents.length === 0 ? 'unknown' : residents}</p>
  `;
  return resultAsString;
}

//* -------------------- Events --------------------
buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    showResults.innerHTML = '';
    switch(button.value) {
      //| -------------------- Fetch and Display Films --------------------
      case 'films':
        try {
          const response = await fetch(`${BASE_URL}${button.value}`);
          const data = await response.json() as IFilms;

          await Promise.all(data.results.map(async (result: IFilmsResult) => {
            const filmContainer = document.createElement('div') as HTMLDivElement;
            filmContainer.classList.add('container');
            filmContainer.innerHTML = await displayFilms(result);
            showResults.appendChild(filmContainer);
          }))
        } catch(error) {
          console.error(error);
        }
        break;
        //| -------------------- Fetch and Display Characters --------------------
      case 'people':
        try {
          (await displayCharacters(fetchCharacters(`${BASE_URL}${button.value}`)));
        } catch(error) {
          console.error(error);
        }
        break;
        //| -------------------- Fetch and Display Planets --------------------
      case 'planets':
        try {
          const response = await fetch(`${BASE_URL}${button.value}`);
          const planets: IPlanets = await response.json();
          let pagesCount: number = 1;
          const allPlanets: IPlanetsResult[] = [];
        
          do {
            const response = await fetch(`${BASE_URL}${button.value}/?page=${pagesCount}`);
            const data: IPlanets = await response.json();
            data.results.forEach((planet) => allPlanets.push(planet));
            pagesCount++;
          } while(pagesCount <= Math.ceil(planets.count / 10));

          await Promise.all(allPlanets.map(async (result: IPlanetsResult) => {
            const container = document.createElement('div') as HTMLDivElement;
            container.classList.add('container');
            container.innerHTML = await displayPlanets(result);
            showResults.appendChild(container);
          }))
        } catch(error) {
          console.error(error);
        }
        break;
    }
    searchInput.value = '';
  })
})
//| -------------------- Search Data --------------------
searchBtn.addEventListener('click', async () => {
  showResults.innerHTML = '';

  const response = await fetch(`${BASE_URL}${searchSelect.value}/?search=${searchInput.value}`);
  const data: any = await response.json();
  console.log(data.results);
  

  switch(searchSelect.value) {
    case 'films':
      data as IFilmsResult[];
      data.results.forEach(async (film: IFilmsResult) => {
        const filmContainer = document.createElement('div') as HTMLDivElement;
        filmContainer.classList.add('container');
        filmContainer.innerHTML = await displayFilms(film);
        showResults.appendChild(filmContainer);
      })
      break;
    case 'people':
      data as ICharactersResult[];
      data.results.forEach(async (character: ICharactersResult) => {
        const characterContainer = document.createElement('div') as HTMLDivElement;
        characterContainer.classList.add('container');
        characterContainer.innerHTML = `
            <p>Name: ${character.name}</p>
            <p>Height: ${character.height} cm</p>character
            <p>Mass: ${character.mass} Kg</p>
            <p>Birth Year: ${character.birth_year}</p>
            <p>Gender: ${character.gender}</p>
            <p>Homeworld: ${await fetchHomeworld(character.homeworld)}</p>
        `;
        showResults.appendChild(characterContainer);
      })
      break;
    case 'planets':
      data as IPlanetsResult[];
      data.results.forEach(async (planet: IPlanetsResult) => {
        const container = document.createElement('div') as HTMLDivElement;
        container.classList.add('container');
        container.innerHTML = await displayPlanets(planet);
        showResults.appendChild(container);
      })
      break;
  }
  searchInput.value = '';
})
