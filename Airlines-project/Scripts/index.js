$(document).ready(function () {
    // Provera da li postoji prijavljeni korisnik u sesiji
    let currentUser = sessionStorage.getItem('currentUser');
    let rezStatus = 0;
    if (currentUser) {
        currentUser = JSON.parse(currentUser);
        $('#navbarDropdown').html(`MyProfile (${currentUser.KorisnickoIme})`);

        let dropdownMenu = `
        <div class="dropdown mr-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="statusDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Status
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="statusDropdown">
                <a class="dropdown-item" href="#" data-status="active" id="activeFlightsLink">Aktivni letovi</a>
                <a class="dropdown-item" href="#" data-status="cancelled" id="cancelledFlightsLink">Otkazani letovi</a>
                <a class="dropdown-item" href="#" data-status="finished" id="finishedFlightsLink">Završeni letovi</a>
            </div>
        </div>
    `;
        $("#searchForm").append(dropdownMenu);

        // Event listener za prikaz aktivnih letova
        $('#activeFlightsLink').click(function (event) {
            event.preventDefault();
            rezStatus = 0;
            loadFlights(0);
        }); 
        $('#finishedFlightsLink').click(function (event) {
            event.preventDefault();
            rezStatus = 2;
            loadUserFlights(2);
        });
        $('#cancelledFlightsLink').click(function (event) {
            event.preventDefault();
            rezStatus = 1;
            loadUserFlights(1);
        });

       

    } else {
        // Ako nije prijavljen korisnik, sakrijemo MyProfile i Logout
        $('.dropdown-item[href="profile.html"]').hide();
        $('.dropdown-item#logoutLink').hide();
    }

    // Logout funkcionalnost
    $('.dropdown-item#logoutLink').click(function (event) {
        event.preventDefault();
        // Brisanje trenutnog korisnika iz sesije
        sessionStorage.removeItem('currentUser');

        // Redirekcija na login.html
        window.location.href = 'index.html';
    });

    // Event listener za pretragu letova
    $('#searchForm').submit(function (event) {
        event.preventDefault();
        loadFlights(rezStatus);
    });

    // Event listener za sortiranje letova
    $('#sortBtn').click(function () {
        let $sortBtn = $(this);
        let sortAsc = $sortBtn.data('sort') === 'asc';

        sortFlights(sortAsc);

        if (sortAsc) {
            $sortBtn.data('sort', 'desc');
        } else {
            $sortBtn.data('sort', 'asc');
        }
    });


    // Postavljanje click event handlera za flight-link
    $(document).on('click', '.flight-link', function (event) {
        event.preventDefault(); // Prevent default link behavior (prevents navigating immediately)

        // Dobijamo LetId iz roditeljskog <tr> elementa
        let letId = $(this).closest('tr').attr('id');


        // Generišemo URL za rezervaciju leta
        let reservationUrl = `rezervisiLet.html?LetId=${letId}`;

        // Preusmeravamo korisnika na odgovarajuću stranicu
        let currentUser = sessionStorage.getItem('currentUser');
        if (currentUser) {
            window.location.href = reservationUrl;
        } else {
            window.location.href = "login.html";
        }
    });

    // Učitavanje letova pri inicijalnom učitavanju stranice
    loadFlights(0);
});

function loadUserFlights(rezStatus) {
    // Provera da li postoji prijavljeni korisnik u sesiji
    let currentUser = sessionStorage.getItem('currentUser');

    if (currentUser) {
        currentUser = JSON.parse(currentUser);

        let rows = '';

        currentUser.ListaRezervacija.forEach(rez => {
            // Proverite da li let ima status koji tražimo i da li je rezervacija aktivna (Status === 1)
            if (rez.Let.Status === rezStatus && rez.Status === 1) {
                let datumPolaskaObj = new Date(rez.Let.DatumVremePolaska);
                let datumDolaskaObj = new Date(rez.Let.DatumVremeDolaska);
                rows += `<tr  class="flight-link" id="${rez.Let.LetId}">
                            <td>${rez.Let.Aviokompanija}</td>
                            <td>${rez.Let.PolaznaDestinacija}</td>
                            <td>${rez.Let.OdredisnaDestinacija}</td>
                            <td>${formatDate(datumPolaskaObj)}</td>
                            <td>${formatDate(datumDolaskaObj)}</td>
                            <td>${rez.Let.BrojSlobodnihMesta}</td>
                            <td>${rez.Let.BrojZauzetihMesta}</td>
                            <td>${rez.Let.Cena}</td>
                        </tr>`;
            }
        });

        $('#bodyF').html(rows); // Prikazivanje podataka u tabeli
    } else {
        console.error('Nije prijavljen korisnik.');
    }
}


