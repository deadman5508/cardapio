const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModal = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//abrir o carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})
//fechar o carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})
closeModal.addEventListener("click", function(){
    cartModal.style.display = "none"
})
menu.addEventListener("click", function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)
        //add ao carrinho.
    
    }

})
//funcao para add ao carrinho
function addToCart(name,price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //se o item existe aumenta +1
        existingItem.quantity +=1;
    }
        else{
            cart.push({
                name,
                price,
                quantity:1,
            })
        }
    updateCartModal()
    
}

//atualiza carrinho visualmente
function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item =>{
        const cartItemElemente = document.createElement("div");
        cartItemElemente.classList.add("flex","justify-betweeen", "mb-4","flex-col")


        cartItemElemente.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
                <button class="remove-btn font-medium bg-red-500 rounded px-1 text-white" data-name="${item.name}" >
                    Remover
                </button>
        </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElemente)
    })
    cartTotal.textContent=total.toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });
    cartCounter.innerHTML=cart.length;
}
//funçao para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quantity > 1){
            item.quantity -=1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();

    }

}
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    //
    if(inputValue !==""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
//finalizar pedido
checkoutBtn.addEventListener("click",function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, restaurante está fechado.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value ===""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar para o whatssap
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade:(${item.quantity}) Preço:R$ ${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "7999323146"

    window.open(`https://wa.me/${phone}?text= Olá! eu gostaria de: ${message} Endereço:${addressInput.value}`,"_blank")
    cart=[];
    updateCartModal();

})
// verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 12 && hora <22; //true restaruante aberto
}
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}
else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}