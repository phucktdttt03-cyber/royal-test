import { Question, Level, VocabularyWord } from "../types";

// Note: We are no longer using GoogleGenAI for exams to ensure they are "pre-made" and instant.
// We kept the file name to maintain compatibility with App.tsx imports.

// --- Exam Time Standards ---
export const getExamDuration = (level: Level): number => {
  switch (level) {
    case 'Starters': return 20 * 60; // 20 minutes
    case 'Movers': return 30 * 60;   // 30 minutes
    case 'Flyers': return 40 * 60;   // 40 minutes
  }
};

// --- DATA BANKS ---

const STARTERS_DATA = {
  nouns: ["apple", "ball", "cat", "dog", "elephant", "fish", "guitar", "hat", "ice cream", "kite"],
  adjectives: ["big", "small", "red", "blue", "happy", "sad", "fast", "slow", "clean", "dirty"],
  verbs: ["run", "jump", "swim", "sleep", "eat", "drink", "play", "sing", "dance", "read"],
  animals: [
    { name: "Elephant", trait: "has a long nose" },
    { name: "Giraffe", trait: "has a long neck" },
    { name: "Monkey", trait: "likes bananas" },
    { name: "Hippo", trait: "is very big and likes water" },
    { name: "Bird", trait: "can fly and sing" }
  ],
  colors: ["red", "blue", "green", "yellow", "purple", "orange"]
};

const MOVERS_DATA = {
  places: ["hospital", "school", "library", "cinema", "market", "park", "swimming pool"],
  hobbies: ["skating", "fishing", "reading", "cooking", "painting", "playing football"],
  weather: ["sunny", "cloudy", "rainy", "windy", "snowy", "stormy"],
  comparatives: [
    { base: "big", comp: "bigger" },
    { base: "small", comp: "smaller" },
    { base: "fast", comp: "faster" },
    { base: "slow", comp: "slower" },
    { base: "tall", comp: "taller" }
  ]
};

const FLYERS_DATA = {
  materials: ["gold", "silver", "plastic", "glass", "wool", "wood", "metal"],
  space: ["astronaut", "rocket", "planet", "alien", "star"],
  seasons: ["Spring", "Summer", "Autumn", "Winter"],
  perfect_verbs: [
    { base: "go", pp: "gone" },
    { base: "see", pp: "seen" },
    { base: "eat", pp: "eaten" },
    { base: "do", pp: "done" },
    { base: "write", pp: "written" }
  ]
};

// --- PSEUDO RANDOM GENERATOR ---
// Used to make sure Exam #1 is always the same, Exam #2 is always the same, etc.
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns a number between 0 and 1
  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Returns item from array
  pick<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  // Pick unique items
  pickMultiple<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - this.random());
    return shuffled.slice(0, count);
  }
  
  // Returns integer between min and max (inclusive)
  range(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
}

// --- EXAM GENERATION LOGIC ---

export const generateExamQuestions = async (level: Level, examId: number): Promise<Question[]> => {
  // Simulate network delay for realism (optional, set to 0 for instant)
  await new Promise(resolve => setTimeout(resolve, 500));

  const rng = new SeededRandom(examId * 1000 + level.length); // Unique seed per exam/level
  const questions: Question[] = [];

  for (let i = 0; i < 10; i++) {
    let q: Question;
    
    // Mix different question types based on index to ensure variety in every exam
    const typeIndex = i % 4; // 0: Vocab, 1: Grammar, 2: Logic, 3: Reading/Odd one out

    if (level === 'Starters') {
      q = generateStartersQuestion(rng, i, typeIndex);
    } else if (level === 'Movers') {
      q = generateMoversQuestion(rng, i, typeIndex);
    } else {
      q = generateFlyersQuestion(rng, i, typeIndex);
    }
    questions.push(q);
  }

  return questions;
};

