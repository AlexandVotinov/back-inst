let PIZZAS, TAGS, ORDER = [];

const $BUTTON_TAGS = document.getElementById('button-tags-box');
const $BUTTONS     = document.querySelectorAll('.button button');
const $CARD_BOX    = document.querySelector('.menu-card');
const $CARD        = document.querySelector('.card');

const $MAIN_BOX    = document.querySelector('.main');

const $CART_TOTAL    = document.querySelector('.menu-item .menu-button');
const $CART_QUANTITY = document.querySelector('.menu-item .description');

const $MODAL_CARD_MAIN = document.querySelector('.modal-cart_main');
const $MODAL_CARD_ITEM = document.querySelector('.modal-cart_main_card');
const $MODAL_ORDER     = document.querySelector('.modal-cart_order__form');

let selectCategory = 'all';
jQuery(($) => {
    $(document).on('click', '.size-select', function () {
        $(this).prev().prop('checked', true);
        setQuantity($(this).parent().parent()[0]);
    });
    
    $(document).on('click', '.card-cart__button', function () {
        addToCart($(this).parent().parent()[0]);
        alert('Пицца добавлена в корзину');
        getPizzasList(selectCategory);
    });
    
    $(document).on('click', '.menu-item .menu-button', function () {
        if(ORDER.length > 0){
            $('#modal-box').css('display', 'flex');
        }
    });
    
    $(document).on('click', '.button-tag_item', function () {
            let data = $(this).attr('data');
            selectCategory = data;
            getPizzasList(data);
    });
    
    $(document).on('click', '.modal-cart_header__close', function () {
        $('#modal-box').css('display', 'none');
    });
    
    $(document).on('click', '.modal-cart_main_card__delete', function () {
        ORDER.splice($(this).parent().parent().attr('data-id'), 1);
        setCart()
    });
    
    $(document).on('click', '#submit-order', function (e) {
        e.preventDefault();
        console.log(ORDER);
        $.post("panel/orders", {
            name    : $MODAL_ORDER.querySelector('.modal-card_order__left input[name=name]').value,
            phone   : $MODAL_ORDER.querySelector('.modal-card_order__left input[name=phone]').value,
            email   : $MODAL_ORDER.querySelector('.modal-card_order__left input[name=email]').value,
            address : $MODAL_ORDER.querySelector('.modal-card_order__left input[name=address]').value,
            order   : ORDER,
            comment : $MODAL_ORDER.querySelector('.modal-card_order__right textarea').value,
        })
        .done(function(data) {
            if(data == 'ok'){
                alert('Ваш заказ принят')
                ORDER = [];
                $('#modal-box').css('display', 'none');
                setCart();
            }
        });
    });
    
    
    
    
    $.post("test.cgi", { name: "John", time: "2pm" })
    .done(function(data) {
      alert("Data Loaded: " + data);
    });
    
    
    $(document).on('click', '.input-number__minus', function () {
        let total = $(this).next();
        if (total.val() > 1) {
            total.val(+total.val() - 1);
            setQuantity($(this).parent().parent().parent()[0]);
        }
    });
    $(document).on('click', '.input-number__plus', function () {
        let total = $(this).prev();
        total.val(+total.val() + 1);
        setQuantity($(this).parent().parent().parent()[0]);
    });
    document.querySelectorAll('.input-number__input').forEach(function (el) {
        el.addEventListener('input', function () {
            this.value = this.value.replace(/[^\d]/g, '');
        });
    });
});





function addToCart(el){
    let total   = el.querySelector('.card-cart__price').innerHTML;
    let val     = el.querySelector('.input-number__input').value;
    let name    = el.querySelector('.card__name').innerHTML;
    let imgName = el.querySelector('.card__img img').getAttribute('src');
    let id      = el.getAttribute('data-id');
    let _id     = el.getAttribute('data-card-id');
    let size    = el.querySelector(`input[name=size${id}]:checked`).value;
    
    let result = {
        id       : _id,
        quantity : +val,
        size     : +size,
        total    : +total,
        name     : name,
        pizza    : _id,
        imgName  : imgName
    }
    
    ORDER.push(result);
    setCart();   
}






