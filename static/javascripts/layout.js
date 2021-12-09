document.addEventListener('DOMContentLoaded', () =>{
    CKEDITOR.editorConfig = function( config ) {
        config.removePlugins = 'cloudservices';     
        config.removePlugins = 'exportpdf'; 
     };
     CKEDITOR.replace( 'editor', {
        extraPlugins: 'exportpdf',
        exportPdf_tokenUrlrl: '',
    } );
    
    const cart = document.querySelector('#cart-badge');
    fetch("/api/load_cart")
    .then(response => response.json())
    .then(data =>{
        const badge = data.length;
        cart.innerHTML = badge;
        if (parseInt(cart.innerHTML) <= 0){
            cart.style.display = 'none';
        }
    });

    document.querySelector('#cart').onclick = () =>{
        window.location = `/profile`;
    };

    
})