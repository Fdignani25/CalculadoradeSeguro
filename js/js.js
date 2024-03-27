const descuentosPorMarca = {
  "Renault": 0.25,
  "Ford": 0.35,
  "Peugeot": 0.70,
  "Fiat": 0.20,
  "Chevrolet": 0.15,
};

const seguroForm = document.getElementById('seguroForm');
const tipoSeguroSelect = document.getElementById('tipoSeguro');
const entradaMarcaAuto = document.getElementById('entradaMarcaAuto');
const resultadoDiv = document.getElementById('resultado');

// Comprobar si existen datos en el almacenamiento y completar el formulario
const datosAlmacenados = localStorage.getItem('datosSeguro');
if (datosAlmacenados) {
  const datosParseados = JSON.parse(datosAlmacenados);
  document.getElementById('nombre').value = datosParseados.nombre;
  document.getElementById('apellido').value = datosParseados.apellido;
  document.getElementById('edad').value = datosParseados.edad;
  document.getElementById('tipoSeguro').value = datosParseados.tipoSeguro;
  if (datosParseados.tipoSeguro === 'auto') {
      entradaMarcaAuto.style.display = 'block';
      document.getElementById('marcaAuto').value = datosParseados.marcaAuto;
  }
}

tipoSeguroSelect.addEventListener('change', function() {
  if (this.value === 'auto') {
      entradaMarcaAuto.style.display = 'block';
  } else {
      entradaMarcaAuto.style.display = 'none';
  }
});

document.getElementById('botonCalcular').addEventListener('click', calcularTotal);

function calcularTotal() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const edad = parseInt(document.getElementById('edad').value);
  const tipoSeguro = document.getElementById('tipoSeguro').value;
  const marcaAutoSeleccionada = tipoSeguro === 'auto' ? document.getElementById('marcaAuto').value : null;

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

      if (marcaAutoSeleccionada && marcaAutoSeleccionada in descuentosPorMarca) {
          costoAnual = costoMensual * 12 * (1 - descuentosPorMarca[marcaAutoSeleccionada]);
      } else {
          costoAnual = costoMensual * 12;
      }
  }

  resultadoDiv.innerHTML = `Estimado ${nombre} ${apellido}, el costo anual del seguro es: $${costoAnual.toFixed(2)}`;
  resultadoDiv.style.display = 'block';

  // Almacenar datos en localStorage
  const datosSeguro = {
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      tipoSeguro: tipoSeguro,
      marcaAuto: marcaAutoSeleccionada || ""
  };
  localStorage.setItem('datosSeguro', JSON.stringify(datosSeguro));
}