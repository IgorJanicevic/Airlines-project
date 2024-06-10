$(document).ready(function () {
    $('#registerForm').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        let korisnickoime = $('#korisinickoime').val().trim();
        let lozinka = $('#password').val().trim();
        let ime = $('#ime').val().trim();
        let prezime = $('#prezime').val().trim();
        let email = $('#email').val().trim();
        let datumRodjenja = $('#datumRodjenja').val().trim();
        let pol = $('#pol').val();

        // Create user object
        let newUser = {
            korisnickoime: korisnickoime,
            lozinka: lozinka,
            ime: ime,
            prezime: prezime,
            email: email,
            datumRodjenja: datumRodjenja,
            pol: pol,
            tipKorisnika: "Putnik", // Pretpostavka da je svaki novi korisnik inicijalno tipa "Putnik"
            listaRezervacija: [] // Inicijalno prazna lista rezervacija
        };

        // AJAX call to register user
        $.ajax({
            type: 'POST',
            url: '/api/korisnici/registracija',
            contentType: 'application/json',
            data: JSON.stringify(newUser),
            success: function (response) {
                alert(response);
                $('#korisnickoime').val('IGORORORORO');

            },
            error: function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
            }
        });
    });

    
});
