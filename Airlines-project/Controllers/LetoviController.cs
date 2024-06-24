using Airlines_project.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Http;

namespace Airlines_project.Controllers
{
    [Route("api/letovi")]
    public class LetoviController : ApiController
    {
        private readonly string letoviFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/letovi.json");

        public LetoviController()
        {
            if (!File.Exists(letoviFilePath))
            {
                File.Create(letoviFilePath);
            }
        }

        [HttpGet]
        [Route("api/letovi")]
        public IHttpActionResult DohvatiLetove()
        {
            try
            {
                var letovi = UcitajLetoveIzFajla();
                return Ok(letovi);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpGet]
        [Route("api/letovi/{letId}")]
        public IHttpActionResult DohvatiLet(int letId)
        {
            try
            {
                var letovi = UcitajLetoveIzFajla();
                foreach(Let l in letovi)
                {
                    if (l.LetId == letId)
                        return Ok(l);
                }
                return NotFound();

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public List<Let> UcitajLetoveIzFajla()
        {
            if (!File.Exists(letoviFilePath))
            {
                return new List<Let>();
            }

            var json = File.ReadAllText(letoviFilePath);
            return JsonConvert.DeserializeObject<List<Let>>(json);
        }


    private void SacuvajLetoveUFajl(List<Let> letovi)
        {
            var json = JsonConvert.SerializeObject(letovi, Formatting.Indented);
            File.WriteAllText(letoviFilePath, json);
        }

      
    }
}
