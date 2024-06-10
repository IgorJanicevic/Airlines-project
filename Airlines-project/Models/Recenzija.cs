using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Airlines_project.Models
{
    public class Recenzija
    {
        public int Recezent { get; set; } 
        public string Naslov { get; set; }
        public string Sadrzaj { get; set; }
        public string Slika { get; set; }
        public StatusRecenzije Status { get; set; }
    }

    public enum StatusRecenzije
    {
        Kreirana,
        Odobrena,
        Odbijena
    }
}