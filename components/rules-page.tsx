"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Download, FileText, Search, ChevronDown, ChevronRight, Shield, 
  Car, Users, Store, Radio, MapPin, Swords, MessageSquare, 
  Heart, Stethoscope, Ticket, Video, AlertTriangle, Gavel, Plane, 
  Package, Clock, Zap, UserX, Ban, Target, Castle, HandMetal,
  BookOpen, Filter, X, Printer, ArrowUp
} from "lucide-react"

type Rule = { id: string; text: string; ban?: string }
type RuleSection = {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  rules: Rule[]
}

const ruleSections: RuleSection[] = [
  {
    id: "major",
    title: "Major Rules",
    icon: <Gavel className="h-5 w-5" />,
    color: "from-red-500/20 to-red-600/5",
    rules: [
      { id: "1.1", text: "Players are requested to respect Paradise Team and the Community." },
      { id: "1.2", text: "RDM (Random Death Match) will lead to ban depending on severity.", ban: "72 hours" },
      { id: "1.3", text: "VDM (Vehicle Death Match) will lead to a ban depending on severity.", ban: "24 hours" },
      { id: "1.4", text: "NLR (New Life Rule) must be followed. You can't get involved in a situation in which you have died and respawned.", ban: "24 hours" },
      { id: "1.5", text: "Revenge RP is strictly prohibited and will lead to a ban.", ban: "24 hours" },
      { id: "1.6", text: "Anyone found using Duplication, Exploiting Glitches/Bugs will lead to a Permanent Ban.", ban: "Permanent" },
      { id: "1.7", text: "Using Third Party Softwares/Hacks will lead to a Permanent Ban (With no unban appeal).", ban: "Permanent" },
      { id: "1.8", text: "Being toxic to someone off character may lead to temp ban.", ban: "Temp Ban" },
      { id: "1.9", text: "Abusing in (OOC/Twitter/ME) will lead to a permanent ban.", ban: "Permanent" },
      { id: "1.10", text: "Meta gaming is strictly prohibited (using information out-of-character in roleplay, stream sniping, identifying people by looking up their game IDs etc.).", ban: "32 hours" },
      { id: "1.11", text: "Power gaming is strictly Prohibited - anything that gives unfair advantage in roleplaying.", ban: "72 hours" },
      { id: "1.12", text: "Do not spam in chat (in-game and discord), it may lead to a kick.", ban: "Kick" },
      { id: "1.13", text: "Everyone should cooperate and respect Content Creators. Stream sniping may cause temp ban.", ban: "Temp Ban" },
      { id: "1.14", text: "Combat Logging - Intentionally disconnecting during a Situation will lead to ban.", ban: "48 hours" },
      { id: "1.15", text: "You Cannot Shoot or Rob an EMS in any situation, unless they are seen in RDM zones." },
      { id: "1.16", text: "Disrespecting or Abusing a Staff member will lead to a Permanent Ban.", ban: "Permanent" },
      { id: "1.17", text: "Scamming is not allowed! It can lead to permanent ban.", ban: "12 hours" },
      { id: "1.18", text: "While reporting a player, you must have video proof (minimum 5 minutes) of the situation." },
      { id: "1.19", text: "You can't force someone to get money out of their bank account while robbing them." },
      { id: "1.20", text: "Code-Red has to be initiated verbally." },
      { id: "1.21", text: "All Gang members must have their Gang Tags while in game.", ban: "12 hours" },
      { id: "1.22", text: "Using special characters in your name will lead to a kick from the server.", ban: "16 hours" },
      { id: "1.23", text: "Associating with a hacker (taking money, items, guns or hiding their identity) will lead to a permanent ban.", ban: "Permanent" },
      { id: "1.24", text: "Fear RP should be followed.", ban: "24 hours" },
      { id: "1.25", text: "LSPD IS NOT ALLOWED TO INITIATE CODE RED. ONLY GANGS CAN INITIATE CODE REDS." },
      { id: "1.26", text: "Any kind of disrespect to content creators or female players will lead to a permanent ban.", ban: "Permanent" },
      { id: "1.27", text: "Your ingame name & discord name should remain same.", ban: "48 hours" },
      { id: "1.28", text: "Helmets are not allowed in server.", ban: "24 hours" },
      { id: "1.29", text: "Transaction of 1 Million without POV is not allowed. Your account will be wiped if caught.", ban: "Account Wipe" },
      { id: "1.30", text: "It is forbidden to use OBS without overlays. All overlays must be recorded." },
      { id: "1.31", text: "YOU CANNOT PLAY FROM YOUR OTHER STEAM ACCOUNTS.", ban: "Permanent" },
    ],
  },
  {
    id: "failrp",
    title: "Fail RP Rules",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "from-orange-500/20 to-orange-600/5",
    rules: [
      { id: "2.1", text: "Fail RP - Any action that breaks roleplay immersion.", ban: "48 hours" },
      { id: "2.2", text: "Carrying/Un-Carrying while dead will be considered Fail RP.", ban: "48 hours" },
      { id: "2.3", text: "Any shots fired from moving vehicle will be considered fail RP unless code red has been initiated verbally." },
      { id: "2.4", text: "You cannot wear any type of Ped during code red." },
      { id: "2.5", text: "If you die during a situation you have to wait at least 5 minutes for respawn before leaving.", ban: "24 hours" },
    ],
  },
  {
    id: "codered",
    title: "Code Red Rules",
    icon: <Zap className="h-5 w-5" />,
    color: "from-red-600/20 to-red-700/5",
    rules: [
      { id: "3.1", text: "Code-Red has to be initiated verbally." },
      { id: "3.2", text: "Code red cannot be initiated whilst the vehicles are moving." },
      { id: "3.3", text: "If anyone has PL above 10% they can't respond to code red situations.", ban: "24 hours" },
      { id: "3.4", text: "Your PL, fps, and ping must be visible on your POV during code red situations.", ban: "6 hours" },
      { id: "3.5", text: "After a code red situation is over, you CANNOT disconnect from server. You must get revived & leave OR respawn." },
      { id: "3.6", text: "During code red if anyone is shooting out of the red circle, they will be banned.", ban: "72 hours" },
      { id: "3.7", text: "Initiating through helicopters are strictly not allowed." },
      { id: "3.8", text: "You CAN NOT initiate on Police by sending a police dispatch." },
    ],
  },
  {
    id: "combat",
    title: "Combat Rules",
    icon: <Swords className="h-5 w-5" />,
    color: "from-amber-500/20 to-amber-600/5",
    rules: [
      { id: "4.1", text: "Combat Logging - Intentionally disconnecting during a Situation.", ban: "48 hours" },
      { id: "4.2", text: "Combat Storing - Storing valuables during chase/fight/active situation.", ban: "48 hours" },
      { id: "4.3", text: "Combat Reviving - Healing yourself or reviving fellow player in code red.", ban: "36-72 hours" },
      { id: "4.4", text: "If someone gets banned for Combat Logging, their inventory will be wiped too.", ban: "Inventory Wipe" },
      { id: "4.5", text: "Ghost peak/Silent peak is not allowed.", ban: "32 hours" },
    ],
  },
  {
    id: "pitting",
    title: "Vehicle Pitting Rules",
    icon: <Car className="h-5 w-5" />,
    color: "from-blue-500/20 to-blue-600/5",
    rules: [
      { id: "5.1", text: "Pitting is allowed to destroy the other person's vehicle but code red must be verbally initiated." },
      { id: "5.2", text: "Code red cannot be initiated whilst the vehicles are moving." },
      { id: "5.3", text: "Any shots fired from moving vehicle will be considered fail RP unless code red has been initiated." },
      { id: "5.4", text: "Any type of verbal communication is not valid in any type of car chase (Rebels vs Rebels & PD vs Rebels)." },
      { id: "5.5", text: "Anyone seen using or violating Military Vehicles will be banned (Except Military).", ban: "48 hours" },
    ],
  },
  {
    id: "kidnapping",
    title: "Kidnapping Rules",
    icon: <UserX className="h-5 w-5" />,
    color: "from-purple-500/20 to-purple-600/5",
    rules: [
      { id: "6.1", text: "You can only kidnap a COP/Civilian only if you have a legit reason - Minimum 2 members required." },
      { id: "6.2", text: "FOR KIDNAPPING A CIVILIAN YOU HAVE TO GIVE MINIMUM 10 SECONDS FOR HANDSUP." },
      { id: "6.3", text: "You cannot kidnap taxi driver.", ban: "48 hours" },
      { id: "6.4", text: "You cannot kidnap Weazel News Department employees." },
      { id: "6.5", text: "Only gangs that have a rivalry can start a kidnapping situation against each other.", ban: "4 days" },
      { id: "6.6", text: "YOU ARE NOT ALLOWED TO PUNCH/ROB/KIDNAP CRIMINALS SENT FOR JAIL." },
      { id: "6.7", text: "YOU CANNOT USE /TAKEHOSTAGE COMMAND UNTIL THE PERSON IS NOT HANDSUP.", ban: "24 hours" },
    ],
  },
  {
    id: "robbery-general",
    title: "Robbery General Rules",
    icon: <Package className="h-5 w-5" />,
    color: "from-emerald-500/20 to-emerald-600/5",
    rules: [
      { id: "7.1", text: "Robbers are advised to use Masks during any type of robbery in order not to get identified." },
      { id: "7.2", text: "Tasing is highly prohibited during Hostage Situation, unless the robber's gun is not pointed at the Hostage." },
      { id: "7.3", text: "Hostage is top priority in any situation." },
      { id: "7.4", text: "Robbers are not allowed to Execute Hostage for no reason." },
      { id: "7.5", text: "If the Robbers get caught, they have to do FEAR RP and show fear towards the Cops." },
      { id: "7.6", text: "You must have a hostage in a Robbery in order to negotiate with the cops or buy time." },
      { id: "7.7", text: "You can't run during an ongoing negotiation. Negotiations must end in order to run away." },
      { id: "7.8", text: "In a hostage situation robbers are not allowed to ask for more than 2 (possible and valid) demands." },
      { id: "7.9", text: "Robbing a COP/EMS is strictly prohibited." },
      { id: "7.10", text: "You can not start any robbery knowingly that server is about to restart." },
    ],
  },
  {
    id: "jewelry",
    title: "Jewelry Robbery",
    icon: <Store className="h-5 w-5" />,
    color: "from-cyan-500/20 to-cyan-600/5",
    rules: [
      { id: "8.1", text: "Amount of Robbers and Cops allowed at Jewelry Robberies is 4." },
      { id: "8.2", text: "A gang can only trigger Jewelry robbery once after every hour.", ban: "48 hours" },
      { id: "8.3", text: "Five-0 and LSPD will now respond together on robberies (4 LSPD + 4 Five-0 officers)." },
    ],
  },
  {
    id: "bank",
    title: "Bank Robbery Rules",
    icon: <Store className="h-5 w-5" />,
    color: "from-green-500/20 to-green-600/5",
    rules: [
      { id: "9.1", text: "Small Banks: Amount of Robbers allowed is 6, while 7 cops are allowed to respond." },
      { id: "9.2", text: "Code red must be initiated verbally and at least 30 seconds heads up have to be given to the Cops." },
      { id: "9.3", text: "Main Bank: A Maximum of 10 Cops Can Respond To A Situation." },
    ],
  },
  {
    id: "shop",
    title: "Shop Robbery",
    icon: <Store className="h-5 w-5" />,
    color: "from-teal-500/20 to-teal-600/5",
    rules: [
      { id: "10.1", text: "Amount of Robbers and Cops allowed at Shop Robbery is 2." },
      { id: "10.2", text: "Only Pistol And Shot Gun Is Allowed At Shop Robbery.", ban: "32 hours" },
    ],
  },
  {
    id: "humane",
    title: "Humane Labs & Airplane Robbery",
    icon: <Plane className="h-5 w-5" />,
    color: "from-indigo-500/20 to-indigo-600/5",
    rules: [
      { id: "11.1", text: "There is no limit for participating for Robbers or LSPD. Multiple Gangs are allowed to do the robbery together." },
      { id: "11.2", text: "You can't take a hostage to Humane Labs or Airplane Robbery." },
      { id: "11.3", text: "Every available weapon (unless blacklisted) is allowed to be used by robbers." },
      { id: "11.4", text: "AIRPLANE ROBBERY - You are not allowed to camp the teleporter. Stand behind the yellow line in the hangar." },
      { id: "11.5", text: "You CAN NOT INITIATE CODE RED DIRECTLY DURING AIRCRAFT HEIST. You have to tweet before initiating." },
    ],
  },
  {
    id: "steal",
    title: "Steal Command Rules",
    icon: <HandMetal className="h-5 w-5" />,
    color: "from-pink-500/20 to-pink-600/5",
    rules: [
      { id: "12.1", text: "To use steal command, you should have Gun Pointed On the Player." },
      { id: "12.2", text: "You Cannot Steal stuff from Police, EMS, Weazel News & Govt Members." },
      { id: "12.3", text: "You Cannot Steal from People in SafeZone." },
      { id: "12.4", text: "You must have higher manpower in order to steal from other party." },
      { id: "12.5", text: "You can only steal from those gang members with whom you have rivalry." },
      { id: "12.6", text: "You need minimum 2 members to steal/rob a single person." },
      { id: "12.7", text: "You have to press X for handsup. Doing emote for handsup is power gaming.", ban: "24 hours" },
    ],
  },
  {
    id: "radio",
    title: "Radio & Tracker Rules",
    icon: <Radio className="h-5 w-5" />,
    color: "from-violet-500/20 to-violet-600/5",
    rules: [
      { id: "13.1", text: "AS SOON AS YOU TAKE SOMEONE'S RADIO YOU HAVE TO GO SIT IN THEIR PERSON'S WAITING CHANNEL OR DEAFEN YOURSELF." },
    ],
  },
  {
    id: "safezone",
    title: "Safe Zone Rules",
    icon: <MapPin className="h-5 w-5" />,
    color: "from-lime-500/20 to-lime-600/5",
    rules: [
      { id: "14.1", text: "VDM in a safe zone may lead to ban (depending on severity)." },
      { id: "14.2", text: "You are not allowed to carry weapons in safe zone (Hospital/Mechanic/Dealership/Casino)." },
      { id: "14.3", text: "Running from a situation and hiding in the safe zone may lead to ban.", ban: "16 hours" },
      { id: "14.4", text: "PD is a Safe Zone for LSPD unless your gang member is being held at the PD." },
      { id: "14.5", text: "You can't kidnap/kill/rob anyone within a 100 meters radius of a safe zone." },
      { id: "14.6", text: "All Garages, Petrol Stations, Shops, Car Dealership, Mechanic and Banks are UNSCRIPTED SAFEZONE." },
      { id: "14.7", text: "Government House Is Safe Zone. Same Rules Apply." },
      { id: "14.8", text: "Spraying at LSPD, Five-O Station & Hospital is strictly prohibited.", ban: "32 hours" },
      { id: "14.9", text: "Spraying at Paradise Staff office is strictly prohibited.", ban: "32 hours" },
    ],
  },
  {
    id: "cuffing",
    title: "Cuffing Rules",
    icon: <Ban className="h-5 w-5" />,
    color: "from-rose-500/20 to-rose-600/5",
    rules: [
      { id: "15.1", text: "IF YOU TRY TO PUNCH A POLICE OFFICER WHEN HE'S CUFFING (DURING THE ANIMATION), YOU WILL BE BANNED." },
      { id: "15.2", text: "PD has the right to ask for compensation + search the suspect if someone combat logs while PD is about to search them." },
    ],
  },
  {
    id: "rdmzone",
    title: "RDM Zone Rules",
    icon: <Target className="h-5 w-5" />,
    color: "from-red-500/20 to-red-600/5",
    rules: [
      { id: "16.1", text: "UNEMPLOYED AND EMS ARE NOT ALLOWED IN RDM ZONES (COCAINE_LABS, MONEY_WASH, WEED_LABS)." },
      { id: "16.2", text: "IT IS A RDM ZONE, ANYBODY SEEN IN THIS AREA ARE TO BE SHOT DEAD BY THE COPS WITHOUT ANY INITIATION." },
      { id: "16.3", text: "GANGS CAN MAKE COCAINE TOGETHER, BUT COPS OR SHERIFF CANNOT MAKE COCAINE. They will be removed from factions." },
      { id: "16.4", text: "If someone sees a person leaving RDM zone, they can follow and kill without initiate (POV required)." },
      { id: "16.5", text: "YOU CANNOT KILL A PERSON OUTSIDE OF RDM ZONE RADIUS." },
      { id: "16.6", text: "NLR must be applied in every RDM zones." },
      { id: "16.7", text: "You cannot carry your teammate in RDM zones." },
    ],
  },
  {
    id: "cayo",
    title: "Cayo Perico Rules",
    icon: <Castle className="h-5 w-5" />,
    color: "from-sky-500/20 to-sky-600/5",
    rules: [
      { id: "17.1", text: "Cayo Perico is a Red-Zone Area. You are allowed to shoot without any initiation." },
      { id: "17.2", text: "LSPD can Search you right after killing you in Cayo Perico Red zone." },
      { id: "17.3", text: "EMS is not allowed to respond at Cayo Perico." },
      { id: "17.4", text: "NLR still applies at Cayo Perico." },
      { id: "17.5", text: "Carrying someone within the RDM zone [Cayo Perico] is prohibited." },
      { id: "17.6", text: "Collaborating with other gangs or forming alliances for Code Red at Cayo Perico is not allowed." },
    ],
  },
  {
    id: "territory",
    title: "Territory Zone Rules",
    icon: <MapPin className="h-5 w-5" />,
    color: "from-amber-500/20 to-amber-600/5",
    rules: [
      { id: "18.1", text: "Stay within the zone by keeping an eye on the left-side overlay." },
      { id: "18.2", text: "The New Life Rule (NLR) applies across all zones." },
      { id: "18.3", text: "EMS cannot enter during zone fights." },
      { id: "18.4", text: "LSPD must declare their involvement with a 10-11 dispatch before joining a zone fight." },
      { id: "18.5", text: "Bring backup from your own gang, no support from other gangs or alliances." },
      { id: "18.6", text: "LSPD can only join fights within a 10-11 radius on their GPS." },
      { id: "18.7", text: "Before starting a code red in the zone, each gang needs to post an anonymous tweet." },
      { id: "18.8", text: "Combat reviving during active zone fights is strictly prohibited." },
      { id: "18.9", text: "Once the zone war timer ends, code red activities must cease." },
      { id: "18.10", text: "All parties must type 'OVER FROM [gang/faction name]' in OOC chat after timer ends." },
      { id: "18.11", text: "After code red, PD can search gang members but rebels with more manpower can point guns and ask them to leave." },
      { id: "18.12", text: "Alliance is allowed in zones after the code red ends (when asking PD to leave)." },
      { id: "18.13", text: "During zone fights in small areas, nearest 2 plots will be considered within the code red radius." },
      { id: "18.14", text: "Zone wars near the LSPD station and safe zones are strictly prohibited for gangs." },
      { id: "18.15", text: "Gangs are not permitted to use helicopters at high altitudes for territory zones.", ban: "72 hours" },
      { id: "18.16", text: "No one is allowed to take zones on MrJayPlays stream. Turf menu will be revoked for a week." },
      { id: "18.17", text: "The gang who starts a zone war must post an Anonymous tweet before starting.", ban: "48 hours" },
    ],
  },
  {
    id: "powergaming",
    title: "Power Gaming Rules",
    icon: <Zap className="h-5 w-5" />,
    color: "from-yellow-500/20 to-yellow-600/5",
    rules: [
      { id: "19.1", text: "Power gaming ban duration: 72 hours.", ban: "72 hours" },
      { id: "19.2", text: "Powergaming is defined as anything that gives unfair advantage or makes it difficult for other party to roleplay." },
      { id: "19.3", text: "You can only use /me to disable weapon and take communications. Other /me's like 'ties legs' are power gaming." },
      { id: "19.4", text: "IT IS NOT ALLOWED TO ASK EMS TO NOT REVIVE. Maximum you can ask EMS to take to hospital and revive." },
      { id: "19.5", text: "Using emote for handsup instead of pressing X is power gaming." },
      { id: "19.6", text: "Using Ped lights feature from menu is prohibited.", ban: "24 hours" },
      { id: "19.7", text: "Any type of Graphic pack that removes water, bushes or props are not allowed.", ban: "Permanent" },
    ],
  },
  {
    id: "initiation",
    title: "Initiation Rules",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "from-fuchsia-500/20 to-fuchsia-600/5",
    rules: [
      { id: "20.1", text: "Failed Initiation ban duration: 24 hours.", ban: "24 hours" },
      { id: "20.2", text: "If you intend to show threat to someone, you must verbally impose the same." },
      { id: "20.3", text: "Initiations should be clearly communicated through voice chat ONLY (/me commands not valid)." },
      { id: "20.4", text: "Initiating through helicopters are strictly not allowed." },
      { id: "20.5", text: "You CAN NOT initiate on Police by sending a police dispatch." },
      { id: "20.6", text: "If a player gets revived after a gun fight, he should leave or continue RP. Cannot join the fight again." },
      { id: "20.7", text: "Any player not part of an established gang or faction is liable to initiate for himself." },
      { id: "20.8", text: "Every gang has to initiate role-play for themselves." },
    ],
  },
  {
    id: "alliance",
    title: "Alliance Rules",
    icon: <Users className="h-5 w-5" />,
    color: "from-blue-500/20 to-blue-600/5",
    rules: [
      { id: "21.1", text: "Alliance ban duration for violations: 72 hours.", ban: "72 hours" },
      { id: "21.2", text: "Alliance is only valid in roleplay situations. No alliance is valid during code reds." },
      { id: "21.3", text: "No gang is allowed to ask for/respond to any backup calls for code reds." },
      { id: "21.4", text: "If alliance needs backup, they must type /TWEET in OOC and call them. Other gang must reply in OOC." },
      { id: "21.5", text: "Alliance is allowed in zones after the code red ends (when asking PD to leave)." },
    ],
  },
  {
    id: "ooc",
    title: "OOC Chat Rules",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "from-slate-500/20 to-slate-600/5",
    rules: [
      { id: "22.1", text: "/me is considered in RP. You can't type OOC stuff in /me unless you have permission." },
      { id: "22.2", text: "Trash talking in OOC or using OOC for in character chat will lead to a ban." },
      { id: "22.3", text: "Spamming OOC chat will lead to a kick from the server.", ban: "Kick" },
      { id: "22.4", text: "Calling EMS in OOC chat is strictly prohibited. Use distress signal or phone." },
      { id: "22.5", text: "Abusive language will not be tolerated.", ban: "6 hours" },
      { id: "22.6", text: "Taunting anyone ingame/on discord would lead to Strict Action." },
    ],
  },
  {
    id: "erp",
    title: "Erotic RP Rules",
    icon: <Heart className="h-5 w-5" />,
    color: "from-pink-500/20 to-pink-600/5",
    rules: [
      { id: "23.1", text: "ERP (Erotic Role Play) is strictly prohibited.", ban: "72 hours" },
      { id: "23.2", text: "ERP is any role-playing activity performed mostly or exclusively for the purpose of sexual behavior." },
    ],
  },
  {
    id: "ems",
    title: "EMS Rules",
    icon: <Stethoscope className="h-5 w-5" />,
    color: "from-red-400/20 to-red-500/5",
    rules: [
      { id: "24.1", text: "EMS is not allowed to revive or carry anyone to the hospital in an on-going situation." },
      { id: "24.2", text: "You cannot carry your died player and bring to hospital when EMS is in the city. Wait for EMS to respond." },
      { id: "24.3", text: "EMS cannot enter during zone fights." },
      { id: "24.4", text: "EMS is not allowed to respond at Cayo Perico." },
    ],
  },
  {
    id: "ticket",
    title: "Ticket & Report Rules",
    icon: <Ticket className="h-5 w-5" />,
    color: "from-orange-400/20 to-orange-500/5",
    rules: [
      { id: "25.1", text: "It's must to say 'Save POV' in valid format to make your ticket report valid." },
      { id: "25.2", text: "For report-player ticket you need to provide a video proof (minimum 5 minutes)." },
      { id: "25.3", text: "False reports may lead to punishment.", ban: "Warning" },
      { id: "25.4", text: "Respect staff decisions. Arguing excessively may lead to punishment." },
    ],
  },
  {
    id: "recording",
    title: "Recording Rules",
    icon: <Video className="h-5 w-5" />,
    color: "from-cyan-400/20 to-cyan-500/5",
    rules: [
      { id: "26.1", text: "It is forbidden to use OBS without overlays. All overlays must be recorded." },
      { id: "26.2", text: "Your PL, fps, and ping must be visible on your POV during code red situations.", ban: "6 hours" },
      { id: "26.3", text: "While reporting a player, you must have video proof (minimum 5 minutes) of the situation." },
      { id: "26.4", text: "Transaction of 1 Million without POV is not allowed.", ban: "Account Wipe" },
    ],
  },
  {
    id: "misc",
    title: "Miscellaneous Rules",
    icon: <Shield className="h-5 w-5" />,
    color: "from-neutral-500/20 to-neutral-600/5",
    rules: [
      { id: "27.1", text: "Respect all players and staff members at all times." },
      { id: "27.2", text: "Use common sense in all situations." },
      { id: "27.3", text: "Rules may be updated at any time. Check regularly for changes." },
      { id: "27.4", text: "Ignorance of rules is not an excuse for breaking them." },
      { id: "27.5", text: "Staff have final say in all disputes and rule interpretations." },
    ],
  },
]

