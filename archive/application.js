
function showTicket () {
$(this).closest('.confirmation').find('.ticket').slideDown();
}

$(document).ready(function() {
// create a <p> node with the price
$('#btn1').click(function () {
//$('#hp').css("display", "none");
$('#home').css("display", "block");
$('#service').css("display", "none");


/*$('#block3').css("display", "none");
$('#block4').css("display", "none");
$('#block5').css("display", "block");*/
//$('#block1').toggle("slow");
//$('#hp').toggle("slow");

});

$('#btn2').click(function () {
//$('#hp').css("display", "none");
$('#home').css("display", "none");
$('#service').css("display", "block");


/*$('#block3').css("display", "none");
$('#block4').css("display", "none");
$('#block5').css("display", "block");*/

//$('#block2').toggle("slow");
//$('#hp').toggle("slow");
});

$('#btn3').click(function () {
$('#hp').css("display", "none");
$('#block1').css("display", "none");
$('#block2').css("display", "none");
$('#block3').css("display", "block");
$('#block4').css("display", "none");
$('#block5').css("display", "block");

//$('#block2').toggle("slow");
//$('#hp').toggle("slow");
});


$('#btn4').click(function () {
$('#hp').css("display", "none");
$('#block1').css("display", "none");
$('#block2').css("display", "none");
$('#block3').css("display", "none");
$('#block4').css("display", "block");
$('#block5').css("display", "block");

//$('#block2').toggle("slow");
//$('#hp').toggle("slow");
});


$('#btn0').click(function () {
$('#hp').css("display", "none");
$('#block2').css("display", "none");
$('#block1').css("display", "none");
$('#block3').css("display", "none");
$('#block4').css("display", "none");
$('#block5').css("display", "none");
//$('#block1').toggle("slow");
//$('#hp').toggle("slow");

});



});