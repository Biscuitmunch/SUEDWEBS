using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Terraria;
using Terraria.GameContent.Bestiary;
using Terraria.ID;
using Terraria.ModLoader;

namespace BossTrackerWebhook
{
    public sealed class BossTrackerWebhook : Mod
    {
        internal static BossTrackerWebhook Instance;

        public override void Load()
        {
            Instance = this;
            Logger.Info("[BossWebhook] Mod loaded");
        }

        public override void Unload()
        {
            Logger.Info("[BossWebhook] Mod unloaded");
            Instance = null;
        }
    }

    public sealed class BossKillTracker : GlobalNPC
    {
        private static readonly HttpClient httpClient = new HttpClient();

        public override void OnKill(NPC npc)
        {
            if (Main.netMode != NetmodeID.Server)
                return;
            if (!npc.boss)
                return;

            BossTrackerWebhook.Instance.Logger.Info(
                $"[BossWebhook] OnKill fired for NPC {npc.type}"
            );

            // Get Slain count from BestiaryTracker
            int slainCount = Main.BestiaryTracker.Kills.GetKillCount(npc);

            // Get display name
            string bossName = Lang.GetNPCNameValue(npc.type) ?? $"Boss_{npc.type}";

            BossTrackerWebhook.Instance.Logger.Info(
                $"[BossWebhook] Boss defeated: {bossName} (Slain #{slainCount})"
            );

            // Send webhook
            _ = SendWebhookAsync(bossName, slainCount);
        }

        private static async Task SendWebhookAsync(string bossName, int slainCount)
        {
            try
            {
                BossTrackerWebhook.Instance.Logger.Info(
                    $"[BossWebhook] Sending PUT for {bossName} (Slain #{slainCount})"
                );

                var json = $"{{\"bossName\":\"{bossName}\",\"bossKills\":{slainCount}}}";

                mod.Logger.Info($"[DeathWebhook] PUT body: {json}");

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage resp = await httpClient.PutAsync(
                    "http://api.elsie.cafe/bosskills",
                    content
                );

                BossTrackerWebhook.Instance.Logger.Info(
                    $"[BossWebhook] PUT status {(int)resp.StatusCode} ({resp.StatusCode})"
                );
            }
            catch (Exception ex)
            {
                BossTrackerWebhook.Instance.Logger.Error("[BossWebhook] Webhook error", ex);
            }
        }
    }
}
