# Brain Dump User Manual

![Brain Dump](../assets/logos/braindump-logo-stacked.png)

Brain Dump is a pocket voice notebook. Press a button, speak your thought, tag
it, and Brain Dump keeps it organized — transcribed, summarized, and sorted
into Notes, Todos, and Follow-ups — on a screen that sips power and stays
legible even when it's "asleep."

This manual describes the device as it actually behaves today. Brain Dump is
a fork of **Chroninkle**, which was itself renamed from **Followup**; a
device still running one of those firmwares broadcasts its Wi-Fi setup
hotspot under the older name until it's updated. Brain Dump's hotspot is
named `BrainDump-` followed by three pairs of letters and digits.

## Contents

- [At a glance: the buttons](#at-a-glance-the-buttons)
- [First-time setup](#first-time-setup)
- [Recording a thought](#recording-a-thought)
- [The Home screen](#the-home-screen)
- [Notes, Todos, and Follow-up](#notes-todos-and-follow-up)
- [Viewing a recording's details](#viewing-a-recordings-details)
- [Topics](#topics)
- [Books](#books)
- [Settings](#settings)
- [Hebrew](#hebrew)
- [Books and recordings on your phone](#books-and-recordings-on-your-phone)
- [Updating the firmware over Wi-Fi](#updating-the-firmware-over-wi-fi)
- [Locking, sleep, and battery](#locking-sleep-and-battery)
- [Shutting down and charging](#shutting-down-and-charging)
- [Tips and things that surprise people](#tips-and-things-that-surprise-people)

## At a glance: the buttons

Brain Dump has three physical controls. There is no touchscreen — everything
is driven by these.

| Control | Quick action | Press and hold |
|---|---|---|
| **Record button** | **Back** — exits whatever you're currently inside (an open list, a scroll view, a switch) | **Record** a thought (see below) |
| **Rocker** (tilt up / tilt down / press in) | Tilt up or down to move the selection; press the rocker straight in (**Select**) to select/confirm. **Press it in twice quickly** to jump to the Home screen from anywhere. | Hold a tilt to keep moving in that direction. **Hold the rocker in** on a Todo to mark it done (or not done), or on a Note or Follow-up to play its recording. |
| **PWR** | Short press: **lock / unlock** the screen | Hold ~1 second: open a **shut down?** confirmation |

A few things worth knowing up front:

- **The rocker is one control, not three buttons.** Tilting it up or down
  moves your selection; pressing it straight in — referred to as
  **Select** in this manual — selects/confirms.
- **The Record button does double duty.** A quick tap is **Back** — it
  backs out of whatever you're currently inside. Press and *hold* it, and
  it starts recording instead. You don't need to reach for a different
  control to back out of a list versus to record.
- **Holding PWR for a full 6 seconds forces the power off**, no matter what
  the screen is doing. This is a hardware failsafe, not something you
  should need in normal use.
- The screen is e-paper: black-and-white, and it **visibly flashes** on a
  full-screen refresh (opening a new screen, waking up). Smaller updates
  (moving a selection, a checkbox) redraw more quietly. This is normal.

### Typing on the on-screen keyboard

The keyboard (for a Wi-Fi password or a topic name) works in two steps, so
you never have to tilt through every key:

1. **Pick a row.** The whole row is highlighted. Tilt up or down to move
   between rows.
2. **Press in** to go into that row, then tilt to move across its keys
   (it wraps around at the ends, so the far end is often only a tilt or two
   away). Press in to type the highlighted key. You stay in the row, so
   letters next to each other are quick to type.
3. **Tap Record** to come back out to choosing rows. Tapping Record again
   while choosing rows closes the keyboard without saving.

Switching to numbers or symbols (the **123** key) takes you back to
choosing a row, since the rows change. **Shift** keeps you where you are.

## First-time setup

On first boot, Brain Dump walks you through a short introduction carousel.
Use the **rocker** to move through it (tilt to move, press in to confirm),
and close it on the final slide. You can replay this carousel any time from
**Settings → Manual**.

To actually get set up, Brain Dump opens its own WiFi hotspot named
**`Brain Dump-XXXXXX`** (the last few characters are unique to your device)
whenever it doesn't have saved WiFi credentials yet. Connect a phone or laptop to
that hotspot — it's open, no password needed — and your device should
automatically open a setup page (or visit `http://192.168.4.1` yourself).
From there you can:

- **Connect Brain Dump to your WiFi** — scan for networks, pick yours, enter
  the password.
- **Add your Gemini API key** — this is what powers transcription and
  summaries. Without it, recordings still save to the SD card, they just
  won't be transcribed.
- **Set your timezone and the current time/date** — needed for accurate
  timestamps on your recordings and for the "Today" grouping on Notes/Todos.

You can come back to WiFi and time settings later from the device itself
(see [Settings](#settings) below — they're the Network and Time pages in
the Settings hub) — the setup portal is only needed the first time, or if
you want to change your Gemini key.

## Recording a thought

This is the core interaction:

1. **Press and hold the Record button.** You'll hear a start cue.
   Recording actually begins fractionally before the cue finishes, so
   your first word isn't cut off — and Brain Dump even keeps a rolling
   one-second buffer while the button is held, so a beat of audio right
   before you "properly" started holding it is still caught.
2. **Speak.** Recordings are capped at **10 seconds** — Brain Dump is built
   for quick captures, not long dictation. If you keep holding past 10
   seconds, it stops automatically.
3. **Release the Record button.** You'll hear a stop cue, and Brain Dump
   immediately plays your recording back to you.
4. **Choose a tag**, from a menu with six options:
   - **Auto** — the first choice, so one press of the select button is
     enough. Brain Dump files the recording for you: when it is
     transcribed, it is sorted into Note, Task or Idea based on what you
     said ("remind me to call the bank tomorrow" becomes a Task). Until
     the transcript arrives — for example while there's no WiFi — it sits
     with your Notes. If you later change the type yourself, your choice
     is kept.
   - **Note** — a general thought.
   - **Task** — something to do. (This is what shows up on the **Todos**
     screen — the tag itself is called "Task," even though the screen
     that lists them is called "Todos.")
   - **Idea** — something to mull over later.
   - **Topic** — doesn't save a note at all. Brain Dump transcribes what
     you said, distills it into a short name, and adds it as a new
     [topic](#topics) (e.g. hold Record, say "kitchen renovation," pick
     Topic — that project name now exists as a topic you can tag other
     entries with). Nothing is saved to the SD card for this option,
     same as Discard below.
   - **Discard** — throws the recording away. Nothing is saved to the SD
     card if you pick this — that's exactly why the review-then-tag order
     exists: you get to hear it back before deciding.
5. If you chose Auto, Note, Task, or Idea, and Brain Dump has WiFi and a
   Gemini key configured, it transcribes the recording in the
   background — you'll see a brief "Transcribing recording..." message,
   then either a transcript being saved or a note that transcription
   failed. Topic and Discard skip this: Topic transcribes immediately to
   produce its name (see above), and Discard has nothing to transcribe.

**If you're offline when you record**, the clip still saves to the SD
card — it just gets marked as pending. The moment Brain Dump reconnects to
WiFi, it automatically retries every pending recording. A small badge on
the status bar shows how many are waiting.

## The Home screen

Home is Brain Dump's dashboard. Near the top you'll see:

- A **task tracker** — "`done`/`total` completed" with a progress bar, or
  "No tasks yet" if you haven't tagged anything as a Task.
- Today's date and a rotating welcome message.

Below that is the main menu, in this order:

- **Follow up** — anything you've flagged for later, regardless of what
  it's tagged as (badge shows how many).
- **Todos** (badge shows how many) — your Task recordings.
- **Notes** (badge shows how many) — your Note and Idea recordings.
- **Topics** — browse everything tagged with a given [topic](#topics),
  including Gemini-generated summaries.
- **Books** — browse and read `.txt` files from the device's [Books
  folder](#books).

Move between them by tilting the rocker and pressing it in to **Select**.

## Notes, Todos, and Follow-up

These three screens share the same layout: recordings are grouped by the
day they were made. Select a day to open it, and you'll see the individual
recordings inside — each showing a snippet of its transcript (or "Audio
only" if it hasn't been transcribed yet), its time, and its length. Tap the
Record button to back out of an opened day and return to the list of days.

What shows up where:

- **Notes** — everything tagged Note or Idea.
- **Todos** — everything tagged Task.
- **Follow-up** — anything you've flagged as a follow-up, whatever its tag,
  shown with its actual tag labeled on the row.

Selecting an item opens an actions menu. The exact options depend on the
screen:

| Action | Notes | Todos | Follow-up |
|---|:---:|:---:|:---:|
| Play recording *(only if audio still exists)* | ✓ | ✓ | ✓ |
| View details | ✓ | ✓ | ✓ |
| Follow up / Remove follow-up | ✓ | ✓ | — |
| Turn to task | ✓ | — | — |
| Complete / Mark incomplete | — | ✓ | — |
| Complete follow-up | — | — | ✓ |
| Archive now *(only once completed)* | — | ✓ | — |
| Delete | ✓ | ✓ | ✓ |

**Shortcut:** instead of opening the menu, **hold the rocker in** on a
recording. On **Todos** that marks it done — or, if it's already done, not
done — and a short message confirms it. On **Notes** and **Follow-up** it
plays the recording straight away.

A couple of notes on these:

- **Turn to task** (on Notes) is how you promote a Note or Idea into a
  Todo after the fact, without re-recording it.
- **Complete follow-up** (on the Follow-up screen) is one-way — it marks
  the item done and clears the follow-up flag, rather than toggling back
  and forth.
- **Delete removes the recording for good** — there's no separate
  "archive vs. delete" distinction here; that's a different feature (see
  next).

### Archiving completed Todos

At the top of the Todos screen is a **Current / Archived** switch. Select
it and tilt the rocker to flip between the two views.

A completed Task doesn't disappear right away — it stays visible (checked
off) in Current for a while, so you can see what you've gotten done.
After it's been completed for a configurable number of days (7 by
default — see [Settings](#settings)), Brain Dump automatically **archives**
it: the audio recording is deleted to free up SD card space, but the
transcript text is kept, and the item moves to the Archived view where you
can still read it. You can also archive a completed item immediately with
**Archive now** from its actions menu, rather than waiting.

Un-completing an archived item (via "Mark incomplete") brings it back to
Current — but the deleted audio does not come back.

## Viewing a recording's details

"View details" opens the full transcript for a recording, scrollable if
it's long — select the scroll area and tilt the rocker to move through it
a screenful at a time (the last line of the previous screen stays at the
top, so you never lose your place). Below that:

- **Edit topics** opens a checklist of your [topics](#topics) — select
  one to check or uncheck it, then select **Done** to save. Multiple
  topics can be checked at once.
- **Back** returns you to wherever you came from.
- The last button is either **Play** (if a transcript exists) or
  **Transcribe** (if it doesn't yet). If the transcript exists but the
  audio file itself is gone (for example, after archiving, or if you
  removed files over USB), this button disappears entirely rather than
  offering to play nothing.

## Topics

Topics are labels — a project name, say — you can attach to any Note, Idea,
or Todo, independent of its type (see [Recording a
thought](#recording-a-thought) for creating one by voice, and [Manage
topics](#manage-topics) for renaming/deleting one). The Home screen's
**Topics** item is where you browse by them:

1. Select a topic from the list.
2. You'll see everything tagged with it — Notes, Ideas, and Todos mixed
   together — grouped by day, the same way the Notes/Todos/Follow-up
   screens group their own timelines. Each row shows which type it is
   (Note/Idea/Task) so you can tell them apart.
3. Select an entry to open its [Details](#viewing-a-recordings-details).
4. Once the topic has at least one entry, a **Summarize** button appears
   next to **Back**. Select it for a Gemini-written recap of everything
   ever tagged with this topic — unlike Notes/Todos there's no recent-only
   time window, since a topic can be revisited months apart. Press **Get
   summary** to generate one; the result appears in the scrollable area
   above (same 10%-step scrolling as the Details page). Revisiting a
   topic's summary later shows the one you already generated, without
   regenerating it — press **Refresh summary** for a new one. If Gemini
   isn't connected yet, you'll see a prompt to set it up instead.
5. **Back** returns you to the topic list — or, from a topic's summary,
   to that topic's entries.

If a topic has nothing tagged with it yet, you'll see "No entries tagged
with this topic yet" and no Summarize button.

## Books

The Home screen's **Books** item opens a simple on-device reader for plain
text. The easiest way to add books is the **Books** section of the setup web
page (see [Books and recordings on your phone](#books-and-recordings-on-your-phone)),
which takes `.txt` and `.epub` files. You can also copy `.txt` files straight
onto the SD card's `books` folder over USB (Settings > Storage > Enable OTG).

- Selecting **Books** shows the list of `.txt` files found in that folder.
  Tilt the rocker to move between them, and select one to open a menu with:
  - **Continue reading** — opens the book at the page you last left it on.
  - **Start from the beginning** — opens the book at page one, overwriting
    your saved position.
  - **Delete** — removes the book (and your saved position for it) from the
    SD card, after a confirmation. There's no undo.
- In the reading view, tilting the rocker turns the page forward (down) or
  back (up). Each book remembers the page you last left it on, so leaving
  and reopening it picks up where you stopped.
- Tap the Record button to leave the reading view and return to the book
  list.
- You can page back all the way to the start of the book at any time,
  including right after reopening it — not just through pages turned in the
  current session. Reopening a book you've read a long way into may take a
  moment to open while it re-figures out where earlier pages started.
- The reader only looks in that one folder (no subfolders), and only reads
  `.txt` files. EPUB books sent from the setup page are turned into `.txt`
  on your phone first, so they appear here like any other book. If you copy
  Hebrew books over USB yourself, save them as UTF-8 text (the setup page
  converts older Hebrew text files for you).

## Settings

Settings is a hub, like a phone's settings app: six headings, each
opening its own page, plus one action below them:

- **Network** — WiFi and Access Point.
- **Time** — timezone and clock.
- **Storage** — SD card status and management.
- **Todos** — todo archiving.
- **Topics** — create, rename, and delete topics.
- **Changelog** — what's new: every Brain Dump release and its changes.
- **About** — firmware version and acknowledgments.
- **Manual** — replays the first-time onboarding carousel. This one isn't
  a heading — it's a direct action, since there's nothing to configure on
  it.

Select a heading to open its page. Every one of those pages has its own
**Back** button at the bottom that returns you to this Settings hub. The
footer's **Home** icon, on any of them, is different — it jumps straight
back to the Home screen, skipping the hub.

### Network

From the top:

1. **WiFi** — toggle WiFi on or off.
2. **Access Point** — toggle Brain Dump's own setup hotspot on or off.
3. A list of nearby networks — each row indicates whether it's open or
   password-protected, its signal strength, and whether it's the one
   you're currently connected to. Select a network, enter its password if
   it needs one (there's a show/hide toggle for what you've typed), and
   press **Connect**. If you're already connected to the highlighted
   network, that same button reads **Disconnect** instead. Use **Scan**
   to refresh the list.

### Time

**Timezone.** Select the Timezone field and pick in two steps: first your
region (Africa, America, Asia, Europe, ...), then your city. Every place in
the world is listed, each with its offset from UTC — for example
**Jerusalem (UTC+2/+3)**, where the second number is the summer-time offset.
Brain Dump switches between summer and winter time on its own. **UTC** is
at the top of the region list and needs no second step. Press **Sync &
Save** to apply your choice.

The setup web page (see [Updating the firmware over Wi-Fi](#updating-the-firmware-over-wi-fi)) offers the
same list, and if your phone's timezone is in it, a **Use it** button picks
it for you.

**Where the time comes from.** Under the timezone, a short line tells you
how the clock was set:

- **Set over Wi-Fi at 20:22** — the time came from the internet. While
  Brain Dump has Wi-Fi it keeps the time right by itself, and a time you
  type below is replaced at the next sync. If the clock looks wrong, the
  timezone is what needs changing, not the time.
- **Set by hand** — you entered it; it will be corrected the next time
  Brain Dump connects to Wi-Fi.
- **Clock not set** — pick your timezone and connect Wi-Fi, or enter the
  time below.

You can also enter the date and time by hand in the fields provided (hour,
minute, AM/PM, month, day, year). Press **Sync & Save** when you're done —
it both saves what you entered and re-syncs the clock.

**Changing a number.** Move to the hour, minute, month, day or year and
press the rocker in. The field turns black with small arrows above and
below the number: tilt the rocker up to raise it and down to lower it (it
wraps around — past 59 minutes comes 00). Hold a tilt to keep going; after a
moment minutes jump in fives and years in tens. Press the rocker in again
to keep the number, or tap the Record button to put back the number you
started with. The day never goes past the end of the month you picked, so
choosing February turns a 31st into the 28th (or 29th).

**12-hour or 24-hour clock.** The button next to the minutes cycles through
**AM**, **PM** and **24H** each time you select it. Choose **24H** and press
**Sync & Save** to show every time on the device — the status bar clock and
the time on each recording — as 24-hour (for example `17:05` instead of
`5:05 PM`). While **24H** is showing, enter the hour as 00–23. Cycle back to
**AM** or **PM** and save to return to the 12-hour clock.

### Storage

1. Free space and usage percent on the SD card (only shown when a card is
   inserted and mounted).
2. **Enable OTG** — mounts the SD card as a USB drive on a computer you've
   connected via USB-C, so you can pull files off directly. While this is
   active, the card is unavailable to Brain Dump itself, and you'll need to
   explicitly **Disable OTG mode** to get it back (there's no accidental
   way out of this while the cable's connected — that's intentional, so
   Brain Dump doesn't touch the card while your computer has it mounted).
3. **Format SD** — erases the SD card completely. Brain Dump asks you to
   confirm ("Formatting the SD card will erase everything on the card") —
   there's no undo once you confirm.

### Todos

**Archive todos after** — how many days a completed Todo stays in the
active list before auto-archiving (see [Archiving completed
Todos](#archiving-completed-todos)). Choices are 7, 14, 30, 60, or 90
days, or **Never** to turn off automatic archiving entirely (you can
still archive individual items manually). Default is 7 days.

### Changelog

The release notes for every Brain Dump version since it split off from
Chroninkle, newest first: each version's number and date, then what was
added, changed and fixed, one line per change. The version installed on
your device is shown under the title.

Select the notes and tilt the rocker to page through them a screenful at a
time; tap Record (or press the rocker in again) to stop scrolling. **Back**
returns to Settings.

### About

Shows the installed firmware version and an acknowledgment: Brain Dump
began as a fork of Followup, created by ALXV Labs.

### Manage topics

Create, rename, and delete [topics](#topics) — labels you can use to group
notes, ideas, and todos across a project, independent of their Note/Idea/Todo
type. Three are there from the start (**Home**, **Car**, **Shopping**) so the
list isn't empty on first boot; rename or delete them like any topic you add
yourself. You can also create a topic by voice without coming here at
all — see the **Topic** tag option in [Recording a
thought](#recording-a-thought).

- **New topic** — opens the keyboard to type a name.
- Select an existing topic to **Rename** (opens the keyboard) or
  **Delete** it. Deleting asks you to confirm; anything already
  tagged with that topic simply loses
  it, keeping any other topics it has.

## Hebrew

You can record in Hebrew. The transcript is kept in Hebrew (it is not
translated), and the device shows it right to left: transcripts, the lists
of notes and to-dos, summaries, the lock screen's to-do list, and Books.
English words and numbers inside a Hebrew sentence keep their normal
direction. Summaries are written in the language you spoke.

The device's own menus and buttons stay in English. Vowel points (nikud)
are not shown, and the on-screen keyboard has no Hebrew letters, so topic
names are typed in English.

## Books and recordings on your phone

The setup web page also lets you add books and take your recordings off the
device, without a cable:

1. On the device, open **Settings > Network** and turn **Access Point** on.
2. On your phone or computer, join the Brain Dump hotspot and open
   `http://192.168.4.1`.

**Books.** The list shows the books on the device, their size, and the free
space on the SD card; **Delete** removes one (after asking). To add books,
choose one or more `.txt` or `.epub` files and press **Send to device**:

- An **EPUB** is converted to plain text on your phone before it is sent:
  chapters and paragraphs are kept, pictures and formatting are dropped. The
  device only ever stores text, so it opens as fast as any `.txt` book.
  Copy-protected (DRM) EPUBs from stores can't be converted.
- A `.txt` file can be UTF-8 or an older Windows file (Western or Hebrew);
  it is converted to UTF-8 as it is sent.
- The book is named after the EPUB's title (or the file name). Names can only
  use English letters, digits and simple punctuation, so a Hebrew title is
  saved as `book.txt` — rename the file before sending if you want a
  different name. Sending a book with the same name as one already on the
  device asks whether to replace it, and replacing it starts it from page
  one.

**Recordings.** Every recording, newest first, with its type, date, length
and title (or the start of its transcript). **Audio** downloads the recording
as a `.wav` file; **Transcript** saves its text as a `.txt` file; **All
transcripts** saves every transcript in one file. Archived Todos no longer
have their audio, so only **Transcript** is offered for them. **Refresh**
reloads the list after you record something new.

While the SD card is connected to a computer as a USB drive, both sections
say so and wait until you turn that off.

## Updating the firmware over Wi-Fi

Once a firmware version with this feature is on the device, later updates
don't need a USB cable.

1. Get the update file — the one whose name ends in `-update.bin`.
2. On the device, open **Settings > Network** and turn **Access Point** on.
3. On your phone or computer, join the Brain Dump hotspot and open the setup
   page (`http://192.168.4.1`).
4. In the **Firmware Update** section, choose the file and press **Install
   Update**. The page shows the installed version and the upload progress.
5. Keep the page open and the device powered until it restarts by itself,
   about a minute. The page then shows the new version.

If the battery is below 30% and the device isn't plugged in, it refuses the
update and asks you to plug it in first.

If the file is the wrong one or arrives damaged, the device refuses it and
keeps running the version it had. If a new version fails to start, the
device goes back to the previous one on its own.

The setup hotspot has no password, so anyone in range could reach this page
while it is on — turn **Access Point** off again when you're done.

## Locking, sleep, and battery

**Locking**: a short press of PWR locks the screen. Locking also puts the
display straight to sleep — it doesn't wait out the usual inactivity
timer — so a locked device you drop in a pocket or bag goes dark right
away rather than staying lit for a few more minutes. The frozen screen
you'll see while locked is a quick summary of your pending Todos (see
below), not a clock.

While locked, **jostling the device does not wake it** — only a real
button press does. This is deliberate: motion alone (walking, being carried
in a bag) is ignored so a locked device doesn't keep flashing itself awake.

**Unlocking**: press PWR again. Unlike locking, it lands you straight back
on the Home screen in one step rather than needing a second press.

**The lock screen itself** shows, at a glance:
- The current weekday and date.
- A **"TO-DO"** heading — or **"TO-DO - N PENDING"** if you have pending
  Todos — followed by up to five of them. Reminders that have a day or
  time come first, soonest at the top, each starting with when it is due
  ("Today 09:30", "Tomorrow", "Overdue"); a due time is picked up
  automatically when you say one in the recording ("call the bank
  tomorrow at nine"). After those come anything flagged as a follow-up,
  then the rest. If there are more than five, you'll see a
  "+N more pending" line instead of a longer list. If you're all caught
  up, it just says so.

**Auto-sleep** (when you're not locked, but the device has just been left
alone): after about 3 minutes of no motion, the screen goes to sleep —
it freezes on whatever was last shown rather than blanking, so it still
reads as "resting," not "off" or broken. After about 30 minutes of
continued inactivity, the device goes into a deeper low-power sleep and
disconnects WiFi; press the Record button or PWR to wake it back up.

While Brain Dump is plugged into a **computer** by USB, it skips that
deeper sleep (the screen still sleeps after 3 minutes). The deeper sleep
switches off the USB connection, so the computer would lose the device and
installing firmware over the cable would fail. A plain USB charger or power
bank doesn't count — on those it sleeps as usual.

## Shutting down and charging

**Shutting down**: hold PWR for about a second. A confirmation appears —
"Your device will power off. Do you want to continue?" — with **Cancel**
and **Shut down** options. Confirming powers the device off. If it's
plugged into USB power at the time, it'll actually stay on until you
unplug the cable — shutting down and unplugging together is what fully
powers it off on external power.

As a last resort, **holding PWR continuously for 6 seconds cuts power
immediately**, regardless of what the screen is doing — useful if the
device is ever unresponsive.

**Charging**: plug in via USB-C. The status bar shows your battery
percentage and a charging indicator while power is connected.

## Tips and things that surprise people

- **Recordings are short on purpose** — 10 seconds max. Think "quick
  capture," not dictation.
- **Discard really discards** — nothing touches the SD card until you
  pick a tag other than Discard.
- **"Task" is what "Todos" means** — if you're looking for the tag that
  puts something on your Todos list, it's called Task in the tagging
  menu.
- **Archiving isn't deleting** — an archived Todo's transcript stays
  readable in the Archived view; only its audio goes away, and only after
  it's already been marked complete for a while (or you archive it
  yourself).
- **A locked, sleeping screen isn't broken** — e-paper stays on whatever
  it last drew when it sleeps; that's expected, not a bug.
