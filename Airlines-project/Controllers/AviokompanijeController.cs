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
    public class AviokompanijeController : ApiController
    {
        private readonly string kompanijeFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/aviokompanije.json");

        public AviokompanijeController()
        {
            if (!File.Exists(kompanijeFilePath))
            {
                File.Create(kompanijeFilePath);
            }
        }

        [HttpGet]
        [Route("api/aviokompanije")]
        public IHttpActionResult DohvatiKompanie()
        {
            try
            {
                var kompanije = UcitajKompanijeIzFajla();
                return Ok(kompanije);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private List<Aviokompanija> UcitajKompanijeIzFajla()
        {       

            var json = File.ReadAllText(kompanijeFilePath);
            return JsonConvert.DeserializeObject<List<Aviokompanija>>(json);
        }

        private void SacuvajKompanijeUFajl(List<Aviokompanija> kompanije)
        {
            var json = JsonConvert.SerializeObject(kompanije, Formatting.Indented);
            File.WriteAllText(kompanijeFilePath, json);
        }


        [HttpGet]
        [Route("api/aviokompanije/{id}")]
        public IHttpActionResult DohvatiKompaniju(int id)
        {
                var kompanije = UcitajKompanijeIzFajla();
                var kompTemp = kompanije[1];
                var kompanija = kompanije.FirstOrDefault(k => k.AviokompanijaId == id);
                if (kompanija == null)
                {
                    return NotFound();
                }
                return Ok(kompanija);
           
            
        }
    }
}
