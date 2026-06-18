const cards = document.querySelectorAll(".card");


cards.forEach(card => {
  card.addEventListener("click", function() {
    card.classList.toggle("active");
   

cards.forEach(otherCard => {


if(otherCard !==this){

otherCard.classList.remove("active")


}


})


  });
}); 



