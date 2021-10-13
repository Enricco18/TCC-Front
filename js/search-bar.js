let searchMenuOpen = false;
const icon = document.getElementById("search-button");
const submit = document.getElementById("search-submit");
const searchBar = document.getElementById("search-menu")

icon.onclick = openSearchBar;
submit.onclick= closeSearchBar;

function openSearchBar(){
    searchMenuOpen = !searchMenuOpen
    searchBar.style.left =  "0";
}

function closeSearchBar(){
    if(searchMenuOpen){
        searchBar.style.left="-150vw";
        searchMenuOpen = !searchMenuOpen;
    }
}
