// Script to update STORIES_DATA and Story Viewer in js/app.js
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'ENGLISH-', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const updatedStoriesData = `  const STORIES_DATA = [
    {
      id: "three-little-pigs",
      title: "The Three Little Pigs",
      titleEs: "Los tres cerditos",
      level: "Nivel A2",
      category: "Fábula Clásica",
      coverImage: "images/story_three_little_pigs.jpg",
      moralEn: "Hard work, patience, and solid preparation build lasting security and peace of mind.",
      moralEs: "El trabajo constante, la paciencia y la sólida preparación construyen una seguridad duradera y paz mental.",
      acts: ["Act I: The Beginning", "Act II: The Challenge", "Act III: The Resolution"],
      paragraphs: [
        {
          act: "Act I: The Beginning",
          en: "Once upon a time in a verdant valley, three little pig brothers lived happily with their wise mother until the day arrived to build their own independent lives.",
          es: "Érase una vez en un valle verdeante, tres hermanos cerditos vivían felices con su sabia madre hasta que llegó el día de forjar sus vidas independientes."
        },
        {
          act: "Act I: The Beginning",
          en: "Before bidding them farewell, their mother urged them with solemn words: 'Whatever you do in this wide world, do it with dedication and build carefully, for the perils of the forest are real.'",
          es: "Antes de despedirlos, su madre les aconsejó con palabras solemnes: 'Hagan lo que hagan en este ancho mundo, háganlo con esmero y construyan con cuidado, pues los peligros del bosque son reales.'"
        },
        {
          act: "Act I: The Beginning",
          en: "The first pig was jovial and impatient; he gathered bundles of dry golden straw from a local farmer to quickly assemble a light hut in less than an hour.",
          es: "El primer cerdito era jovial e impaciente; reunió atados de paja dorada y seca de un granjero local para armar rápidamente una choza ligera en menos de una hora."
        },
        {
          act: "Act I: The Beginning",
          en: "Delighted with his rapid construction, he merrily danced along the meadow path while teasing his brothers for wasting valuable leisure hours.",
          es: "Encantado con su rápida construcción, bailó alegremente por el sendero del prado mientras se burlaba de sus hermanos por gastar valiosas horas de ocio."
        },
        {
          act: "Act II: The Challenge",
          en: "The second brother, slightly more thoughtful, gathered sturdy wooden sticks and pine branches from the forest floor to craft a rustic timber cabin.",
          es: "El segundo hermano, un poco más pensativo, recolectó ramas firmes y palos de pino del suelo del bosque para confeccionar una cabaña rústica de madera."
        },
        {
          act: "Act II: The Challenge",
          en: "Although stronger than the straw hut, the wooden cabin trembled under gusty winds, yet the second pig concluded it was solid enough before rushing off to play.",
          es: "Aunque era más fuerte que la choza de paja, la cabaña temblaba ante las ráfagas de viento; aun así, el segundo cerdito concluyó que era suficientemente sólida y corrió a jugar."
        },
        {
          act: "Act II: The Challenge",
          en: "The third brother, known for his patience and diligence, hauled heavy red bricks, wet sand, and bags of grey lime mortar from the riverside quarry.",
          es: "El tercer hermano, célebre por su paciencia y diligencia, acarreó pesados ladrillos rojos, arena húmeda y sacos de mortero de cal desde la cantera ribereña."
        },
        {
          act: "Act II: The Challenge",
          en: "From dawn until dusk, he meticulously laid brick after brick, ignoring the playful mockery of his siblings, until a fortified fortress stood complete with a smoking brick chimney.",
          es: "Desde el amanecer hasta el anochecer, colocó meticulosamente ladrillo tras ladrillo, ignorando las burlas de sus hermanos, hasta erigir una fortaleza fortificada con chimenea humeante."
        },
        {
          act: "Act III: The Resolution",
          en: "One chilly autumn twilight, a ravenous grey wolf crept from the forest shadows, knocked menacingly at the straw hut, and roared: 'Little pig, let me in!'",
          es: "En un gélido crepúsculo otoñal, un lobo gris voraz surgió de las sombras del bosque, golpeó amenazante la choza de paja y rugió: '¡Cerdito, déjame entrar!'"
        },
        {
          act: "Act III: The Resolution",
          en: "When the terrified pig refused, the fierce beast took a deep breath, puffed out his chest, and blew the flimsy straw structure into the air with one tremendous blast.",
          es: "Cuando el cerdito aterrorizado se negó, la feroz bestia respiró hondo, hinchó el pecho y sopló la endeble estructura de paja por los aires de un solo bramido."
        },
        {
          act: "Act III: The Resolution",
          en: "The first pig bolted frantically toward his brother's stick cabin, where they slammed the wooden door, but the wolf took two monstrous breaths and shattered the timber into splinters.",
          es: "El primer cerdito corrió despavorido hacia la cabaña de ramas de su hermano, donde atrancaron la puerta, pero el lobo sopló dos veces y redujo la madera a astillas."
        },
        {
          act: "Act III: The Resolution",
          en: "Gasping for air, both brothers raced into the brick house; the wise third pig locked the heavy iron bolt and calmly placed a boiling cauldron over the blazing hearth.",
          es: "Jadeando por aire, ambos hermanos corrieron a la casa de ladrillo; el sabio tercer cerdito cerró el pesado cerrojo de hierro y colocó con calma un caldero hirviente sobre el fogón."
        },
        {
          act: "Act III: The Resolution",
          en: "The wolf puffed and blew until he was utterly exhausted, but the brick walls remained immovable; in furious desperation, he scrambled up the roof to slide down the chimney.",
          es: "El lobo sopló y resopló hasta quedar exhausto, pero los muros de ladrillo permanecieron inamovibles; en furiosa desesperación, trepó al tejado para deslizarse por la chimenea."
        },
        {
          act: "Act III: The Resolution",
          en: "With a piercing howl, the ferocious intruder splashed straight into the bubbling kettle of boiling soup, leaping out of the hearth and fleeing into the dark wilderness never to return.",
          es: "Con un aullido desgarrador, el feroz intruso cayó directamente en la olla burbujeante de sopa hirviendo, saltó fuera de la chimenea y huyó hacia la selva oscura para no regresar jamás."
        }
      ],
      vocab: [
        { term: "Verdant valley", ipa: "/ˈvɜːr.dənt ˈvæl.i/", es: "Valle verdeante y frondoso" },
        { term: "Perils", ipa: "/ˈper.əlz/", es: "Peligros / Amenazas" },
        { term: "Jovial", ipa: "/ˈdʒoʊ.vi.əl/", es: "Jovial / Alegre y despreocupado" },
        { term: "Straw", ipa: "/strɔː/", es: "Paja seca para techos" },
        { term: "Assemble", ipa: "/əˈsem.bəl/", es: "Armar / Ensamblar" },
        { term: "Sturdy sticks", ipa: "/ˈstɜː.di stɪks/", es: "Ramas firmes y robustas" },
        { term: "Timber cabin", ipa: "/ˈtɪm.bɚ ˈkæb.ɪn/", es: "Cabaña de vigas de madera" },
        { term: "Diligence", ipa: "/ˈdɪl.ə.dʒəns/", es: "Diligencia / Constancia y esmero" },
        { term: "Mortar", ipa: "/ˈmɔːr.t̬ɚ/", es: "Mortero / Mezcla de cemento" },
        { term: "Fortress", ipa: "/ˈfɔːr.trəs/", es: "Fortaleza impenetrable" },
        { term: "Ravenous wolf", ipa: "/ˈræv.ən.əs wʊlf/", es: "Lobo voraz y hambriento" },
        { term: "Flimsy", ipa: "/ˈflɪm.zi/", es: "Endeble / Poco resistente" },
        { term: "Splinters", ipa: "/ˈsplɪn.tɚz/", es: "Astillas de madera rota" },
        { term: "Cauldron", ipa: "/ˈkɑːl.drən/", es: "Caldero / Olla grande de hierro" },
        { term: "Immovable", ipa: "/ɪˈmuː.və.bəl/", es: "Inamovible / Firme y sólido" }
      ]
    },
    {
      id: "little-red-riding-hood",
      title: "Little Red Riding Hood",
      titleEs: "Caperucita Roja",
      level: "Nivel A2",
      category: "Cuento Popular",
      coverImage: "images/story_red_riding_hood.jpg",
      moralEn: "Stay vigilant on life's path, cherish wise guidance, and never trust flattering deceivers.",
      moralEs: "Mantente alerta en tu camino, valora los sabios consejos y nunca confíes en aduladores engañosos.",
      acts: ["Act I: The Beginning", "Act II: The Challenge", "Act III: The Resolution"],
      paragraphs: [
        {
          act: "Act I: The Beginning",
          en: "At the sunny fringe of an ancient whispering forest lived a cheerful young girl celebrated throughout the countryside for her vibrant scarlet velvet cloak.",
          es: "En el lindero soleado de un antiguo y susurrante bosque vivía una alegre niña célebre en la campiña por su vibrante capa de terciopelo escarlata."
        },
        {
          act: "Act I: The Beginning",
          en: "Because she wore her cherished hood everywhere she traveled, villagers and wanderers affectionately called her Little Red Riding Hood.",
          es: "Como llevaba su preciada caperuza a dondequiera que iba, tanto aldeanos como caminantes la llamaban cariñosamente Caperucita Roja."
        },
        {
          act: "Act I: The Beginning",
          en: "One crisp spring morning, her mother baked a batch of warm honey cakes and prepared a vial of soothing blackberry syrup in a woven wicker basket.",
          es: "Una fresca mañana primaveral, su madre horneó un lote de pasteles de miel y preparó un frasco de jarabe de moras en una canasta de mimbre tejida."
        },
        {
          act: "Act I: The Beginning",
          en: "'Your dear grandmother is feeling weak and bedridden across the woods,' her mother instructed gently. 'Walk directly along the cobblestone path and never stray into the wilderness.'",
          es: "'Tu querida abuela se siente débil y postrada en cama al otro lado del bosque,' le instruyó su madre con dulzura. 'Camina directamente por el sendero empedrado y nunca te desvíes.'"
        },
        {
          act: "Act II: The Challenge",
          en: "Little Red Riding Hood promised complete obedience, but as she stepped beneath the dappled green canopy, fragrant bluebells and dancing butterflies captivated her eyes.",
          es: "Caperucita Roja prometió obediencia total, pero al internarse bajo el dosel verde moteado por el sol, fragantes campanillas y mariposas cautivaron su mirada."
        },
        {
          act: "Act II: The Challenge",
          en: "Suddenly, a charming yet deceitful wolf emerged silently from behind a mossy oak, masking his predatory appetite behind courteous greetings.",
          es: "De repente, un lobo encantador pero taimado emergió sigiloso de detrás de un roble musgoso, ocultando su apetito voraz tras saludos corteses."
        },
        {
          act: "Act II: The Challenge",
          en: "'Where are you strolling so delightfully on this lovely morning, sweet child?' inquired the cunning predator with a flattering grin.",
          es: "'¿Hacia dónde paseas tan alegremente en esta bella mañana, dulce niña?' inquirió el astuto depredador con una sonrisa halagadora."
        },
        {
          act: "Act II: The Challenge",
          en: "Naively trusting his gentle demeanor, the innocent girl revealed her grandmother's secluded cottage nestled beneath three towering hazelnut trees.",
          es: "Confiando ingenuamente en su porte amable, la niña inocente reveló la ubicación de la cabaña aislada de su abuela, cobijada bajo tres imponentes avellanos."
        },
        {
          act: "Act II: The Challenge",
          en: "The sly beast suggested gathering a fresh bouquet of forest blossoms for the elder, slyly granting himself the opportunity to race ahead unnoticed.",
          es: "La taimada bestia le sugirió cortar un ramo de flores silvestres para la anciana, ganando así la oportunidad de adelantarse a toda prisa sin ser visto."
        },
        {
          act: "Act III: The Resolution",
          en: "Arriving at the cottage threshold, the villain knocked softly, trapped the frightened grandmother in the wardrobe, and donned her nightcap and spectacles in bed.",
          es: "Al llegar al umbral de la cabaña, el villano tocó con suavidad, encerró a la asustada abuela en el armario y se puso su gorro de dormir y anteojos en la cama."
        },
        {
          act: "Act III: The Resolution",
          en: "When Little Red Riding Hood stepped inside the shadowy bedroom, an unsettling chill shivered down her spine as she approached the bed.",
          es: "Cuando Caperucita Roja entró en el umbrío dormitorio, un escalofrío inquietante recorrió su espalda mientras se aproximaba a la cama."
        },
        {
          act: "Act III: The Resolution",
          en: "'Oh grandmother, what immense ears you possess! What dazzling eyes you have! What sharp, gleaming teeth are hiding in your smile!' she gasped in dread.",
          es: "'¡Oh abuela, qué orejas tan inmensas tienes! ¡Qué ojos tan brillantes posees! ¡Qué dientes tan afilados y relucientes se esconden en tu sonrisa!' exclamó con espanto."
        },
        {
          act: "Act III: The Resolution",
          en: "'All the better to devour you, my dear!' howled the wolf, lunging forward with bared claws as the girl shrieked desperately for help.",
          es: "'¡Son para devorarte mejor, querida mía!' aulló el lobo, abalanzándose con garras afiladas mientras la niña gritaba desesperadamente por auxilio."
        },
        {
          act: "Act III: The Resolution",
          en: "A vigilant woodsman patrolling the clearing burst through the door with his trusty axe, subduing the beast and liberating the family safe and sound.",
          es: "Un vigilante leñador que patrullaba el claro irrumpió por la puerta con su fiel hacha, sometiendo a la bestia y liberando a la familia sana y salva."
        }
      ],
      vocab: [
        { term: "Scarlet cloak", ipa: "/ˈskɑːr.lət kloʊk/", es: "Capa escarlata de terciopelo" },
        { term: "Wicker basket", ipa: "/ˈwɪk.ɚ ˈbæs.kɪt/", es: "Canasta de mimbre tejida" },
        { term: "Cobblestone path", ipa: "/ˈkɑː.bəl.stoʊn pæθ/", es: "Sendero empedrado de pueblo" },
        { term: "Stray", ipa: "/streɪ/", es: "Desviarse del camino recto" },
        { term: "Dappled canopy", ipa: "/ˈdæp.əld ˈkæn.ə.pi/", es: "Dosel forestal moteado de sol" },
        { term: "Deceitful", ipa: "/dɪˈsiːt.fəl/", es: "Engañoso / Taimado" },
        { term: "Courteous demeanor", ipa: "/ˈkɜːr.t̬i.əs dɪˈmiː.nɚ/", es: "Comportamiento cortés y afable" },
        { term: "Secluded cottage", ipa: "/səˈkluː.dɪd ˈkɑː.t̬ɪdʒ/", es: "Cabaña solitaria y apartada" },
        { term: "Blossoms", ipa: "/ˈblɑː.səmz/", es: "Flores tiernas / Capullos" },
        { term: "Spectacles", ipa: "/ˈspek.tə.kəlz/", es: "Anteojos / Gafas de lectura" },
        { term: "Unsettling chill", ipa: "/ʌnˈset.lɪŋ tʃɪl/", es: "Escalofrío inquietante" },
        { term: "Devour", ipa: "/dɪˈvaʊ.ɚ/", es: "Devorar vorazmente" },
        { term: "Lunging", ipa: "/ˈlʌn.dʒɪŋ/", es: "Arremetiendo / Lanzándose" },
        { term: "Vigilant woodsman", ipa: "/ˈvɪdʒ.əl.ənt ˈwʊdz.mən/", es: "Leñador vigilante y atento" },
        { term: "Safe and sound", ipa: "/seɪf ænd saʊnd/", es: "Sano y salvo / Ileso" }
      ]
    },
    {
      id: "goldilocks-three-bears",
      title: "Goldilocks and the Three Bears",
      titleEs: "Ricitos de Oro y los tres osos",
      level: "Nivel B1",
      category: "Cuento Clásico",
      coverImage: "images/story_goldilocks.jpg",
      moralEn: "Respect boundaries and the privacy of others; true harmony requires self-restraint.",
      moralEs: "Respeta los límites y la privacidad ajena; la verdadera armonía exige moderación y respeto.",
      acts: ["Act I: The Beginning", "Act II: The Challenge", "Act III: The Resolution"],
      paragraphs: [
        {
          act: "Act I: The Beginning",
          en: "Once upon a time, nestled deep in the emerald heart of an alpine forest, stood a tidy wooden cottage belonging to a harmonious bear family.",
          es: "Érase una vez, en lo profundo del corazón esmeralda de un bosque alpino, se erigía una pulcra cabaña de madera perteneciente a una armoniosa familia de osos."
        },
        {
          act: "Act I: The Beginning",
          en: "There was a colossal Papa Bear with a deep thunderous voice, an elegant Mama Bear with gentle eyes, and a cheerful Baby Bear with a squeaky laugh.",
          es: "Había un colosal Papá Oso de voz profunda y cavernosa, una elegante Mamá Osa de mirada apacible, y un alegre Bebé Oso de risa chillona."
        },
        {
          act: "Act I: The Beginning",
          en: "Every morning, Mama Bear brewed a hearty pot of sweet oatmeal porridge, ladling it into three handcrafted ceramic bowls of differing sizes.",
          es: "Cada mañana, Mamá Osa cocinaba una sustanciosa olla de avena dulce, sirviéndola en tres tazones de cerámica artesanal de distintos tamaños."
        },
        {
          act: "Act I: The Beginning",
          en: "Because the steaming porridge was scalding hot, the polite family decided to enjoy a refreshing morning promenade beneath the pines while breakfast cooled.",
          es: "Como la avena humeante estaba abrasadoramente caliente, la educada familia decidió dar un refrescante paseo matutino bajo los pinos mientras se enfriaba."
        },
        {
          act: "Act II: The Challenge",
          en: "While the forest cottage stood vacant, an inquisitive golden-curled girl named Goldilocks wandered off the main trail and stumbled upon the veranda.",
          es: "Mientras la cabaña del bosque estaba desocupada, una niña curiosa de rizos dorados llamada Ricitos de Oro se desvió del sendero y llegó a la galería."
        },
        {
          act: "Act II: The Challenge",
          en: "Finding the latch unlocked, the curious intruder peeked inside the sunlit kitchen, immediately guided by the irresistible aroma of cinnamon and oats.",
          es: "Al hallar el cerrojo abierto, la intrusa curiosa se asomó a la cocina soleada, guiada al instante por el irresistible aroma a canela y avena."
        },
        {
          act: "Act II: The Challenge",
          en: "She tasted from the immense bowl of Papa Bear, but spat it out: 'Too scorching hot!' Then she sampled Mama Bear's medium bowl: 'Far too icy cold!'",
          es: "Probó del inmenso tazón de Papá Oso, pero lo escupió: '¡Demasiado caliente!' Luego probó del tazón mediano de Mamá Osa: '¡Demasiado helado!'"
        },
        {
          act: "Act II: The Challenge",
          en: "Finally, she spooned the delicate mini bowl of Baby Bear: 'Delicious! Neither too hot nor too cold; it is just right!' and ravenously devoured every crumb.",
          es: "Finalmente, probó una cucharada del tazón de Bebé Oso: '¡Delicioso! Ni muy caliente ni muy frío; ¡está en su punto!' y lo devoró hasta la última gota."
        },
        {
          act: "Act II: The Challenge",
          en: "Seeking rest in the parlor, she tested three chairs: the giant chair was too hard, the medium chair too soft, but the miniature chair was perfection—until it splintered beneath her weight.",
          es: "Buscando reposo en la sala, probó tres sillas: la gigante era muy dura, la mediana muy blanda, pero la pequeña era perfecta, hasta que se partió bajo su peso."
        },
        {
          act: "Act III: The Resolution",
          en: "Fatigued from her misadventures, Goldilocks wandered upstairs to the bedchamber, seeking comfort on three neatly made goose-down mattresses.",
          es: "Fatigada por sus travesuras, Ricitos de Oro subió al dormitorio en busca de reposo sobre tres colchones de plumas primorosamente tendidos."
        },
        {
          act: "Act III: The Resolution",
          en: "The great bed was far too rigid, the middle bed felt suffocatingly plush, but Baby Bear's little bed was just right, and she drifted into peaceful slumber.",
          es: "La cama grande era demasiado rígida, la mediana sofocantemente blanda, pero la camita de Bebé Oso era ideal, y cayó en un sueño profundo."
        },
        {
          act: "Act III: The Resolution",
          en: "Moments later, the bear family stepped across the threshold, and Papa Bear rumbled indignantly: 'Someone has been tasting my warm porridge!'",
          es: "Momentos después, los osos cruzaron el umbral, y Papá Oso bramó con indignación: '¡Alguien ha estado probando mi avena!'"
        },
        {
          act: "Act III: The Resolution",
          en: "Baby Bear gasped tearfully beside the table: 'Someone tasted my porridge and swallowed it all up, and then shattered my favorite armchair!'",
          es: "Bebé Oso sollozó desconsolado junto a la mesa: '¡Alguien probó mi avena y se la comió toda, y luego rompió en pedazos mi sillón favorito!'"
        },
        {
          act: "Act III: The Resolution",
          en: "Ascending to the attic, Baby Bear discovered the intruder asleep: 'Here she is!' Goldilocks bolted upright, shrieked in shock, vaulted through the open casement window, and sprinted away with deep humility.",
          es: "Al subir al ático, Bebé Oso descubrió a la intrusa dormida: '¡Aquí está!' Ricitos de Oro despertó sobresaltada, gritó espantada, saltó por la ventana abierta y huyó con profunda humildad."
        }
      ],
      vocab: [
        { term: "Emerald forest", ipa: "/ˈem.ɚ.əld ˈfɔːr.ɪst/", es: "Bosque alpino color esmeralda" },
        { term: "Colossal", ipa: "/kəˈlɑː.səl/", es: "Colosal / Gigantesco" },
        { term: "Oatmeal porridge", ipa: "/ˈoʊt.miːl ˈpɔːr.ɪdʒ/", es: "Avena cocida en leche / Gachas" },
        { term: "Scalding hot", ipa: "/ˈskɑːl.dɪŋ hɑːt/", es: "Hirviente / Quemante" },
        { term: "Promenade", ipa: "/ˌprɑː.məˈneɪd/", es: "Paseo tranquilo al aire libre" },
        { term: "Inquisitive", ipa: "/ɪnˈkwɪz.ə.t̬ɪv/", es: "Curiosa / Indagadora" },
        { term: "Veranda", ipa: "/vəˈræn.də/", es: "Galería exterior techada" },
        { term: "Scorching", ipa: "/ˈskɔːr.tʃɪŋ/", es: "Abrasador / Que abrasa" },
        { term: "Just right", ipa: "/dʒʌst raɪt/", es: "En su punto exacto" },
        { term: "Splintered", ipa: "/ˈsplɪn.tɚd/", es: "Se astilló / Se hizo añicos" },
        { term: "Bedchamber", ipa: "/ˈbed.tʃeɪm.bɚ/", es: "Dormitorio / Alcoba" },
        { term: "Slumber", ipa: "/ˈslʌm.bɚ/", es: "Sueño plácido y reparador" },
        { term: "Indignantly", ipa: "/ɪnˈdɪɡ.nənt.li/", es: "Con indignación y reproche" },
        { term: "Casement window", ipa: "/ˈkeɪs.mənt ˈwɪn.doʊ/", es: "Ventana con bisagras abatibles" },
        { term: "Humility", ipa: "/hjuːˈmɪl.ə.t̬i/", es: "Humildad / Modestia" }
      ]
    },
    {
      id: "tortoise-and-hare",
      title: "The Tortoise and the Hare",
      titleEs: "La tortuga y la liebre",
      level: "Nivel A2",
      category: "Fábula de Esopo",
      coverImage: "images/story_tortoise_hare.jpg",
      moralEn: "Slow, steady, and disciplined perseverance always triumphs over arrogant complacency.",
      moralEs: "La perseverancia disciplinada, firme y constante siempre triunfa sobre la complacencia arrogante.",
      acts: ["Act I: The Beginning", "Act II: The Challenge", "Act III: The Resolution"],
      paragraphs: [
        {
          act: "Act I: The Beginning",
          en: "In a sun-drenched countryside clearing, an excessively boastful hare loved entertaining woodland creatures by flaunting her lightning-quick speed.",
          es: "En un claro soleado de la campiña, una liebre sumamente presumida deleitaba a los animales del bosque alardeando de su velocidad fulgurante."
        },
        {
          act: "Act I: The Beginning",
          en: "She pranced around boasting: 'No living beast in this forest can match my stride; I challenge anyone here to outpace me in a contest!'",
          es: "Brincaba jactándose: 'Ningún ser viviente en este bosque puede igualar mi zancada; ¡desafío a cualquiera aquí a superarme en una carrera!'"
        },
        {
          act: "Act I: The Beginning",
          en: "The other animals remained silent, knowing her agility was unmatched, until a calm, measured voice answered from the clover meadow: 'I accept your wager.'",
          es: "Los demás animales guardaron silencio, sabiendo que su agilidad era inigualable, hasta que una voz calmada y medida respondió: 'Acepto tu apuesta.'"
        },
        {
          act: "Act I: The Beginning",
          en: "To everyone's disbelief, it was Master Tortoise, plodding along with his heavy shell and unshakeable serenity, which prompted the hare to burst into mocking laughter.",
          es: "Para asombro de todos, era el maestro Tortuga, avanzando con su pesado caparazón y serenidad inquebrantable, lo que desató las carcajadas de la liebre."
        },
        {
          act: "Act II: The Challenge",
          en: "A prominent banner was hung across the country lane, and the wise old Owl was appointed impartial referee to outline the official four-league course.",
          es: "Se colgó un estandarte en el camino rural, y el sabio y anciano Búho fue designado árbitro imparcial para marcar la ruta oficial de cuatro leguas."
        },
        {
          act: "Act II: The Challenge",
          en: "At the gunshot signal, the hare burst into a whirlwind of dust, vanishing over the hillside in mere seconds while the tortoise took his first patient strides.",
          es: "A la señal de partida, la liebre salió como un torbellino de polvo, desapareciendo sobre la colina en segundos mientras la tortuga daba sus primeros pasos pausados."
        },
        {
          act: "Act II: The Challenge",
          en: "Reaching the halfway marker with a tremendous lead, the hare glanced back, chuckled at the tortoise's distant silhouette, and grew exceedingly complacent.",
          es: "Al alcanzar la mitad del trayecto con enorme ventaja, la liebre miró atrás, sonrió ante la silueta lejana de la tortuga y se confió ciegamente."
        },
        {
          act: "Act II: The Challenge",
          en: "'This contest is a comical parade,' she murmured arrogantly. 'I have abundant time to relish a pleasant siesta beneath this breezy oak canopy before crossing the ribbon.'",
          es: "'Esta competencia es una farsa cómica,' murmuró con arrogancia. 'Tengo tiempo de sobra para disfrutar una siesta bajo este roble ventilado antes de cruzar la meta.'"
        },
        {
          act: "Act II: The Challenge",
          en: "Curled on the cool grass under the whispering leaves, the overconfident hare closed her eyelids and drifted into a profound midday slumber.",
          es: "Acurrucada sobre el césped fresco bajo las hojas susurrantes, la liebre engreída cerró los ojos y se sumió en un profundo sopor del mediodía."
        },
        {
          act: "Act III: The Resolution",
          en: "Meanwhile, the humble tortoise kept pacing forward, step by steady step, never wavering, never stopping for water, and never allowing exhaustion to triumph.",
          es: "Entretanto, la humilde tortuga continuó avanzando, paso a paso con constancia, sin vacilar jamás, sin detenerse y sin permitir que el cansancio triunfara."
        },
        {
          act: "Act III: The Resolution",
          en: "The blazing midday sun shifted westward as woodland creatures quietly lined the trail to witness the slow traveler steadily overtaking the sleeping racer.",
          es: "El ardiente sol del mediodía comenzó a declinar mientras las criaturas del bosque se alineaban en silencio para atestiguar cómo la tortuga rebasaba a la durmiente."
        },
        {
          act: "Act III: The Resolution",
          en: "By the time the hare awoke with a startled gasp, the golden rays of twilight were painting the finish line with shades of violet and amber.",
          es: "Para cuando la liebre despertó con un sobresalto, los rayos dorados del ocaso teñían la línea de meta con matices violáceos y ámbar."
        },
        {
          act: "Act III: The Resolution",
          en: "She bounded forward in panic, her legs moving like frantic gears, but it was too late: Master Tortoise placed his front claw across the chalk line amidst roaring cheers.",
          es: "Saltó adelante presa del pánico, moviendo sus patas como engranajes frenéticos, pero era tarde: el maestro Tortuga cruzó la línea blanca entre vítores estruendosos."
        },
        {
          act: "Act III: The Resolution",
          en: "Hanging her head in genuine shame, the defeated sprinter learned a lifelong lesson in humility: constant dedication and steady discipline will always prevail over unguided talent.",
          es: "Bajando la cabeza con sincera vergüenza, la derrotada velocista aprendió una lección de vida: la constancia y la disciplina siempre superarán al talento indisciplinado."
        }
      ],
      vocab: [
        { term: "Boastful", ipa: "/ˈboʊst.fəl/", es: "Jactancioso / Fanfarrón" },
        { term: "Flaunting", ipa: "/ˈflɑːn.tɪŋ/", es: "Haciendo ostentación / Alardeando" },
        { term: "Agility", ipa: "/əˈdʒɪl.ə.t̬i/", es: "Agilidad y ligereza de movimiento" },
        { term: "Wager", ipa: "/ˈweɪ.dʒɚ/", es: "Desafío con apuesta formal" },
        { term: "Plodding", ipa: "/ˈplɑː.dɪŋ/", es: "Caminando con paso pesado pero constante" },
        { term: "Impartial referee", ipa: "/ɪmˈpɑːr.ʃəl ˌref.əˈriː/", es: "Árbitro imparcial y justo" },
        { term: "Whirlwind of dust", ipa: "/ˈwɜːrl.wɪnd əv dʌst/", es: "Torbellino espeso de polvo" },
        { term: "Complacent", ipa: "/kəmˈpleɪ.sənt/", es: "Complaciente / Confiado en exceso" },
        { term: "Midday slumber", ipa: "/ˌmɪdˈdeɪ ˈslʌm.bɚ/", es: "Sueño profundo del mediodía" },
        { term: "Never wavering", ipa: "/ˈnev.ɚ ˈweɪ.vɚ.ɪŋ/", es: "Sin dudar ni tambalear jamás" },
        { term: "Twilight rays", ipa: "/ˈtwaɪ.laɪt reɪz/", es: "Rayos crepusculares del atardecer" },
        { term: "Frantic gears", ipa: "/ˈfræn.tɪk ɡɪrz/", es: "Movimientos desesperados y rápidos" },
        { term: "Roaring cheers", ipa: "/ˈrɔːr.ɪŋ tʃɪrz/", es: "Vítores y aclamaciones entusiastas" },
        { term: "Humility", ipa: "/hjuːˈmɪl.ə.t̬i/", es: "Humildad sincera ante la derrota" },
        { term: "Prevail", ipa: "/prɪˈveɪl/", es: "Prevalecer / Imponerse con el tiempo" }
      ]
    },
    {
      id: "boy-who-cried-wolf",
      title: "The Boy Who Cried Wolf",
      titleEs: "El pastorcito mentiroso",
      level: "Nivel B1",
      category: "Fábula Moral",
      coverImage: "images/story_boy_cried_wolf.svg",
      moralEn: "A reputation for honesty is priceless; when a liar speaks the truth, no one will believe him.",
      moralEs: "La reputación de honestidad no tiene precio; cuando un mentiroso dice la verdad, nadie le cree.",
      acts: ["Act I: The Beginning", "Act II: The Challenge", "Act III: The Resolution"],
      paragraphs: [
        {
          act: "Act I: The Beginning",
          en: "On the sun-bleached slopes overlooking a prosperous agrarian village, a restless adolescent shepherd was hired to guard the community's sheep flock.",
          es: "En las laderas soleadas con vista a una próspera aldea agrícola, un inquieto joven pastor fue contratado para cuidar el rebaño comunal de ovejas."
        },
        {
          act: "Act I: The Beginning",
          en: "Day after day, his sole duty was to watch the gentle herd graze on wild clover, ensuring that no wild beasts prowled near the stone pastures.",
          es: "Día tras día, su única tarea era vigilar al dócil ganado pastar en el trébol silvestre, cuidando que ninguna fiera merodeara las cercas de piedra."
        },
        {
          act: "Act I: The Beginning",
          en: "Although his responsibilities were straightforward and honorable, the youth found the absolute quiet of the highland hills profoundly monotonous.",
          es: "Aunque sus deberes eran sencillos y honorables, el muchacho encontraba el silencio absoluto de las colinas sumamente monótono."
        },
        {
          act: "Act I: The Beginning",
          en: "Longing for thrilling excitement and mischievous amusement, he devised an irresponsible scheme to disrupt the tranquil afternoon of the town below.",
          es: "Anhelando emociones fuertes y diversión maliciosa, ideó un plan irresponsable para perturbar la tarde tranquila del pueblo en el valle."
        },
        {
          act: "Act II: The Challenge",
          en: "Climbing atop a high limestone boulder, he cupped his hands around his mouth and shrieked with theatrical terror: 'Wolf! Wolf! A monstrous beast is attacking the flock!'",
          es: "Subiéndose a un peñasco de piedra caliza, puso las manos en su boca y chilló con fingido terror: '¡El lobo! ¡El lobo! ¡Una fiera monstruosa ataca al rebaño!'"
        },
        {
          act: "Act II: The Challenge",
          en: "Down in the valley, blacksmiths, bakers, and farmers dropped their heavy tools, seized pitchforks and wooden clubs, and sprinted breathlessly up the steep mountain slope.",
          es: "En el valle, herreros, panaderos y labriegos soltaron sus herramientas, tomaron horcas y garrotes, y treparon jadeando la empinada ladera."
        },
        {
          act: "Act II: The Challenge",
          en: "Upon arriving exhausted at the plateau, they found no menacing wolf, but rather the shepherd boy doubling over in convulsive laughter at their panic.",
          es: "Al llegar exhaustos a la meseta, no hallaron lobo alguno, sino al pastorcillo desternillándose de la risa ante su pánico."
        },
        {
          act: "Act II: The Challenge",
          en: "'Do not sound false emergencies, young man!' scolded the village elder sternly. 'A warning call is a sacred trust between neighbors.'",
          es: "'¡No des falsas alarmas, jovencito!' le reprendió con severidad el anciano del pueblo. 'Un llamado de auxilio es un pacto sagrado entre vecinos.'"
        },
        {
          act: "Act II: The Challenge",
          en: "Yet a few days later, bored once again by the mountain silence, the foolish boy yelled his deceitful battle cry a second time, sending the village scrambling once more.",
          es: "Sin embargo, pocos días después, aburrido de nuevo por la soledad de la montaña, el insensato muchacho repitió su grito engañoso haciendo correr al pueblo."
        },
        {
          act: "Act III: The Resolution",
          en: "Furious and insulted by the repeated deception, the citizens warned him that lying destroys credibility and that his voice would soon carry no weight.",
          es: "Furiosos e indignados por el engaño repetido, los pobladores le advirtieron que la mentira destruye la credibilidad y que pronto nadie le creería."
        },
        {
          act: "Act III: The Resolution",
          en: "That very dusk, as shadows lengthened across the canyon, a colossal ravenous wolf genuinely prowled from the craggy pines, red eyes glaring with malice.",
          es: "Ese mismo crepúsculo, cuando las sombras se alargaban en el cañón, un lobo inmenso y famélico emergió de verdad de los pinares con ojos inyectados de malicia."
        },
        {
          act: "Act III: The Resolution",
          en: "The ferocious predator lunged into the herd with gnashing fangs, scattering sheep in terror as the horrified shepherd screamed with all his might: 'Wolf! Help me, please, it is real!'",
          es: "El depredador arremetió contra el rebaño rechinando los colmillos y dispersando a las ovejas, mientras el pastor gritaba aterrado: '¡El lobo! ¡Auxilio, es verdad!'"
        },
        {
          act: "Act III: The Resolution",
          en: "Down in the village square, workers shook their heads and smirked: 'The mischievous trickster thinks he can fool us three times; we shall not waste our breath.'",
          es: "En la plaza del pueblo, los vecinos negaron con la cabeza y sonrieron con desdén: 'El bromista cree que puede engañarnos tres veces; no gastaremos el aliento.'"
        },
        {
          act: "Act III: The Resolution",
          en: "With nobody answering his desperate pleas, the boy watched helplessly as the predator decimated the flock, learning the bitter truth that nobody believes a liar even when he speaks with sincerity.",
          es: "Sin nadie que respondiera a sus súplicas desesperadas, el muchacho contempló impotente cómo el depredador diezmaba el rebaño, aprendiendo la amarga verdad."
        }
      ],
      vocab: [
        { term: "Agrarian village", ipa: "/əˈɡrer.i.ən ˈvɪl.ɪdʒ/", es: "Aldea dedicada a la agricultura" },
        { term: "Restless shepherd", ipa: "/ˈrest.ləs ˈʃep.ɚd/", es: "Pastor inquieto y descontento" },
        { term: "Monotonous", ipa: "/məˈnɑː.t̬ən.əs/", es: "Monótono / Rutinario y aburrido" },
        { term: "Mischievous scheme", ipa: "/ˈmɪs.tʃə.vəs skiːm/", es: "Plan travieso y malintencionado" },
        { term: "Theatrical terror", ipa: "/θiˈæt.rɪ.kəl ˈter.ɚ/", es: "Miedo fingido / Alarido actuado" },
        { term: "Pitchforks", ipa: "/ˈpɪtʃ.fɔːrks/", es: "Horcas agrícolas de labranza" },
        { term: "Convulsive laughter", ipa: "/kənˈvʌl.sɪv ˈlæf.tɚ/", es: "Carcajada incontrolable" },
        { term: "Sacred trust", ipa: "/ˈseɪ.krɪd trʌst/", es: "Confianza sagrada entre personas" },
        { term: "Deception", ipa: "/dɪˈsep.ʃən/", es: "Engaño premeditado" },
        { term: "Credibility", ipa: "/ˌkred.əˈbɪl.ə.t̬i/", es: "Credibilidad / Confianza pública" },
        { term: "Craggy pines", ipa: "/ˈkræɡ.i paɪnz/", es: "Pinos crecidos entre peñascos" },
        { term: "Gnashing fangs", ipa: "/ˈnæʃ.ɪŋ fæŋz/", es: "Colmillos rechinantes y voraces" },
        { term: "Desperate pleas", ipa: "/ˈdes.pɚ.ət pliːz/", es: "Ruegos y súplicas desesperadas" },
        { term: "Decimated", ipa: "/ˈdes.ə.meɪ.t̬ɪd/", es: "Diezmó / Destruyó gran parte" },
        { term: "Bitter truth", ipa: "/ˈbɪt̬.ɚ truːθ/", es: "Amarga y dolorosa verdad" }
      ]
    },
    {
      id: "the-ugly-duckling",
      title: "The Ugly Duckling",
      titleEs: "El patito feo",
      level: "Nivel B1",
      category: "Cuento de Andersen",
      coverImage: "images/story_ugly_duckling.jpg",
      moralEn: "True nobility and beauty bloom in their own season; never let cruel judgment define your worth.",
      moralEs: "La verdadera nobleza y belleza florecen a su debido tiempo; nunca dejes que el juicio cruel defina tu valor.",
      acts: ["Act I: The Beginning", "Act II: The Challenge", "Act III: The Resolution"],
      paragraphs: [
        {
          act: "Act I: The Beginning",
          en: "On a glorious golden summer morning near a scenic rural canal, a proud mother duck sat patiently over her nest surrounded by fragrant yellow irises.",
          es: "En una gloriosa mañana dorada de verano junto a un pintoresco canal campestre, una orgullosa mamá pata empollaba su nido rodeada de lirios amarillos."
        },
        {
          act: "Act I: The Beginning",
          en: "One by one, the fragile shells cracked open, and delightful fluffy yellow ducklings tumbled into the sunshine with sweet melodious chirps.",
          es: "Uno a uno, los frágiles cascarones se quebraron, y encantadores patitos amarillos y esponjosos salieron al sol con tiernos piadas melodiosas."
        },
        {
          act: "Act I: The Beginning",
          en: "However, the largest egg in the clutch stubbornly resisted, until finally breaking to reveal an awkward, clumsy fledgling draped in dull grey plumage.",
          es: "No obstante, el huevo más grande de la nidada se resistía tercamente, hasta abrirse por fin para revelar un pichón desgarbado y torpe envuelto en plumaje gris apagado."
        },
        {
          act: "Act I: The Beginning",
          en: "'What an unusually enormous and peculiar chick,' remarked the neighboring geese disdainfully. 'He looks utterly discordant compared to your graceful brood.'",
          es: "'Qué polluelo tan inusualmente enorme y peculiar,' remarcaron los gansos con desdén. 'Luce totalmente discordante junto a tu grácil camada.'"
        },
        {
          act: "Act II: The Challenge",
          en: "The following day at the farmyard pond, chickens, turkeys, and older ducks pecked cruel taunts at the grey bird, banishing him from family meals.",
          es: "Al día siguiente en el estanque del corral, gallinas, pavos y patos mayores lanzaron crueles picotazos al ave gris, expulsándolo de las comidas familiares."
        },
        {
          act: "Act II: The Challenge",
          en: "Unable to withstand the relentless ostracism and heartbreak, the lonely fledgling fled the barnyard gate and wandered into the solitary wilderness.",
          es: "Incapaz de soportar el rechazo implacable y el desconsuelo, el solitario pichón escapó por la reja del corral y se adentró en la inhóspita naturaleza."
        },
        {
          act: "Act II: The Challenge",
          en: "He navigated frosty marshes where wild hunters fired thunderous muskets, surviving on frozen roots and weeping beneath shivering cattails.",
          es: "Navegó por pantanos escarchados donde cazadores disparaban ruidosos mosquetes, sobreviviendo con raíces heladas y llorando bajo los juncos trémulos."
        },
        {
          act: "Act II: The Challenge",
          en: "When harsh winter enveloped the landscape in ice and blinding blizzards, a compassionate farmer rescued the freezing creature, nursing him beside the hearth.",
          es: "Cuando el crudo invierno cubrió el paisaje de hielo y ventiscas cegadoras, un compasivo granjero rescató a la criatura congelada, cuidándolo junto al fuego."
        },
        {
          act: "Act II: The Challenge",
          en: "Yet terrified of playful barking dogs, the skittish bird slipped away again into the freezing swamp, enduring the cold with quiet, unwavering fortitude.",
          es: "Pero atemorizado por los perros juguetones, el asustadizo pájaro escapó de nuevo al gélido pantano, soportando el frío con silenciosa e inquebrantable fortaleza."
        },
        {
          act: "Act III: The Resolution",
          en: "When mild vernal breezes melted the winter ice, tender shoots of willow burst forth and the warm spring sun rejuvenated the countryside.",
          es: "Cuando las suaves brisas vernales derritieron el hielo, brotaron tiernos retoños de sauce y el sol primaveral rejuveneció los campos."
        },
        {
          act: "Act III: The Resolution",
          en: "The lonely bird felt powerful new feathers rippling along his wings; with a sudden flap, he soared effortlessly above the sparkling reeds.",
          es: "El ave solitaria sintió plumas nuevas y poderosas ondular en sus alas; de un repentino aleteo, se elevó sin esfuerzo sobre los juncos relucientes."
        },
        {
          act: "Act III: The Resolution",
          en: "Gliding downward toward a tranquil crystal lagoon, he noticed three majestic snow-white swans swimming with sublime nobility and grace.",
          es: "Descendiendo en planeo hacia una tranquila laguna de cristal, divisó tres majestuosos cisnes blancos nadando con sublime nobleza y gracia."
        },
        {
          act: "Act III: The Resolution",
          en: "Fearing they would reject him as an unsightly monster, he bowed his neck humbly toward the mirrored water, bracing for their harsh judgement.",
          es: "Temiendo que lo repudiaran por considerarlo un monstruo informe, inclinó su cuello con humildad hacia el agua espejada, esperando su cruel condena."
        },
        {
          act: "Act III: The Resolution",
          en: "But looking into the crystal reflection, he was stunned: he was no longer an awkward grey duckling, but a breathtaking, radiant white swan, celebrated and welcomed by his true kin forevermore.",
          es: "Pero al mirarse en el reflejo de cristal, quedó maravillado: ya no era un patito torpe y gris, sino un cisne blanco deslumbrante y radiante, acogido con amor por los suyos para siempre."
        }
      ],
      vocab: [
        { term: "Scenic rural canal", ipa: "/ˈsiː.nɪk ˈrʊr.əl kəˈnæl/", es: "Canal campestre pintoresco" },
        { term: "Fragile shells", ipa: "/ˈfrædʒ.əl ʃelz/", es: "Cascarones frágiles y quebradizos" },
        { term: "Dull grey plumage", ipa: "/dʌl ɡreɪ ˈpluː.mɪdʒ/", es: "Plumaje grisáceo apagado" },
        { term: "Utterly discordant", ipa: "/ˈʌt̬.ɚ.li dɪsˈkɔːr.dənt/", es: "Completamente fuera de lugar" },
        { term: "Cruel taunts", ipa: "/ˈkruː.əl tɑːnts/", es: "Burlas despiadadas y crueles" },
        { term: "Relentless ostracism", ipa: "/rɪˈlent.ləs ˈɑː.strə.sɪz.əm/", es: "Exclusión y rechazo implacable" },
        { term: "Frosty marshes", ipa: "/ˈfrɑː.sti ˈmɑːr.ʃɪz/", es: "Pantanos cubiertos de escarcha" },
        { term: "Blinding blizzards", ipa: "/ˈblaɪn.dɪŋ ˈblɪz.ɚdz/", es: "Ventiscas blancas y cegadoras" },
        { term: "Unwavering fortitude", ipa: "/ʌnˈweɪ.vɚ.ɪŋ ˈfɔːr.t̬ə.tuːd/", es: "Fortaleza de ánimo inquebrantable" },
        { term: "Vernal breezes", ipa: "/ˈvɜːr.nəl ˈbriː.zɪz/", es: "Brisas primaverales y cálidas" },
        { term: "Rejuvenated", ipa: "/rɪˈdʒuː.və.neɪ.t̬ɪd/", es: "Cobró nueva vida / Rejuveneció" },
        { term: "Majestic swans", ipa: "/məˈdʒes.tɪk swɑːnz/", es: "Cisnes de majestuosa estampa" },
        { term: "Sublime nobility", ipa: "/səˈblaɪm noʊˈbɪl.ə.t̬i/", es: "Nobleza y porte sublime" },
        { term: "Mirrored water", ipa: "/ˈmɪr.ɚd ˈwɑː.t̬ɚ/", es: "Superficie de agua como espejo" },
        { term: "Breathtaking", ipa: "/ˈbreθˌteɪ.kɪŋ/", es: "Deslumbrante / Que quita el aliento" }
      ]
    }
  ];`;

