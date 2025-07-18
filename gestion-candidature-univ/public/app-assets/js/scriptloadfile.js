$(function() {
    
    var dropZone = $('#dropZone');

    dropZone.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.addClass('hover');
    });

    dropZone.on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.removeClass('hover');
    });

    dropZone.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.removeClass('hover');

        var files = e.originalEvent.dataTransfer.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileInfo = '<p><strong>Nom du fichier:</strong> ' + file.name + '</p>';
            fileInfo += '<p><strong>Type du fichier:</strong> ' + file.type + '</p>';
            fileInfo += '<p><strong>Taille du fichier:</strong> ' + file.size + ' bytes</p>';
            $('#fileInfo').html(fileInfo);

            // Télécharger le fichier
            uploadFile(file);
        }
    }

    function uploadFile(file) {
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: 'upload.php', // Remplacez par l'URL de votre script PHP
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Téléchargement réussi');
                console.log('Réponse du serveur:', response);
                $('#fileInfo').append('<p>Le fichier a été téléchargé avec succès.</p>');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Échec du téléchargement:', textStatus, errorThrown);
                $('#fileInfo').append('<p>Le téléchargement a échoué.</p>');
            }
        });
    }

    dropZone.on('click', function() {
        $('#fileInput').click();
    });

    $('#fileInput').on('change', function() {
        var files = this.files;
        handleFiles(files);
    });
});