let open = false;

function menu(){
    let menu = document.getElementById("menu-box");
    if(open){
        menu.style.left =  "-105vw";
        open = !open
        return
    }
    open = !open
    menu.style.left =  "0";
}