using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Airlines_project.Models
{
    public class Rezervacija
    {
        public int Korisnik { get; set; }
        public int Let { get; set; }
        public int BrojPutnika { get; set; }
        public decimal UkupnaCena { get; set; }
        public StatusRezervacije Status { get; set; }
    }

    public enum StatusRezervacije
    {
        Kreirana,
        Odobrena,
        Otkazana,
        Zavrsena
    }

}