function setQuantity(el){
    let total = el.querySelector('.card-cart__price');
    let val   = el.querySelector('.input-number__input').value;
    let id    = el.getAttribute('data-id');
    let size  = el.querySelector(`input[name=size${id}]:checked`).value;
    let price = el.getAttribute('data-card-priceFor' + size);
    
    total.innerHTML = val * price;
}





function setCart(){
    let total = 0;
    let quantity = 0;
    $MODAL_CARD_MAIN.innerHTML = '';
    for(let i = 0; i < ORDER.length; i++){
        total += ORDER[i].total;
        quantity += +ORDER[i].quantity;
        
        let item = $MODAL_CARD_ITEM.cloneNode(true);
        item.style.display = 'grid';
        item.setAttribute('data-id', i);
        item.querySelector('.modal-cart_main_card__logo img').setAttribute('src', ORDER[i].imgName);
        item.querySelector('.modal-cart_main_card__name').innerHTML = ORDER[i].name;
        item.querySelector('.modal-cart_main_card__size').innerHTML = ORDER[i].size + ' см.';
        item.querySelector('.modal-cart_main_card__quantity').innerHTML = ORDER[i].quantity + ' шт.';
        item.querySelector('.modal-cart_main_card__total').innerHTML = ORDER[i].total + ' р.';
        
        $MODAL_CARD_MAIN.append(item);
        
    }
    document.querySelector('.modal-card_order__left .total').innerHTML = `${total} р.`
    $CART_TOTAL.innerHTML = total + ' р.';
    $CART_QUANTITY.innerHTML = quantity + ' шт.';
}






async function getResponse(){
    let response = await fetch('/panel/api/get/tags');
    if (response.ok) {
        TAGS = await response.json();
        setButton(TAGS);
        getPizzasList(selectCategory);
    }
}



getResponse();

function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

async function getPizzasList(data){
    let response = await fetch('/panel/api/get/pizzas/' + data);
    if(response.ok){
        let pizzas = await response.json();
        setPizzasList(pizzas);
    }else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function setMainPizza(obj){
    $MAIN_BOX.querySelector('.main__pizza .heading').innerHTML = obj.name;
    $MAIN_BOX.querySelector('.main__pizza .description').innerHTML = obj.ingredients;
    $MAIN_BOX.querySelector('.main__image img').setAttribute('src', `img/pizza/${obj.imgName}`);
}

function setPizzasList(pizzas){
    $CARD_BOX.innerHTML = '';
    setMainPizza(pizzas[getRandomInt(pizzas.length)])
    for(let i = 0; i < pizzas.length; i++){
        let div = $CARD.cloneNode(true);
        div.style.display = 'block';
        div.setAttribute('data-card-id', pizzas[i]._id);
        div.setAttribute('data-card-priceFor30', pizzas[i].priceFor30);
        div.setAttribute('data-card-priceFor40', pizzas[i].priceFor40);
        div.setAttribute('data-id', pizzas[i].id);
        div.querySelector('.card__img img').setAttribute('src', `img/pizza/${pizzas[i].imgName}`);
        div.querySelector('.card__img img').setAttribute('alt', pizzas[i].name);
        div.querySelector('.card__name').innerHTML = pizzas[i].name;
        div.querySelector('.card__description').innerHTML = pizzas[i].ingredients;
        div.querySelector('.card-cart__price').innerHTML = `${pizzas[i].priceFor30}`;
        div.querySelector('.card__size').innerHTML = `<input type="radio" id="${pizzas[i].id}" name="size${pizzas[i].id}" value="30"  checked="checked">`+
                                                     `<label class="size-select" for="${pizzas[i].id}" data-size="30">30 см</label>`+
                                                     `<input type="radio" id="${pizzas[i].id+100}" name="size${pizzas[i].id}" value="40">`+
                                                     `<label class="size-select" for="${pizzas[i].id+100}" data-size="40">40 см</label></div>`;
        $CARD_BOX.append(div);
    }   
    $itemBasket = document.querySelectorAll('.card');
}


function setButton(tags){
    for(let i = 0; i < tags.length; i++){
        let button = document.createElement('button');
        button.className = 'button-tag_item';
        button.innerHTML = tags[i].name;
        button.setAttribute('data', tags[i].name)
        $BUTTON_TAGS.append(button);
    }
}






                    