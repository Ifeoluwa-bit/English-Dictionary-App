//getting all required element
const container = document.querySelector(".container"),
synonyms = document.querySelector(".synonyms .list"),
searchInput = document.querySelector("input"),
infoText = document.querySelector(".info-text"),
volumeIcon = container.querySelector(".word i"),
removeIcon = container.querySelector(".search-box span");
let audio;

//data function
function data(result, word){
    if(result.title){ //if api returns message of can't find word
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span> Please, try to search for another word`;
    } else{
        console.log(result);
        container.classList.add('active');
        let definitions = result[0].meanings[0].definitions[0],
        definite = result[0].meanings[0],
       
        phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;


        // let's pass the particular response data to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio); //creating a new audio objet and passing audio src
       
        if(definitions.example == undefined){
            document.querySelector(".example span").parentElement.style.display = "none";
        }else{
            document.querySelector(".example span").parentElement.style.display = "block";
        }

        if(definite.synonyms[0] == undefined){ // if there is  no synonyms then hide the synonym div
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) { //getting only 5 synonyms out of many
                let tag = ` <span onclick=search('${definite.synonyms[i]}')>${definite.synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag); //passing all 5 synonyms  inside synonyms div
            }
        }
    }
}

//search synonyms function
function search(word){
    searchInput.value = word;
    fetchApi(word);
}

//fetch api function
function fetchApi(word){
    container.classList.remove('active');
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    //fetching api response and returning it with parsing into js obj and in another then
    // method calling data function with passing api response and searched word as an argument
    fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener('keyup', e =>{
    if(e.key === "Enter" && e.target.value){
        fetchApi(e.target.value);
    }
    
});

volumeIcon.addEventListener('click', ()=>{
    audio.play(); 
});

removeIcon.addEventListener('click', ()=>{
    searchInput.value = ""; 
    searchInput.focus();
    container.classList.add('active');
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = "Type a word and press enter to get meaning, example, pronounciation and synonyms of the typed word";
});