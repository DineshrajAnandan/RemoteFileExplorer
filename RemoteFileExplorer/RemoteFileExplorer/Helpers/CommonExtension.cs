using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RemoteFileExplorer.Helpers
{
    public static class CommonExtension
    {
        public static string MaskPathForUI(this string path) => 
            path.Replace(Startup.StaticConfig["root"], Constants.MaskRootName);

        public static string UnMaskPath(this string path) =>
            path.Replace(Constants.MaskRootName, Startup.StaticConfig["root"]);

        public static string RenameItemForDuplication(this string fileName) =>
            $"{fileName}-Copy-{DateTime.Now.ToString("yyyyMMddHHmmssffff")}";
        
    }
}
