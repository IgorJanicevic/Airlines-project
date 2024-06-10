$(document).ready(function () {


    function loadAviokompanije() {
        $.get('/api/aviokompanije', function (data) {
            const aviokompanijeList = $('#aviokompanijeList');
            aviokompanijeList.empty();

            data.forEach(aviokompanija => {
                const aviokompanijaElement = `
                        <div class="list-group-item avio-link" data-aviokompanija-id="${aviokompanija.AviokompanijaId}">
                            <h5>${aviokompanija.Naziv}</h5>
                        </div>
                    `;
                aviokompanijeList.append(aviokompanijaElement);
            });
        });
    }

    // Učitaj aviokompanije na inicijalno učitavanje stranice
    loadAviokompanije();

    // Event listener za klik na avio-link
    $(document).on('click', '.avio-link', function () {
        const aviokompanijaId = $(this).data('aviokompanija-id');

        // Redirekcija na stranicu aviokompanija.html sa id-em aviokompanije u URL-u
        window.location.href = `aviokompanija.html?id=${aviokompanijaId}`;
    });


});