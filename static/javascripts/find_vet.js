document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#city').onchange = () => {
        const city_id = document.querySelector('#city').value;
        load_districts_select(city_id);
    };

    document.querySelector('#search-vet').onclick = () =>{
        const city = city_selected.replace(" ", "+");
        const district = document.querySelector('#district').value.replace(" ", "+");
        console.log('city:', city, 'district', district);
        document.querySelector('#vet-map').src = `https://www.google.com/maps/embed/v1/search?key=AIzaSyB3yfXvfce5AruLbVQuFtFTuVG-P74446Y&q=vet+in+${district}+${city}+Vietnam`
    };
});

var city_selected = null;

function load_districts_select(city_id){
    document.querySelector('#district').innerHTML = "<option selected>Select District</option>";
    fetch(`api/load_districts/${city_id}`)
    .then(response => response.json())
    .then(result => {
        city_selected = result['city'];
        result['districts'].forEach((district) => {
            const option = document.createElement('option');
            option.innerHTML = district;
            document.querySelector('#district').append(option);
        })
    });
}