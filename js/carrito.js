
let carrito = localStorage.getItem("producto-carrito");
let productCart =  carrito && carrito !="[]" && carrito !=""?  JSON.parse(carrito): [] ;


const emptyCart = document.querySelector("#carrito-vacio");
const productsCart = document.querySelector("#productos-carrito");
const actionsCart = document.querySelector("#acciones-carrito");
const storageCart = document.querySelector("#comprar-carrito");



function controlCart(){
    carrito = localStorage.getItem("producto-carrito");
    productCart =  carrito && carrito !="[]" && carrito !=""?  JSON.parse(carrito): [] ;
    productsCart.innerHTML = " ";

    productCart.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("carrito-producto");
        div.innerHTML = 
        `
        <img class="carrito-producto__imagen"  src="${producto.imagen}" alt="${producto.titulo}">
                   <div class="carrito-producto__titulo">
                       <small>Titulo</small>
                       <h3>${producto.titulo}</h3>
                   </div>
                   <div class="carrito-producto__cantidad">
                       <small>cantidad</small>
                       <p>${producto.cantidad}</p>
                   </div>

                   <div class="carrito-producto__precio">
                       <small>Precio</small>
                       <p>$${producto.precio}</p>
                   </div>

                   <div class="carrito-producto__subtotal">
                       <small>Subtotal</small>
                       <p id="subTotal">${producto.precio * producto.cantidad}</p>
                   </div>

                   <div class="botones">
                   <button id="${producto.id}" class="aumentar">+</i></button>
                   <button id="${producto.id}" class="disminuir">-</i></button>
                   <button id="${producto.id}" class="carrito-producto__eliminar"><i class="bi bi-trash-fill"></i></button>
                   </div>
        `;
        
        productsCart.append(div);
        
        
    
    }
    );
    actualizarNumCard();   
    if(productCart.length > 0 ){
         emptyCart.classList.add("disabled");
         productsCart.classList.remove("disabled");
         actionsCart.classList.remove("disabled");
         storageCart.classList.add("disabled");
        
    

    }else{
         emptyCart.classList.remove("disabled");
         productsCart.classList.add("disabled");
         actionsCart.classList.add("disabled");
         storageCart.classList.add("disabled");
         
        
    }
    eventosBotones();
    actualizarTotal();
    
}

let total = document.querySelector("#total");
controlCart();
actualizarTotal();
function actualizarTotal(){
    let nuevoTotal = productCart.reduce((acc, producto) => acc + (producto.cantidad *producto.precio), 0);
    total.innerText = nuevoTotal;
    return nuevoTotal;
}


inicializarEventos();
function inicializarEventos(){
    btnVaciar = document.getElementById("carrito-acciones__vaciar");
    btnCompra = document.getElementById("carrito-acciones__comprar");  
    btnCompra.addEventListener("click", finalizarCompra);
    btnVaciar.addEventListener("click", vaciarCarrito);  
      
}
/* llamando libreria*/ 
function finalizarCompra(){
    let totaPago = actualizarTotal();
    let nCompra = Math.floor((Math.random() * (999999 - 100000 + 1)) + 100000);
    swal("Compra finalizada!", `Gracias por su compra! se ha pagado: ${totaPago}. \n N° orden de compra :  ${nCompra} ` , "success");
    vaciarCarrito();
}
function eventosBotones() { 
    eventoBotonesIncre = document.querySelectorAll(".aumentar");
    eventoBotonesIncre.forEach(boton => {
        boton.addEventListener("click", incrementarProducto);
    });

    eventoBotonesDis = document.querySelectorAll(".disminuir");
    eventoBotonesDis.forEach(boton => {
        boton.addEventListener("click", disminuirProducto);
    });
    
    eventoBotonesEliminar = document.querySelectorAll(".carrito-producto__eliminar");
    eventoBotonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminar);
    });

 }

function vaciarCarrito(){
    localStorage.setItem('producto-carrito', []);
   
    productCart = [];
    controlCart();    
}


    function actualizarNumCard(){
        let numeroCarrito = document.getElementById("numeroCard");
        let nuevoNumero = productCart.reduce((acc, producto) => acc + producto.cantidad, 0);
        numeroCarrito.innerHTML = nuevoNumero;

}


function incrementarProducto(eve){
    const idProducto = eve.currentTarget.id;
    const products = localStorage.getItem("producto-carrito");
    const inventario = JSON.parse(localStorage.getItem("inventario-prodcutos"));
    const indexInventario = inventario.findIndex(producto => producto.id === idProducto);
    const productosCarrito = products && products !="[]" && products !=""?  JSON.parse(products): [] ;
    const indexCarrito = productosCarrito.findIndex(producto =>producto.id === idProducto);
    const stockProducto = inventario[indexInventario].stock;
    
    if(stockProducto>0){
        productosCarrito[indexCarrito].cantidad +=1; 
        inventario[indexInventario].stock -- ;
        localStorage.setItem("producto-carrito", JSON.stringify(productosCarrito));
        localStorage.setItem("inventario-prodcutos", JSON.stringify(inventario));
        controlCart();
    }else{
        swal("Stock productos!", "Producto agotado!", "error");
    }


   
    
}

function disminuirProducto(eve){
    const idProducto = eve.currentTarget.id;
    const products = localStorage.getItem("producto-carrito");
    const inventario = JSON.parse(localStorage.getItem("inventario-prodcutos"));
    const indexInventario = inventario.findIndex(producto => producto.id === idProducto);
    const productosCarrito = products && products !="[]" && products !=""?  JSON.parse(products): [] ;
    const indexCarrito = productosCarrito.findIndex(producto =>producto.id === idProducto);
    const cantidad = productosCarrito[indexCarrito].cantidad;
  
   if(cantidad >1){
    productosCarrito[indexCarrito].cantidad -=1; 
    inventario[indexInventario].stock ++ ;
   }else{

    

    productosCarrito.splice(indexCarrito, 1);
   }
    
    localStorage.setItem("producto-carrito", JSON.stringify(productosCarrito));
    localStorage.setItem("inventario-prodcutos", JSON.stringify(inventario));
    controlCart();
 
}

    

function eliminar(eve){
    const idProducto = eve.currentTarget.id;
    const products = localStorage.getItem("producto-carrito");
    const inventario = JSON.parse(localStorage.getItem("inventario-prodcutos"));
    const indexInventario = inventario.findIndex(producto => producto.id === idProducto);
    const productosCarrito = products && products !="[]" && products !=""?  JSON.parse(products): [] ;
    const indexCarrito = productosCarrito.findIndex(producto =>producto.id === idProducto);
    const cantidad = productosCarrito[indexCarrito].cantidad;
    swal({
        title: "Esta Seguro?",
        text: "Una vez eliminado, no se recupera!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        

        if (willDelete) {  
            productosCarrito.splice(indexCarrito, 1);
            inventario[indexInventario].stock += cantidad ;
            localStorage.setItem("producto-carrito", JSON.stringify(productosCarrito));
            localStorage.setItem("inventario-prodcutos", JSON.stringify(inventario));  
            
                 
        swal("Se a eliminado el producto!", {
            icon: "success",
          });
        } else {
          swal("no se elimino el producto!");
        }
        controlCart();
      }
      
      );
      
      
   
    
}

