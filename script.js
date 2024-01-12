const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");


//API Key, SearchTerm and Pagination variables.
const apikey = "0IBgIrIaNVp8HfbgIukHpeJqs2y93RRiYWNeaANEH3OMBzEBg5JHremc";
const per_page = 15;
let currentPage = 1;
let searchTerm = null;

//close navbar
const closeNavbar = () => {
  const nav = document.getElementById("nav");
  nav.style.top = "-700%";
}

//toggles navbar
const toggleNavbar = () => {
  const nav = document.getElementById("nav");
  nav.style.top = "65%";
}

//html for images card
const generateHTML = (images) => {
  imagesWrapper.innerHTML += images.map(img =>

    `<li class="cardImage" onclick="showLightBox('${img.src.large2x}','${img.photographer}')">
        <img src=${img.src.large2x} alt="">
        <div class="details">
            <div class="photographer">
               <i class="uil uil-camera"></i>
               <span>${img.photographer}</span>
            </div>
          <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
            <i class="uil uil-import"></i>
          </button>
        </div>
      </li>`
  ).join("")
}

//fetch images
const getImages = (apiURL) => {
  //Fetching images by API call with Authorization header
  loadMoreBtn.innerHTML = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apikey }
  }).then(res => res.json()).then(data => {
    // console.log(data);
    generateHTML(data.photos);
    loadMoreBtn.innerHTML = "Load More";
    loadMoreBtn.classList.remove("disabled");
  }).catch(() => {
    alert("Failed to load images!");
  })
}

//download images
const downloadImg = (imgURL) => {
  
  //Converting received img to blob, creating its download link & downloading it.
  //console.log(imgURL);

  fetch(imgURL).then(res => res.blob()).then(file => {
    //console.log(file);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();

  }).catch(() => {
    alert("Failed to download Image!")
  })
}

//show light box
const showLightBox = (img, name) => {
  //showing lightbox and setting image source and name and button attributes.
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

//Hide lightbox
const HideLightbox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

//Load more images by load more button
const loadMoreImages = () => {
  currentPage++;//Increment current page by 1.
  //If searchTerm has some value then call API with search term else call default API
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${per_page}`;
  apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}?page=${currentPage}&per_page=${per_page}` : apiURL;
  getImages(apiURL);
}

//Search on typing on search bar 
const loadSearchImages = (e) => {
  //If the search input is empty,set the search term to null and return from here.
  if (e.target.value === "") {
    return searchTerm = null;
  }
  if (e.key === "Enter") {
    //If pressed key is enter,update the current page, search term and call the getImages 
    // console.log("Enter key pressed.");
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}?page=${currentPage}&per_page=${per_page}`);
  }
}




getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${per_page}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", HideLightbox);
downloadImgBtn.addEventListener("click", (e) => {
  downloadImg(e.target.dataset.img);
});



