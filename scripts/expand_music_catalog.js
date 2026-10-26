const fs = require('fs');

const { MUSIC_SESSION_TRACKS, STORIES_DATA, WORLD_TOUR_SCENARIOS } = require('./datasets_backup.js');

const newTracks = [
  {
    id: "losing_my_religion",
    title: "Losing My Religion",
    artist: "R.E.M.",
    genre: "Alternative Rock",
    youtubeId: "xwtdhWltSIg",
    duration: "4:28",
    lyrics: [
      { time: 8, text: "Oh life is bigger, it's bigger than you" },
      { time: 13, text: "And you are not me, the lengths that I will go to" },
      { time: 18, text: "The distance in your eyes" },
      { time: 24, text: "Oh no, I've said too much, I set it up" },
      { time: 30, text: "That's me in the corner, that's me in the spotlight" },
      { time: 36, text: "Losing my religion" },
      { time: 41, text: "Trying to keep up with you, and I don't know if I can do it" },
      { time: 47, text: "Oh no, I've said too much, I haven't said enough" },
      { time: 54, text: "I thought that I heard you laughing" },
      { time: 58, text: "I thought that I heard you sing" },
      { time: 63, text: "I think I thought I saw you try" },
      { time: 70, text: "Every whisper, of every waking hour" },
      { time: 76, text: "I'm choosing my confessions, trying to keep an eye on you" },
      { time: 82, text: "Like a hurt, lost and blinded fool, fool" },
      { time: 88, text: "Oh no, I've said too much, I set it up" }
    ]
  },
  {
    id: "bohemian_rhapsody",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Classic Rock",
    youtubeId: "fJ9rUzIMcZQ",
    duration: "5:55",
    lyrics: [
      { time: 4, text: "Is this the real life? Is this just fantasy?" },
      { time: 11, text: "Caught in a landslide, no escape from reality" },
      { time: 18, text: "Open your eyes, look up to the skies and see" },
      { time: 27, text: "I'm just a poor boy, I need no sympathy" },
      { time: 33, text: "Because I'm easy come, easy go, little high, little low" },
      { time: 41, text: "Any way the wind blows doesn't really matter to me, to me" },
      { time: 55, text: "Mama, just killed a man, put a gun against his head" },
      { time: 64, text: "Pulled my trigger, now he's dead" },
      { time: 70, text: "Mama, life had just begun, but now I've gone and thrown it all away" },
      { time: 83, text: "Mama, ooh, didn't mean to make you cry" }
    ]
  },
  {
    id: "yellow",
    title: "Yellow",
    artist: "Coldplay",
    genre: "Alternative Rock",
    youtubeId: "yKNxeF4KMsY",
    duration: "4:29",
    lyrics: [
      { time: 16, text: "Look at the stars, look how they shine for you" },
      { time: 24, text: "And everything you do, yeah they were all yellow" },
      { time: 37, text: "I came along, I wrote a song for you" },
      { time: 45, text: "And all the things you do, and it was called Yellow" },
      { time: 58, text: "So then I took my turn, oh what a thing to have done" },
      { time: 69, text: "And it was all yellow" },
      { time: 78, text: "Your skin, oh yeah your skin and bones" },
      { time: 86, text: "Turn into something beautiful, you know you know I love you so" }
    ]
  },
  {
    id: "radioactive",
    title: "Radioactive",
    artist: "Imagine Dragons",
    genre: "Electropop / Rock",
    youtubeId: "ktvTqknDobU",
    duration: "3:08",
    lyrics: [
      { time: 8, text: "I'm waking up to ash and dust" },
      { time: 12, text: "I wipe my brow and I sweat my rust" },
      { time: 16, text: "I'm breathing in the chemicals" },
      { time: 24, text: "I'm breaking in, shaping up, then checking out on the prison bus" },
      { time: 32, text: "This is it, the apocalypse, whoa" },
      { time: 40, text: "I'm waking up, I feel it in my bones" },
      { time: 44, text: "Enough to make my systems blow" },
      { time: 48, text: "Welcome to the new age, to the new age" },
      { time: 54, text: "Welcome to the new age, to the new age" },
      { time: 59, text: "Whoa, whoa, I'm radioactive, radioactive" }
    ]
  },
  {
    id: "hey_jude",
    title: "Hey Jude",
    artist: "The Beatles",
    genre: "Classic Rock",
    youtubeId: "A_MjCqQoLLA",
    duration: "7:11",
    lyrics: [
      { time: 1, text: "Hey Jude, don't make it bad" },
      { time: 7, text: "Take a sad song and make it better" },
      { time: 14, text: "Remember to let her into your heart" },
      { time: 21, text: "Then you can start to make it better" },
      { time: 29, text: "Hey Jude, don't be afraid" },
      { time: 35, text: "You were made to go out and get her" },
      { time: 42, text: "The minute you let her under your skin" },
      { time: 49, text: "Then you begin to make it better" }
    ]
  },
  {
    id: "someone_like_you",
    title: "Someone Like You",
    artist: "Adele",
    genre: "Pop / Soul",
    youtubeId: "hLQl3W9rnKU",
    duration: "4:45",
    lyrics: [
      { time: 14, text: "I heard that you're settled down" },
      { time: 19, text: "That you found a girl and you're married now" },
      { time: 26, text: "I heard that your dreams came true" },
      { time: 31, text: "Guess she gave you things, I didn't give to you" },
      { time: 40, text: "Old friend, why are you so shy?" },
      { time: 45, text: "Ain't like you to hold back or hide from the light" },
      { time: 52, text: "Never mind, I'll find someone like you" },
      { time: 61, text: "I wish nothing but the best for you too" }
    ]
  },
  {
    id: "wonderwall",
    title: "Wonderwall",
    artist: "Oasis",
    genre: "Britpop",
    youtubeId: "6hzrDeceEKc",
    duration: "4:18",
    lyrics: [
      { time: 15, text: "Today is gonna be the day that they're gonna throw it back to you" },
      { time: 22, text: "By now you should've somehow realized what you gotta do" },
      { time: 29, text: "I don't believe that anybody feels the way I do about you now" },
      { time: 40, text: "Backbeat, the word is on the street that the fire in your heart is out" },
      { time: 47, text: "I'm sure you've heard it all before, but you never really had a doubt" },
      { time: 58, text: "And all the roads we have to walk are winding" },
      { time: 65, text: "And all the lights that lead us there are blinding" },
      { time: 73, text: "Because maybe, you're gonna be the one that saves me" },
      { time: 82, text: "And after all, you're my wonderwall" }
    ]
  },
  {
    id: "in_the_end",
    title: "In the End",
    artist: "Linkin Park",
    genre: "Nu Metal / Rock",
    youtubeId: "eVTXPUF4Oz4",
    duration: "3:36",
    lyrics: [
      { time: 9, text: "It starts with one, one thing, I don't know why" },
      { time: 14, text: "It doesn't even matter how hard you try" },
      { time: 18, text: "Keep that in mind, I designed this rhyme to explain in due time" },
      { time: 26, text: "All I know, time is a valuable thing" },
      { time: 30, text: "Watch it fly by as the pendulum swings" },
      { time: 35, text: "Watch it count down to the end of the day, the clock ticks life away" },
      { time: 44, text: "I tried so hard and got so far" },
      { time: 48, text: "But in the end, it doesn't even matter" },
      { time: 53, text: "I had to fall to lose it all" },
      { time: 57, text: "But in the end, it doesn't even matter" }
    ]
  },
  {
    id: "billie_jean",
    title: "Billie Jean",
    artist: "Michael Jackson",
    genre: "Pop / R&B",
    youtubeId: "Zi_XLOBDo_Y",
    duration: "4:54",
    lyrics: [
      { time: 28, text: "She was more like a beauty queen from a movie scene" },
      { time: 34, text: "I said don't mind, but what do you mean, I am the one" },
      { time: 40, text: "Who will dance on the floor in the round?" },
      { time: 47, text: "She told me her name was Billie Jean, as she caused a scene" },
      { time: 53, text: "Then every head turned with eyes that dreamed of being the one" },
      { time: 59, text: "People always told me, be careful of what you do" },
      { time: 64, text: "Don't go around breaking young girls' hearts" },
      { time: 70, text: "Billie Jean is not my lover, she's just a girl who claims that I am the one" },
      { time: 82, text: "But the kid is not my son" }
    ]
  },
  {
    id: "every_breath_you_take",
    title: "Every Breath You Take",
    artist: "The Police",
    genre: "Rock / New Wave",
    youtubeId: "OMOGaugKpzs",
    duration: "4:13",
    lyrics: [
      { time: 17, text: "Every breath you take and every move you make" },
      { time: 23, text: "Every bond you break, every step you take, I'll be watching you" },
      { time: 35, text: "Every single day and every word you say" },
      { time: 41, text: "Every game you play, every night you stay, I'll be watching you" },
      { time: 52, text: "Oh, can't you see you belong to me?" },
      { time: 60, text: "How my poor heart aches with every step you take" }
    ]
  }
];

// Merge into MUSIC_SESSION_TRACKS avoiding duplicates
newTracks.forEach(nt => {
  if (!MUSIC_SESSION_TRACKS.some(t => t.id === nt.id)) {
    MUSIC_SESSION_TRACKS.push(nt);
  }
});

const fileContent = `const MUSIC_SESSION_TRACKS = ${JSON.stringify(MUSIC_SESSION_TRACKS, null, 2)};\n\nconst STORIES_DATA = ${JSON.stringify(STORIES_DATA, null, 2)};\n\nconst WORLD_TOUR_SCENARIOS = ${JSON.stringify(WORLD_TOUR_SCENARIOS, null, 2)};\n\nmodule.exports = { MUSIC_SESSION_TRACKS, STORIES_DATA, WORLD_TOUR_SCENARIOS };\n`;

fs.writeFileSync('scripts/datasets_backup.js', fileContent, 'utf8');
console.log('✅ Successfully expanded MUSIC_SESSION_TRACKS! Total tracks now:', MUSIC_SESSION_TRACKS.length);