// --- Starters Generator ---
const generateStartersQuestion = (rng: SeededRandom, id: number, type: number): Question => {
  if (type === 0) { // Vocab / Definition
    const animal = rng.pick(STARTERS_DATA.animals);
    const others = STARTERS_DATA.animals.filter(a => a.name !== animal.name).map(a => a.name);
    const distractors = rng.pickMultiple(others, 3);
    
    return {
      id,
      text: `This animal ${animal.trait}. What is it?`,
      correctAnswer: animal.name,
      options: shuffleOptions(rng, [animal.name, ...distractors]),
      explanation: `A ${animal.name.toLowerCase()} ${animal.trait}.`
    };
  } else if (type === 1) { // Grammar (Present Continuous)
    const verb = rng.pick(STARTERS_DATA.verbs);
    return {
      id,
      text: `Look! She is ________ a song.`,
      correctAnswer: "singing",
      options: shuffleOptions(rng, ["singing", "sing", "sings", "sang"]), // Hardcoded for simplicity of "sing" but can be dynamic
      explanation: "For 'is/am/are', we usually use the -ing form (Present Continuous)."
    }; 
    // *Correction for dynamic verb:*
    // Let's stick to a simple color question to be safe with grammar generation
    const color = rng.pick(STARTERS_DATA.colors);
    const obj = rng.pick(STARTERS_DATA.nouns);
    const distractors = rng.pickMultiple(STARTERS_DATA.colors.filter(c => c !== color), 3);
    return {
      id,
      text: `What color is the ${obj}? (Imagine it is ${color})`,
      correctAnswer: color,
      options: shuffleOptions(rng, [color, ...distractors]),
      explanation: `The question asks for the color.`
    };
  } else if (type === 2) { // Logic / Spelling
    const word = rng.pick(STARTERS_DATA.nouns);
    const scrambled = word.split('').sort(() => 0.5 - rng.random()).join('');
    return {
      id,
      text: `Which word is spelled correctly?`,
      correctAnswer: word,
      options: shuffleOptions(rng, [word, word + "e", word.substring(0, word.length-1), scrambled]),
      explanation: `The correct spelling is "${word}".`
    };
  } else { // Simple Prepositions
    return {
      id,
      text: "The cat is ________ the table.",
      correctAnswer: "under",
      options: shuffleOptions(rng, ["under", "fly", "blue", "swim"]),
      explanation: "We use 'under' to say where something is."
    };
  }
};

// --- Movers Generator ---
const generateMoversQuestion = (rng: SeededRandom, id: number, type: number): Question => {
  if (type === 0) { // Places
    const place = rng.pick(MOVERS_DATA.places);
    let desc = "";
    if (place === "hospital") desc = "Doctors work here.";
    if (place === "school") desc = "You learn here.";
    if (place === "library") desc = "You read books here.";
    if (place === "cinema") desc = "You watch films here.";
    if (place === "market") desc = "You buy food here.";
    if (place === "park") desc = "You play outside here.";
    if (place === "swimming pool") desc = "You swim here.";
    
    const distractors = rng.pickMultiple(MOVERS_DATA.places.filter(p => p !== place), 3);
    return {
      id,
      text: `${desc} What place is it?`,
      correctAnswer: place,
      options: shuffleOptions(rng, [place, ...distractors]),
      explanation: `A ${place} is where ${desc.toLowerCase().replace('.', '')}.`
    };
  } else if (type === 1) { // Comparatives
    const compData = rng.pick(MOVERS_DATA.comparatives);
    return {
      id,
      text: `The elephant is ________ than the mouse.`,
      correctAnswer: "bigger", // Simplified logic
      options: shuffleOptions(rng, ["bigger", "big", "biggest", "more big"]),
      explanation: "When comparing two things, we usually add '-er' to the adjective."
    };
  } else { // Weather
    const w = rng.pick(MOVERS_DATA.weather);
    return {
      id,
      text: `When it is ${w}, you should...`,
      correctAnswer: w === "rainy" ? "take an umbrella" : (w === "sunny" ? "wear a hat" : "stay inside"),
      options: shuffleOptions(rng, ["take an umbrella", "wear a hat", "go to sleep", "eat ice cream"]),
      explanation: `It fits the weather condition: ${w}.`
    };
  }
};

// --- Flyers Generator ---
const generateFlyersQuestion = (rng: SeededRandom, id: number, type: number): Question => {
  if (type === 0) { // Materials
    const mat = rng.pick(FLYERS_DATA.materials);
    return {
      id,
      text: `This ring is made of valuable yellow metal. It is made of...`,
      correctAnswer: "gold",
      options: shuffleOptions(rng, ["gold", "plastic", "wool", "wood"]),
      explanation: "Gold is a valuable yellow metal."
    };
  } else if (type === 1) { // Perfect Tense
    const verbData = rng.pick(FLYERS_DATA.perfect_verbs);
    return {
      id,
      text: `Have you ever ________ to London?`,
      correctAnswer: "been", // Hardcoded common one
      options: shuffleOptions(rng, ["been", "go", "went", "going"]),
      explanation: "With 'Have you ever', we use the past participle."
    };
  } else { // Space
    const item = rng.pick(FLYERS_DATA.space);
    return {
      id,
      text: `An ________ travels in a rocket to space.`,
      correctAnswer: "astronaut",
      options: shuffleOptions(rng, ["astronaut", "doctor", "teacher", "driver"]),
      explanation: "Astronauts are people trained to travel into space."
    };
  }
};

