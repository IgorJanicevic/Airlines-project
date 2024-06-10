$(document).ready(function () {




    // Provera da li postoji prijavljeni korisnik u sesiji
    let currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        currentUser = JSON.parse(currentUser);
        $('#navbarDropdown').html(`MyProfile (${currentUser})`);
        
        let dropdownMenu = `
        <div class="dropdown mr-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="statusDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Status
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="statusDropdown">
                <a class="dropdown-item" href="#" data-status="active">Aktivni letovi</a>
                <a class="dropdown-item" href="#" data-status="cancelled" id="cancelled">Otkazani letovi</a>
                <a class="dropdown-item" href="#" data-status="finished">Završeni letovi</a>
            </div>
        </div>
    `;
        $("#searchForm").append(dropdownMenu);

        // Event listener za prikaz aktivnih letova
        $('#activeFlightsLink').click(function (event) {
            event.preventDefault();
            loadFlights();
        });

        // Event listener za prikaz otkazanih letova
        $('#cancelled').click(function (event) {
            //event.preventDefault();
            loadCancelledFlights();
        });

        // Event listener za prikaz završenih letova
        $('#finishedFlightsLink').click(function (event) {
            event.preventDefault();
            loadFinishedFlights();
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
        loadFlights();
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





    // Učitavanje letova pri inicijalnom učitavanju stranice
    loadFlights();
});


function loadCancelledFlights() {
    const currentUser = sessionStorage.getItem('currentUser');

    if (currentUser) {
        // Učitavanje podataka o trenutnom korisniku na osnovu korisničkog imena
        $.get(`/api/korisnici/${currentUser.substring(1, currentUser.length - 1)}`, function (korisnik) {
            rows = '';
            korisnik.ListaRezervacija.forEach(rez => {
                if (rez.Status === 1) {
                    let datumPolaskaObj = new Date(rez.Let.DatumVremePolaska);
                    let datumDolaskaObj = new Date(rez.Let.DatumVremeDolaska);
                    rows += `<tr>
                            <td class="avio-link">${rez.Let.Aviokompanija}</td>
                            <td>${rez.Let.PolaznaDestinacija}</td>
                            <td>${rez.Let.OdredisnaDestinacija}</td>
                            <td>${formatDate(datumPolaskaObj)}</td>
                            <td>${formatDate(datumDolaskaObj)}</td>
                            <td>${rez.Let.BrojSlobodnihMesta}</td>
                            <td>${rez.Let.Cena}</td>
                        </tr>`;
                }
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Greška prilikom učitavanja podataka o korisniku:', textStatus, errorThrown);

        });
    } else {
        console.error('Nije prijavljen korisnik.');

        // Možete uputiti korisnika na stranicu za prijavu ili na drugu početnu stranicu
    }
}





function loadFlights() {
    let aviokompanija = $('#aviokompanija').val().toLowerCase();
    let polaznaDestinacija = $('#polaznaDestinacija').val().toLowerCase();
    let odredisnaDestinacija = $('#odredisnaDestinacija').val().toLowerCase();
    let datumPolaska = $('#datumPolaska').val();
    let datumDolaska = $('#datumDolaska').val();

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

            data.forEach(function (let) {
               // getFlyInHtml(let);
                let datumPolaskaObj = new Date(let.DatumVremePolaska);
                let datumDolaskaObj = new Date(let.DatumVremeDolaska);

                // Provera za prikaz svih letova ako nijedan filter nije unet
                if (!aviokompanija && !polaznaDestinacija && !odredisnaDestinacija && !datumPolaska && !datumDolaska) {
                    rows += `<tr>
                            <td class="avio-link">${let.Aviokompanija}</td>
                            <td>${let.PolaznaDestinacija}</td>
                            <td>${let.OdredisnaDestinacija}</td>
                            <td>${formatDate(datumPolaskaObj)}</td>
                            <td>${formatDate(datumDolaskaObj)}</td>
                            <td>${let.BrojSlobodnihMesta}</td>
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
                        rows += `<tr>
                                <td class="avio-link">${let.Aviokompanija}</td>
                                <td>${let.PolaznaDestinacija}</td>
                                <td>${let.OdredisnaDestinacija}</td>
                                <td>${formatDate(datumPolaskaObj)}</td>
                                <td>${formatDate(datumDolaskaObj)}</td>
                                <td>${let.BrojSlobodnihMesta}</td>
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
            console.error("Error fetching data:", xhr.responseText);
        }
    });
}

function getFlyInHtml(let) {
    alert(let.Aviokompanija);
    let datumPolaskaObj = new Date(let.DatumVremePolaska);
    let datumDolaskaObj = new Date(let.DatumVremeDolaska);
    retval = '';
    // Provera za prikaz svih letova ako nijedan filter nije unet
    if (!aviokompanija && !polaznaDestinacija && !odredisnaDestinacija && !datumPolaska && !datumDolaska) {
        retval += `<tr>
                            <td class="avio-link">${let.Aviokompanija}</td>
                            <td>${let.PolaznaDestinacija}</td>
                            <td>${let.OdredisnaDestinacija}</td>
                            <td>${formatDate(datumPolaskaObj)}</td>
                            <td>${formatDate(datumDolaskaObj)}</td>
                            <td>${let.BrojSlobodnihMesta}</td>
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
            retval += `<tr>
                                <td class="avio-link">${let.Aviokompanija}</td>
                                <td>${let.PolaznaDestinacija}</td>
                                <td>${let.OdredisnaDestinacija}</td>
                                <td>${formatDate(datumPolaskaObj)}</td>
                                <td>${formatDate(datumDolaskaObj)}</td>
                                <td>${let.BrojSlobodnihMesta}</td>
                                <td>${let.Cena}</td>
                            </tr>`;
        }
    }
    return retval;

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
        let priceA = parseFloat($(rowA).find('td').eq(6).text()); // 6 je index kolone sa cenom
        let priceB = parseFloat($(rowB).find('td').eq(6).text());

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