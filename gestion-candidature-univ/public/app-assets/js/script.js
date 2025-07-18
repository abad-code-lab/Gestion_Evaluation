$(function(){

    $("#validations").hide();

    $("#lienAjout").click(function(){
        $("#validations").toggle();
    });

    $('#formValidate').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'insertUtilisateur.php',
            data: $(this).serialize(),
            success: function(response) {
                $('#result').html(response);

                // Vider les champs du formulaire
                $("#formValidate")[0].reset();
            },
            error: function() {
                $('#result').html('Une erreur est survenue.');
            }
        });
    });

});