// Replace STORIES_DATA in appJs
const startMarker = '  const STORIES_DATA = [';
const endMarker = '    const WORLD_TOUR_SCENARIOS = {';

const startIndex = appJs.indexOf(startMarker);
const endIndex = appJs.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find STORIES_DATA markers!', { startIndex, endIndex });
  process.exit(1);
}

appJs = appJs.slice(0, startIndex) + updatedStoriesData + '\n\n    ' + appJs.slice(endIndex);

console.log('STORIES_DATA successfully replaced in memory.');

// Now replace renderStorySelector and loadStoryViewer and related continuous narration logic
const startViewerMarker = '    // MÓDULO CUENTOS CLÁSICOS ILUSTRADOS (CON PROPIEDADES CORREGIDAS)';
const endViewerMarker = '    function startVoicePracticeParagraph(pIdx, targetText) {';

const startVIdx = appJs.indexOf(startViewerMarker);
const endVIdx = appJs.indexOf(endViewerMarker);

if (startVIdx === -1 || endVIdx === -1) {
  console.error('Could not find Viewer functions markers!', { startVIdx, endVIdx });
  process.exit(1);
}

const updatedViewerFunctions = `    // MÓDULO CUENTOS CLÁSICOS ILUSTRADOS (CON PROPIEDADES CORREGIDAS)
    // ========================================================
    let currentStoryIndex = 0;
    let isBilingualStoryModeActive = true;
    let activeStoryRecognition = null;
    let currentStoryFontSize = parseInt(localStorage.getItem('story_font_size') || '16', 10);

    let storyContinuousActive = false;
    let storyContinuousPIdx = 0;
    let storyContinuousPaused = false;
    let storyContinuousTimeout = null;

    function renderStorySelector() {
      const container = document.getElementById('storiesSelectorContainer');
      if (!container) return;

      container.innerHTML = STORIES_DATA.map((story, idx) => {
        const isSelected = idx === currentStoryIndex;
        const coverImg = story.coverImage || 'images/portal_stories.jpg';
        return \`
        <div onclick="selectStory(\${idx})" id="storyTab-\${idx}" class="group p-2.5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between \${isSelected ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-500/25 scale-[1.02]' : 'bg-slate-900/85 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}">
          <div>
            <div class="relative w-full h-20 rounded-xl overflow-hidden bg-slate-950 mb-2 border \${isSelected ? 'border-emerald-500/70 shadow-md shadow-emerald-500/30' : 'border-slate-800'}">
              <img src="\${coverImg}" alt="\${story.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.onerror=null; this.src='images/portal_stories.jpg';">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none"></div>
              <span class="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-slate-950/90 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                \${story.level || 'A2'}
              </span>
            </div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded \${isSelected ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'}">\${story.level || 'Nivel A2'}</span>
              <span class="text-[9px] font-mono text-slate-400 truncate">\${story.paragraphs ? story.paragraphs.length : 14} escenas</span>
            </div>
            <h4 class="text-xs font-extrabold \${isSelected ? 'text-emerald-300' : 'text-white group-hover:text-emerald-200'} leading-tight line-clamp-1">\${story.title}</h4>
            <p class="text-[10px] text-slate-400 italic truncate mt-0.5">\${story.titleEs || ''}</p>
          </div>
        </div>
      \`;
      }).join('');

      loadStoryViewer(currentStoryIndex);
    }

    function stopStoryNarration() {
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.stop === 'function') {
          window.AndroidBridge.stop();
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) { }
    }

    function selectStory(idx) {
      stopContinuousStoryNarration();
      stopStoryNarration();
      if (activeStoryRecognition) {
        try { activeStoryRecognition.abort(); } catch (e) { }
        activeStoryRecognition = null;
      }
      currentStoryIndex = idx;
      renderStorySelector();
    }

    function speakStoryParagraph(pIdx) {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story || !story.paragraphs || !story.paragraphs[pIdx]) return;
      const text = story.paragraphs[pIdx].en;
      highlightAndScrollToParagraph(pIdx);
      speakText(text, 0.92, () => {
        if (!storyContinuousActive) {
          const cardEl = document.getElementById(\`storyParagraphCard-\${pIdx}\`);
          if (cardEl) {
            cardEl.classList.remove('story-active-paragraph', 'border-amber-400');
          }
        }
      });
    }

    window.changeStoryFontSize = function(delta) {
      currentStoryFontSize = Math.max(13, Math.min(24, currentStoryFontSize + delta));
      try {
        localStorage.setItem('story_font_size', currentStoryFontSize.toString());
      } catch (_) {}
      applyStoryFontSize();
    };

    function applyStoryFontSize() {
      document.querySelectorAll('.story-en-text').forEach(el => {
        el.style.fontSize = \`\${currentStoryFontSize}px\`;
        el.style.lineHeight = \`\${Math.round(currentStoryFontSize * 1.58)}px\`;
      });
      const indicator = document.getElementById('storyFontSizeIndicator');
      if (indicator) indicator.textContent = \`\${currentStoryFontSize}px\`;
    }

    function updateStoryReadingProgress(currentIdx, totalCount) {
      const pct = Math.min(100, Math.round(((currentIdx + 1) / totalCount) * 100));
      const fill = document.getElementById('storyReadingProgressFill');
      const text = document.getElementById('storyReadingProgressPct');
      if (fill) fill.style.width = \`\${pct}%\`;
      if (text) text.textContent = \`\${pct}%\`;
    }

    function highlightAndScrollToParagraph(pIdx) {
      document.querySelectorAll('.story-paragraph-card').forEach(c => {
        c.classList.remove('story-active-paragraph');
      });
      const cardEl = document.getElementById(\`storyParagraphCard-\${pIdx}\`);
      if (cardEl) {
        cardEl.classList.add('story-active-paragraph');
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    window.startContinuousStoryNarration = function() {
      const story = STORIES_DATA[currentStoryIndex];
      if (!story || !story.paragraphs || !story.paragraphs.length) return;

      storyContinuousActive = true;
      storyContinuousPaused = false;
      storyContinuousPIdx = 0;
      updateContinuousNarrationUI();
      narrateNextContinuousStep();
    };

    window.pauseContinuousStoryNarration = function() {
      if (!storyContinuousActive) return;
      if (storyContinuousPaused) {
        storyContinuousPaused = false;
        updateContinuousNarrationUI();
        narrateNextContinuousStep();
      } else {
        storyContinuousPaused = true;
        if ('speechSynthesis' in window) {
          try { window.speechSynthesis.pause(); } catch (_) {}
        }
        updateContinuousNarrationUI();
      }
    };

    window.stopContinuousStoryNarration = function() {
      storyContinuousActive = false;
      storyContinuousPaused = false;
      if (storyContinuousTimeout) {
        clearTimeout(storyContinuousTimeout);
        storyContinuousTimeout = null;
      }
      stopStoryNarration();
      document.querySelectorAll('.story-paragraph-card').forEach(c => {
        c.classList.remove('story-active-paragraph');
      });
      updateContinuousNarrationUI();
    };

    function updateContinuousNarrationUI() {
      const playBtn = document.getElementById('storyContinuousPlayBtn');
      const pauseBtn = document.getElementById('storyContinuousPauseBtn');
      const stopBtn = document.getElementById('storyContinuousStopBtn');

      if (playBtn) {
        playBtn.style.display = storyContinuousActive ? 'none' : 'inline-flex';
      }
      if (pauseBtn) {
        pauseBtn.style.display = storyContinuousActive ? 'inline-flex' : 'none';
        pauseBtn.innerHTML = storyContinuousPaused ? '<span>▶️ Reanudar</span>' : '<span>⏸️ Pausar</span>';
      }
      if (stopBtn) {
        stopBtn.style.display = storyContinuousActive ? 'inline-flex' : 'none';
      }
    }

    function narrateNextContinuousStep() {
      if (!storyContinuousActive || storyContinuousPaused) return;
      const story = STORIES_DATA[currentStoryIndex];
      if (!story || !story.paragraphs || storyContinuousPIdx >= story.paragraphs.length) {
        window.stopContinuousStoryNarration();
        if (typeof showFloatingToast === 'function') {
          showFloatingToast('¡Obra literaria completada con éxito!', '📖');
        }
        return;
      }

      const pIdx = storyContinuousPIdx;
      const p = story.paragraphs[pIdx];

      highlightAndScrollToParagraph(pIdx);
      updateStoryReadingProgress(pIdx, story.paragraphs.length);

      speakText(p.en, 0.92, () => {
        if (!storyContinuousActive || storyContinuousPaused) return;
        storyContinuousPIdx++;
        storyContinuousTimeout = setTimeout(() => {
          narrateNextContinuousStep();
        }, 550);
      });
    }

    window.handleStoryWordClick = function(event, word) {
      if (event && event.stopPropagation) event.stopPropagation();
      if (!word) return;
      const clean = word.replace(/[^a-zA-Z'-]/g, '').trim();
      if (!clean) return;

      speakText(clean, 0.9);

      // Check if word is in current story vocabulary
      const story = STORIES_DATA[currentStoryIndex];
      let foundVocab = null;
      if (story && Array.isArray(story.vocab)) {
        foundVocab = story.vocab.find(v => v.term.toLowerCase().includes(clean.toLowerCase()));
      }

      if (foundVocab && typeof showFloatingToast === 'function') {
        showFloatingToast(\`\${foundVocab.term} (\${foundVocab.ipa || ''}): \${foundVocab.es}\`, '📖');
      } else if (typeof showFloatingToast === 'function') {
        showFloatingToast(\`"\${clean}" (Escuchando pronunciación)\`, '🔊');
      }
    };

    function renderClickableParagraphWords(rawText) {
      if (!rawText) return '';
      const words = rawText.split(/(\\s+)/);
      return words.map(w => {
        if (/^\\s+$/.test(w)) return w;
        const cleanWord = w.replace(/[^a-zA-Z'-]/g, '');
        if (!cleanWord) return w;
        const safeWord = cleanWord.replace(/'/g, "\\\\'");
        const prefix = w.match(/^[^a-zA-Z'-]+/)?.[0] || '';
        const suffix = w.match(/[^a-zA-Z'-]+$/)?.[0] || '';
        return \`\${prefix}<span class="story-word-clickable" onclick="window.handleStoryWordClick(event, '\${safeWord}')" title="Clic para escuchar pronunciación y significado">\${cleanWord}</span>\${suffix}\`;
      }).join('');
    }

    function loadStoryViewer(idx) {
      const story = STORIES_DATA[idx];
      if (!story) return;

      const titleEl = document.getElementById('activeStoryTitle');
      const subtitleEl = document.getElementById('activeStorySubtitle');
      const diffEl = document.getElementById('activeStoryDifficulty');
      const catEl = document.getElementById('activeStoryCategory');
      const illEl = document.getElementById('activeStoryIllustration');
      const pContainer = document.getElementById('storyParagraphsContainer');
      const moralContainer = document.getElementById('activeStoryMoralContainer');

      if (titleEl) titleEl.textContent = story.title || 'Cuento Clásico';
      if (subtitleEl) subtitleEl.textContent = story.titleEs || story.title_es || story.title || '';
      if (diffEl) diffEl.textContent = story.level || story.difficulty || 'Nivel A2';
      if (catEl) catEl.textContent = story.category || 'Obra Clásica';

      if (illEl) {
        const coverImg = story.coverImage || 'images/portal_stories.jpg';
        illEl.innerHTML = \`
          <div class="relative w-full h-full group overflow-hidden rounded-2xl shadow-xl border border-slate-700/60">
            <img src="\${coverImg}" alt="\${story.title}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" onerror="this.onerror=null; this.src='images/portal_stories.jpg';">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none"></div>
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span class="px-2.5 py-1 rounded-full bg-slate-900/90 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow">
                \${story.category || 'Fábula Clásica'} • \${story.level || 'Nivel A2'}
              </span>
              <span class="px-2 py-0.5 rounded-full bg-slate-950/85 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold">
                \${story.paragraphs.length} Escenas Literarias
              </span>
            </div>
          </div>
        \`;
      }

      if (pContainer && story.paragraphs) {
        let currentRenderedAct = '';
        let paragraphsHtml = \`
          <!-- BARRA EDITORIAL DE PROGRESO Y CONTROLES DE NARRACIÓN -->
          <div class="mb-5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="w-full sm:w-1/2">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">Progreso de Lectura</span>
                <span id="storyReadingProgressPct" class="text-xs font-mono font-bold text-amber-400">0%</span>
              </div>
              <div class="story-reading-progress-track">
                <div id="storyReadingProgressFill" class="story-reading-progress-fill" style="width: 0%;"></div>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-wrap justify-end">
              <!-- Selector de Tamaño de Letra -->
              <div class="flex items-center gap-1 bg-slate-900/90 border border-slate-700/70 rounded-xl px-2 py-1">
                <span class="text-[10px] text-slate-400 font-bold mr-1">Fuente:</span>
                <button type="button" onclick="window.changeStoryFontSize(-1)" class="story-font-btn" title="Reducir tamaño de letra">A-</button>
                <span id="storyFontSizeIndicator" class="text-[10px] font-mono text-amber-300 font-bold px-1">\${currentStoryFontSize}px</span>
                <button type="button" onclick="window.changeStoryFontSize(1)" class="story-font-btn" title="Aumentar tamaño de letra">A+</button>
              </div>

              <!-- Controles de Narración Continua -->
              <button type="button" id="storyContinuousPlayBtn" onclick="window.startContinuousStoryNarration()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow-md shadow-amber-500/20 cursor-pointer active:scale-95" title="Narrar Obra Completa de corrido con Auto-Scroll">
                <span>▶️ Narrar Obra Completa (Auto-Scroll)</span>
              </button>
              <button type="button" id="storyContinuousPauseBtn" onclick="window.pauseContinuousStoryNarration()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer hidden" title="Pausar / Reanudar">
                <span>⏸️ Pausar</span>
              </button>
              <button type="button" id="storyContinuousStopBtn" onclick="window.stopContinuousStoryNarration()" class="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-bold transition cursor-pointer hidden" title="Detener Narración">
                <span>⏹️ Detener</span>
              </button>
            </div>
          </div>
        \`;

        story.paragraphs.forEach((p, pIdx) => {
          if (p.act && p.act !== currentRenderedAct) {
            currentRenderedAct = p.act;
            paragraphsHtml += \`
              <div class="story-act-separator">
                <span class="story-act-badge">\${currentRenderedAct}</span>
              </div>
            \`;
          }

          const safeEn = (p.en || '').replace(/\\\\/g, "\\\\\\\\").replace(/'/g, "\\\\'");
          const clickableEnText = renderClickableParagraphWords(p.en || '');
          const sceneNum = (pIdx + 1) < 10 ? \`0\${pIdx + 1}\` : \`\${pIdx + 1}\`;

          paragraphsHtml += \`
          <div id="storyParagraphCard-\${pIdx}" class="story-paragraph-card space-y-2.5">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="flex items-start gap-3 flex-1">
                <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-amber-400 shrink-0 mt-0.5">
                  §\${sceneNum}
                </span>
                <p class="story-en-text font-semibold text-white leading-relaxed tracking-wide" style="font-size: \${currentStoryFontSize}px; line-height: \${Math.round(currentStoryFontSize * 1.58)}px;">
                  \${clickableEnText}
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <button onclick="speakStoryParagraph(\${pIdx}); speakText('\${safeEn}')"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition cursor-pointer"
                  title="Escuchar pronunciación de este párrafo">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                  <span>Audio</span>
                </button>
                <button id="storyMicBtn-\${pIdx}" onclick="startVoicePracticeParagraph(\${pIdx}, '\${safeEn}')"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow shadow-emerald-600/20 cursor-pointer"
                  title="Speaking Coach: Pronunciar párrafo (+50 EXP)">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                  <span id="storyMicLabel-\${pIdx}">Pronunciar</span>
                </button>
              </div>
            </div>
            \${isBilingualStoryModeActive ? \`<p class="text-xs sm:text-sm text-slate-300 italic pt-2 border-t border-slate-700/40 pl-9">\${p.es || ''}</p>\` : ''}
            <div id="voiceFeedback-\${pIdx}" class="text-xs font-mono hidden pt-2 pl-9"></div>
          </div>
        \`;
        });

        pContainer.innerHTML = paragraphsHtml;
        applyStoryFontSize();
      }

      if (moralContainer) {
        const vocabHtml = (story.vocab && story.vocab.length)
          ? \`
            <div class="mt-6">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                  <span>📚 Glosario Literario & Audio (\${story.vocab.length} Expresiones Clave)</span>
                </h4>
                <span class="text-[10px] text-slate-400">Toca cualquier tarjeta para escuchar su pronunciación</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                \${story.vocab.map(v => {
                  const safeTerm = (v.term || '').replace(/'/g, "\\\\'");
                  return \`
                    <button onclick="speakText('\${safeTerm}', 0.9)" class="story-vocab-card text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-500/50 transition cursor-pointer flex flex-col justify-between">
                      <div class="flex items-start justify-between gap-1 mb-1">
                        <span class="text-xs font-bold text-emerald-300 leading-tight">\${v.term}</span>
                        <span class="text-xs text-sky-400 shrink-0">🔊</span>
                      </div>
                      <span class="text-[10px] font-mono text-sky-400/90 mb-1">\${v.ipa || ''}</span>
                      <p class="text-[11px] text-slate-300 mt-auto leading-snug">\${v.es || ''}</p>
                    </button>
                  \`;
                }).join('')}
              </div>
            </div>
          \`
          : '';

        moralContainer.innerHTML = \`
          <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 shadow-lg">
            <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">Moraleja de la Obra / Moral of the Story</span>
            <p class="text-sm sm:text-base font-bold text-white leading-relaxed">\${story.moralEn || ''}</p>
            \${isBilingualStoryModeActive && story.moralEs ? \`<p class="text-xs sm:text-sm text-slate-300 italic mt-1.5">\${story.moralEs}</p>\` : ''}
          </div>
          \${vocabHtml}
        \`;
      }
    }

    function toggleBilingualStoryMode() {
      isBilingualStoryModeActive = !isBilingualStoryModeActive;
      const labelEl = document.getElementById('storyBilingualToggleLabel');
      const btn = document.getElementById('storyBilingualToggleBtn');
      if (labelEl) {
        labelEl.textContent = isBilingualStoryModeActive ? 'Modo Bilingüe: Activo' : 'Modo: Solo Inglés';
      } else if (btn) {
        btn.textContent = isBilingualStoryModeActive ? 'Modo Bilingüe: Activo' : 'Modo: Solo Inglés';
      }
      loadStoryViewer(currentStoryIndex);
    }

    function readEntireStoryAudio() {
      window.startContinuousStoryNarration();
    }
`;

appJs = appJs.slice(0, startVIdx) + updatedViewerFunctions + appJs.slice(endVIdx);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Successfully updated ENGLISH-/js/app.js with expanded stories and immersive editorial reader!');
