import { createClient } from "@supabase/supabase-js";
// import { auth, v2 } from "osu-api-extended";
import Banchojs from "bancho.js";

// await auth.login({
//     method: "v2",
//     client_id: process.env.OSU_CLIENT_ID!,
//     client_secret: process.env.OSU_CLIENT_SECRET!,
//     scopes: ["public"],
//     // api_key: !,
// });

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
        global: {
            headers: { Authorization: req.headers.get("Authorization")! },
        },
    },
);

const banchoClient = new Banchojs.BanchoClient({
    username: "jollyWudchip",
    password: process.env.OSU_IRC_KEY!,
});

const { data, error } = await supabase
    .from("matches")
    .select(
        `*, 
      rounds (*, 
        map_pools(*,
          map_pool_mods(*,
            map_pool_mod_mods(*,
              mods(*
              )
            ),
            map_pool_maps(*,
              maps(*, 
                mapsets(*
                )
              )
            )
          )
        ),
        events(*, event_groups(*))
      ),
      match_participants(*,
        match_participant_players(*,
          match_participant_player_states(*
          ),
          team_members(*, 
            user_profiles(*
            )
          )
        ),
        participants(*, 
          teams(*
          )
        )
      ),
      match_maps(*, map_pool_maps(*, maps(*, mapsets(*))), scores(*, match_participant_players(*))),
      match_bans(*, match_participants(*, participants(*, teams(name))))`,
    );

await banchoClient.connect();

const channel = await banchoClient.createLobby(
    "VASH: (Stan) vs (Stan 2)",
    true,
);

const updatedMatch = await supabase.from("matches").update({
    channel_name: channel.lobby.id,
}).eq("id", match.id).select();

banchoClient.on(
    "PM",
    (message) => console.log(`${message.user.ircUsername}: ${message.message}`),
);
