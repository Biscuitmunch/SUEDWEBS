using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Terraria;
using Terraria.DataStructures;
using Terraria.ID;
using Terraria.ModLoader;

namespace PlayerDeathWebhook
{
    public sealed class PlayerDeathWebhook : Mod
    {
        internal static PlayerDeathWebhook Instance;

        public override void Load()
        {
            Instance = this;
            Logger.Info("[DeathWebhook] Mod loaded");
        }

        public override void Unload()
        {
            Logger.Info("[DeathWebhook] Mod unloaded");
            Instance = null;
        }
    }

    public sealed class DeathReporterPlayer : ModPlayer
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private static FieldInfo fieldPVE;
        private static FieldInfo fieldPVP;

        public override void Kill(
            double damage,
            int hitDirection,
            bool pvp,
            PlayerDeathReason damageSource
        )
        {
            var mod = ModContent.GetInstance<PlayerDeathWebhook>();

            // --- Always log for debugging ---
            mod.Logger.Info(
                $"[DeathWebhook] Kill() fired for '{Player.name}' in NetMode {Main.netMode}"
            );

            // Lazy reflection setup
            if (fieldPVE == null || fieldPVP == null)
            {
                fieldPVE = typeof(Player).GetField(
                    "numberOfDeathsPVE",
                    BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public
                );
                fieldPVP = typeof(Player).GetField(
                    "numberOfDeathsPVP",
                    BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public
                );

                if (fieldPVE == null || fieldPVP == null)
                {
                    mod.Logger.Error(
                        "[DeathWebhook] CRITICAL: numberOfDeathsPVE or numberOfDeathsPVP not found"
                    );

                    // Dump all Player fields for debugging
                    foreach (
                        var f in typeof(Player).GetFields(
                            BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public
                        )
                    )
                        mod.Logger.Warn($"[DeathWebhook] Player field: {f.Name}");

                    return;
                }
            }

            int deathsPVE = (int)fieldPVE.GetValue(Player);
            int deathsPVP = (int)fieldPVP.GetValue(Player);

            int totalDeaths = deathsPVE + deathsPVP;

            mod.Logger.Info(
                $"[DeathWebhook] Total deaths = {totalDeaths} (PVE {deathsPVE} + PVP {deathsPVP})"
            );

            // PUT only on server
            if (Main.netMode == NetmodeID.Server)
            {
                _ = PutDeathAsync(Player.name, totalDeaths);
            }
            else
            {
                mod.Logger.Info("[DeathWebhook] Not server mode, skipping PUT");
            }
        }

        private static async Task PutDeathAsync(string playerName, int totalDeaths)
        {
            var mod = ModContent.GetInstance<PlayerDeathWebhook>();

            try
            {
                var json = $"{{\"playerName\":\"{playerName}\",\"playerDeaths\":{totalDeaths}}}";

                mod.Logger.Info($"[DeathWebhook] PUT body: {json}");

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                content.Headers.ContentType.CharSet = "utf-8";

                var request = new HttpRequestMessage(
                    HttpMethod.Put,
                    "http://api.elsie.cafe/deathcount"
                )
                {
                    Content = content,
                };
                request.Headers.UserAgent.ParseAdd("PlayerDeathWebhook/1.0");

                HttpResponseMessage response = await httpClient.SendAsync(request);

                mod.Logger.Info(
                    $"[DeathWebhook] PUT status {(int)response.StatusCode} ({response.StatusCode})"
                );
            }
            catch (System.Exception ex)
            {
                mod.Logger.Error("[DeathWebhook] PUT failed", ex);
            }
        }
    }
}
