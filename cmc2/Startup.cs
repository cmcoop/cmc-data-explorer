
using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(cmc2.Startup))]
namespace cmc2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            
        }
    }
}
