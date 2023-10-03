let counter = 0;

document.addEventListener('DOMContentLoaded', () =>{
    load_posts(type);
    window.onscroll = ()=>{
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
          load_posts(type);
        }
    };    
})

function load_posts(type){
    const start = counter;
    const end = start + 9;
    counter += 10;
    fetch(`/api/posts/${type}?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
      if (type === 'important'){
          data.forEach(build_post);
      }else{
        data.forEach(build_article);
      }
        
    })
}

function build_post(post){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="card-body">
                        <h5 class="card-title"><a href="/post/${post.id}">${post.title}</a></h5>
                        <p class="card-text" class="bottom"><small>${post.time}</small></p>
                      </div>`;
    document.querySelector('#posts').append(card);
}

function build_article(post){
    const card = document.createElement('div');
    card.className = 'post';
    card.innerHTML = `<a href="/post/${post.id}">
    <div style="padding: 20px">
      <span><img class="avatar" src="${post.avatar}" alt="..." width="100%"><span
      <span style="font-weight: bold">${ post.username }</span>
    </div >
    <div class="post-body">${ post.body.slice(0,200) }...</div>
  </a>`;
  document.querySelector('#articles').append(card);
}