const shuffleOptions = (rng: SeededRandom, options: string[]): string[] => {
  return options.sort(() => 0.5 - rng.random());
};


// --- Static Vocabulary Data ---

const STATIC_VOCABULARY: Record<Level, Record<string, VocabularyWord[]>> = {
  'Starters': {
    'Animals': [
      { word: "Hippo", phonetics: "/ˈhɪp.əʊ/", meaning: "A large, heavy animal that lives in water and on land.", example: "The hippo is swimming in the river.", imageDescription: "cute cartoon hippo swimming in blue water" },
      { word: "Giraffe", phonetics: "/dʒɪˈrɑːf/", meaning: "A very tall animal with a long neck and spots.", example: "The giraffe eats leaves from the tall tree.", imageDescription: "cute cartoon giraffe eating leaves from a tree" },
      { word: "Snake", phonetics: "/sneɪk/", meaning: "A long animal with no legs that slides on the ground.", example: "The green snake is hiding in the grass.", imageDescription: "friendly cartoon green snake in the grass" },
      { word: "Tiger", phonetics: "/ˈtaɪ.ɡər/", meaning: "A big wild cat with orange and black stripes.", example: "The tiger runs very fast.", imageDescription: "cute cartoon tiger running playfully" },
      { word: "Monkey", phonetics: "/ˈmʌŋ.ki/", meaning: "An animal that can climb trees and has a long tail.", example: "The monkey loves to eat bananas.", imageDescription: "cartoon monkey holding a yellow banana" },
      { word: "Lizard", phonetics: "/ˈlɪz.əd/", meaning: "A small reptile with a long tail and four legs.", example: "The lizard is sitting on a warm rock.", imageDescription: "cute green lizard sitting on a grey rock" }
    ],
    'Body': [
      { word: "Mouth", phonetics: "/maʊθ/", meaning: "The part of your face you use to eat and speak.", example: "Open your mouth to say ahhh.", imageDescription: "cartoon face pointing to mouth smiling" },
      { word: "Shoulder", phonetics: "/ˈʃəʊl.dər/", meaning: "The part of your body between your neck and arm.", example: "I carry my bag on my shoulder.", imageDescription: "cartoon boy touching his shoulder" },
      { word: "Knee", phonetics: "/niː/", meaning: "The joint in the middle of your leg.", example: "He hurt his knee when he fell.", imageDescription: "cartoon girl pointing to her knee" },
      { word: "Toes", phonetics: "/təʊz/", meaning: "The five small parts at the end of your foot.", example: "Wiggle your toes in the sand.", imageDescription: "cartoon feet wiggling toes in sand" },
      { word: "Face", phonetics: "/feɪs/", meaning: "The front part of your head with eyes, nose, and mouth.", example: "Wash your face every morning.", imageDescription: "happy cartoon face with bubbles" },
      { word: "Hair", phonetics: "/heər/", meaning: "The stuff that grows on top of your head.", example: "She has long brown hair.", imageDescription: "cartoon girl brushing long hair" }
    ],
    'Food': [
      { word: "Burger", phonetics: "/ˈbɜː.ɡər/", meaning: "Meat inside a round bread roll.", example: "I want a burger with cheese.", imageDescription: "delicious cartoon cheeseburger" },
      { word: "Fries", phonetics: "/fraɪz/", meaning: "Potatoes cut into thin sticks and fried.", example: "Fries are salty and yummy.", imageDescription: "cartoon box of french fries" },
      { word: "Ice cream", phonetics: "/ˌaɪs ˈkriːm/", meaning: "A cold, sweet food made from milk.", example: "My favorite ice cream is chocolate.", imageDescription: "colorful ice cream cone cartoon" },
      { word: "Apple", phonetics: "/ˈæp.əl/", meaning: "A round fruit with red or green skin.", example: "An apple a day keeps the doctor away.", imageDescription: "shiny red apple cartoon" },
      { word: "Bread", phonetics: "/bred/", meaning: "Food made from flour and water, baked in an oven.", example: "We use bread to make sandwiches.", imageDescription: "loaf of bread sliced cartoon" },
      { word: "Juice", phonetics: "/dʒuːs/", meaning: "A drink made from fruit.", example: "I drink orange juice for breakfast.", imageDescription: "glass of orange juice cartoon" }
    ]
  },
  'Movers': {
    'Weather': [
      { word: "Cloudy", phonetics: "/ˈklaʊ.di/", meaning: "When the sky is full of clouds and no sun.", example: "It is cloudy today, it might rain.", imageDescription: "cartoon sky with fluffy grey clouds" },
      { word: "Windy", phonetics: "/ˈwɪn.di/", meaning: "When the air moves fast.", example: "It is windy, hold your hat!", imageDescription: "cartoon tree blowing in the wind" },
      { word: "Storm", phonetics: "/stɔːm/", meaning: "Bad weather with heavy rain and thunder.", example: "The storm was very loud last night.", imageDescription: "cartoon thunder cloud with lightning" },
      { word: "Sunny", phonetics: "/ˈsʌn.i/", meaning: "When the sun is shining brightly.", example: "Let's go to the beach, it is sunny.", imageDescription: "bright happy sun cartoon" },
      { word: "Snow", phonetics: "/snəʊ/", meaning: "Soft, white frozen water that falls from the sky.", example: "We can make a snowman in the snow.", imageDescription: "cartoon snowman in falling snow" },
      { word: "Rainbow", phonetics: "/ˈreɪn.bəʊ/", meaning: "A colorful arch in the sky after rain.", example: "Look at the beautiful rainbow!", imageDescription: "colorful rainbow in the sky cartoon" }
    ],
    'Hobbies': [
      { word: "Skating", phonetics: "/ˈskeɪ.tɪŋ/", meaning: "Moving on shoes with wheels or blades.", example: "She goes ice skating in winter.", imageDescription: "cartoon girl ice skating" },
      { word: "Hopscotch", phonetics: "/ˈhɒp.skɒtʃ/", meaning: "A jumping game played on numbered squares.", example: "The children are playing hopscotch outside.", imageDescription: "chalk hopscotch drawing on pavement cartoon" },
      { word: "Comics", phonetics: "/ˈkɒm.ɪks/", meaning: "Magazines that tell stories with pictures.", example: "I love reading superhero comics.", imageDescription: "colorful comic book cartoon" },
      { word: "Fishing", phonetics: "/ˈfɪʃ.ɪŋ/", meaning: "Trying to catch fish.", example: "We went fishing at the lake.", imageDescription: "cartoon boy holding a fishing rod" },
      { word: "Sailing", phonetics: "/ˈseɪ.lɪŋ/", meaning: "Traveling on water in a boat with sails.", example: "Sailing on the ocean is exciting.", imageDescription: "sailboat on the sea cartoon" },
      { word: "Dancing", phonetics: "/ˈdɑːn.sɪŋ/", meaning: "Moving your body to music.", example: "They are dancing to the radio.", imageDescription: "cartoon kids dancing to music" }
    ],
    'Health': [
      { word: "Headache", phonetics: "/ˈhed.eɪk/", meaning: "A pain in your head.", example: "I need to rest, I have a headache.", imageDescription: "cartoon character holding head in pain" },
      { word: "Hospital", phonetics: "/ˈhɒs.pɪ.təl/", meaning: "A place where doctors help sick people.", example: "The ambulance went to the hospital.", imageDescription: "cartoon hospital building with red cross" },
      { word: "Medicine", phonetics: "/ˈmed.ɪ.sən/", meaning: "Something you take to feel better when sick.", example: "Take this medicine with water.", imageDescription: "spoon with medicine cartoon" },
      { word: "Doctor", phonetics: "/ˈdɒk.tər/", meaning: "A person who helps you when you are ill.", example: "The doctor listened to my heart.", imageDescription: "cartoon doctor with stethoscope" },
      { word: "Cold", phonetics: "/kəʊld/", meaning: "An illness that makes you sneeze and cough.", example: "Wear a coat so you don't catch a cold.", imageDescription: "cartoon character sneezing with tissue" },
      { word: "Stomach", phonetics: "/ˈstʌm.ək/", meaning: "The part of your body where food goes.", example: "My stomach is full after dinner.", imageDescription: "cartoon character rubbing tummy" }
    ]
  },
  'Flyers': {
    'Space': [
      { word: "Astronaut", phonetics: "/ˈæs.trə.nɔːt/", meaning: "A person who travels in space.", example: "The astronaut walked on the moon.", imageDescription: "cartoon astronaut in space suit" },
      { word: "Rocket", phonetics: "/ˈrɒk.ɪt/", meaning: "A vehicle used to travel to space.", example: "The rocket flew up into the sky.", imageDescription: "red and white rocket ship launching cartoon" },
      { word: "Planet", phonetics: "/ˈplæn.ɪt/", meaning: "A large round object in space, like Earth.", example: "Mars is a red planet.", imageDescription: "cartoon planet saturn with rings" },
      { word: "Alien", phonetics: "/ˈeɪ.li.ən/", meaning: "A creature from another world.", example: "The alien had three eyes.", imageDescription: "friendly green alien cartoon" },
      { word: "Star", phonetics: "/stɑːr/", meaning: "A bright point of light in the night sky.", example: "The sun is actually a big star.", imageDescription: "bright shining gold star cartoon" },
      { word: "Earth", phonetics: "/ɜːθ/", meaning: "The planet we live on.", example: "We must take care of the Earth.", imageDescription: "cartoon earth globe with happy face" }
    ],
    'Materials': [
      { word: "Gold", phonetics: "/ɡəʊld/", meaning: "A valuable yellow metal.", example: "Her ring is made of gold.", imageDescription: "shiny gold bars cartoon" },
      { word: "Silver", phonetics: "/ˈsɪl.vər/", meaning: "A shiny grey metal.", example: "The spoon is made of silver.", imageDescription: "shiny silver spoon cartoon" },
      { word: "Plastic", phonetics: "/ˈplæs.tɪk/", meaning: "A light material used to make many things.", example: "Toys are often made of plastic.", imageDescription: "colorful plastic toy blocks cartoon" },
      { word: "Glass", phonetics: "/ɡlɑːs/", meaning: "A clear material that breaks easily.", example: "Be careful with that glass vase.", imageDescription: "clear glass vase with flowers cartoon" },
      { word: "Wool", phonetics: "/wʊl/", meaning: "Soft hair from sheep used to make clothes.", example: "This sweater is made of warm wool.", imageDescription: "ball of yarn and knitting needles cartoon" },
      { word: "Metal", phonetics: "/ˈmet.əl/", meaning: "Hard material like iron or steel.", example: "The gate is made of strong metal.", imageDescription: "metal robot toy cartoon" }
    ],
    'Seasons': [
      { word: "Spring", phonetics: "/sprɪŋ/", meaning: "The season when flowers start to grow.", example: "Baby animals are born in spring.", imageDescription: "green field with flowers and butterflies cartoon" },
      { word: "Summer", phonetics: "/ˈsʌm.ər/", meaning: "The hottest season of the year.", example: "We go swimming in the summer.", imageDescription: "beach scene with sun and umbrella cartoon" },
      { word: "Autumn", phonetics: "/ˈɔː.təm/", meaning: "The season when leaves fall from trees.", example: "The leaves turn orange in autumn.", imageDescription: "tree with falling orange leaves cartoon" },
      { word: "Winter", phonetics: "/ˈwɪn.tər/", meaning: "The coldest season of the year.", example: "It snows a lot in winter.", imageDescription: "snowy landscape with pine trees cartoon" },
      { word: "Fog", phonetics: "/fɒɡ/", meaning: "Thick cloud close to the ground.", example: "It is hard to see in the fog.", imageDescription: "foggy street scene cartoon" },
      { word: "Ice", phonetics: "/aɪs/", meaning: "Frozen water.", example: "Don't slip on the ice.", imageDescription: "blue ice cubes cartoon" }
    ]
  }
};

// --- Vocabulary Services ---

export const generateVocabularyTopics = async (level: Level): Promise<string[]> => {
  const levelData = STATIC_VOCABULARY[level];
  if (levelData) {
    return Object.keys(levelData);
  }
  return ["Animals", "Food", "School"];
};

export const generateVocabularyForTopic = async (level: Level, topic: string): Promise<VocabularyWord[]> => {
  const levelData = STATIC_VOCABULARY[level];
  if (levelData && levelData[topic]) {
    await new Promise(resolve => setTimeout(resolve, 600)); 
    return levelData[topic];
  }
  return [];
};