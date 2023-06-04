$(document).ready(() => {
  const selectedCoins = [];
  const coinContainer = $("#coinContainer");
  const search = $('#search');

  $.ajax({
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=ils&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
    success: (data) => {
      console.log(data);
      renderCoins(data) 
      document.querySelector('#dataAjax').value = JSON.stringify(data);
    },
    error: (error) => console.error(error),
  });

  async function renderCoins(coinsArray) {
   
    await coinsArray.forEach((coin) => {
      coinContainer.append(`

      <div class="card text-center">
      <div class="card-header">
        <p class='coin_symbol'>${coin.symbol}</p>

        <div class="form_check">
        <input class="switch_chek" type="checkbox" role="switch">
        <div class="round_Check"></div>
        </div>

      </div>
      <div class="card-body">

        <img src="${coin.image}">
        <h5 class="card-title">${coin.name}</h5>
     
      </div>
      <div class="card-footer text-muted">
      <button class="btn btn-info btn-primary">Details</button>

        <div class= 'info__card'>
          <p>USD: ${coin.current_price} $</p>
          <p>EUR: ${Math.floor(coin.current_price * 0.93)} €</p>
          <p>ILS: ${Math.floor(coin.current_price * 3,75 )} ₪</p>
        </div>
      </div>
    </div>

      `);
    });
    buttonEvents(coinsArray);
    checkLocalStorage(); // -> the starting point of the code
  };

  // buttons slide functions
  function buttonEvents() {
    const arrBtn = Array.from($(".btn-info"));
    $(".info__card").hide();
    arrBtn.map((item) =>
      $(item).on("click", function () {
        $(this).next().slideToggle();
      })
    );
  };

// switch animations
  function switchAnimation(item) {
    if(selectedCoins.length < 5){
      item.classList.toggle('black');
      item.querySelector('.switch_chek').checked = item.classList.contains('black') ? true : false;
      item.querySelector('.round_Check').classList.toggle('right');
    }else{
      item.classList.remove('black');
      item.querySelector('.switch_chek').checked = item.classList.contains('black') ? true : false;
      item.querySelector('.round_Check').classList.remove('right');
    }
  };
  // conditions check (to add-remove cards to-from selected array)
  function checkConditions(item, index, arrCard, selectedCoins){
    if(item.querySelector('.switch_chek').checked == true){
      selectedCoins.push(arrCard[index]);
      setLocalStorage(selectedCoins);
    }else{
      // removing a card from selected array
      deleteCard(item, selectedCoins);
    }
  };

  function deleteCard(item, selectedCoins){
    selectedCoins.map((elem, i) => elem.children[0].innerText == item.previousElementSibling.innerText 
    ? selectedCoins.splice(i,1)
    : item);
    setLocalStorage(selectedCoins);
  };

  // copying selectedCoins array to the modal window:
  function setModalCard(arr, arrCard){
    document.querySelector('.cont_clone_card').append(...arr);

    // removing unnecessary html parts of a card:
    arr.map(elem => {
      elem.querySelector('.btn').remove();
      elem.querySelector('.card-footer').remove();
    });

    arr.map((elem, i) => elem.querySelector('.form_check').addEventListener('click', () => {
      switchAnimation(elem.querySelector('.form_check'));
      const str = elem.querySelector('p').innerText;

      arrCard.map(item => item.querySelector('p').innerText == str ? [switchAnimation(item.querySelector('.form_check')), deleteCard(item.querySelector('.form_check'), selectedCoins)]
      : item);

      // removing the html of a card from modalWindow with timeout:
      setTimeout(() => {
        elem.remove();
      },800);
    }))
  }

  const coinEvents =(item, index, arrCard) => {
       // calling the animation:
       switchAnimation(item);
       // calling the conditions check:
       checkConditions(item, index, arrCard, selectedCoins);

       // adding no more than 5 coins check:
       if (selectedCoins.length < 5) {
           $("#modal").addClass("hidden");
           $(".overlay").addClass("hidden");
       } else if(selectedCoins.length == 5) {
        // cloning the selected array to transfer it to the modalWindow:
            const cloneArr = selectedCoins.map(item => item.cloneNode(true));
            setModalCard(cloneArr, arrCard);
           $("#modal").removeClass("hidden");
           $(".overlay").removeClass("hidden");        
         };
  };

  // adding selected coins:
  function addSelectedCoins() {
    const arrCard = Array.from(document.querySelectorAll(".card"));
    const switchBlock = Array.from($(".form_check"));
    switchBlock.map((item, index) =>
      item.addEventListener("click", () => {
        coinEvents(item, index, arrCard);
     })
    );
  };

  // close modal window button:
  const closeModal = document.querySelector(".close-modal");
  closeModal.addEventListener('click', () => {
    $(".modal").addClass("hidden");
    $(".overlay").addClass("hidden");
    document.querySelector(".cont_clone_card").innerHTML = '';
  });

  // search bar functionality:
  search.on('input', (e) => {
      const value = e.target.value;
      const arrCard = Array.from($(".card"));
      arrCard.map((card) => {
        const p = $(card).find(".coin_symbol").text();
        const h5 = $(card).find("h5").text();
        const isVisible = h5.includes(value) || p.includes(value) || h5.toLocaleLowerCase().includes(value);
        $(card).toggleClass("hidden", !isVisible);
      });
    });

// LOCAL STORAGE
//  setting the local storage:
 function setLocalStorage(arr){
  arr = arr.map(item => item.querySelector('p').innerHTML);
  localStorage.clear();
  localStorage.setItem("selectedElements",JSON.stringify(arr));
 };
 
//  getting the local storage:
function  getLocalStorage(storage){
  const arrCard = Array.from(document.querySelectorAll('.card'));
  arrCard.map((item, index) => storage.includes(item.querySelector('p').innerText) ? coinEvents(item.querySelector('.form_check'), index, arrCard) : item);
};

// checking localStorage data:
 function checkLocalStorage(){
  const storage = JSON.parse(localStorage.getItem("selectedElements")); 
  if(storage == null || storage.length == 0){
   addSelectedCoins();
  } else {
    addSelectedCoins();
    return getLocalStorage(storage);
  }
 }
});
