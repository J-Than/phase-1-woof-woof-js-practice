// Establish constants
let goodFilter = false;

// Build variables for DOM interfacing
const filterButton = document.getElementById('good-dog-filter');
const dogBar = document.getElementById('dog-bar');
const dogInfo = document.getElementById('dog-info');

// Good dog filter button handler
filterButton.addEventListener('click', e => {
  e.preventDefault();
  goodFilter = !goodFilter;
  filterButton.textContent = `Filter good dogs: ${goodFilter ? 'ON' : 'OFF'}`
  refreshDogBar();
})

// Pull down updated dog information from database and initialize rebuild of bar
function refreshDogBar() {
  fetch('http://localhost:3000/pups', {})
  .then(resp => resp.json())
  .then(json => buildDogBar(json));
}

// Build the dog bar taking filter into account
function buildDogBar(dogs) {
  dogBar.replaceChildren();
  for (dog of dogs) {
    let newDog = document.createElement('span');
    newDog.innerText = dog.name;
    newDog.id = dog.id;
    newDog.name = dog.name;
    newDog.picture = dog.image;
    newDog.good = dog.isGoodDog;
    newDog.addEventListener('click', e => showDogDetails(e));
    if (!goodFilter) {
      dogBar.appendChild(newDog);
    } else if (dog.isGoodDog) {
      dogBar.appendChild(newDog);
    }
  }
}

// Display the current dog's details
function showDogDetails(e) {
  e.preventDefault();
  dogInfo.replaceChildren();
  currentDog = e.target.id;
  let dogPic = document.createElement('img');
  dogPic.src = e.target.picture;
  let dogName = document.createElement('h2');
  dogName.textContent = e.target.name;
  let dogGood = document.createElement('button');
  dogGood.textContent = `${e.target.good ? 'Good' : 'Bad'} Dog!`;
  dogGood.identifier = e.target.id;
  dogGood.state = e.target.good;
  dogGood.addEventListener('click', e => updateGoodDog(e));
  dogInfo.appendChild(dogPic);
  dogInfo.appendChild(dogName);
  dogInfo.appendChild(dogGood);
}

// Change dog status from good to bad or vice versa
function updateGoodDog(e) {
  e.target.state = !e.target.state;
  e.target.textContent = `${e.target.state ? 'Good' : 'Bad'} Dog!`;
  fetch(`http://localhost:3000/pups/${e.target.identifier}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      isGoodDog: e.target.state
    }),
  })
}

// Initialize page
refreshDogBar();