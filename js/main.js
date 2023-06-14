
Productos = [];
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let eventoBotones = document.querySelectorAll(".producto-agregar");
const numeroCard = document.querySelector("#numeroCard");
const stock = document.querySelector("#producto-stock");

async function iniciar(){
    

    const response = await fetch('./js/productos.json');
    const data = await response.json();
    Productos = data; 
    //Cargar data de productos en Local Storage
    cargaPrductos();
    //Muestra productos (Local storage) 
    mostrarProductos( JSON.parse(localStorage.getItem("inventario-prodcutos")) );
}


iniciar();


function mostrarProductos(productoElegido){
    contenedorProductos.innerHTML =" ";
    productoElegido.map(producto =>{ 
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = 
    `<img class="producto-imagen"  src="${producto.imagen}" alt="${producto.titulo}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <p id="producto-stock" class="producto-stock">${producto.stock} Unidades</p>
                    <button class="producto-agregar" id = "${producto.id}">Agregar</button>
                </div>
    `;
    contenedorProductos.append(div);
})
eventosBotones();
}



botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e)=>{
        const productos =  JSON.parse(localStorage.getItem("inventario-prodcutos"));
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        if(e.currentTarget.id !=="todos"){
            const productoCategoria = productos.find(producto =>producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerHTML =productoCategoria.categoria.nombre;
            const productosElegidos = productos.filter(producto =>producto.categoria.id ===e.currentTarget.id)
            mostrarProductos(productosElegidos);
        }else {
            tituloPrincipal.innerHTML ="Todos los Productos";
            mostrarProductos(productos);
        }

        
    })
})

function eventosBotones() { 
    eventoBotones = document.querySelectorAll(".producto-agregar");
    eventoBotones.forEach(boton => {
        boton.addEventListener("click", addCart);
    });

 }

const carrito = localStorage.getItem("producto-carrito");
const productCartLocal = carrito &&  carrito!= "[]" && carrito != ""? JSON.parse(carrito): [] ;


function validadStorage(){
    if(productCartLocal){
        productCart = productCartLocal;
        actualizarNumCard();
    }else{
        productCart = [] ;
    }
}

validadStorage();

function addCart(eve){  
        const productos = JSON.parse(localStorage.getItem("inventario-prodcutos"));
        const idProducto = eve.currentTarget.id;
        const productAdd = productos.find(producto =>producto.id === idProducto);
        let stockProducto = productAdd.stock;
        //VERIFICAR STOCK DEL PRODUCTO
        if(stockProducto > 0){

            //VERIFICAR SI EL PRODUCTO EXISTE EN EL CARRITO
            if(productCart.some(producto =>producto.id === idProducto)){
                const index = productCart.findIndex(producto =>producto.id === idProducto);

                productCart[index].cantidad +=1; 
                productCart[index].stock -- ;
                stockProducto=productAdd.stock;
            }
            else{
                productAdd.cantidad = 1;
                productAdd.stock -- ;
                productCart.push(productAdd);
            }

            actualizaStockProductos(idProducto, 'quitar', 1);

        }else{
            swal("Stock productos!", "Producto agotado!", "error");
        }

        actualizarNumCard();
        localStorage.setItem('producto-carrito', JSON.stringify(productCart));
}

function actualizarNumCard(){
    let nuevoNumero = productCart.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCard.innerText = nuevoNumero;
}



//FUNCION PARA CARGAR ARRAY DE PRODUCTOS AL LOCAL STORAGE (SOLO SI NO EXISTE)
function cargaPrductos(){
    const inventario = JSON.parse(localStorage.getItem("inventario-prodcutos"));
    //Guardar solo si no existe elemento en el local storage
    if(!inventario){
        console.log("loaded data!!");
        localStorage.setItem('inventario-prodcutos', JSON.stringify(Productos));
    }
}

//ACTUALIZAR STOCK DE ARRAY PRODUCTOS
function actualizaStockProductos(idProducto, operacion, cantidad){

    //PRODUCTOS EXISTENTES
    const productos = JSON.parse(localStorage.getItem("inventario-prodcutos"));

    //OBTENER LA POSICION DEL PRODUCTO
    const index = productos.findIndex(producto => producto.id === idProducto);

    //OPERACION CON STOCK
    switch (operacion) {
        case 'agregar':
            productos[index].stock = productos[index].stock + cantidad;
            break;
    
        case 'quitar':
            productos[index].stock = productos[index].stock - cantidad;
            break;

        default:
            break;
    }

    //ACTUALIZAR PRODUCTOS MOSTRADOS
    localStorage.setItem('inventario-prodcutos', JSON.stringify(productos));
    mostrarProductos(productos);
}

