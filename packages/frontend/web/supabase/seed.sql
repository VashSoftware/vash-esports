insert into platforms
  (name, url)
values
  ('osu!', 'https://osu.ppy.sh'),
  ('osu! (username)', 'https://osu.ppy.sh'),
  ('Discord', 'https://discord.com');

insert into games
  (name)
values
  ('osu!');

insert into mods
  (name, order_no, code)
values
  ('No Mod', 1, NULL),
  ('Hidden', 2, 'HD'),
  ('Hard Rock', 3, 'HR'),
  ('Double Time', 4, 'DT'),
  ('Free Mod', 5, 'FM'),
  ('Tiebreaker', 6, 'TB');

insert into match_participant_player_states
  (name, emoji)
values
  ('Offline', '🔴'),
  ('Online', '🟡'),
  ('Joined', '🟢'),
  ('Ready', '✅'),
  ('Playing', '🎮');