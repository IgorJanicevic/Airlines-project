using Airlines_project.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Airlines_project.Controllers
{
    public class KorisniciController : ApiController
    {
        private readonly string  korisniciFilePath = "C:\\Users\\HomePC\\Desktop\\Airlines-project\\Airlines-project\\App_Data\\korisnici.json";

        // POST api/korisnici/registracija
        [HttpPost]
        [Route("api/korisnici/registracija")]
        public IHttpActionResult Registracija([FromBody] Korisnik noviKorisnik)
        {
            if (noviKorisnik == null)
            {
                return BadRequest("Podaci o korisniku nisu ispravni.");
            }

            List<Korisnik> korisnici = LoadKorisniciFromFile();

            // Provera da li korisnicko ime vec postoji
            if (korisnici.Any(k => k.KorisnickoIme.Equals(noviKorisnik.KorisnickoIme)))
            {
                return BadRequest("Korisničko ime već postoji. Molimo izaberite drugo korisničko ime.");
            }

            korisnici.Add(noviKorisnik);
            SaveKorisniciToFile(korisnici);

            return Ok("Uspešno ste se registrovali!");
        }

        // POST api/korisnici/prijava
        [HttpPost]
        [Route("api/korisnici/prijava")]
        public IHttpActionResult Prijava([FromBody] Korisnik loginData)
        {
            if (loginData == null || string.IsNullOrWhiteSpace(loginData.KorisnickoIme) || string.IsNullOrWhiteSpace(loginData.Lozinka))
            {
                return BadRequest("Podaci o korisniku nisu ispravni.");
            }

            List<Korisnik> korisnici = LoadKorisniciFromFile();
            
            Korisnik korisnik= korisnici.FirstOrDefault(kor=>kor.KorisnickoIme.Equals(loginData.KorisnickoIme) && kor.Lozinka.Equals(loginData.Lozinka));

            if (korisnik == null)
            {
                return BadRequest("Pogrešno korisničko ime ili lozinka. Molimo pokušajte ponovo.");
            }

            return Ok($"Uspešno ste se ulogovali, {korisnik.Ime}!");
        }

        // Privatne pomoćne funkcije za rad sa fajlom korisnici.json

        private List<Korisnik> LoadKorisniciFromFile()
        {           
            string jsonData = File.ReadAllText(korisniciFilePath);         
            return JsonConvert.DeserializeObject<List<Korisnik>>(jsonData);
        }

        private void SaveKorisniciToFile(List<Korisnik> korisnici)
        {
            string jsonData = JsonConvert.SerializeObject(korisnici, Formatting.Indented);
            File.WriteAllText(korisniciFilePath, jsonData);
        }
    }
}
