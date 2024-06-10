using System;
using System.Collections.Generic;

namespace Airlines_project.Models
{
    public class Korisnik
    {
        public string KorisnickoIme { get; set; }
        public string Lozinka { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public DateTime DatumRodjenja { get; set; }
        public Pol Pol { get; set; }
        public TipKorisnika TipKorisnika { get; set; }
        public List<Rezervacija> ListaRezervacija { get; set; }
    }

    public enum Pol
    {
        Muski,
        Zenski,
        Ostalo
    }

    public enum TipKorisnika
    {
        Putnik,
        Administrator
    }
}