const punishmentFilters = [
  { label: "All", value: "all" },
  { label: "Permanent", value: "permanent" },
  { label: "72+ Hours", value: "72+" },
  { label: "24-48 Hours", value: "24-48" },
  { label: "Under 24h", value: "under24" },
  { label: "No Ban", value: "none" },
]

function getBanSeverity(ban?: string): string {
  if (!ban) return "none"
  const lower = ban.toLowerCase()
  if (lower.includes("permanent") || lower.includes("wipe")) return "permanent"
  if (lower.includes("72") || lower.includes("4 day") || lower.includes("96")) return "72+"
  if (lower.includes("24") || lower.includes("32") || lower.includes("36") || lower.includes("48")) return "24-48"
  return "under24"
}

function getBanColor(ban?: string): string {
  if (!ban) return "bg-neutral-800/50 text-neutral-400 border-neutral-700/50"
  const lower = ban.toLowerCase()
  if (lower.includes("permanent")) return "bg-red-950/80 text-red-300 border-red-800/50"
  if (lower.includes("wipe")) return "bg-purple-950/80 text-purple-300 border-purple-800/50"
  if (lower.includes("72") || lower.includes("4 day")) return "bg-orange-950/80 text-orange-300 border-orange-800/50"
  if (lower.includes("48") || lower.includes("36")) return "bg-yellow-950/80 text-yellow-300 border-yellow-800/50"
  if (lower.includes("24") || lower.includes("32")) return "bg-amber-950/80 text-amber-300 border-amber-800/50"
  if (lower.includes("kick") || lower.includes("warning")) return "bg-blue-950/80 text-blue-300 border-blue-800/50"
  return "bg-[#d4a94c]/10 text-[#d4a94c] border-[#d4a94c]/30"
}

