using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Airlines_project.Models
{
    public class Aviokompanija
    {
        public int AviokompanijaId { get; set; }
        public string Naziv { get; set; }
        public string Adresa { get; set; }
        public string KontaktInformacije { get; set; }
        public List<Let> Letovi { get; set; }
        public List<Recenzija> Recenzije { get; set; }
    }
}