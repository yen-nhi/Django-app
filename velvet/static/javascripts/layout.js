document.addEventListener('DOMContentLoaded', () =>{
    const w = updateWindowSize();
    width_display(w);

    const cart = document.querySelector('#cart-badge');
    fetch("/api/load_cart")
        .then(response => response.json())
        .then(data =>{
            console.log('load_cart:', data)
            const badge = data.length; 
            cart.innerHTML = badge;
            if (badge <= 0){
                cart.style.display = 'none';
            }else{
                cart.style.display = 'block';
            } 
        });
    
    fetch("/api/is_anonymous_user").then(response => response.json())
        .then(result =>{
            if (result === 'true'){
                document.querySelector('#cart').onclick = () =>{
                    window.location = "/anonymous_cart";
                };      
            }else{
                document.querySelector('#cart').onclick = () =>{
                    window.location = "/profile";
                };
            }
        })  
        
    window.onresize = () =>{
        const w = updateWindowSize();
        width_display(w);
    }
})        
    

function updateWindowSize() {
    if (document.body && document.body.offsetWidth) {
      width = document.body.offsetWidth;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
       width = document.documentElement.offsetWidth;
    }
    if (window.innerWidth) {
       width = window.innerWidth;
    }
    return width;
}

function width_display(w){
    if(w <= 1100){
        document.querySelector('#dropdown-menu').style.display = "block";
        document.querySelectorAll('.normal-menu').forEach((element) =>{
            element.style.display = 'none';
        });
        if(document.querySelector('#categories') != null){
            document.querySelector('#categories').querySelectorAll('li:not(#search)').forEach((li) =>{
                li.style.display = 'none';});    
        }
    }else{
        document.querySelector('#dropdown-menu').style.display = "none";
        document.querySelectorAll('.normal-menu').forEach((element) =>{
            element.style.display = 'inline';
        });
        if(document.querySelector('#categories') != null){
            document.querySelector('#categories').querySelectorAll('li:not(#search)').forEach((li) =>{
                li.style.display = 'inline';});    
        }
    }   
}