export default function RulesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(ruleSections.map(s => s.id)))
  const [punishmentFilter, setPunishmentFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  const expandAll = useCallback(() => setExpandedSections(new Set(ruleSections.map(s => s.id))), [])
  const collapseAll = useCallback(() => setExpandedSections(new Set()), [])

  const filteredSections = useMemo(() => {
    return ruleSections.map(section => ({
      ...section,
      rules: section.rules.filter(rule => {
        const matchesSearch = 
          rule.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.title.toLowerCase().includes(searchQuery.toLowerCase())
        
        if (!matchesSearch) return false
        
        if (punishmentFilter === "all") return true
        if (punishmentFilter === "none") return !rule.ban
        return getBanSeverity(rule.ban) === punishmentFilter
      })
    })).filter(section => section.rules.length > 0)
  }, [searchQuery, punishmentFilter])

  const totalRules = useMemo(() => ruleSections.reduce((acc, s) => acc + s.rules.length, 0), [])
  const filteredRuleCount = useMemo(() => filteredSections.reduce((acc, s) => acc + s.rules.length, 0), [filteredSections])

  const downloadTxt = useCallback(() => {
    let content = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                         ██████╗  █████╗ ██████╗  █████╗ ██████╗ ██╗███████╗  ║
║                         ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║██╔════╝  ║
║                         ██████╔╝███████║██████╔╝███████║██║  ██║██║███████╗  ║
║                         ██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║  ██║██║╚════██║  ║
║                         ██║     ██║  ██║██║  ██║██║  ██║██████╔╝██║███████║  ║
║                         ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝  ║
║                                                                              ║
║                              R E M A S T E R E D                             ║
║                                                                              ║
║                          OFFICIAL SERVER RULES                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

                           Last Updated: ${new Date().toLocaleDateString()}

    By joining Paradise Remastered, you agree to follow all rules listed below.
                  Ignorance of rules is not an excuse for breaking them.

╔══════════════════════════════════════════════════════════════════════════════╗
║                            TABLE OF CONTENTS                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

`
    ruleSections.forEach((section, idx) => {
      const num = String(idx + 1).padStart(2, '0')
      content += `    ${num}. ${section.title.padEnd(40)} [${section.rules.length} rules]\n`
    })
    
    content += `\n${"═".repeat(80)}\n\n`
    
    ruleSections.forEach((section, idx) => {
      const num = String(idx + 1).padStart(2, '0')
      content += `\n╔${"═".repeat(78)}╗\n`
      content += `║  SECTION ${num}: ${section.title.toUpperCase().padEnd(62)}║\n`
      content += `╚${"═".repeat(78)}╝\n\n`
      
      section.rules.forEach(rule => {
        content += `    [${rule.id}] ${rule.text}\n`
        if (rule.ban) {
          content += `           ⚠ Punishment: ${rule.ban}\n`
        }
        content += `\n`
      })
    })
    
    content += `
╔══════════════════════════════════════════════════════════════════════════════╗
║                          BAN DURATION REFERENCE                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ██ PERMANENT BAN    Severe violations (hacking, exploiting, harassment)   ║
║    ██ 72+ HOURS        Major violations (RDM, power gaming, alliance)        ║
║    ██ 48 HOURS         Serious violations (combat logging, fail RP)          ║
║    ██ 24-32 HOURS      Standard violations (NLR, VDM, meta gaming)           ║
║    ██ 6-16 HOURS       Minor violations (recording, name violations)         ║
║    ██ KICK/WARNING     First-time minor offenses                             ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

                    ★ Thank you for being part of Paradise Remastered! ★
                         Play fair. Respect others. Have fun.

╔══════════════════════════════════════════════════════════════════════════════╗
║                              paradiserp.com                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Paradise-Remastered-Rules.txt"
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Handle scroll for showing back to top button
  if (typeof window !== "undefined") {
    window.onscroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303]">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4a94c]/8 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#d4a94c]/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#d4a94c]/3 blur-[180px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#d4a94c]/10 bg-[#030303]/95 backdrop-blur-2xl print:relative print:bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#d4a94c]/30 blur-2xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
              <Image
                src="/logo.png"
                alt="Paradise Remastered Logo"
                width={52}
                height={52}
                className="relative rounded-xl shadow-2xl"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#d4a94c] via-[#f4d794] to-[#d4a94c] bg-clip-text text-transparent">
                Paradise Remastered
              </h1>
              <p className="text-xs text-neutral-500 tracking-widest uppercase">Official Server Rules</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="border-[#d4a94c]/20 bg-[#d4a94c]/5 text-[#d4a94c] hover:bg-[#d4a94c]/10 hover:border-[#d4a94c]/30 hover:text-[#f4d794] text-xs h-9"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              onClick={downloadTxt}
              size="sm"
              className="bg-gradient-to-r from-[#d4a94c] to-[#b8923e] text-[#0a0a0a] hover:from-[#f4d794] hover:to-[#d4a94c] font-semibold text-xs shadow-lg shadow-[#d4a94c]/25 h-9"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#d4a94c]/10 py-16 sm:py-20 lg:py-24 print:py-8">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-[#d4a94c]/25 blur-[60px] rounded-full scale-150" />
            <Image
              src="/logo.png"
              alt="Paradise Remastered"
              width={200}
              height={200}
              className="relative drop-shadow-2xl"
              priority
            />
          </div>
          
          <h2 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Server <span className="bg-gradient-to-r from-[#d4a94c] via-[#f4d794] to-[#d4a94c] bg-clip-text text-transparent">Rules</span>
          </h2>
          <p className="mx-auto max-w-2xl text-neutral-400 text-base sm:text-lg leading-relaxed mb-10">
            Welcome to Paradise Remastered. These rules ensure fair and enjoyable roleplay for everyone.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5 rounded-2xl border border-[#d4a94c]/15 bg-[#d4a94c]/5 px-5 py-3 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-[#d4a94c]" />
              <span className="text-sm text-neutral-300">
                <span className="font-bold text-[#d4a94c] text-lg">{ruleSections.length}</span>
                <span className="ml-1.5">Categories</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl border border-[#d4a94c]/15 bg-[#d4a94c]/5 px-5 py-3 backdrop-blur-sm">
              <Gavel className="h-5 w-5 text-[#d4a94c]" />
              <span className="text-sm text-neutral-300">
                <span className="font-bold text-[#d4a94c] text-lg">{totalRules}</span>
                <span className="ml-1.5">Rules</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl border border-[#d4a94c]/15 bg-[#d4a94c]/5 px-5 py-3 backdrop-blur-sm">
              <Clock className="h-5 w-5 text-[#d4a94c]" />
              <span className="text-sm text-neutral-300">
                Updated <span className="font-bold text-[#d4a94c]">{new Date().toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Controls */}
      <section className="sticky top-[61px] z-40 border-b border-[#d4a94c]/10 bg-[#030303]/98 backdrop-blur-2xl py-4 print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
              <Input
                type="text"
                placeholder="Search rules by keyword, ID, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[#d4a94c]/15 bg-[#0a0a0a] pl-11 pr-10 text-white placeholder:text-neutral-600 focus:border-[#d4a94c]/40 focus:ring-[#d4a94c]/20 h-11 text-sm rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-[#d4a94c]/20 text-xs h-9 ${showFilters ? 'bg-[#d4a94c]/10 text-[#d4a94c]' : 'text-neutral-400 hover:text-[#d4a94c]'}`}
              >
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                Filters
              </Button>

              <div className="h-5 w-px bg-neutral-800" />

              <Button
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="text-neutral-500 hover:text-[#d4a94c] hover:bg-[#d4a94c]/5 text-xs h-9"
              >
                Expand All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={collapseAll}
                className="text-neutral-500 hover:text-[#d4a94c] hover:bg-[#d4a94c]/5 text-xs h-9"
              >
                Collapse All
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-800/50">
              <span className="text-xs text-neutral-500 mr-2">Punishment:</span>
              {punishmentFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setPunishmentFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    punishmentFilter === filter.value
                      ? 'bg-[#d4a94c] text-[#0a0a0a]'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              {(searchQuery || punishmentFilter !== "all") && (
                <span className="ml-auto text-xs text-neutral-500">
                  Showing {filteredRuleCount} of {totalRules} rules
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12" ref={contentRef}>
        {/* Quick Navigation */}
        <section className="mb-10 rounded-3xl border border-[#d4a94c]/10 bg-gradient-to-b from-[#0a0a0a] to-[#050505] p-6 lg:p-8 print:hidden">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-semibold text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d4a94c]/10 text-[#d4a94c]">
              <FileText className="h-5 w-5" />
            </div>
            Quick Navigation
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ruleSections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSections(prev => new Set([...prev, section.id]))
                  setTimeout(() => {
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }, 50)
                }}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-[#d4a94c]/5 border border-transparent hover:border-[#d4a94c]/10"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${section.color} text-[11px] font-bold text-white/80 group-hover:text-[#d4a94c] transition-colors`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm text-neutral-400 group-hover:text-white transition-colors truncate">
                  {section.title}
                </span>
                <span className="text-[10px] text-neutral-600 tabular-nums">{section.rules.length}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Rules Sections */}
        <div className="space-y-5">
          {filteredSections.map((section, sectionIdx) => {
            const originalIdx = ruleSections.findIndex(s => s.id === section.id)
            return (
              <section
                key={section.id}
                id={section.id}
                className="print-section overflow-hidden rounded-3xl border border-[#d4a94c]/10 bg-[#070707] scroll-mt-36"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-all hover:bg-[#d4a94c]/[0.03] print:pointer-events-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color} text-white border border-white/5`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-3 text-lg">
                        <span className="text-[#d4a94c] text-sm font-mono opacity-60">
                          {String(originalIdx + 1).padStart(2, '0')}
                        </span>
                        {section.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">{section.rules.length} rules in this section</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 print:hidden">
                    <span className="text-xs text-neutral-600 hidden sm:block">
                      {expandedSections.has(section.id) ? "Click to collapse" : "Click to expand"}
                    </span>
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-[#d4a94c]" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-neutral-600" />
                    )}
                  </div>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="border-t border-[#d4a94c]/5">
                    <div className="divide-y divide-neutral-800/30">
                      {section.rules.map((rule) => (
                        <div
                          key={rule.id}
                          className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-white/[0.01]"
                        >
                          <span className="flex h-7 min-w-[3.25rem] items-center justify-center rounded-lg bg-[#111] border border-[#d4a94c]/10 px-2.5 text-xs font-mono font-semibold text-[#d4a94c] shrink-0">
                            {rule.id}
                          </span>
                          <p className="flex-1 text-sm text-neutral-300 leading-relaxed pt-0.5">{rule.text}</p>
                          {rule.ban && (
                            <span className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide border ${getBanColor(rule.ban)}`}>
                              {rule.ban}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredSections.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#d4a94c]/10 bg-[#070707] py-20">
            <Search className="mb-5 h-14 w-14 text-neutral-800" />
            <p className="text-xl font-medium text-neutral-500">No rules found</p>
            <p className="text-sm text-neutral-600 mt-2">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearchQuery(""); setPunishmentFilter("all") }}
              className="mt-6 border-[#d4a94c]/20 text-[#d4a94c]"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Ban Duration Legend */}
        <section className="mt-10 rounded-3xl border border-[#d4a94c]/10 bg-gradient-to-b from-[#0a0a0a] to-[#050505] p-6 lg:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-semibold text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            Punishment Reference Guide
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { color: "bg-red-950/60 border-red-800/40", text: "text-red-300", label: "Permanent Ban", desc: "Hacking, exploiting, severe harassment" },
              { color: "bg-purple-950/60 border-purple-800/40", text: "text-purple-300", label: "Account/Inventory Wipe", desc: "Economic violations, combat log" },
              { color: "bg-orange-950/60 border-orange-800/40", text: "text-orange-300", label: "72+ Hours", desc: "RDM, power gaming, alliance breaks" },
              { color: "bg-yellow-950/60 border-yellow-800/40", text: "text-yellow-300", label: "36-48 Hours", desc: "Combat logging, serious fail RP" },
              { color: "bg-amber-950/60 border-amber-800/40", text: "text-amber-300", label: "24-32 Hours", desc: "NLR, VDM, meta gaming" },
              { color: "bg-blue-950/60 border-blue-800/40", text: "text-blue-300", label: "Kick/Warning", desc: "First-time minor offenses" },
            ].map((item) => (
              <div key={item.label} className={`flex items-start gap-3 rounded-xl border ${item.color} p-4`}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.color}`}>
                  <div className={`h-3 w-3 rounded-sm ${item.text} bg-current`} />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${item.text}`}>{item.label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center print:mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/logo.png" alt="Paradise Remastered" width={40} height={40} className="rounded-lg" />
            <span className="text-lg font-bold bg-gradient-to-r from-[#d4a94c] to-[#f4d794] bg-clip-text text-transparent">
              Paradise Remastered
            </span>
          </div>
          <p className="text-sm text-neutral-500">Play fair. Respect others. Have fun.</p>
          <p className="text-xs text-neutral-600 mt-2">Rules last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a94c] text-[#0a0a0a] shadow-lg shadow-[#d4a94c]/25 transition-all hover:scale-110 hover:bg-[#f4d794] print:hidden"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