function loadFlights(rezStatus) {
    let aviokompanija = $('#aviokompanija').val().toLowerCase();
    let polaznaDestinacija = $('#polaznaDestinacija').val().toLowerCase();
    let odredisnaDestinacija = $('#odredisnaDestinacija').val().toLowerCase();
    let datumPolaska = $('#datumPolaska').val();
    let datumDolaska = $('#datumDolaska').val();
    let letovi;

    $.ajax({
        type: 'GET',
        url: '/api/letovi',
        data: {
            aviokompanija: aviokompanija,
            polaznaDestinacija: polaznaDestinacija,
            odredisnaDestinacija: odredisnaDestinacija,
            DatumVremePolaska: datumPolaska,
            DatumVremeDolaska: datumDolaska
        },
        success: function (data) {
            let rows = '';
            letovi = data;


            letovi.forEach(function (let) {
                let datumPolaskaObj = new Date(let.DatumVremePolaska);
                let datumDolaskaObj = new Date(let.DatumVremeDolaska);

                // Provera za prikaz svih letova ako nijedan filter nije unet
                if (!aviokompanija && !polaznaDestinacija && !odredisnaDestinacija && !datumPolaska && !datumDolaska) {
                    rows += `<tr  class="flight-link" id="${let.LetId}">
                            <td>${let.Aviokompanija}</td>
                            <td>${let.PolaznaDestinacija}</td>
                            <td>${let.OdredisnaDestinacija}</td>
                            <td>${formatDate(datumPolaskaObj)}</td>
                            <td>${formatDate(datumDolaskaObj)}</td>
                            <td>${let.BrojSlobodnihMesta}</td>
                            <td>${let.BrojZauzetihMesta}</td>
                            <td>${let.Cena}</td>
                        </tr>`;
                } else {
                    let isMatch = true;

                    // Provera da li let odgovara filterima
                    if (aviokompanija && !let.Aviokompanija.toLowerCase().includes(aviokompanija)) {
                        isMatch = false;
                    }
                    if (polaznaDestinacija && !let.PolaznaDestinacija.toLowerCase().includes(polaznaDestinacija)) {
                        isMatch = false;
                    }
                    if (odredisnaDestinacija && !let.OdredisnaDestinacija.toLowerCase().includes(odredisnaDestinacija)) {
                        isMatch = false;
                    }
                    if (datumPolaska && !let.DatumVremePolaska.includes(datumPolaska)) {
                        isMatch = false;
                    }
                    if (datumDolaska && !let.DatumVremeDolaska.includes(datumDolaska)) {
                        isMatch = false;
                    }

                    if (isMatch) {
                        rows += `<tr  class="flight-link" id="${let.LetId}">
                                <td>${let.Aviokompanija}</td>
                                <td>${let.PolaznaDestinacija}</td>
                                <td>${let.OdredisnaDestinacija}</td>
                                <td>${formatDate(datumPolaskaObj)}</td>
                                <td>${formatDate(datumDolaskaObj)}</td>
                                <td>${let.BrojSlobodnihMesta}</td>
                                <td>${let.BrojZauzetihMesta}</td>
                                <td>${let.Cena}</td>
                            </tr>`;
                    }
                }
            });

            $('#bodyF').html(rows);
            $('#aviokompanija').val('');
            $('#polaznaDestinacija').val('');
            $('#odredisnaDestinacija').val('');
            $('#datumPolaska').val('');
            $('#datumDolaska').val('');
        },
        error: function (xhr, status, error) {
            console.error("Error:", xhr.responseText);
        }
    });
}

   
   

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Dodajemo nulu ispred meseca, dana, minuta i sati ako su manji od 10
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function sortFlights(ascending) {
    let tableRows = $('#bodyF tr').get();

    tableRows.sort(function (rowA, rowB) {
        let priceA = parseFloat($(rowA).find('td').eq(7).text()); // 6 je index kolone sa cenom
        let priceB = parseFloat($(rowB).find('td').eq(7).text());

        if (ascending) {
            return priceA - priceB;
        } else {
            return priceB - priceA;
        }
    });

    $.each(tableRows, function (index, row) {
        $('#bodyF').append(row);
    });
}
