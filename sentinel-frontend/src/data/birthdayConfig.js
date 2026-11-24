/**
 * CENTRALIZED BIRTHDAY CONFIGURATION
 * 
 * Edit this file to customize the entire birthday website experience!
 * All names, dates, photos, messages, letters, and relationship details
 * are populated dynamically throughout the website from here.
 */

export const birthdayConfig = {
  // 1. Personal Details
  name: "Alex",
  nickname: "Bestie",
  relationship: "Best Friend", // Options: "Best Friend", "Friend", "Partner", "Sister", "Brother", "Soulmate"
  
  // Birthday date (YYYY-MM-DD)
  birthdayDate: "2026-11-15", 

  signatureName: "Your Friend",

  // 2. Cinematic Scroll-Controlled Video Intro
  videoIntro: {
    videoPath: "/videos/birthday-intro.mp4",
    posterPath: "/videos/intro-poster.jpg",
    scrollDistance: 380, // in vh units (380vh creates silky smooth scroll travel)
    overlays: {
      tag: "A LITTLE SOMETHING SPECIAL",
      phase1: "Some days deserve to be remembered forever.",
      phase2: "And today is one of those days.",
      phase3: "BECAUSE TODAY IS ALL ABOUT YOU.",
      scrollIndicator: "SCROLL TO EXPERIENCE",
    },
  },

  // 3. Hero Section
  hero: {
    badge: "✨ A SPECIAL CELEBRATION ✨",
    heading: "HAPPY BIRTHDAY, ALEX!",
    subtitle: "Today, the world feels a little more beautiful because of you.",
    universeQuote: "Today, the universe celebrates you.",
    buttonText: "OPEN YOUR SURPRISE",
    scrollPrompt: "SCROLL TO EXPLORE",
  },

  // 4. Profile Photograph
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  profileFallback: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",

  // 5. Interactive Cake & Wishes
  cake: {
    title: "Make a Birthday Wish",
    instruction: "Close your eyes, think of what your heart desires, and blow out the candles.",
    buttonText: "MAKE A WISH",
    wishGrantedMessage: "✨ May every little wish in your heart find its way to you! ✨",
    relightButton: "Light Candles Again 🕯️",
  },

  // 6. Scrapbook / Photo Gallery (6-8 items)
  gallery: {
    heading: "EVERY PICTURE HAS A STORY",
    subtitle: "A little world of cherished memories, laughs, and golden moments.",
    photos: [
      {
        id: 1,
        title: "Golden Hour Glow",
        caption: "A moment worth remembering.",
        date: "Summer Adventures",
        tag: "Unforgettable",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "Pure Joy",
        caption: "The smile that makes everything better.",
        date: "City Lights",
        tag: "Happiness",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        title: "Coffee & Long Talks",
        caption: "Some memories never get old.",
        date: "Cozy Afternoons",
        tag: "Soul Talks",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        title: "Spontaneous Roadtrip",
        caption: "Little moments, endless happiness.",
        date: "Open Highways",
        tag: "Adventure",
        url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 5,
        title: "Unstoppable Laughter",
        caption: "When laughing until our stomachs hurt was normal.",
        date: "Midnight Snacks",
        tag: "Inside Jokes",
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 6,
        title: "Starlit Evenings",
        caption: "Quiet talks under a sky full of dreams.",
        date: "Night Vibes",
        tag: "Dreamers",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 7,
        title: "Celebration Nights",
        caption: "Living fully, cheering loudly, loving endlessly.",
        date: "Weekend Cheers",
        tag: "Celebration",
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 8,
        title: "New Horizons",
        caption: "Another chapter of making our dreams come true.",
        date: "Looking Ahead",
        tag: "Forever",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  // 7. Memory Storytelling Timeline (5-6 entries)
  timeline: {
    heading: "A JOURNEY OF BEAUTIFUL MOMENTS",
    subtitle: "How time turned simple days into our greatest treasures.",
    events: [
      {
        id: 1,
        title: "The First Hello",
        subtitle: "Where it all began",
        description: "Every beautiful story starts somewhere. We met as strangers, not knowing how deeply intertwined our paths would become.",
        icon: "Sparkles",
        highlight: "Day One",
      },
      {
        id: 2,
        title: "The Crazy Conversations",
        subtitle: "Endless talks & 2 AM laughs",
        description: "From random philosophical debates to uncontrollable fits of laughter over absolutely nothing. The hours always slipped away like minutes.",
        icon: "MessageCircleHeart",
        highlight: "Unforgettable",
      },
      {
        id: 3,
        title: "The Unforgettable Days",
        subtitle: "Moments etched in gold",
        description: "The trips, the spontaneous plans, the challenges we faced together, and the quiet comfort of knowing we always had each other's back.",
        icon: "Camera",
        highlight: "Milestones",
      },
      {
        id: 4,
        title: "The Little Adventures",
        subtitle: "Finding magic in ordinary days",
        description: "Every mundane coffee run, every rainy afternoon, every shared meal turned into a mini adventure worth remembering forever.",
        icon: "Compass",
        highlight: "Pure Joy",
      },
      {
        id: 5,
        title: "Today & Beyond",
        subtitle: "Celebrating who you are",
        description: "Celebrating the amazing, resilient, hilarious, and inspiring person you are. Here's to writing the next chapter of your extraordinary life!",
        icon: "HeartHandshake",
        highlight: "The Future",
      },
    ],
  },

  // 8. The Emotional Handwritten Letter
  letter: {
    heading: "A LETTER, JUST FOR YOU",
    subtitle: "A heartfelt message sealed with warmth, gratitude, and care.",
    envelopeLabel: "You have a little letter waiting...",
    openButtonText: "OPEN YOUR LETTER",
    closeButtonText: "FOLD LETTER",
    salutation: "Dear Alex,",
    paragraphs: [
      "I don't know if you realize how special you are, but I hope today reminds you of that.",
      "Some people enter our lives and make ordinary moments feel extraordinary. You are one of those people.",
      "Thank you for the laughter, the random conversations, the unforgettable memories, and all those little moments that somehow become the biggest reasons to smile.",
      "Life won't always be perfect, and every year will bring its own challenges, but I hope you never forget how capable, valuable, and wonderful you are.",
      "Keep chasing your dreams. Keep smiling that beautiful smile. Never stop being the person who makes the world around them a little brighter.",
      "I wish you endless happiness, good health, success, beautiful adventures, and everything your heart quietly wishes for.",
    ],
    closing: "Happy Birthday!",
    signature: "With lots of love,",
    senderName: "Your Friend ❤️",
  },

  // 9. 10 Little Reasons Why You Are Special
  reasonsSection: {
    heading: "10 LITTLE REASONS WHY YOU ARE AMAZING",
    subtitle: "Click each card to unlock what makes you so genuinely irreplaceable.",
    reasons: [
      {
        id: 1,
        title: "Your Contagious Smile",
        description: "It has this superpower to brighten up the darkest room and turn any bad day around instantly.",
        emoji: "✨",
        tag: "Radiance",
      },
      {
        id: 2,
        title: "Your Beautiful Heart",
        description: "You love genuinely, feel deeply, and stand up for those you care about with unmatched loyalty.",
        emoji: "💖",
        tag: "Kindness",
      },
      {
        id: 3,
        title: "Your Ability to Make People Laugh",
        description: "Your sense of humor is top tier. You can make anyone burst into giggles without even trying.",
        emoji: "😂",
        tag: "Joy",
      },
      {
        id: 4,
        title: "Your Pure Kindness",
        description: "The quiet empathy you show to everyone around you leaves an indelible mark on every soul you meet.",
        emoji: "🌸",
        tag: "Empathy",
      },
      {
        id: 5,
        title: "Your Crazy Energy",
        description: "Life with you is never boring. You bring spontaneous fun and vibrant colors wherever you step.",
        emoji: "⚡",
        tag: "Vibes",
      },
      {
        id: 6,
        title: "Your Determination",
        description: "When you set your mind on something, you face the mountain head-on with inspiring resilience.",
        emoji: "🔥",
        tag: "Strength",
      },
      {
        id: 7,
        title: "Your Unique Personality",
        description: "You are authentically, unapologetically yourself. There is truly nobody else like you on this earth.",
        emoji: "🌟",
        tag: "Original",
      },
      {
        id: 8,
        title: "Your Deep Conversations",
        description: "The late-night philosophical talks, the unfiltered honesty, and the safe space you create.",
        emoji: "🌙",
        tag: "Soul",
      },
      {
        id: 9,
        title: "Your Positive Attitude",
        description: "Even when life gets stormy, you always search for the silver lining and inspire others to do the same.",
        emoji: "🌈",
        tag: "Hope",
      },
      {
        id: 10,
        title: "Simply Being YOU",
        description: "Just your existence is a gift to everyone lucky enough to know you. Never change.",
        emoji: "👑",
        tag: "Priceless",
      },
    ],
  },

  // 10. Interactive Wishes Wall
  wishesSection: {
    heading: "WORDS WE WISH FOR YOU",
    subtitle: "A constellation of blessings, hopes, and prayers for your upcoming year.",
    revealButtonText: "REVEAL ONE MORE WISH ✨",
    wishes: [
      { id: 1, text: "A lifetime of genuine, unshakeable happiness.", category: "Joy", color: "pink" },
      { id: 2, text: "Endless success and doors opening wherever you knock.", category: "Success", color: "gold" },
      { id: 3, text: "Deep, loyal friendships that celebrate you at your best and hold you at your worst.", category: "Friendship", color: "lavender" },
      { id: 4, text: "Unstoppable courage to boldly chase every single dream in your heart.", category: "Courage", color: "rose" },
      { id: 5, text: "Calm peace and tranquility in every difficult or uncertain moment.", category: "Peace", color: "lavender" },
      { id: 6, text: "More belly laughs that make you tear up with happiness.", category: "Laughter", color: "pink" },
      { id: 7, text: "Thrilling adventures, passport stamps, and stories worth telling forever.", category: "Adventure", color: "gold" },
      { id: 8, text: "Vibrant health, boundless energy, and deep restful nights.", category: "Wellness", color: "rose" },
      { id: 9, text: "The quiet certainty that you are deeply, unconditionally loved.", category: "Love", color: "pink" },
      { id: 10, text: "Surprise moments of serendipity that take your breath away.", category: "Magic", color: "gold" },
      { id: 11, text: "Financial abundance that brings both freedom and peace of mind.", category: "Prosperity", color: "gold" },
      { id: 12, text: "Confidence that grows stronger with every sunrise.", category: "Self-Love", color: "lavender" },
    ],
  },

  // 11. Surprise Smile Generator ("I NEED A LITTLE SMILE")
  smileGenerator: {
    title: "Need a Little Smile?",
    buttonText: "I NEED A LITTLE SMILE 😊",
    messages: [
      "Fun fact: You are 100% scientifically proven to be one of the coolest people in the world! 🌟",
      "If happiness had a human face, it would definitely be your smile today! ☀️",
      "Reminder: Take a deep breath. You're doing amazing, and today the universe is rooting for you! 🍀",
      "I asked the stars what the best thing that happened this year was. They pointed at you! ✨",
      "May your day be filled with warm coffee, zero stress, and endless reasons to laugh out loud! ☕",
      "You make being an incredible human look completely effortless! 💫",
      "Warning: Being around you may cause spontaneous smiles, laughter, and high vibrations! 🚀",
      "You are worthy of every good thing flowing into your life right now. Soak it all in! 🌻",
    ],
  },

  // 12. Secret Message Easter Egg
  secretMessage: {
    tooltip: "A tiny secret awaits...",
    modalTitle: "You Discovered The Secret Note! 🗝️✨",
    content: "If you're reading this, it means you're curious and attentive to the little details — just another reason why you're so special. Never lose that spark of curiosity and wonder. Happy Birthday!",
  },

  // 13. Cinematic Finale
  finale: {
    heading: "AND BEFORE YOU GO...",
    subtitle: "One last grand surprise to send you into your best year yet.",
    buttonText: "MAKE THIS MOMENT MAGICAL 🎆",
    finalHeading: "May this year be your most beautiful chapter yet.",
    madeWithLoveText: "Made with ❤️ just for you.",
  },

  // 14. Relationship-Specific Endings
  relationshipEndings: {
    "Best Friend": "To my partner in crime, thank you for being the person who understands my silence, amplifies my joy, and makes life an adventure.",
    "Friend": "So incredibly thankful for your friendship, your good energy, and all the warm memories we've created together.",
    "Partner": "You make every heartbeat richer and every tomorrow brighter. Having you in my life is the greatest gift of all.",
    "Sister": "Blessed to have you not just as a sister, but as a lifelong confidante and guardian angel.",
    "Brother": "Proud to call you my brother, my teammate, and someone I will always look up to.",
    "Default": "Thank you for being the amazing, radiant human being that you are. Today is your day!",
  },

  // 15. Music & Sound Configuration
  music: {
    title: "Dreamy Birthday Melody",
    artist: "Acoustic Serenade",
    audioPath: "/assets/audio/birthday-ambient.mp3",
    allowSynthesizerFallback: true,
  },
};

export default birthdayConfig;
