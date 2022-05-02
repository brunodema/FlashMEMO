import { Guid } from 'guid-ts';
import { LoremIpsum, loremIpsum } from 'lorem-ipsum';
import {
  Flashcard,
  FlashcardLayout,
} from 'src/app/shared/models/flashcard-models';
import deckJson from 'src/assets/test_assets/Decks.json';

function getRandomElementFromArray<Type>(array: Array<Type>): Type {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Function shamelessly stolen from: https://stackoverflow.com/questions/31378526/generate-random-date-between-two-dates-and-times-in-javascript.
 * @param from Starting date
 * @param to Finish date
 * @returns Random date
 */
function getRandomDate(from: Date, to: Date): Date {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

function randomValueWithCuttof<Type>(
  cutoff: number,
  fixedValue: Type,
  predicate: (...args: any[]) => Type,
  ...args: any[]
): Type {
  let rng = Math.random();
  if (rng < cutoff) {
    console.log('rng value of ' + rng + ', returning fixed value...');
    return fixedValue;
  }
  console.log('rng value of ' + rng + ', returning predicate value...');
  return predicate(args);
}

export function theNewFlashcardSeeder(amount: number) {
  let loremIpsum = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });
  let deckIdPool = deckJson.map((x) => x.deckId); // sets ID pool from Decks
  let levelPool = Array.from(Array(11).keys()); // array from 0 to 10 (stolen from here: https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n)
  let answerPool = [
    'thing',
    'macchina',
    'kirche',
    'mel',
    'ni hao',
    '¿Cómo está señor?',
    'Tarte',
    'Restaurant',
    'kill',
    'Gelsenkirchen',
    'onda',
    'Hi, how are you?',
    'nuage',
    'el pueblo',
    'vecchia signora',
  ];
  let layoutPool = [
    'SINGLE_BLOCK',
    'VERTICAL_SPLIT',
    'TRIPLE_BLOCK',
    'HORIZONTAL_SPLIT',
    'FULL_CARD',
  ];
  let flashcardContentpool = [
    'https://target.scene7.com/is/image/Target/GUEST_d29e72d0-b1cd-4cfd-8c8b-f2a200fd7193?wid=488&hei=488&fmt=pjpeg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6463/6463555_sd.jpg',
    'https://m.media-amazon.com/images/I/81rz6kuxieL._AC_SL1500_.jpg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6440/6440961_sd.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt48f811476e162ed0/620c15764ae5ae6845c6b0c9/LOL_Homepage_Modal_(1680x650)_(1).jpg',
    'https://target.scene7.com/is/image/Target/GUEST_b3e2da64-ad54-48b5-9dc7-50071ea5075d?wid=488&hei=488&fmt=pjpeg',
    'https://audio.oxforddictionaries.com/en/mp3/car_gb_1.mp3',
    'https://audio12.forvo.com/audios/mp3/l/i/li_9002112_133_543430_266179.mp3',
    'https://audio12.forvo.com/audios/mp3/4/r/4r_20_74_136_1.mp3',
    'https://audio12.forvo.com/audios/mp3/u/n/un_9523171_118_7665857.mp3',
    'https://audio12.forvo.com/audios/mp3/p/v/pv_8979922_49_607322_1.mp3',
    'https://audio12.forvo.com/audios/mp3/6/o/6o_9014612_41_617305_1.mp3',
  ];
  let referenceDate = new Date(2020, 1, 1, 12, 0, 0, 0);
  let startDateRange = new Date(
    referenceDate.setDate(referenceDate.getDate() - 30)
  );
  let endDateRange = new Date(
    referenceDate.setDate(referenceDate.getDate() + 30)
  );
  let flashcardDictPool = [
    "<p><b>car</b></p><p>Category: Noun</p><p>Spelling: kɑː</p><p>Definitions:</p><ul><li>a four-wheeled road vehicle that is powered by an engine and is able to carry a small number of people</li></ul><p>Examples:</p><ul><li>she drove up in a car</li><li>we're going by car</li></ul>",
    "<p><b>love</b></p><p>Category: Noun</p><p>Spelling: ləv</p><p>Definitions:</p><ul><li>an intense feeling of deep affection</li><li>a great interest and pleasure in something</li><li>a person or thing that one loves</li><li>(in tennis, squash, and some other sports) a score of zero; nil</li></ul><p>Examples:</p><ul><li>babies fill parents with feelings of love</li><li>their love for their country</li><li>his love for football</li><li>we share a love of music</li><li>she was the love of his life</li><li>their two great loves are tobacco and whiskey</li><li>love fifteen</li><li>he was down two sets to love</li></ul><p>Category: Verb</p><p>Spelling: ləv</p><p>Definitions:</p><ul><li>feel deep affection for (someone)</li><li>like or enjoy very much</li></ul><p>Examples:</p><ul><li>he loved his sister dearly</li><li>there were four memorial pages set up by her friends in honor of Phoebe, saying how much they loved and missed her</li><li>I just love dancing</li><li>I'd love a cup of tea</li><li>I love this job</li><li>they love to play golf</li></ul>",
    "<p><b>calcio</b></p><p>Category: noun</p><p>Spelling: ˈkaltʃo</p><p>Definitions:</p><ul><li>impugnatura della pistola</li><li>parte del fucile che si appoggia alla spalla</li></ul><p>Examples:</p><ul><li>carabina con calcio in legno</li><li>L'aggressore lo colpì con il calcio della pistola.</li></ul><p>Category: noun</p><p>Spelling: ˈkaltʃo</p><p>Definitions:</p><ul><li>colpo dato con il piede</li><li>colpo dato con la zampa da animali forniti di zoccoli</li><li>il gioco del pallone</li><li>tiro effettuato colpendo col piede il pallone</li></ul><p>Examples:</p><ul><li>dare un calcio</li><li>prendere a calci</li><li>Il mulo tira calci se infastidito.</li><li>una partita di calcio</li><li>la nazionale di calcio</li><li>calcio d'angolo</li><li>calcio di punizione</li></ul><p>Category: noun</p><p>Spelling: ˈkaltʃo</p><p>Definitions:</p><ul><li>elemento chimico di colore bianco</li></ul><p>Examples:</p><ul><li>Il latte è ricco di calcio.</li></ul>",
    '<p><b>arbol</b></p><p>Category: Noun</p><p>Spelling: </p><p>Definitions:</p><ul><li>Planta de tronco leñoso, grueso y elevado que se ramifica a cierta altura del suelo formando la copa</li><li>Cuadro descriptivo que representa de forma gráfica las relaciones que tienen los elementos de un conjunto o las variaciones de un fenómeno</li><li>Barra fija o giratoria que en una máquina sirve para soportar piezas rotativas o para transmitir fuerza motriz de unos órganos a otros</li><li>Barra o eje que se usa en posición vertical y sirve de apoyo a una estructura que se desarrolla alrededor del mismo, como el árbol de una escalera de caracol</li><li>Madero que junto con otros se coloca perpendicularmente a la quilla de una embarcación y está destinado a sujetar las velas</li><li>Eje del órgano (instrumento musical) que, movido a voluntad del ejecutante, hace que suene o deje de sonar un registro</li><li>Punzón que usan los relojeros para perforar el metal y que tiene el mango de madera y la punta de acero</li><li>Pieza de hierro en la parte superior del husillo de la prensa de imprimir</li></ul><p>Examples:</p><ul><li>el Ministerio de Medio Ambiente tiene previsto plantar un millón de árboles en el próximo año</li><li>diagrama en árbol</li></ul>',
  ];

  let ret = new Array<Flashcard>();

  for (let index = 0; index < amount; index++) {
    const element = new Flashcard();
    element.flashcardId = Guid.newGuid().toString();
    element.deckId = getRandomElementFromArray(deckIdPool);
    element.level = getRandomElementFromArray(levelPool);
    element.creationDate = getRandomDate(
      startDateRange,
      endDateRange
    ).toISOString();
    element.lastUpdated = randomValueWithCuttof(0.8, element.creationDate, () =>
      getRandomDate(new Date(element.creationDate), endDateRange).toISOString()
    );
    element.dueDate = new Date(
      new Date(element.lastUpdated).setDate(
        new Date(element.lastUpdated).getDate() + element.level ** 2
      )
    ).toISOString();

    element.answer = randomValueWithCuttof(0.5, '', () =>
      getRandomElementFromArray(answerPool)
    );

    element.frontContentLayout = getRandomElementFromArray(layoutPool);
    switch (element.frontContentLayout) {
      case FlashcardLayout.SINGLE_BLOCK:
        element.content1 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.HORIZONTAL_SPLIT:
        element.content1 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content2 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.TRIPLE_BLOCK:
        element.content1 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content2 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content3 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.VERTICAL_SPLIT:
        element.content1 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content2 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.FULL_CARD:
        element.content1 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content2 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content3 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
    }
    element.backContentLayout = getRandomElementFromArray(layoutPool);
    switch (element.backContentLayout) {
      case FlashcardLayout.SINGLE_BLOCK:
        element.content4 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.HORIZONTAL_SPLIT:
        element.content4 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content5 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.TRIPLE_BLOCK:
        element.content4 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content5 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content6 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.VERTICAL_SPLIT:
        element.content4 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content5 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
      case FlashcardLayout.FULL_CARD:
        element.content4 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content5 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        element.content6 = randomValueWithCuttof(
          0.5,
          getRandomElementFromArray(flashcardContentpool),
          () => loremIpsum.generateSentences()
        );
        break;
    }
    ret.push(element);
  }

  return JSON.stringify(ret);
}
