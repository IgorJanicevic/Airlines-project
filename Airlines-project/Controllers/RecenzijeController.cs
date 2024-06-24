using Airlines_project.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Airlines_project.Controllers
{
    public class RecenzijeController : ApiController
    {
        private string recenzijeFilePath = HttpContext.Current.Server.MapPath("~/App_Data/recenzije.json");

        // Metoda za učitavanje recenzija iz JSON fajla
        private List<Recenzija> UcitajRecenzijeIzFajla()
        {
            if (!File.Exists(recenzijeFilePath))
            {
                return new List<Recenzija>();
            }

            var json = File.ReadAllText(recenzijeFilePath);
            return JsonConvert.DeserializeObject<List<Recenzija>>(json);
        }

        // GET: api/recenzije
        [HttpGet]
        [Route("api/recenzije")]
        public IHttpActionResult DohvatiRecenzije()
        {
            try
            {
                var recenzije = UcitajRecenzijeIzFajla();
                return Ok(recenzije);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
