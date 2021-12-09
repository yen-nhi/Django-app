var city_selected = null;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#city').onchange = () => {
        const city_id = document.querySelector('#city').value;
        console.log('city id', city_id);
        load_districts_select(city_id);
    };

    document.querySelector('#search-vet').onclick = () =>{
        console.log('city', city_selected);
        if ( document.querySelector('#city').value == 0){
            alert('No city has been selected.');
        }else{
            const city = city_selected.replaceAll(" ", "+");
            console.log(document.querySelector('#district').value);
            if (document.querySelector('#district').value === "Select District"){
                console.log('no dist choosen');
                document.querySelector('#vet-map').src = `https://www.google.com/maps/embed/v1/search?key=AIzaSyB3yfXvfce5AruLbVQuFtFTuVG-P74446Y&q=vet+in+${city}+city+Vietnam`
            }else{
                const district = document.querySelector('#district').value.replaceAll(" ", "+");
                console.log('yes dist choosen', district);
                document.querySelector('#vet-map').src = `https://www.google.com/maps/embed/v1/search?key=AIzaSyB3yfXvfce5AruLbVQuFtFTuVG-P74446Y&q=vet+in+${district}+${city}+Vietnam`
            }
        }
    };
});


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