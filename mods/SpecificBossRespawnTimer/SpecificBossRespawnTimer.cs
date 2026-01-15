using System.ComponentModel;
using CalamityMod;
using Mono.Cecil.Cil;
using MonoMod.Cil;
using Terraria;
using Terraria.DataStructures;
using Terraria.ModLoader;
using Terraria.ModLoader.Config;

namespace SpecificBossRespawnTimer
{
    public class SpecificBossRespawnTimer : Mod { }

    public class BossRespawnConfig : ModConfig
    {
        public override ConfigScope Mode => ConfigScope.ServerSide;

        [Header("Respawn_Times_Seconds")]
        [DefaultValue(90)]
        [Range(0, 3600)]
        public int BossRespawnTime;
    }

    public class BossRespawnTimer : ModPlayer
    {
        public override void Kill(
            double damage,
            int hitDirection,
            bool pvp,
            PlayerDeathReason damageSource
        )
        {
            var config = ModContent.GetInstance<BossRespawnConfig>();

            if (CalamityUtils.AnyBossNPCS())
            {
                Player.respawnTimer = config.BossRespawnTime * 60;
                return;
            }
        }
    }

    public class BossRespawnTimerEdits : ModSystem
    {
        public override void PostSetupContent()
        {
            IL_Player.UpdateDead += PatchRespawnTimerCap;
        }

        private void PatchRespawnTimerCap(ILContext il)
        {
            var cursor = new ILCursor(il);
            int patchCount = 0;

            // Patch all instances of 3600 (60 second cap) to 216000 (3600 seconds)
            while (cursor.TryGotoNext(MoveType.Before, x => x.MatchLdcI4(3600)))
            {
                cursor.Remove();
                cursor.Emit(OpCodes.Ldc_I4, 216000);
                patchCount++;
            }

            if (patchCount == 0)
            {
                Mod.Logger.Warn(
                    "Failed to patch respawn timer cap - vanilla code may have changed"
                );
            }
            else
            {
                Mod.Logger.Info($"Successfully patched {patchCount} respawn timer cap(s)");
            }
        }
    }
}
