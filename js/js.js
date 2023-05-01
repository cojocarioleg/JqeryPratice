$(document).ready(function () {
  $("#colorsSelector .colorItem").on("click", function () {
    let $imgPath = $(this).attr("data-img-path");
    $("#imgHolder img").fadeOut(1000, function () {
      $("#imgHolder img").attr("src", $imgPath).fadeIn(1000);
    });
  });

  let modelSpecs,
    modelPrice,
    modelSpecsHolder,
    modelPriceHolder,
    modelPriceEURHolder,
    modelPriceMDLHolder;

  modelSpecsHolder = $("#modelSpecs");
  modelPriceHolder = $("#modelPrice");
  modelPriceMDLHolder = $("#modelPriceMDL");
  modelPriceEURHolder = $("#modelPriceEUR");
  modelPrice = 0;
  modelSpecs = "";

  function calculatePrice() {
    let modelPriceEngine = $("input[name=engine]:checked", "#autoForm").val();

    let modelPriceTransmission = $(
      "input[name=transmission]:checked",
      "#autoForm"
    ).val();

    let modelPricePackage = $("input[name=package]:checked", "#autoForm").val();

    modelPriceEngine = parseInt(modelPriceEngine);
    modelPriceTransmission = parseInt(modelPriceTransmission);
    modelPricePackage = parseInt(modelPricePackage);

    modelPrice = modelPriceEngine + modelPriceTransmission + modelPricePackage;

    modelPriceHolder.text(addSpace(modelPrice) + " rub");
    return modelPrice;
  }
  modelPrice = calculatePrice();

  $("#autoForm input").on("change", function () {
    calculatePrice();
    calculateUSD();
  });

  let currentcyUrl = "https://www.cbr-xml-daily.ru/daily_json.js";

  let MdlUsdRate = 0;
  let EurUsdRate = 0;
  $.ajax({
    type: "GET",
    url: currentcyUrl,
    data: { get_param: "value" },
    dataType: "json",
    success: function (data) {
      MdlUsdRate = data.Valute.MDL.Previous;
      EurUsdRate = data.Valute.EUR.Previous;
      calculateUSD();
    },
  });

  function calculateUSD() {
    let modelPriceEUR = modelPrice / EurUsdRate;
    let modelPriceMDL = modelPrice / MdlUsdRate;
    modelPriceMDLHolder.text(addSpace(modelPriceMDL.toFixed(0)) + " lei");
    modelPriceEURHolder.text(addSpace(modelPriceEUR.toFixed(0)) + " EUR");
  }

  function addSpace(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + " " + "$2");
    }
    return x1 + x2;
  }
});
