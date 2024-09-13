# Cesar Discord bot for the CES Gaming Discord server

## TODO:

-   ~~Count channel auto-moderation~~
-   ~~Member count channel~~
-   Logs
    -   member join/leave
    -   member kick
    -   member ban/unban
-   Role memory and auto-assign
-   Commands
    -   Announce stream
    -   ~~BWS calculator~~
    -   Moderation
        -   Kick
        -   Ban
        -   Tempban
        -   Timeout
        -   Warn
        -   Clean
        -   Slowmode
    -   Referee tools
    -   Challonge API
    -   Google API
    -   Bancho API
    -   osu! API
-   Music
-   Auto-provision voice channels
-   Ticket system
-   Verification system
-   Role commands
-   Automod
-   YouTube auto-announce
-   Embeds


## Development

1. Clone the repo, install the dependencies

```bash
git clone https://github.com/Competetive-Electronic-Sports/ces-discord-bot.git
npm install
```

2. Rename `example.env` to `.env` and fill out the properties.

3. Deploy application commands to your guildId

```bash
npm run deploy
```

4. Run your app in development mode

```bash
npm run dev
```
