var salesApp = new Vue({
  el: "#sales",
  data: {
    exchangeRateUYU: 0,
    cars: [],
    years: [],
    brands: [],
    brandSelected: "",
    yearSelected: "",
    modelSelected: "",
    statusSelected: "",
    models: [],
    USDUYU: true,
    loading: true,
  },
  methods: {
    formatPrice(value) {
      value = Math.round(value);
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    changeDollar: function () {
      salesApp.USDUYU = !salesApp.USDUYU;
    },
  },
});

// Carga de Tipo de Cambio:
$.ajax({
  url: "https://ha.edu.uy/api/rates",
  success: function (data) {
    salesApp.exchangeRateUYU = data.uyu;
    salesApp.loading = false;
  },
});

$.ajax({
  url: "https://ha.edu.uy/api/cars",
  success: function (data) {
    console.log(data);
    salesApp.cars = data;
  },
});

for (var i = 2020; i >= 1900; i--) {
  salesApp.years.push(i);
}

$.ajax({
  url: "https://ha.edu.uy/api/brands",
  success: function (data) {
    salesApp.brands = data;
  },
});

$("#select-brand").on("change", function () {
  var url = "https://ha.edu.uy/api/models?brand=" + salesApp.brandSelected;

  $.ajax({
    url: url,
    success: function (data) {
      salesApp.models = data;
    },
  });
});

$("#btnsearch").on("click", function () {
  $("#not-loading").addClass("d-none");
  $("#loading").removeClass("d-none");

  var url =
    "https://ha.edu.uy/api/cars?year=" +
    salesApp.yearSelected +
    "&brand=" +
    salesApp.brandSelected +
    "&model=" +
    salesApp.modelSelected +
    "&status=" +
    salesApp.statusSelected;

  $.ajax({
    url: url,
    success: function (data) {
      if (data.length != 0) {
        console.log("AUTO ENCONTRADO");
        salesApp.cars = data;
      } else {
        alert("AUTO NO ENCONTRADO");
      }
    },
    complete: function () {
      // Al terminar la búsqueda, se quita el loader y
      // el texto del botón pasa de "Buscando" a "Buscar".
      $("#not-loading").removeClass("d-none");
      $("#loading").addClass("d-none");
    },
  });
});
