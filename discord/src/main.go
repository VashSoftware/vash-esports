package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	discord, err := discordgo.New("Bot " + os.Getenv("DISCORD_TOKEN"))
	if err != nil {
		log.Fatal(err)
	}

	discord.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		fmt.Printf("Bot is running as %s\n", r.User.Username)
	})

	discord.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		data := i.ApplicationCommandData()
		switch data.Name {
		case "queue":
			joinQueue()
			if err != nil {
				log.Fatal(err)
			}

			err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "You have joined the queue!",
				},
			})
			if err != nil {
				log.Fatal(err)
			}
		}
	})

	registerCommands(discord)

	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	go func() {
		for range ticker.C {
			checkOngoingMatches(discord)
		}
	}()

	err = discord.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer discord.Close()

	sigch := make(chan os.Signal, 1)
	signal.Notify(sigch, os.Interrupt)
	<-sigch
}

func registerCommands(discord *discordgo.Session) {
	_, err := discord.ApplicationCommandBulkOverwrite(
		os.Getenv("DISCORD_APPLICATION_ID"),
		os.Getenv("DISCORD_GUILD_ID"),
		[]*discordgo.ApplicationCommand{
			{
				Name:        "queue",
				Description: "Join the quick queue.",
			},
		})
	if err != nil {
		log.Fatal(err)
	}
}

func joinQueue() {
	client := http.Client{}

	req, err := http.NewRequest(
		"POST",
		os.Getenv("SUPABASE_URL")+"/rest/v1/quick_queue",
		bytes.NewBuffer([]byte(`{"team_id": 2, "position": 1}`)))
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("Authorization", "Bearer "+os.Getenv("SUPABASE_SERVICE_KEY"))
	if err != nil {
		log.Fatal(err)
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

}

type UserPlatform struct {
	ID         int    `json:"id"`
	Value      string `json:"value"`
	UserID     int    `json:"user_id"`
	CreatedAt  string `json:"created_at"`
	PlatformID int    `json:"platform_id"`
}

type UserProfile struct {
	UserPlatforms []UserPlatform `json:"user_platforms"`
}

type TeamMember struct {
	UserProfiles UserProfile `json:"user_profiles"`
}

type MatchParticipantPlayer struct {
	TeamMembers TeamMember `json:"team_members"`
}

type MatchParticipant struct {
	MatchParticipantPlayers []MatchParticipantPlayer `json:"match_participant_players"`
}

type Match struct {
	ID                  int                `json:"id"`
	CreatedAt           string             `json:"created_at"`
	RoundID             int                `json:"round_id"`
	Ongoing             bool               `json:"ongoing"`
	WinnerParticipantID *int               `json:"winner_participant_id"`
	StartTime           string             `json:"start_time"`
	IsLosersMatch       *bool              `json:"is_losers_match"`
	NextMatchID         *int               `json:"next_match_id"`
	NextLosersMatchID   *int               `json:"next_losers_match_id"`
	LobbyID             string             `json:"lobby_id"`
	Type                string             `json:"type"`
	MapPoolID           int                `json:"map_pool_id"`
	Tiebreaker          bool               `json:"tiebreaker"`
	MatchParticipants   []MatchParticipant `json:"match_participants"`
}

func sendDM(discord *discordgo.Session, userID, message string) {
	channel, err := discord.UserChannelCreate(userID)
	if err != nil {
		log.Println("Error creating DM channel:", err)
		return
	}

	_, err = discord.ChannelMessageSend(channel.ID, message)
	if err != nil {
		log.Println("Error sending DM:", err)
	}
}

func checkOngoingMatches(discord *discordgo.Session) {
	client := http.Client{}
	url := os.Getenv("SUPABASE_URL") + "/rest/v1/matches?ongoing=eq.true&select=*,match_participants(match_participant_players(team_members(user_profiles(user_platforms(*)))))"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("Error creating request:", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+os.Getenv("SUPABASE_SERVICE_KEY"))

	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("Error reading response body:", err)
			return
		}

		var matches []Match
		err = json.Unmarshal(body, &matches)
		if err != nil {
			log.Println("Error unmarshalling response body:", err)
			return
		}

		for _, match := range matches {
			for _, participant := range match.MatchParticipants {
				for _, player := range participant.MatchParticipantPlayers {
					for _, platform := range player.TeamMembers.UserProfiles.UserPlatforms {
						if platform.PlatformID == 3 { // Discord platform ID
							userID := platform.UserID

							// Check if a notification already exists
							if !notificationExists(userID, match.ID) {
								// Send DM and create a notification record
								discordID := platform.Value
								sendDM(discord, discordID, "Your match is ongoing!")
								createNotification(userID, "Your match is ongoing!", "discord_dm")
							}
						}
					}
				}
			}
		}
	} else {
		body, _ := io.ReadAll(resp.Body)
		log.Println("Request failed with status:", resp.StatusCode)
		log.Println("Response Body:", string(body))
	}
}

func notificationExists(userID, matchID int) bool {
	client := http.Client{}
	url := os.Getenv("SUPABASE_URL") + fmt.Sprintf("/rest/v1/notifications?user_id=eq.%d&type=eq.discord_dm&href=eq.%d", userID, "/matches/"+strconv.Itoa(matchID))
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("Error creating request:", err)
		return false
	}

	req.Header.Set("Authorization", "Bearer "+os.Getenv("SUPABASE_SERVICE_KEY"))

	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error making request:", err)
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		var notifications []interface{}
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("Error reading response body:", err)
			return false
		}
		err = json.Unmarshal(body, &notifications)
		if err != nil {
			log.Println("Error unmarshalling response body:", err)
			return false
		}

		return len(notifications) > 0
	}

	return false
}

func createNotification(userID int, message, notifType string, matchId int) {
	client := http.Client{}
	url := os.Getenv("SUPABASE_URL") + "/rest/v1/notifications"
	notification := map[string]interface{}{
		"user_id": userID,
		"title":   message,
		"type":    notifType,
		"href":    "/matches/" + strconv.Itoa(matchId),
	}
	notificationData, err := json.Marshal(notification)
	if err != nil {
		log.Println("Error marshalling notification data:", err)
		return
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(notificationData))
	if err != nil {
		log.Println("Error creating request:", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+os.Getenv("SUPABASE_SERVICE_KEY"))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "resolution=merge-duplicates")

	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		log.Println("Failed to create notification with status:", resp.StatusCode)
		log.Println("Response Body:", string(body))
	}
}
