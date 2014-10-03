using System;
using System.IO;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Hosting.Self;
using Nancy.Responses.Negotiation;

namespace SelfHostNancyWorkflow
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var host = new NancyHost(new Uri("http://localhost:1234"), new Bootstrapper()))
            {
                host.Start();
                Console.ReadLine();
            }
        }
    }

    public class SelfHostRootPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            return StaticConfiguration.IsRunningDebug
                ? Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", ".."))
                : AppDomain.CurrentDomain.BaseDirectory;
        }
    }

    public class Bootstrapper : DefaultNancyBootstrapper
    {
        protected override IRootPathProvider RootPathProvider
        {
            get { return new SelfHostRootPathProvider(); }
        }

        protected override NancyInternalConfiguration InternalConfiguration
        {
            get
            {
                return NancyInternalConfiguration.WithOverrides(x => x.ResponseProcessors = new[]
                {
                    typeof(ViewProcessor),
                    typeof(JsonProcessor),
                    typeof(XmlProcessor)
                });
            }
        }
    }

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => View["index.html"];
        }
    }
}
