// Objeto que contiene los descuentos por marca de auto y sus modelos
const descuentosPorMarca = {
  "Renault": { "Clio": 0.2, "Sandero": 0.25, "Megane": 0.3 },
  "Ford": { "Fiesta": 0.3, "Focus": 0.35, "Mondeo": 0.4 },
  "Peugeot": { "208": 0.5, "308": 0.6, "408": 0.7 },
  "Fiat": { "Uno": 0.15, "Palio": 0.2, "Siena": 0.25 },
  "Chevrolet": { "Corsa": 0.1, "Cruze": 0.15, "Onix": 0.2 }
};

// Función para mostrar u ocultar el campo de selección de modelo de auto
function mostrarCampoModeloAuto(mostrar) {
  const entradaModeloAuto = document.getElementById('entradaModeloAuto');
  entradaModeloAuto.style.display = mostrar ? 'block' : 'none';
}

// Función para actualizar las opciones del campo de selección de modelo de auto
function actualizarOpcionesModeloAuto(marcaSeleccionada) {
  const modeloAutoSelect = document.getElementById('modeloAuto');
  modeloAutoSelect.innerHTML = ''; // Limpiar opciones anteriores

  if (marcaSeleccionada && descuentosPorMarca[marcaSeleccionada]) {
    const modelos = Object.keys(descuentosPorMarca[marcaSeleccionada]);
    modelos.forEach(modelo => {
      const opcion = document.createElement('option');
      opcion.textContent = modelo;
      opcion.value = modelo;
      modeloAutoSelect.appendChild(opcion);
    });
    mostrarCampoModeloAuto(true);
  } else {
    mostrarCampoModeloAuto(false);
  }
}

// Función para calcular el ahorro potencial al cambiar de proveedor de seguros
function calcularAhorroPotencial(costoActual, costoNuevo) {
  const ahorro = costoActual - costoNuevo;
  return ahorro;
}

// Función principal para calcular el total del seguro y mostrar el ahorro potencial
function calcularTotal() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const edad = parseInt(document.getElementById('edad').value);
  const tipoSeguro = document.getElementById('tipoSeguro').value;
  const marcaAutoSeleccionada = tipoSeguro === 'auto' ? document.getElementById('marcaAuto').value : null;
  const modeloAutoSeleccionado = tipoSeguro === 'auto' ? document.getElementById('modeloAuto').value : null;
  const tieneGNC = document.getElementById('tieneGNC').value === 'si';

  let costoMensual;
  let costoAnual;

  if (tipoSeguro === "vida") {
    const costoProducto1Mensual = 10000;
    const costoProducto2Mensual = 15000;
    const porcentajeDescuento = 0.20;

    costoMensual = edad < 40 ? costoProducto1Mensual : costoProducto2Mensual;
    costoAnual = costoMensual * 12 * (1 - porcentajeDescuento);
  } else if (tipoSeguro === "auto") {
    const costoSeguroAutoMensual = 5000;
    costoMensual = costoSeguroAutoMensual;

    let descuentoPorMarca = 0;
    if (marcaAutoSeleccionada && descuentosPorMarca[marcaAutoSeleccionada] && descuentosPorMarca[marcaAutoSeleccionada][modeloAutoSeleccionado]) {
      descuentoPorMarca = descuentosPorMarca[marcaAutoSeleccionada][modeloAutoSeleccionado];
    }
    costoAnual = costoMensual * 12 * (1 - descuentoPorMarca);

    if (tieneGNC) {
      costoAnual *= 1.1; // Aumentar el costo en un 10% si tiene GNC
    }
  }

  // Mostrar resultado del seguro
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = `Estimado ${nombre} ${apellido}, el costo anual del seguro es: $${costoAnual.toFixed(2)}`;
  resultadoDiv.style.display = 'block';

  // Mostrar opciones de ahorro potencial
  const costoActual = parseFloat(prompt("Por favor, ingresa el costo actual de tu seguro:"));
  if (!isNaN(costoActual)) {
    const ahorro = calcularAhorroPotencial(costoActual, costoAnual);
    const mensajeAhorro = document.getElementById('ahorroPotencial');
    mensajeAhorro.textContent = `Al cambiar a nuestro servicio, ahorrarías $${ahorro.toFixed(2)} en comparación con tu proveedor actual.`;
    mensajeAhorro.style.display = 'block';
  }
}

// Evento de cambio en la selección de marca de auto
document.getElementById('marcaAuto').addEventListener('change', function() {
  const marcaSeleccionada = this.value;
  actualizarOpcionesModeloAuto(marcaSeleccionada);
});

// Obtener elementos del DOM
const tipoSeguroSelect = document.getElementById('tipoSeguro');

// Comprobar si existen datos en el almacenamiento y completar el formulario
const datosAlmacenados = localStorage.getItem('datosSeguro');
if (datosAlmacenados) {
  const datosParseados = JSON.parse(datosAlmacenados);
  document.getElementById('nombre').value = datosParseados.nombre;
  document.getElementById('apellido').value = datosParseados.apellido;
  document.getElementById('edad').value = datosParseados.edad;
  document.getElementById('tipoSeguro').value = datosParseados.tipoSeguro;
  if (datosParseados.tipoSeguro === 'auto') {
    const marcaAutoSelect = document.getElementById('marcaAuto');
    marcaAutoSelect.value = datosParseados.marcaAuto;
    actualizarOpcionesModeloAuto(datosParseados.marcaAuto);
    document.getElementById('modeloAuto').value = datosParseados.modeloAuto;
    document.getElementById('tieneGNC').value = datosParseados.tieneGNC ? 'si' : 'no';
  }
}

// Mostrar u ocultar la entrada de marca de auto según el tipo de seguro seleccionado
tipoSeguroSelect.addEventListener('change', function() {
  const entradaMarcaAuto = document.getElementById('entradaMarcaAuto');
  entradaMarcaAuto.style.display = this.value === 'auto' ? 'block' : 'none';
});

// Obtener referencia al botón de calcular
const botonCalcular = document.getElementById('botonCalcular');

// Vincular evento de clic con la función calcularTotal
botonCalcular.addEventListener('click', calcularTotal);

// Cargar datos desde un archivo JSON local usando fetch
fetch('datos.json')
  .then(response => response.json())
  .then(data => {
    // Aquí puedes manejar los datos cargados desde el archivo JSON
    console.log(data);
  })
  .catch(error => console.error('Error al cargar datos desde JSON:', error));
