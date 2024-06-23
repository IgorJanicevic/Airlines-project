using Airlines_project.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Airlines_project.Controllers
{
    public class RezervacijeController : ApiController
    {
        private readonly string letoviFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/letovi.json");
        private readonly string rezervacijeFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/rezervacije.json");

        // POST api/rezervacije/rezervisi
        [HttpPost]
        [Route("api/rezervacije/rezervisi")]
        public IHttpActionResult RezervisiLet([FromBody] Rezervacija novaRezervacija)
        {
            if (novaRezervacija == null)
            {
                return BadRequest("Podaci o rezervaciji nisu ispravni.");
            }

            // Učitavanje svih letova iz fajla
            List<Let> letovi = LoadLetoviFromFile();

            // Pronalaženje leta za rezervaciju
            Let letZaRezervaciju = letovi.FirstOrDefault(l => l.LetId == 1);

            if (letZaRezervaciju == null)
            {
                return BadRequest("Let za rezervaciju nije pronađen.");
            }

            // Provera da li ima dovoljno slobodnih mesta
            if (novaRezervacija.BrojPutnika > letZaRezervaciju.BrojSlobodnihMesta)
            {
                return BadRequest("Nema dovoljno slobodnih mesta za rezervaciju.");
            }

            // Ažuriranje broja slobodnih i zauzetih mesta u letu
            letZaRezervaciju.BrojSlobodnihMesta -= novaRezervacija.BrojPutnika;
            letZaRezervaciju.BrojZauzetihMesta += novaRezervacija.BrojPutnika;

            // Dodavanje nove rezervacije
            novaRezervacija.RezervacijaId = GenerateRezervacijaId();
            novaRezervacija.UkupnaCena = novaRezervacija.BrojPutnika * letZaRezervaciju.Cena;
            novaRezervacija.Status = StatusRezervacije.Kreirana; // Pretpostavljeno stanje rezervacije

            List<Rezervacija> rezervacije = LoadRezervacijeFromFile();
            rezervacije.Add(novaRezervacija);
            SaveRezervacijeToFile(rezervacije);

            // Ažuriranje letova u JSON fajlu
            SaveLetoviToFile(letovi);

            return Ok("Uspešno ste rezervisali mesta.");
        }

        // Privatne pomoćne funkcije za rad sa fajlovima

        private List<Let> LoadLetoviFromFile()
        {
            if (!File.Exists(letoviFilePath))
            {
                return new List<Let>();
            }

            var json = File.ReadAllText(letoviFilePath);
            return JsonConvert.DeserializeObject<List<Let>>(json);
        }

        private void SaveLetoviToFile(List<Let> letovi)
        {
            string jsonData = JsonConvert.SerializeObject(letovi, Formatting.Indented);
            File.WriteAllText(letoviFilePath, jsonData);
        }

        private List<Rezervacija> LoadRezervacijeFromFile()
        {
            if (!File.Exists(rezervacijeFilePath))
            {
                return new List<Rezervacija>();
            }
            string jsonData = File.ReadAllText(rezervacijeFilePath);
            return JsonConvert.DeserializeObject<List<Rezervacija>>(jsonData);
        }

        private void SaveRezervacijeToFile(List<Rezervacija> rezervacije)
        {
            string jsonData = JsonConvert.SerializeObject(rezervacije, Formatting.Indented);
            File.WriteAllText(rezervacijeFilePath, jsonData);
        }

        private int GenerateRezervacijaId()
        {
            Random random = new Random();
            return random.Next(1, 1200);
        }
    }
}
