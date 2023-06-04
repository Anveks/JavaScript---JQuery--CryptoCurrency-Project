const sliders = Array.from(document.querySelectorAll('.nav-link')); // here we target all the hyperlinks.

const slider = (index) => {
  const container = document.querySelector('.global_container'); // we find the div-container we need.
  const width = container.children[index].clientWidth; // we check max width of all child-elements of the container.
  container.scroll({ // we use .scroll method to create a vertical scroll.
    top: 0,
    left: width * index,
    behavior: "smooth",
  })
  index == 1 || index == 2 ?  container.classList.add('max_height') : container.classList.remove('max_height'); // we fix the empty space at the bottom of 2nd and 3d child-elements by adding a class .max_height, then we define its max-height in CSS.
};

const getData = async () => {
  const storage = JSON.parse(localStorage.getItem("selectedElements")); 
  const data = await JSON.parse(document.querySelector('#dataAjax').value);
  // we get both the storage data and the ajax data and transfer it to the selectedCoins script:
  displayChart(data, storage);
  // here we set an interval that updates the ajax data every 10 seconds:
  setInterval(() => {
    getDataAjax(storage);
  },10000)
};

sliders.map((item, index) => item.addEventListener('click', () => {
  slider(index); // each item is a hyperlink, we add the slider function that gets their index as an arguement.
  getData();
}));



