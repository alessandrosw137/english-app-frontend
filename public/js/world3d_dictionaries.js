/**
 * MASTERENG — DICCIONARIO COLOQUIAL, PHRASAL VERBS A-Z & VOCABULARIO VISUAL DE LUZ
 * Localización 100% Nativa al Español de México (Expresiones, Modismos y Ejemplos Naturales).
 * Compatible con 3D Worlds, Learning Path, Quizzes y Motor de Audio Kokoro TTS.
 */

(function(global) {
  'use strict';

  // 1. Phrasal Verbs Extremos de la A a la Z
  const PHRASAL_VERBS_A_Z = [
  {
    "term": "Abide by",
    "pron": "/əˈbaɪd baɪ/",
    "meaning": "Acatar las reglas al pie de la letra o cumplir con lo acordado",
    "example": "Tienes que abide by el reglamento del taller si no quieres broncas."
  },
  {
    "term": "Account for",
    "pron": "/əˈkaʊnt fɔːr/",
    "meaning": "Dar cuenta de algo, justificar un gasto o explicar qué pasó",
    "example": "No me cuadra el dinero, vas a tener que account for cada peso."
  },
  {
    "term": "Act on",
    "pron": "/ækt ɑːn/",
    "meaning": "Tomar acción basada en un consejo, pista o corazonada",
    "example": "Tienes que act on esa corazonada antes de que te ganen el negocio."
  },
  {
    "term": "Act out",
    "pron": "/ækt aʊt/",
    "meaning": "Hacer un berrinche o portarse mal por frustración",
    "example": "El chamaco empezó a act out porque le quitaron el celular."
  },
  {
    "term": "Act up",
    "pron": "/ækt ʌp/",
    "meaning": "Dar lata o fallar una máquina / ponerse rebelde",
    "example": "Mi troca empezó a act up en plena subida."
  },
  {
    "term": "Add on",
    "pron": "/æd ɑːn/",
    "meaning": "Añadir o agregar un extra al precio o al trato",
    "example": "Te quieren add on cargos ocultos a la cuenta; fíjate bien."
  },
  {
    "term": "Add up",
    "pron": "/æd ʌp/",
    "meaning": "Tener sentido o cuadrar una historia",
    "example": "Lo que me cuenta Juan no me add up para nada."
  },
  {
    "term": "Aim at",
    "pron": "/eɪm æt/",
    "meaning": "Apuntar hacia un blanco o enfocar un producto a cierto público",
    "example": "Esa campaña está aimed at chavos que apenas van entrando a la uni."
  },
  {
    "term": "Allow for",
    "pron": "/əˈlaʊ fɔːr/",
    "meaning": "Tomar en cuenta o prever un imprevisto / tiempo extra",
    "example": "Hay que allow for el tráfico de periférico en hora pico."
  },
  {
    "term": "Amount to",
    "pron": "/əˈmaʊnt tuː/",
    "meaning": "Equivaler a o llegar a sumar una cantidad respetable",
    "example": "Todas esas moneditas terminan amounting to una buena lana."
  },
  {
    "term": "Answer back",
    "pron": "/ˈæn.sɚ bæk/",
    "meaning": "Contestarle feo a alguien o ser respondón",
    "example": "No le vayas a answer back a tu jefa porque te va peor."
  },
  {
    "term": "Answer for",
    "pron": "/ˈæn.sɚ fɔːr/",
    "meaning": "Dar la cara y responder por las metidas de pata",
    "example": "El patrón va a tener que answer for el relajo que se armó en la bodega."
  },
  {
    "term": "Appeal to",
    "pron": "/əˈpiːl tuː/",
    "meaning": "Gustarle mucho a la banda o apelar al buen corazón de alguien",
    "example": "Ese estilo retro le appeals to un buen a los compas."
  },
  {
    "term": "Apply for",
    "pron": "/əˈplaɪ fɔːr/",
    "meaning": "Meter solicitud para una chamba, beca o permiso",
    "example": "Fui a apply for la visa y me trajeron vuelta y vuelta."
  },
  {
    "term": "Ask after",
    "pron": "/æsk ˈæf.tɚ/",
    "meaning": "Preguntar por la salud o cómo le va a alguien",
    "example": "Tu tía vino ayer y se puso a ask after ti."
  },
  {
    "term": "Ask around",
    "pron": "/æsk əˈraʊnd/",
    "meaning": "Preguntar a varios conocidos a ver quién sabe del rollo",
    "example": "Voy a ask around en la colonia a ver quién arregla refpas."
  },
  {
    "term": "Ask for",
    "pron": "/æsk fɔːr/",
    "meaning": "Buscarse broncas gratis o pedir algo",
    "example": "Si sigues toreando a ese perro te estás asking for un mordisco."
  },
  {
    "term": "Ask in",
    "pron": "/æsk ɪn/",
    "meaning": "Invitar a pasar a la casa a tomar un café o platicar",
    "example": "Llegó la vecina y de volada la asked in para echar el chisme."
  },
  {
    "term": "Ask out",
    "pron": "/æsk aʊt/",
    "meaning": "Invitar a salir a alguien en plan de ligue",
    "example": "Júntate valor y anímate a ask her out al cine."
  },
  {
    "term": "Ask over",
    "pron": "/æsk ˈoʊ.vɚ/",
    "meaning": "Invitar a los amigos a la casa a convivir",
    "example": "Vamos a ask over a la palomilla para ver el partido de fútbol."
  },
  {
    "term": "Auction off",
    "pron": "/ˈɑːk.ʃən ɔːf/",
    "meaning": "Subastar o rematar tiliches al mejor postor",
    "example": "Van a auction off las trocas viejas del municipio este sábado."
  },
  {
    "term": "Back away",
    "pron": "/bæk əˈweɪ/",
    "meaning": "Echarse para atrás con cuidado al ver el peligro",
    "example": "Vi que el compa sacó bronca y de volada I backed away."
  },
  {
    "term": "Back down",
    "pron": "/bæk daʊn/",
    "meaning": "Echarse para atrás o rajarse en una discusión",
    "example": "Cuando vio la bronca que se armaba, prefirió back down."
  },
  {
    "term": "Back off",
    "pron": "/bæk ɔːf/",
    "meaning": "Bajarle dos rayitas / dejar de fregar a alguien",
    "example": "Dile a tu primo que back off porque ya me está colmando la paciencia."
  },
  {
    "term": "Back out",
    "pron": "/bæk aʊt/",
    "meaning": "Rajarse a la mera hora de un trato o compromiso",
    "example": "Ya habíamos quedado en hacer el negocio, no te vayas a back out."
  },
  {
    "term": "Back up",
    "pron": "/bæk ʌp/",
    "meaning": "Hacer un respaldo de datos o tirar paro (apoyar a un compa)",
    "example": "Haz un back up de tu tesis y yo te back up si te preguntan."
  },
  {
    "term": "Bail out",
    "pron": "/beɪl aʊt/",
    "meaning": "Sacar a alguien de un apuro económico o de la cárcel",
    "example": "Mi hermano me tuvo que bail out porque me quedé sin un quinto."
  },
  {
    "term": "Band together",
    "pron": "/bænd təˈɡeð.ɚ/",
    "meaning": "Unirse en bola para defenderse o sacar la chamba",
    "example": "Los vecinos tuvimos que band together para arreglar la calle."
  },
  {
    "term": "Bang into",
    "pron": "/bæŋ ˈɪn.tuː/",
    "meaning": "Toparse de frente con alguien o darse un golpazo con algo",
    "example": "I banged into el poste por venir papaloteando con el celular."
  },
  {
    "term": "Bargain for",
    "pron": "/ˈbɑːr.ɡɪn fɔːr/",
    "meaning": "Esperarse algo imprevisto (más de lo que pedías)",
    "example": "Esta chamba resultó ser más difícil de lo que I bargained for."
  },
  {
    "term": "Bark out",
    "pron": "/bɑːrk aʊt/",
    "meaning": "Soltar órdenes a grito pelado como capataz",
    "example": "El encargado solo sabe barking out órdenes a lo loco."
  },
  {
    "term": "Base on",
    "pron": "/beɪs ɑːn/",
    "meaning": "Basarse en hechos reales o tomar como referencia",
    "example": "Esta rola está based on una anécdota bien chida del rancho."
  },
  {
    "term": "Bawl out",
    "pron": "/bɑːl aʊt/",
    "meaning": "Pegarle una regañada monumental a alguien",
    "example": "Mi jefa me bawled out porque llegué bien tarde de la fiesta."
  },
  {
    "term": "Bear out",
    "pron": "/ber aʊt/",
    "meaning": "Comprobar o respaldar la versión de los hechos",
    "example": "Las cámaras del Oxxo van a bear out que yo no tuve la culpa."
  },
  {
    "term": "Beat down",
    "pron": "/biːt daʊn/",
    "meaning": "Regatear el precio de algo / pegar fuerte el sol",
    "example": "Le logré beat down el precio a la mitad en el tianguis."
  },
  {
    "term": "Beat up",
    "pron": "/biːt ʌp/",
    "meaning": "Ponerle una golpiza a alguien o estar madreado por el uso",
    "example": "Ese carro viejo ya está bien beat up pero todavía jala."
  },
  {
    "term": "Beef up",
    "pron": "/biːf ʌp/",
    "meaning": "Reforzar o meterle más galleta a la seguridad o al código",
    "example": "Tuvimos que beef up el servidor para que aguantara el tráfico."
  },
  {
    "term": "Bend down",
    "pron": "/bend daʊn/",
    "meaning": "Agacharse para recoger algo del piso",
    "example": "Me bent down a levantar la moneda y me tronó la espalda."
  },
  {
    "term": "Bet on",
    "pron": "/bet ɑːn/",
    "meaning": "Apostarle todas las canicas a un proyecto o persona",
    "example": "Yo sí bet on que la selección mexicana va a dar la sorpresa."
  },
  {
    "term": "Black out",
    "pron": "/blæk aʊt/",
    "meaning": "Quedarse noqueado / apagarse la luz por apagón",
    "example": "Con tremendo calorazo hubo un black out en toda la colonia."
  },
  {
    "term": "Blast off",
    "pron": "/blæst ɔːf/",
    "meaning": "Despegar como bólido o cohete hacia el cielo",
    "example": "La nave espacial blasted off dejando una estela impresionante."
  },
  {
    "term": "Blend in",
    "pron": "/blend ɪn/",
    "meaning": "Camuflajearse entre la bola o pasar desapercibido",
    "example": "Ponte una gorra para blend in con la banda y no llamar la atención."
  },
  {
    "term": "Block off",
    "pron": "/blɑːk ɔːf/",
    "meaning": "Cerrar la calle con conos o vallas por obra",
    "example": "Los tránsitos blocked off la avenida principal por el desfile."
  },
  {
    "term": "Blow away",
    "pron": "/bloʊ əˈweɪ/",
    "meaning": "Dejar con la boca abierta o fascinar por completo",
    "example": "Ese concierto de rock me blow away por completo."
  },
  {
    "term": "Blow off",
    "pron": "/bloʊ ɔːf/",
    "meaning": "Mandar a volar un compromiso / darle el avión a alguien",
    "example": "No vayas a blow off la junta con el contador o te multan."
  },
  {
    "term": "Blow over",
    "pron": "/bloʊ ˈoʊ.vɚ/",
    "meaning": "Pasar la tormenta o enfriarse el chisme / bronca",
    "example": "Aguanta tantito vara, deja que el chisme blows over."
  },
  {
    "term": "Blow up",
    "pron": "/bloʊ ʌp/",
    "meaning": "Explotar de coraje / estallar o volverse viral de golpe",
    "example": "El profe va a blow up si ve que nadie hizo la tarea."
  },
  {
    "term": "Blurt out",
    "pron": "/blɝːt aʊt/",
    "meaning": "Soltar la sopa sin pensar o decir una imprudencia",
    "example": "Se le salió blurt out la sorpresa antes de tiempo."
  },
  {
    "term": "Boil down to",
    "pron": "/bɔɪl daʊn tuː/",
    "meaning": "Reducirse todo al meollo del asunto",
    "example": "Todo este rollo se boil down to que falta lana."
  },
  {
    "term": "Boot up",
    "pron": "/buːt ʌp/",
    "meaning": "Prender la compu y cargar el sistema operativo",
    "example": "Espera a que boot up la máquina para checar los archivos."
  },
  {
    "term": "Bottom out",
    "pron": "/ˈbɑː.t̬əm aʊt/",
    "meaning": "Tocar fondo en una crisis antes de recuperarse",
    "example": "Las ventas de la tienda bottoms out en enero y luego repuntan."
  },
  {
    "term": "Bounce back",
    "pron": "/baʊns bæk/",
    "meaning": "Recuperarse de volada de una caída, quiebra o enfermedad",
    "example": "Ese negocio quebró pero el dueño supo bounce back con todo."
  },
  {
    "term": "Branch out",
    "pron": "/bræntʃ aʊt/",
    "meaning": "Expandir el changarro a nuevos rumbos y giros",
    "example": "De vender tacos decidieron branch out a vender postres y café."
  },
  {
    "term": "Break down",
    "pron": "/breɪk daʊn/",
    "meaning": "Descomponerse un auto o máquina / quebrarse a llorar",
    "example": "El carro se me break down a medio camino."
  },
  {
    "term": "Break in",
    "pron": "/breɪk ɪn/",
    "meaning": "Meterse a la fuerza a robar o amoldar unos zapatos nuevos",
    "example": "Tengo que break in estas botas de trabajo para que no me saquen ampollas."
  },
  {
    "term": "Break out",
    "pron": "/breɪk aʊt/",
    "meaning": "Fugarse o brotar de repente una erupción en la piel",
    "example": "Me comí unos mariscos y me break out toda la espalda."
  },
  {
    "term": "Break up",
    "pron": "/breɪk ʌp/",
    "meaning": "Cortar con la pareja o disolverse una reunión",
    "example": "Carlos y su novia acaban de break up después de tres años."
  },
  {
    "term": "Breathe down someone's neck",
    "pron": "/briːð daʊn ˈsʌm.wʌnz nek/",
    "meaning": "Estar respirándole en la nuca a alguien / vigilarlo obsesivamente",
    "example": "El jefe se la pasa breathing down my neck todo el turno."
  },
  {
    "term": "Breeze through",
    "pron": "/briːz θruː/",
    "meaning": "Pasar un examen o reto peladito y en la boca (fácil)",
    "example": "Estudió tanto que breezed through la prueba de inglés."
  },
  {
    "term": "Bring about",
    "pron": "/brɪŋ əˈbaʊt/",
    "meaning": "Provocar o traer como consecuencia un cambio",
    "example": "Las nuevas tecnologías van a bring about una revolución total."
  },
  {
    "term": "Bring back",
    "pron": "/brɪŋ bæk/",
    "meaning": "Traer de vuelta un recuerdo viejito o regresar algo prestado",
    "example": "Esa rola me brings back un chorro de recuerdos de la prepa."
  },
  {
    "term": "Bring down",
    "pron": "/brɪŋ daʊn/",
    "meaning": "Bajarle los humos a un presumido o tumbar un gobierno",
    "example": "Ese escándalo brought down al director de la compañía."
  },
  {
    "term": "Bring up",
    "pron": "/brɪŋ ʌp/",
    "meaning": "Sacar un tema a la plática o criar a los hijos",
    "example": "Ni se te ocurra bring up ese tema delicado en la comida familiar."
  },
  {
    "term": "Brush off",
    "pron": "/brʌʃ ɔːf/",
    "meaning": "Hacer como que la virgen le habla / ignorar un insulto",
    "example": "Nomás se rió y brushed off las críticas como si nada."
  },
  {
    "term": "Brush up on",
    "pron": "/brʌʃ ʌp ɑːn/",
    "meaning": "Darle una repasada a algo que ya tenías olvidado",
    "example": "Tengo que brush up on mi inglés conversacional antes de la entrevista."
  },
  {
    "term": "Buckle down",
    "pron": "/ˈbʌk.əl daʊn/",
    "meaning": "Ponerse las pilas y ponerse a trabajar en serio",
    "example": "Ya se acabó la vacación, ahora toca buckle down machin."
  },
  {
    "term": "Buckle up",
    "pron": "/ˈbʌk.əl ʌp/",
    "meaning": "Abrrocharse el cinturón de seguridad en el carro o avión",
    "example": "Buckle up carnal, que esta carretera tiene un montón de curvas."
  },
  {
    "term": "Bump into",
    "pron": "/bʌmp ˈɪn.tuː/",
    "meaning": "Toparse a alguien de pura casualidad en la calle",
    "example": "Ayer me bump into mi compadre en el tianguis."
  },
  {
    "term": "Bundle up",
    "pron": "/ˈbʌn.dəl ʌp/",
    "meaning": "Arroparse bien con chamarra y bufanda para el frío",
    "example": "Bundle up chamaco, que está haciendo un airazo que cala los huesos."
  },
  {
    "term": "Burn out",
    "pron": "/bɝːn aʊt/",
    "meaning": "Quedar fundido o agotado por exceso de chamba",
    "example": "Si sigues trabajando doce horas diarias te vas a burn out."
  },
  {
    "term": "Burst into",
    "pron": "/bɝːst ˈɪn.tuː/",
    "meaning": "Entrar de sopetón a un cuarto o soltarse a reír",
    "example": "La morra burst into risa loca en pleno velorio."
  },
  {
    "term": "Butt in",
    "pron": "/bʌt ɪn/",
    "meaning": "Meter su cuchara en plática ajena de metiche",
    "example": "No te metas de entrometido a butt in en pleitos de marido y mujer."
  },
  {
    "term": "Buy into",
    "pron": "/baɪ ˈɪn.tuː/",
    "meaning": "Tragarse el cuento o creerse una idea falsa",
    "example": "No puedo creer que hayas bought into ese negocio piramidal."
  },
  {
    "term": "Call back",
    "pron": "/kɑːl bæk/",
    "meaning": "Regresar la llamada telefónica en cuanto te desocupes",
    "example": "Ahorita ando manejando, te call back en quince minutos."
  },
  {
    "term": "Call off",
    "pron": "/kɑːl ɔːf/",
    "meaning": "Cancelar un evento o compromiso",
    "example": "Tuvieron que call off la cascarita de fútbol por el tormentón."
  },
  {
    "term": "Call on",
    "pron": "/kɑːl ɑːn/",
    "meaning": "Pasar a alguien a hablar o hacerle una visita corta",
    "example": "El maestro me called on para que explicara el ejercicio."
  },
  {
    "term": "Call up",
    "pron": "/kɑːl ʌp/",
    "meaning": "Pegarle una llamada a alguien por teléfono",
    "example": "Te call up más al ratito para ponernos de acuerdo."
  },
  {
    "term": "Calm down",
    "pron": "/kɑːm daʊn/",
    "meaning": "Bajarle dos rayitas / calmarse o relajarse",
    "example": "Cálmate un poco y calm down antes de hablar con el cliente."
  },
  {
    "term": "Carry on",
    "pron": "/ˈkær.i ɑːn/",
    "meaning": "Seguir adelante a pesar de las broncas",
    "example": "Aunque la cosa esté difícil, hay que carry on sin rajarse."
  },
  {
    "term": "Carry out",
    "pron": "/ˈkær.i aʊt/",
    "meaning": "Llevar a cabo un plan o ejecutar una orden",
    "example": "Vamos a carry out la auditoría mañana a primera hora."
  },
  {
    "term": "Cash in on",
    "pron": "/kæʃ ɪn ɑːn/",
    "meaning": "Aprovechar la racha para sacar una buena lana",
    "example": "Los taqueros cashed in on el desfile vendiendo el triple."
  },
  {
    "term": "Catch on",
    "pron": "/kætʃ ɑːn/",
    "meaning": "Ponerse de moda o agarrarle la onda a un tema",
    "example": "Ese corrido tardó poco en catch on en todo el norte."
  },
  {
    "term": "Catch up",
    "pron": "/kætʃ ʌp/",
    "meaning": "Alcanzar a alguien en ritmo o ponerse al corriente",
    "example": "Caminen ustedes despacio, ahorita los catch up."
  },
  {
    "term": "Cave in",
    "pron": "/keɪv ɪn/",
    "meaning": "Doblar las manos y ceder a la presión / derrumbarse un techo",
    "example": "Al final el papá caved in y le compró el videojuego al chamaco."
  },
  {
    "term": "Check in",
    "pron": "/tʃek ɪn/",
    "meaning": "Registrarse en el hotel o en el aeropuerto",
    "example": "Llegando al hotel hacemos check in y nos vamos a comer."
  },
  {
    "term": "Check out",
    "pron": "/tʃek aʊt/",
    "meaning": "Echarle un ojo a algo curioso o desocupar la habitación",
    "example": "Check out esos tenis que acaban de llegar a la tienda."
  },
  {
    "term": "Cheer up",
    "pron": "/tʃɪr ʌp/",
    "meaning": "Animarse o levantar el ánimo a alguien que anda agüitado",
    "example": "¡Cheer up compa, no te agüites por cosas sin importancia!"
  },
  {
    "term": "Chew out",
    "pron": "/tʃuː aʊt/",
    "meaning": "Ponerle una cagada o regañiza tremenda a alguien",
    "example": "El capataz me chewed out porque se me cayó la herramienta."
  },
  {
    "term": "Chicken out",
    "pron": "/ˈtʃɪk.ɪn aʊt/",
    "meaning": "Rajarse o acobardarse al mero momento de aventarse",
    "example": "Iba a aventarse en paracaídas pero al final chickened out."
  },
  {
    "term": "Chill out",
    "pron": "/tʃɪl aʊt/",
    "meaning": "Tirarse a la hueva y relajarse bien a gusto",
    "example": "Este domingo solo quiero chill out viendo pelis en la casa."
  },
  {
    "term": "Chip in",
    "pron": "/tʃɪp ɪn/",
    "meaning": "Ponerse la del Puebla / hacer una vaquita para cooperar",
    "example": "Vamos a chip in diez dólares cada quien para las pizzas."
  },
  {
    "term": "Choke up",
    "pron": "/tʃoʊk ʌp/",
    "meaning": "Hacérsele a uno un nudo en la garganta de la emoción",
    "example": "El profe se choked up al despedirse de su última generación."
  },
  {
    "term": "Clamp down on",
    "pron": "/klæmp daʊn ɑːn/",
    "meaning": "Apretar las tuercas y ponerse estricto con las reglas",
    "example": "La policía va a clamp down on los carros que se estacionan mal."
  },
  {
    "term": "Clean out",
    "pron": "/kliːn aʊt/",
    "meaning": "Dejar sin un centavo a alguien / vaciar los tiliches de un cuarto",
    "example": "La compostura del carro me cleaned out todos mis ahorros."
  },
  {
    "term": "Clean up",
    "pron": "/kliːn ʌp/",
    "meaning": "Hacer la limpieza general o recoger el desmadre",
    "example": "Ayúdame a clean up la cocina antes de que llegue visita."
  },
  {
    "term": "Clear up",
    "pron": "/klɪr ʌp/",
    "meaning": "Aclarar un malentendido o despejarse el cielo",
    "example": "Tenemos que sentarnos a platicar para clear up este enredo."
  },
  {
    "term": "Cling to",
    "pron": "/klɪŋ tuː/",
    "meaning": "Aferrarse como lapa a una esperanza o a una persona",
    "example": "Sigue clinging to la idea de que su ex va a regresar con él."
  },
  {
    "term": "Close down",
    "pron": "/kloʊz daʊn/",
    "meaning": "Cerrar definitivamente un changarro o negocio",
    "example": "Tuvieron que close down la cafetería por falta de clientes."
  },
  {
    "term": "Come across",
    "pron": "/kʌm əˈkrɔːs/",
    "meaning": "Toparse algo por pura suerte o dar cierta impresión",
    "example": "Me come across unas fotos viejas en el cajón de recuerdos."
  },
  {
    "term": "Come along",
    "pron": "/kʌm əˈlɔːŋ/",
    "meaning": "Ir progresando bien o acompañar al grupo",
    "example": "¿Cómo come along el proyecto que estabas programando?"
  },
  {
    "term": "Come apart",
    "pron": "/kʌm əˈpɑːrt/",
    "meaning": "Hacerse pedazos o desbaratarse por estar mal hecho",
    "example": "Ese juguete chafa came apart al primer golpe que le dieron."
  },
  {
    "term": "Come back",
    "pron": "/kʌm bæk/",
    "meaning": "Regresar al barrio o volver a estar en la jugada",
    "example": "Ese boxeador veterano wants to come back al ring este año."
  },
  {
    "term": "Come down with",
    "pron": "/kʌm daʊn wɪð/",
    "meaning": "Caer enfermo de gripe o resfriado",
    "example": "Siento el cuerpo cortado, creo que me voy a come down with tos."
  },
  {
    "term": "Come forward",
    "pron": "/kʌm ˈfɔːr.wɚd/",
    "meaning": "Dar la cara o presentarse como testigo voluntario",
    "example": "Nadie quiso come forward para decir quién rompió el cristal."
  },
  {
    "term": "Come up with",
    "pron": "/kʌm ʌp wɪð/",
    "meaning": "Sacarse una buena idea o solución de la manga",
    "example": "A ver si se te come up with una solución antes de la junta."
  },
  {
    "term": "Cool down",
    "pron": "/kuːl daʊn/",
    "meaning": "Enfriarse un motor o calmarse los ánimos",
    "example": "Deja que el motor cool down antes de revisar el anticongelante."
  },
  {
    "term": "Cool off",
    "pron": "/kuːl ɔːf/",
    "meaning": "Refrescarse del calorón o enfriarse los ánimos de un pleito",
    "example": "Tómate una chela bien fría para cool off del calorón."
  },
  {
    "term": "Count on",
    "pron": "/kaʊnt ɑːn/",
    "meaning": "Contar con el apoyo incondicional de alguien",
    "example": "Sabes que puedes count on mí para las que sean."
  },
  {
    "term": "Crack down on",
    "pron": "/kræk daʊn ɑːn/",
    "meaning": "Aplicar mano dura y cero tolerancia contra los infractores",
    "example": "El gobierno va a crack down on las tomas clandestinas de agua."
  },
  {
    "term": "Crack open",
    "pron": "/kræk ˈoʊ.pən/",
    "meaning": "Destapar una cerveza helada o abrir una botella",
    "example": "Llegando a la casa nos crack open unas chelas bien muertas."
  },
  {
    "term": "Crack up",
    "pron": "/kræk ʌp/",
    "meaning": "Morirse de la risa o soltar la carcajada incontrolable",
    "example": "Ese comediante siempre me makes me crack up de la risa."
  },
  {
    "term": "Crash out",
    "pron": "/kræʃ aʊt/",
    "meaning": "Caer como bulto fundido de sueño por el cansancio",
    "example": "Llegué tan madreado del trabajo que me crashed out con la ropa puesta."
  },
  {
    "term": "Cross out",
    "pron": "/krɔːs aʊt/",
    "meaning": "Tachar un renglón de la lista con una raya",
    "example": "Ve cross out las tareas que ya vayas completando."
  },
  {
    "term": "Cut back on",
    "pron": "/kʌt bæk ɑːn/",
    "meaning": "Bajarle al gasto o al consumo de algo por salud",
    "example": "Tengo que cut back on los refrescos y las garnachas."
  },
  {
    "term": "Cut down",
    "pron": "/kʌt daʊn/",
    "meaning": "Talar un árbol o reducir porciones",
    "example": "Tuvieron que cut down el árbol viejo porque iba a tirar los cables."
  },
  {
    "term": "Cut down on",
    "pron": "/kʌt daʊn ɑːn/",
    "meaning": "Bajarle al consumo de azúcares, refrescos o gastos",
    "example": "Tengo que cut down on las garnachas para bajarle a la panza."
  },
  {
    "term": "Cut off",
    "pron": "/kʌt ɔːf/",
    "meaning": "Cortarle el servicio a alguien o cerrársele a un carro",
    "example": "Un taxi me cut off bien feo en la glorieta."
  },
  {
    "term": "Cut out",
    "pron": "/kʌt aʊt/",
    "meaning": "Dejar de dar lata / recortar figuras o apagarse un motor",
    "example": "¡Cut it out! Ya deja de estar molestando a tu hermanito."
  },
  {
    "term": "Dawn on",
    "pron": "/dɑːn ɑːn/",
    "meaning": "Caerle a uno el veinte de repente sobre algo obvio",
    "example": "It finally dawned on me que me estaban queriendo chamaquear."
  },
  {
    "term": "Deal with",
    "pron": "/diːl wɪð/",
    "meaning": "Lidiar con broncas o encargarse de un cliente difícil",
    "example": "No me gusta deal with gente que no tiene palabra."
  },
  {
    "term": "Die down",
    "pron": "/daɪ daʊn/",
    "meaning": "Calmarse un chisme, el viento o el ruido poco a poco",
    "example": "Vamos a esperar a que la tormenta die down para salir."
  },
  {
    "term": "Dig into",
    "pron": "/dɪɡ ˈɪn.tuː/",
    "meaning": "Entrarle con singular alegría a la comida o investigar a fondo",
    "example": "Llegaron los tacos de pastor, ¡vamos a dig into them con todo!"
  },
  {
    "term": "Do away with",
    "pron": "/duː əˈweɪ wɪð/",
    "meaning": "Eliminar de raíz un trámite inútil o regla obsoleta",
    "example": "Deberían do away with tanto papeleo burocrático."
  },
  {
    "term": "Do over",
    "pron": "/duː ˈoʊ.vɚ/",
    "meaning": "Hacer de nuevo algo que quedó mal hecho",
    "example": "El profe me hizo do over todo el ensayo."
  },
  {
    "term": "Do up",
    "pron": "/duː ʌp/",
    "meaning": "Abrocharse el cierre / remodelar una casa vieja",
    "example": "Vamos a do up la fachada con pintura fresca."
  },
  {
    "term": "Do without",
    "pron": "/duː wɪˈðaʊt/",
    "meaning": "Aguantarse o arreglárselas sin algo",
    "example": "Se fue la luz, así que nos va a tocar do without tele esta noche."
  },
  {
    "term": "Double down",
    "pron": "/ˈdʌb.əl daʊn/",
    "meaning": "Aferrarse y meterle el doble de ganas a una postura",
    "example": "En vez de pedir perdón, el vato decided to double down en su mentira."
  },
  {
    "term": "Doze off",
    "pron": "/doʊz ɔːf/",
    "meaning": "Quedarse jetón o echarse una pestañita involuntaria",
    "example": "Estaba tan aburrida la película que I dozed off en la sala."
  },
  {
    "term": "Drag on",
    "pron": "/dræɡ ɑːn/",
    "meaning": "Hacerse eterno o alargarse de más una junta tediosa",
    "example": "La reunión de planeación se drag on por casi cuatro horas."
  },
  {
    "term": "Draw back",
    "pron": "/drɔː bæk/",
    "meaning": "Retroceder asustado o retractarse",
    "example": "Dio un paso atrás y drew back al ver la víbora de cascabel."
  },
  {
    "term": "Draw up",
    "pron": "/drɔː ʌp/",
    "meaning": "Redactar un contrato formal o detenerse un carro",
    "example": "El abogado va a draw up el contrato de arrendamiento."
  },
  {
    "term": "Dress up",
    "pron": "/dres ʌp/",
    "meaning": "Vestirse de gala / ponerse catrín o disfrazarse",
    "example": "Nos tenemos que dress up para la boda de mi prima."
  },
  {
    "term": "Drink up",
    "pron": "/drɪŋk ʌp/",
    "meaning": "¡Fondo, fondo! Tomarse todo el contenido del vaso",
    "example": "Drink up compadre, que todavía queda media botella de mezcal."
  },
  {
    "term": "Drop by",
    "pron": "/drɑːp baɪ/",
    "meaning": "Caerle de imprevisto a la casa de alguien a saludar",
    "example": "Pásale a la casa y drop by cuando andes por mi rumbo."
  },
  {
    "term": "Drop in",
    "pron": "/drɑːp ɪn/",
    "meaning": "Hacer una visita rápida sin avisar con tiempo",
    "example": "Iba pasando por tu cuadra y decidí drop in."
  },
  {
    "term": "Drop off",
    "pron": "/drɑːp ɔːf/",
    "meaning": "Ir a dejar a alguien en el carro o quedarse jetón",
    "example": "Te puedo drop off en la estación del metro de paso."
  },
  {
    "term": "Drop out",
    "pron": "/drɑːp aʊt/",
    "meaning": "Darse de baja o salirse de la escuela/carrera",
    "example": "Decidió drop out de la facultad para abrir su negocio."
  },
  {
    "term": "Ease off",
    "pron": "/iːz ɔːf/",
    "meaning": "Aflojar la presión o calmarse el aguacero",
    "example": "Bájale tantito y ease off al acelerador en las curvas."
  },
  {
    "term": "Eat away at",
    "pron": "/iːt əˈweɪ æt/",
    "meaning": "Carcomer o consumir poco a poco la paciencia o el fierro",
    "example": "El óxido is eating away at la carrocería de la camioneta."
  },
  {
    "term": "Eat out",
    "pron": "/iːt aʊt/",
    "meaning": "Salir a comer fuera a unos tacos o restaurante",
    "example": "Hoy no cocines nada, vámonos a eat out al centro."
  },
  {
    "term": "Eat up",
    "pron": "/iːt ʌp/",
    "meaning": "Terminarse todo el plato sin dejar ni una morona",
    "example": "Eat up tus verduras si quieres que te deje salir a jugar al patio."
  },
  {
    "term": "Edge out",
    "pron": "/edʒ aʊt/",
    "meaning": "Ganar por la mínima ventaja en la carrera o votación",
    "example": "El piloto mexicano managed to edge out a su rival en la última vuelta."
  },
  {
    "term": "Egg on",
    "pron": "/eɡ ɑːn/",
    "meaning": "Estar sonsacando o incitando a alguien a cometer una imprudencia",
    "example": "Sus amigos lo were egging on para que se aventara a la alberca vestido."
  },
  {
    "term": "Eke out",
    "pron": "/iːk aʊt/",
    "meaning": "Sacar apenas lo necesario para sobrevivir con las justas",
    "example": "Lograron eke out el empate en el último minuto del juego."
  },
  {
    "term": "Embark on",
    "pron": "/ɪmˈbɑːrk ɑːn/",
    "meaning": "Emprender una nueva aventura, negocio o viaje",
    "example": "Decidió embark on una nueva aventura abriendo su propio taller mecánico."
  },
  {
    "term": "Empty out",
    "pron": "/ˈemp.ti aʊt/",
    "meaning": "Vaciar por completo los bolsillos o la mochila",
    "example": "Empty out tus bolsas para encontrar las llaves del carro."
  },
  {
    "term": "End up",
    "pron": "/end ʌp/",
    "meaning": "Terminar yendo a parar a un lugar insospechado",
    "example": "Salimos por un café y ended up cenando birria."
  },
  {
    "term": "Even out",
    "pron": "/ˈiː.vən aʊt/",
    "meaning": "Emparejarse las cosas o equilibrarse las cargas",
    "example": "Con las horas extras se van a even out las cuentas del mes."
  },
  {
    "term": "Explain away",
    "pron": "/ɪkˈspleɪn əˈweɪ/",
    "meaning": "Querer justificar con excusas baratas una falta obvia",
    "example": "No quieras explain away tu retardo diciendo que el puente estaba cerrado."
  },
  {
    "term": "Face off",
    "pron": "/feɪs ɔːf/",
    "meaning": "Darse un agarrón o enfrentarse cara a cara dos rivales",
    "example": "El América y las Chivas van a face off en el clásico nacional."
  },
  {
    "term": "Face up to",
    "pron": "/feɪs ʌp tuː/",
    "meaning": "Afrontar la realidad y dar la cara a los problemas",
    "example": "Tienes que face up to tus errores y no echarle la culpa a otros."
  },
  {
    "term": "Factor in",
    "pron": "/ˈfæk.tɚ ɪn/",
    "meaning": "Tomar en cuenta un gasto o imprevisto en el presupuesto",
    "example": "No olvides factor in las casetas de la autopista en el viaje."
  },
  {
    "term": "Fade away",
    "pron": "/feɪd əˈweɪ/",
    "meaning": "Irse desvaneciendo poco a poco hasta desaparecer",
    "example": "El sonido de la música fue fading away a la distancia."
  },
  {
    "term": "Fall apart",
    "pron": "/fɑːl əˈpɑːrt/",
    "meaning": "Caerse a pedazos un mueble viejo o derrumbarse emocionalmente",
    "example": "Ese sillón viejo ya se está cayendo a fall apart."
  },
  {
    "term": "Fall back on",
    "pron": "/fɑːl bæk ɑːn/",
    "meaning": "Tener un plan B o ahorros bajo la manga para emergencias",
    "example": "Siempre es bueno tener un guardadito para fall back on."
  },
  {
    "term": "Fall behind",
    "pron": "/fɑːl bɪˈhaɪnd/",
    "meaning": "Quedarse rezagado o atrasarse con las mensualidades",
    "example": "No te vayas a fall behind con las cuotas del carro."
  },
  {
    "term": "Fall for",
    "pron": "/fɑːl fɔːr/",
    "meaning": "Tragarse una mentira / caer redondito o enamorarse",
    "example": "No puedo creer que fall for esa broma tan inocente."
  },
  {
    "term": "Fall out",
    "pron": "/fɑːl aʊt/",
    "meaning": "Agarrar pleito con un amigo y dejar de hablarse",
    "example": "Se pelearon por dinero y fell out para siempre."
  },
  {
    "term": "Fall through",
    "pron": "/fɑːl θruː/",
    "meaning": "Venirse abajo un plan o negocio a la mera hora",
    "example": "El viaje a Cancún fell through porque no alcanzaron boletos."
  },
  {
    "term": "Feel up to",
    "pron": "/fiːl ʌp tuː/",
    "meaning": "Sentirse con ánimos o fuerzas de hacer algo",
    "example": "Ando tan cansado que no feel up to salir de parranda hoy."
  },
  {
    "term": "Fend for",
    "pron": "/fend fɔːr/",
    "meaning": "Rascárselas uno con sus propias uñas / valerse por sí mismo",
    "example": "Cuando te mudas solo tienes que learn to fend for yourself."
  },
  {
    "term": "Fight back",
    "pron": "/faɪt bæk/",
    "meaning": "Defenderse y devolver los golpes sin agachar la cabeza",
    "example": "No te dejes bullear, tienes que fight back y poner límites."
  },
  {
    "term": "Figure out",
    "pron": "/ˈfɪɡ.jɚ aʊt/",
    "meaning": "Descifrar el misterio o hallarle la maña a un problema",
    "example": "Dame unos minutos para figure out cómo prender esta máquina."
  },
  {
    "term": "Fill in",
    "pron": "/fɪl ɪn/",
    "meaning": "Llenar los espacios en blanco o cubrir el turno de un compañero",
    "example": "Carlos me pidió que lo fill in hoy en el turno de la tarde."
  },
  {
    "term": "Fill out",
    "pron": "/fɪl aʊt/",
    "meaning": "Rellenar una solicitud oficial con tus datos",
    "example": "Por favor fill out esta forma para tramitar la membresía."
  },
  {
    "term": "Fill up",
    "pron": "/fɪl ʌp/",
    "meaning": "Llenar el tanque de gasolina hasta el tope / llenarse la panza",
    "example": "Póngale tanque lleno para fill up la troca de gasolina roja."
  },
  {
    "term": "Find out",
    "pron": "/faɪnd aʊt/",
    "meaning": "Enterarse de un chisme o descubrir la verdad",
    "example": "Al final nos venimos a find out de todo lo que pasó."
  },
  {
    "term": "Finish off",
    "pron": "/ˈfɪn.ɪʃ ɔːf/",
    "meaning": "Rematar lo último que quedaba del guisado o pastel",
    "example": "Vamos a finish off el pozole que quedó en la olla."
  },
  {
    "term": "Fire away",
    "pron": "/faɪr əˈweɪ/",
    "meaning": "¡Suelta la pregunta! / Venga de ahí",
    "example": "Tengo varias dudas, profe. —¡Adelante, fire away!"
  },
  {
    "term": "Fit in",
    "pron": "/fɪt ɪn/",
    "meaning": "Encajar en la bolita o adaptarse al ambiente",
    "example": "El muchacho nuevo tardó poquito en fit in con el equipo."
  },
  {
    "term": "Fix up",
    "pron": "/fɪks ʌp/",
    "meaning": "Arreglar un desperfecto o acicalarse para salir",
    "example": "Le dieron una buena fix up a la camioneta y quedó al cien."
  },
  {
    "term": "Flare up",
    "pron": "/fler ʌp/",
    "meaning": "Prenderse la bronca de repente o dar un brote de alergia",
    "example": "El dolor de rodilla flared up con este frío tan canijo."
  },
  {
    "term": "Flesh out",
    "pron": "/fleʃ aʊt/",
    "meaning": "Meterle carnita y detalles a una idea o proyecto",
    "example": "La idea está buena pero falta flesh out los costos reales."
  },
  {
    "term": "Flip out",
    "pron": "/flɪp aʊt/",
    "meaning": "Perder los estribos o ponerse como loco de furia",
    "example": "Mi papá is going to flip out cuando vea el rayón en el carro."
  },
  {
    "term": "Fly off the handle",
    "pron": "/flaɪ ɔːf ðə ˈhæn.dəl/",
    "meaning": "Ponerse como energúmeno y perder el control por nada",
    "example": "No le digas nada ahorita porque flies off the handle bien fácil."
  },
  {
    "term": "Follow through",
    "pron": "/ˈfɑː.loʊ θruː/",
    "meaning": "Cumplir con lo pactado hasta el final sin rajarse",
    "example": "Si prometiste entregar el reporte, tienes que follow through."
  },
  {
    "term": "Follow up",
    "pron": "/ˈfɑː.loʊ ʌp/",
    "meaning": "Darle seguimiento a un cliente o a un trámite",
    "example": "Voy a mandar un correo para follow up con el proveedor."
  },
  {
    "term": "Fool around",
    "pron": "/fuːl əˈraʊnd/",
    "meaning": "Estar jugando al tonto o haciendo payasadas sin jalar",
    "example": "Dejen de fool around y pónganse a barrer el patio de una vez."
  },
  {
    "term": "Freak out",
    "pron": "/friːk aʊt/",
    "meaning": "Paniquearse o ponerse histérico por un susto",
    "example": "Mi mamá va a freak out si ve el raspón en la puerta."
  },
  {
    "term": "Freeze up",
    "pron": "/friːz ʌp/",
    "meaning": "Trabarase una pantalla o quedarse pasmado de miedo en el escenario",
    "example": "Se me froze up la compu en medio de la presentación ejecutiva."
  },
  {
    "term": "Gear up",
    "pron": "/ɡɪr ʌp/",
    "meaning": "Prepararse con todo el equipo para la faena o el partido",
    "example": "Los jugadores se están gearing up para la gran final del torneo."
  },
  {
    "term": "Get across",
    "pron": "/ɡet əˈkrɔːs/",
    "meaning": "Hacerse entender claramente / transmitir una idea",
    "example": "El ponente logró get across su punto con mucha claridad."
  },
  {
    "term": "Get ahead",
    "pron": "/ɡet əˈhed/",
    "meaning": "Salir adelante en la vida a base de puro esfuerzo y trabajo",
    "example": "Esa familia se partió el lomo trabajando duro para get ahead."
  },
  {
    "term": "Get along",
    "pron": "/ɡet əˈlɔːŋ/",
    "meaning": "Llevarse a todo dar con los compas o la familia",
    "example": "Me da gusto ver que tú y tu cuñado se get along tan bien."
  },
  {
    "term": "Get around",
    "pron": "/ɡet əˈraʊnd/",
    "meaning": "Moverse por la ciudad o sacarle la vuelta a una regla",
    "example": "En esta ciudad es facilísimo get around usando el metro."
  },
  {
    "term": "Get away",
    "pron": "/ɡet əˈweɪ/",
    "meaning": "Darse una escapadita de fin de semana a Acapulco",
    "example": "Nos urge get away de la ciudad para desestresarnos del tráfico."
  },
  {
    "term": "Get away with",
    "pron": "/ɡet əˈweɪ wɪð/",
    "meaning": "Salirse con la suya sin que lo cachen o castiguen",
    "example": "Pensó que se iba a get away with la trampa pero lo torcieron."
  },
  {
    "term": "Get back at",
    "pron": "/ɡet bæk æt/",
    "meaning": "Desquitarse o cobrársela a alguien por una mala jugada",
    "example": "Nomás está esperando la oportunidad para get back at él."
  },
  {
    "term": "Get by",
    "pron": "/ɡet baɪ/",
    "meaning": "Irla pasando o sobrevivir apenas con los gastos",
    "example": "Con este sueldo apenas alcanzamos para get by la quincena."
  },
  {
    "term": "Get down to",
    "pron": "/ɡet daʊn tuː/",
    "meaning": "Entrarle de lleno a los pendientes sin perder más tiempo",
    "example": "Basta de plática, let's get down to business de una buena vez."
  },
  {
    "term": "Get off",
    "pron": "/ɡet ɔːf/",
    "meaning": "Bajarse del camión o salir del turno de trabajo",
    "example": "Me got off del camión dos cuadras antes para caminar un poco."
  },
  {
    "term": "Get on with",
    "pron": "/ɡet ɑːn wɪð/",
    "meaning": "Continuar con la labor o llevar buena relación",
    "example": "Ya no te distraigas y get on with tus pendientes escolares."
  },
  {
    "term": "Get out of",
    "pron": "/ɡet aʊt əv/",
    "meaning": "Zafarse con una excusa para no lavar los trastes",
    "example": "Siempre inventa un pretexto para get out of lavar los trastes."
  },
  {
    "term": "Get over",
    "pron": "/ɡet ˈoʊ.vɚ/",
    "meaning": "Superar a un ex o aliviarse de una enfermedad",
    "example": "Ya supéralo y get over esa ruptura amorosa."
  },
  {
    "term": "Get rid of",
    "pron": "/ɡet rɪd əv/",
    "meaning": "Deshacerse de cacharros viejos que ya estorban",
    "example": "Tenemos que get rid of todas esas cajas arrumbadas."
  },
  {
    "term": "Get through",
    "pron": "/ɡet θruː/",
    "meaning": "Superar una racha difícil o comunicarse por teléfono",
    "example": "Estuvo cañón el examen pero logré get through sin reprobar."
  },
  {
    "term": "Get through to",
    "pron": "/ɡet θruː tuː/",
    "meaning": "Hacer entrar en razón a alguien que está de terco",
    "example": "Por más que le hablo con calma no logro get through to él."
  },
  {
    "term": "Get together",
    "pron": "/ɡet təˈɡeð.ɚ/",
    "meaning": "Juntarse la banda a convivir o armar una carnita asada",
    "example": "Hay que get together este fin de semana a ver el partido."
  },
  {
    "term": "Give away",
    "pron": "/ɡɪv əˈweɪ/",
    "meaning": "Regalar lo que ya no usas o delatar un secreto",
    "example": "Su mirada nerviosa lo give away de inmediato."
  },
  {
    "term": "Give in",
    "pron": "/ɡɪv ɪn/",
    "meaning": "Dar su brazo a torcer o ceder ante la insistencia",
    "example": "Los papás terminaron por give in y le compraron el perrito."
  },
  {
    "term": "Give out",
    "pron": "/ɡɪv aʊt/",
    "meaning": "Repartir volantes o agotarse una máquina / las fuerzas",
    "example": "Se pusieron en la esquina a give out muestras gratis."
  },
  {
    "term": "Give up",
    "pron": "/ɡɪv ʌp/",
    "meaning": "Tirar la toalla o darse por vencido",
    "example": "¡Nunca te vayas a give up, échale todas las ganas!"
  },
  {
    "term": "Go after",
    "pron": "/ɡoʊ ˈæf.tɚ/",
    "meaning": "Ir con todo tras un sueño o perseguir a un maleante",
    "example": "Tienes talento compa, deberías go after esa beca internacional."
  },
  {
    "term": "Go against",
    "pron": "/ɡoʊ əˈɡenst/",
    "meaning": "Ir en contra de la corriente o contradecir los principios",
    "example": "Aceptar esa mordida goes against todos mis valores éticos."
  },
  {
    "term": "Go ahead",
    "pron": "/ɡoʊ əˈhed/",
    "meaning": "¡Dale con confianza! / Seguir adelante con el plan",
    "example": "Si ya tienes todo listo, go ahead y lánzate al ruedo."
  },
  {
    "term": "Go along with",
    "pron": "/ɡoʊ əˈlɑːŋ wɪð/",
    "meaning": "Seguirle la corriente a alguien para no armar pleito",
    "example": "Para no hacerla de tos nomás I went along with lo que decía."
  },
  {
    "term": "Go back on",
    "pron": "/ɡoʊ bæk ɑːn/",
    "meaning": "Romper su promesa o no sostener la palabra dada",
    "example": "Jamás vayas a go back on una promesa hecha a un amigo."
  },
  {
    "term": "Go down",
    "pron": "/ɡoʊ daʊn/",
    "meaning": "Armarse la campal o pasar a la historia",
    "example": "Ese concierto de rock will go down como el mejor de la década."
  },
  {
    "term": "Go for",
    "pron": "/ɡoʊ fɔːr/",
    "meaning": "Ir con todo por una meta o animarse",
    "example": "Si de verdad quieres esa beca, ¡go for it sin dudar!"
  },
  {
    "term": "Go off",
    "pron": "/ɡoʊ ɔːf/",
    "meaning": "Sonar una alarma / echarse a perder la comida",
    "example": "La leche se go off porque la dejaron afuera del refri."
  },
  {
    "term": "Go on",
    "pron": "/ɡoʊ ɑːn/",
    "meaning": "Continuar hablando o suceder algo en el momento",
    "example": "Por favor go on con la historia, me dejaste picado."
  },
  {
    "term": "Go out",
    "pron": "/ɡoʊ aʊt/",
    "meaning": "Salir de fiesta con la novia o apagarse una fogata",
    "example": "Vamos a go out a cenar a la taquería del centro este sábado."
  },
  {
    "term": "Go over",
    "pron": "/ɡoʊ ˈoʊ.vɚ/",
    "meaning": "Darle una revisada minuciosa a las cuentas o papeles",
    "example": "Vamos a go over los números para asegurarnos que cuadren."
  },
  {
    "term": "Go through",
    "pron": "/ɡoʊ θruː/",
    "meaning": "Pasar por una racha bien canija y dura en la vida",
    "example": "Esa familia is going through una situación económica pesada."
  },
  {
    "term": "Go under",
    "pron": "/ɡoʊ ˈʌn.dɚ/",
    "meaning": "Irse a la quiebra un negocio que no pudo sostenerse",
    "example": "Con la pandemia muchos negocios locales unfortunately went under."
  },
  {
    "term": "Go with",
    "pron": "/ɡoʊ wɪð/",
    "meaning": "Combinar bien una prenda con otra o escoger una opción",
    "example": "Esa camisa vaquera goes with tus botas de piel a la perfección."
  },
  {
    "term": "Go without",
    "pron": "/ɡoʊ wɪˈðaʊt/",
    "meaning": "Apretar el cinturón y aguantarse sin algo por falta de lana",
    "example": "Este mes tuvimos que go without tele de paga por pagar la luz."
  },
  {
    "term": "Goof off",
    "pron": "/ɡuːf ɔːf/",
    "meaning": "Hacerse pato perdiendo el tiempo en horas de trabajo",
    "example": "El jefe los cachó goofing off en el almacén jugando dominó."
  },
  {
    "term": "Grow apart",
    "pron": "/ɡroʊ əˈpɑːrt/",
    "meaning": "Distanciarse los amigos con el paso de los años",
    "example": "Éramos uña y mugre de niños pero fuimos growing apart."
  },
  {
    "term": "Grow up",
    "pron": "/ɡroʊ ʌp/",
    "meaning": "Crecer de edad o madurar y dejar de portarse infantil",
    "example": "Ya tienes treinta años compa, es hora de grow up."
  },
  {
    "term": "Hand down",
    "pron": "/hænd daʊn/",
    "meaning": "Heredar ropa o joyas de generación en generación",
    "example": "Este reloj de oro fue handed down por mi bisabuelo."
  },
  {
    "term": "Hand in",
    "pron": "/hænd ɪn/",
    "meaning": "Entregar la tarea o un reporte a la autoridad",
    "example": "Asegúrate de hand in tu reporte antes del mediodía."
  },
  {
    "term": "Hand out",
    "pron": "/hænd aʊt/",
    "meaning": "Repartir volantes, exámenes o víveres mano a mano",
    "example": "El profe se puso a hand out las hojas de examen."
  },
  {
    "term": "Hand over",
    "pron": "/hænd ˈoʊ.vɚ/",
    "meaning": "Soltar o entregar un objeto a la fuerza / ceder el mando",
    "example": "El asaltante le gritó que handed over la cartera."
  },
  {
    "term": "Hang around",
    "pron": "/hæŋ əˈraʊnd/",
    "meaning": "Andar rondando o perdiendo el tiempo en la esquina",
    "example": "A esos vagos les gusta hang around en la tienda toda la tarde."
  },
  {
    "term": "Hang on",
    "pron": "/hæŋ ɑːn/",
    "meaning": "Aguantar tantito vara en la línea telefónica",
    "example": "Hang on tantito, déjame buscar una pluma para anotar el recado."
  },
  {
    "term": "Hang out",
    "pron": "/hæŋ aʊt/",
    "meaning": "Pasar el rato con los amigos sin prisa / cotorrear",
    "example": "Nos gusta hang out en la plaza los domingos por la tarde."
  },
  {
    "term": "Hang up",
    "pron": "/hæŋ ʌp/",
    "meaning": "Colgar la llamada telefónica",
    "example": "Se enojó tanto en la discusión que me hung up en la cara."
  },
  {
    "term": "Harp on",
    "pron": "/hɑːrp ɑːn/",
    "meaning": "Estar machacando y jode y jode con el mismo tema",
    "example": "Ya deja de harp on con lo mismo, ya te dije que lo siento."
  },
  {
    "term": "Head off",
    "pron": "/hed ɔːf/",
    "meaning": "Atajar o evitar una bronca antes de que estalle",
    "example": "Supimos head off el problema antes de que llegara a mayores."
  },
  {
    "term": "Head out",
    "pron": "/hed aʊt/",
    "meaning": "Arrancarse o salir rumbo al trabajo o la escuela",
    "example": "Ya son las siete, ya me tengo que head out para librar el tráfico."
  },
  {
    "term": "Hear about",
    "pron": "/hɪr əˈbaʊt/",
    "meaning": "Enterarse de la noticia o del chisme que anda corriendo",
    "example": "¿Ya heard about lo que pasó en la junta vecinal anoche?"
  },
  {
    "term": "Heat up",
    "pron": "/hiːt ʌp/",
    "meaning": "Calentar el recalentado en el comal o ponerse tensa la plática",
    "example": "Puse a heat up los frijoles con epazote en la cazuela de barro."
  },
  {
    "term": "Help out",
    "pron": "/help aʊt/",
    "meaning": "Echarle la mano o tirarle un paro a un camarada",
    "example": "¿Me puedes help out a mover este ropero pesado al otro cuarto?"
  },
  {
    "term": "Hit on",
    "pron": "/hɪt ɑːn/",
    "meaning": "Tirarle la onda o coquetearle descaradamente a alguien",
    "example": "El compa no perdía el tiempo y was hitting on a la muchacha."
  },
  {
    "term": "Hold back",
    "pron": "/hoʊld bæk/",
    "meaning": "Contenerse las lágrimas o guardarse una opinión",
    "example": "Quiso hold back el llanto pero la emoción le ganó."
  },
  {
    "term": "Hold off",
    "pron": "/hoʊld ɔːf/",
    "meaning": "Posponer una decisión o aguantarse la lluvia",
    "example": "Vamos a hold off el lanzamiento hasta que todo esté probado."
  },
  {
    "term": "Hold on",
    "pron": "/hoʊld ɑːn/",
    "meaning": "¡Espérate tantito! / Aguantar la línea en el teléfono",
    "example": "Hold on un segundo, deja busco una pluma para anotar."
  },
  {
    "term": "Hold out",
    "pron": "/hoʊld aʊt/",
    "meaning": "Resistir en una situación dura hasta que llegue auxilio",
    "example": "Lograron hold out en el cerro hasta que llegó el rescate."
  },
  {
    "term": "Hold up",
    "pron": "/hoʊld ʌp/",
    "meaning": "Retrasar por el tráfico o asaltar a mano armada",
    "example": "El tráfico en la autopista nos held up más de dos horas."
  },
  {
    "term": "Hook up",
    "pron": "/hʊk ʌp/",
    "meaning": "Conectar cables o darse unos besos con alguien",
    "example": "Ayúdame a hook up las bocinas a la pantalla."
  },
  {
    "term": "Hurry up",
    "pron": "/ˈhɝː.i ʌp/",
    "meaning": "¡Apúrate que se nos hace tarde! / Ponerle velocidad",
    "example": "Hurry up carnal, que si no llegamos a tiempo nos cierran la reja."
  },
  {
    "term": "Identify with",
    "pron": "/aɪˈden.t̬ə.faɪ wɪð/",
    "meaning": "Sentirse identificado con la historia o rola de alguien",
    "example": "Me super identify with esa canción porque me pasó lo mismito."
  },
  {
    "term": "Idle away",
    "pron": "/ˈaɪ.dəl əˈweɪ/",
    "meaning": "Matar el tiempo sin hacer nada productivo en toda la tarde",
    "example": "Nos la pasamos idled away la tarde sentados en el quisco de la plaza."
  },
  {
    "term": "Impose on",
    "pron": "/ɪmˈpoʊz ɑːn/",
    "meaning": "Abusar de la confianza o imponerse como carga a una familia",
    "example": "No quiero impose on ustedes quedándome a dormir varios días."
  },
  {
    "term": "Improve on",
    "pron": "/ɪmˈpruːv ɑːn/",
    "meaning": "Superar la marca anterior o mejorar el sazón de un platillo",
    "example": "El chef logró improve on la receta secreta agregando chile chipotle."
  },
  {
    "term": "Indulge in",
    "pron": "/ɪnˈdʌldʒ ɪn/",
    "meaning": "Darse un gustito culinario o consentirse con un postre",
    "example": "Los domingos me gusta indulge in una rica nieve de garrafa."
  },
  {
    "term": "Inform on",
    "pron": "/ɪnˈfɔːrm ɑːn/",
    "meaning": "Acusar o delatar a los malportados ante el maestro",
    "example": "Nadie quiso inform on quién fue el que quebró el florero."
  },
  {
    "term": "Insist on",
    "pron": "/ɪnˈsɪst ɑːn/",
    "meaning": "Ponerse necio insistiendo en pagar la cuenta",
    "example": "Mi tío insisted on pagar toda la cuenta de la taquería."
  },
  {
    "term": "Invite over",
    "pron": "/ɪnˈvaɪt ˈoʊ.vɚ/",
    "meaning": "Invitar a la casa a echar una platicada y unas botanas",
    "example": "Vamos a invite over a los vecinos para conocernos mejor."
  },
  {
    "term": "Iron out",
    "pron": "/ˈaɪ.ɚn aʊt/",
    "meaning": "Planchar las asperezas / resolver detallitos de un trato",
    "example": "Nos falta iron out un par de detallitos del contrato."
  },
  {
    "term": "Iterate on",
    "pron": "/ˈɪt̬.ə.reɪt ɑːn/",
    "meaning": "Ir puliendo y mejorando el diseño sobre la marcha",
    "example": "Vamos a iterate on el prototipo hasta que quede perfecto para producción."
  },
  {
    "term": "Jack up",
    "pron": "/dʒæk ʌp/",
    "meaning": "Subir el carro con el gato hidráulico o disparar los precios",
    "example": "Los hoteleros jacked up los precios por la temporada vacacional."
  },
  {
    "term": "Jam into",
    "pron": "/dʒæm ˈɪn.tuː/",
    "meaning": "Meter todo a presión a la fuerza en la maleta",
    "example": "Tuvimos que jam into la maleta tres chamarras gruesas."
  },
  {
    "term": "Jaw away",
    "pron": "/dʒɑː əˈweɪ/",
    "meaning": "Echar chal y plática tendida durante horas",
    "example": "Las comadres se la pasaron jawing away toda la mañana en el mercado."
  },
  {
    "term": "Jazz up",
    "pron": "/dʒæz ʌp/",
    "meaning": "Meterle sabor, salsa y color a un cuarto o presentación aburrida",
    "example": "Pusimos unas luces neón para jazz up la sala de juegos."
  },
  {
    "term": "Jerk around",
    "pron": "/dʒɝːk əˈraʊnd/",
    "meaning": "Traer a alguien a puras vueltas y largas sin resolver nada",
    "example": "En esa oficina nomás me están jerking around con mi trámite."
  },
  {
    "term": "Join in",
    "pron": "/dʒɔɪn ɪn/",
    "meaning": "Sumarse al relajo o integrarse a la actividad",
    "example": "¡Vente a la mesa y join in con nosotros a jugar!"
  },
  {
    "term": "Jot down",
    "pron": "/dʒɑːt daʊn/",
    "meaning": "Apuntar de volada un dato en una servilleta o libreta",
    "example": "Déjame jot down tu número celular para que no se me olvide."
  },
  {
    "term": "Juice up",
    "pron": "/dʒuːs ʌp/",
    "meaning": "Meterle potencia o recargarle energía a un aparato",
    "example": "Vamos a juice up la batería del carro con los cables pasacorriente."
  },
  {
    "term": "Jump at",
    "pron": "/dʒʌmp æt/",
    "meaning": "Abalanzarse sobre una oportunidad sin pensarlo dos veces",
    "example": "Yo en tu lugar jump at esa oferta de chamba de volada."
  },
  {
    "term": "Jump in",
    "pron": "/dʒʌmp ɪn/",
    "meaning": "Entrarle al quite o meter su cuchara en la conversación",
    "example": "Si tienes una buena idea, don't be shy y jump in a opinar."
  },
  {
    "term": "Jump on",
    "pron": "/dʒʌmp ɑːn/",
    "meaning": "Lanzársele al cuello a alguien reclamándole una falta",
    "example": "En cuanto llegó tarde, su jefe jumped on él de inmediato."
  },
  {
    "term": "Keel over",
    "pron": "/kiːl ˈoʊ.vɚ/",
    "meaning": "Caer fulminado de cansancio o mareo al suelo",
    "example": "Hacía tanto calor en el desfile que el bombero keeled over."
  },
  {
    "term": "Keep at",
    "pron": "/kiːp æt/",
    "meaning": "Seguir terco dándole hasta que salga el resultado",
    "example": "No te desesperes con la programación, tienes que keep at it."
  },
  {
    "term": "Keep away",
    "pron": "/kiːp əˈweɪ/",
    "meaning": "Mantenerse alejado del peligro o de las malas mañas",
    "example": "Keep away del enchufe descompuesto para que no te dé toques."
  },
  {
    "term": "Keep back",
    "pron": "/kiːp bæk/",
    "meaning": "Guardar distancia o no acercarse a la zona de peligro",
    "example": "Keep back de la orilla de la barranca para no resbalar."
  },
  {
    "term": "Keep down",
    "pron": "/kiːp daʊn/",
    "meaning": "No hacer ruido o retener la comida en el estómago",
    "example": "Con ese dolor de panza apenas si podía keep down un caldito de pollo."
  },
  {
    "term": "Keep from",
    "pron": "/kiːp frəm/",
    "meaning": "Aguantarse las ganas de soltar una carcajada",
    "example": "No me pude keep from reírme cuando se le cayó la peluca."
  },
  {
    "term": "Keep off",
    "pron": "/kiːp ɔːf/",
    "meaning": "No pisar el pasto o mantenerse fuera de un área prohibida",
    "example": "El letrero del parque dice clarito: keep off el pasto recién regado."
  },
  {
    "term": "Keep on",
    "pron": "/kiːp ɑːn/",
    "meaning": "Seguir terco dale y dale con lo mismo",
    "example": "A pesar del cansancio decidió keep on corriendo hasta la meta."
  },
  {
    "term": "Keep out",
    "pron": "/kiːp aʊt/",
    "meaning": "Prohibido el paso a personas no autorizadas",
    "example": "Esa bodega tiene candado y dice keep out en la entrada."
  },
  {
    "term": "Keep to",
    "pron": "/kiːp tuː/",
    "meaning": "Apegarse al presupuesto fijado sin gastar de más",
    "example": "Tenemos que keep to el presupuesto si queremos que alcance la quincena."
  },
  {
    "term": "Keep up",
    "pron": "/kiːp ʌp/",
    "meaning": "Mantener el paso firme y el ritmo de trabajo",
    "example": "Vas a un excelente ritmo, keep up con ese buen trabajo."
  },
  {
    "term": "Keep up with",
    "pron": "/kiːp ʌp wɪð/",
    "meaning": "Seguirle el paso o el ritmo a alguien más rápido",
    "example": "Es bien difícil keep up with las nuevas tendencias de redes."
  },
  {
    "term": "Key in",
    "pron": "/kiː ɪn/",
    "meaning": "Teclear el NIP o la clave secreta en el cajero automático",
    "example": "Key in tu contraseña con cuidado cubriendo los números con la mano."
  },
  {
    "term": "Kick around",
    "pron": "/kɪk əˈraʊnd/",
    "meaning": "Tirar ideas sobre la mesa o patear el balón en el recreo",
    "example": "Estuvimos kicking around varias ideas para el nombre del restaurante."
  },
  {
    "term": "Kick back",
    "pron": "/kɪk bæk/",
    "meaning": "Tirarse a la flojera a descansar con una chela",
    "example": "El domingo sólo quiero kick back en el sillón y descansar."
  },
  {
    "term": "Kick in",
    "pron": "/kɪk ɪn/",
    "meaning": "Hacer efecto la pastilla para el dolor de cabeza",
    "example": "Esperé veinte minutos a que la pastilla kicked in y me quitara el dolor."
  },
  {
    "term": "Kick off",
    "pron": "/kɪk ɔːf/",
    "meaning": "Arrancar un evento o dar la patada inicial del partido",
    "example": "El festival de música va a kick off a las cuatro de la tarde."
  },
  {
    "term": "Kick out",
    "pron": "/kɪk aʊt/",
    "meaning": "Correr a patadas a un borracho mala copa del antro",
    "example": "Los guardias kicked out al tipo por andar buscando pleito."
  },
  {
    "term": "Kill off",
    "pron": "/kɪl ɔːf/",
    "meaning": "Matar al personaje principal en el capítulo final de la telenovela",
    "example": "El productor decided to kill off al villano en el último episodio."
  },
  {
    "term": "Knock down",
    "pron": "/nɑːk daʊn/",
    "meaning": "Demoler una barda o noquear a alguien",
    "example": "Van a knock down esa construcción vieja para hacer un parque."
  },
  {
    "term": "Knock off",
    "pron": "/nɑːk ɔːf/",
    "meaning": "Dar por terminado el turno de chamba o dejar de molestar",
    "example": "Ya son las seis, ¡a knock off y vámonos a descansar a la casa!"
  },
  {
    "term": "Knock out",
    "pron": "/nɑːk aʊt/",
    "meaning": "Noquear al rival en el ring o quedar noqueado del sueño",
    "example": "Esa pastilla para la gripa me knocked out toda la noche."
  },
  {
    "term": "Knock over",
    "pron": "/nɑːk ˈoʊ.vɚ/",
    "meaning": "Tirar un vaso de agua sobre el mantel por descuido",
    "example": "Sin querer knocked over la salsa verde sobre mi pantalón blanco."
  },
  {
    "term": "Knuckle down",
    "pron": "/ˈnʌk.əl daʊn/",
    "meaning": "Ponerse bien trucha a estudiar o trabajar sin distracciones",
    "example": "Se acercan los exámenes finales, toca knuckle down a estudiar."
  },
  {
    "term": "Lap up",
    "pron": "/læp ʌp/",
    "meaning": "Tragarse los halagos con gusto o beber a lengüetadas",
    "example": "El perrito lapped up toda el agua de su plato de un jalón."
  },
  {
    "term": "Lay off",
    "pron": "/leɪ ɔːf/",
    "meaning": "Despedir personal por recorte o dejar de estar molestando",
    "example": "La empresa tuvo que lay off a veinte empleados por la crisis."
  },
  {
    "term": "Lay out",
    "pron": "/leɪ aʊt/",
    "meaning": "Explicar con peras y manzanas un plan o desembolsar lana",
    "example": "El arquitecto laid out los planos de la casa sobre la mesa."
  },
  {
    "term": "Lead to",
    "pron": "/liːd tuː/",
    "meaning": "Desembocar en consecuencias graves",
    "example": "Manejar desvelado puede lead to un accidente grave."
  },
  {
    "term": "Leak out",
    "pron": "/liːk aʊt/",
    "meaning": "Filtrarse un secreto a la prensa o a las redes",
    "example": "La noticia del nuevo celular se leaked out antes del evento."
  },
  {
    "term": "Lean on",
    "pron": "/liːn ɑːn/",
    "meaning": "Apoyarse en la familia en las malas o presionar a un deudor",
    "example": "En los momentos más difíciles siempre puedes lean on tu familia."
  },
  {
    "term": "Leave behind",
    "pron": "/liːv bɪˈhaɪnd/",
    "meaning": "Olvidar algo en un lugar o dejar atrás el pasado",
    "example": "Se me olvidó la cartera y la left behind en la cafetería."
  },
  {
    "term": "Leave out",
    "pron": "/liːv aʊt/",
    "meaning": "Dejar fuera a alguien de la lista o excluirlo",
    "example": "No me vayan a leave out de la quiniela de fútbol."
  },
  {
    "term": "Let down",
    "pron": "/let daʊn/",
    "meaning": "Quedarle mal a un amigo o decepcionarlo feo",
    "example": "Contaba conmigo y no le quise let down."
  },
  {
    "term": "Let off",
    "pron": "/let ɔːf/",
    "meaning": "Perdonar el castigo o la multa / dejar ir con una advertencia",
    "example": "El oficial me let off con una advertencia sin ponerme infracción."
  },
  {
    "term": "Lighten up",
    "pron": "/ˈlaɪ.tən ʌp/",
    "meaning": "Relajarse y no tomarse las cosas tan a pecho",
    "example": "Lighten up carnal, nomás era una broma inocente entre compas."
  },
  {
    "term": "Line up",
    "pron": "/laɪn ʌp/",
    "meaning": "Hacer fila india o cuadrar una serie de citas",
    "example": "Tuvimos que line up desde las seis de la mañana por boletos."
  },
  {
    "term": "Listen up",
    "pron": "/ˈlɪs.ən ʌp/",
    "meaning": "¡Paren oreja todos! / Pongan atención a lo que voy a decir",
    "example": "¡Listen up todos, el maestro tiene un anuncio bien importante!"
  },
  {
    "term": "Live up to",
    "pron": "/lɪv ʌp tuː/",
    "meaning": "Estar a la altura de las expectativas que tenían de ti",
    "example": "La secuela de la película lived up to todas las expectativas."
  },
  {
    "term": "Lock out",
    "pron": "/lɑːk aʊt/",
    "meaning": "Quedarse afuera con las llaves adentro de la casa o carro",
    "example": "Cerré la puerta y me locked out; tuve que llamar a un cerrajero."
  },
  {
    "term": "Look after",
    "pron": "/lʊk ˈæf.tɚ/",
    "meaning": "Cuidar a los chamacos o echarle un ojo a la casa",
    "example": "¿Me puedes look after al perro mientras salgo al mandado?"
  },
  {
    "term": "Look down on",
    "pron": "/lʊk daʊn ɑːn/",
    "meaning": "Mirar a alguien por encima del hombro o discriminar",
    "example": "Nadie tiene derecho a look down on ti por tu origen."
  },
  {
    "term": "Look for",
    "pron": "/lʊk fɔːr/",
    "meaning": "Andar buscando las llaves o un objeto perdido",
    "example": "Llevo media hora looking for las llaves de la casa."
  },
  {
    "term": "Look forward to",
    "pron": "/lʊk ˈfɔːr.wɚd tuː/",
    "meaning": "Esperar con muchas ansias un viaje o evento emocionante",
    "example": "Estoy looking forward to las vacaciones en la playa."
  },
  {
    "term": "Look into",
    "pron": "/lʊk ˈɪn.tuː/",
    "meaning": "Investigar a fondo un caso o ponerse a averiguar",
    "example": "La policía va a look into las causas del corto circuito."
  },
  {
    "term": "Look out",
    "pron": "/lʊk aʊt/",
    "meaning": "¡Aguas! / ¡Ponte buzo con el peligro!",
    "example": "¡Look out! Viene una moto en sentido contrario."
  },
  {
    "term": "Look up to",
    "pron": "/lʊk ʌp tuː/",
    "meaning": "Admirar y tener como ejemplo a seguir a alguien",
    "example": "Los niños siempre look up to sus hermanos mayores."
  },
  {
    "term": "Luck out",
    "pron": "/lʌk aʊt/",
    "meaning": "Tener un golpe de suerte descomunal / coronar de chiripa",
    "example": "I really lucked out encontrando el último boleto disponible."
  },
  {
    "term": "Make for",
    "pron": "/meɪk fɔːr/",
    "meaning": "Jalar rumbo a la salida o contribuir a un buen ambiente",
    "example": "En cuanto dieron el timbre todos made for la puerta de salida."
  },
  {
    "term": "Make out",
    "pron": "/meɪk aʊt/",
    "meaning": "Distinguir algo borroso a lo lejos o darse un faje",
    "example": "Con la neblina no alcanzaba a make out el letrero de la salida."
  },
  {
    "term": "Make up",
    "pron": "/meɪk ʌp/",
    "meaning": "Inventar una mentira piadosa o hacer las paces",
    "example": "Tuvieron un pleito fuerte pero ya se hicieron make up."
  },
  {
    "term": "Make up for",
    "pron": "/meɪk ʌp fɔːr/",
    "meaning": "Compensar un error o reparar el daño",
    "example": "Te prometo que te voy a make up for haber llegado tarde."
  },
  {
    "term": "Map out",
    "pron": "/mæp aʊt/",
    "meaning": "Trazar la ruta de viaje o planear bien la estrategia",
    "example": "Vamos a map out la ruta antes de salir a carretera abierta."
  },
  {
    "term": "Melt away",
    "pron": "/melt əˈweɪ/",
    "meaning": "Derretirse la nieve de limón o disiparse las dudas",
    "example": "Todas mis preocupaciones melted away cuando vi sonreír a mi familia."
  },
  {
    "term": "Melt down",
    "pron": "/melt daʊn/",
    "meaning": "Fundir el metal en la herrería o sufrir una crisis de nervios",
    "example": "En la joyería van a melt down el oro viejo para hacer anillos nuevos."
  },
  {
    "term": "Mess around",
    "pron": "/mes əˈraʊnd/",
    "meaning": "Andar perdiendo el tiempo o vacilando sin hacer nada",
    "example": "¡Ya dejen de mess around y pónganse a trabajar!"
  },
  {
    "term": "Mess up",
    "pron": "/mes ʌp/",
    "meaning": "Regarla gacho / arruinar una oportunidad de oro",
    "example": "La regué bien gacho, I really messed up esta vez."
  },
  {
    "term": "Mill around",
    "pron": "/mɪl əˈraʊnd/",
    "meaning": "Andar rondando en círculos esperando a que abran la taquilla",
    "example": "Había cientos de fanáticos milling around afuera del estadio."
  },
  {
    "term": "Miss out",
    "pron": "/mɪs aʊt/",
    "meaning": "Perderse de algo muy chido por no haber ido",
    "example": "La fiesta se puso con madre, te la missed out."
  },
  {
    "term": "Mix up",
    "pron": "/mɪks ʌp/",
    "meaning": "Confundir una cosa con otra por distracción",
    "example": "El mesero mixed up las órdenes y me trajo tacos de pastor en vez de bistec."
  },
  {
    "term": "Mop up",
    "pron": "/mɑːp ʌp/",
    "meaning": "Trapear el piso del local con fabuloso y jerga",
    "example": "Ayúdame a mop up el agua que se metió por la ventana."
  },
  {
    "term": "Mount up",
    "pron": "/maʊnt ʌp/",
    "meaning": "Irse acumulando las deudas e intereses de las tarjetas",
    "example": "Si no pagas a tiempo los intereses start to mount up bien feo."
  },
  {
    "term": "Move in",
    "pron": "/muːv ɪn/",
    "meaning": "Mudarse con todos los tiliches a la nueva casa",
    "example": "Por fin este sábado nos move in al nuevo departamento."
  },
  {
    "term": "Move on",
    "pron": "/muːv ɑːn/",
    "meaning": "Pasar la página y seguir adelante con tu vida",
    "example": "Ya no te martirices por el pasado, hay que move on."
  },
  {
    "term": "Move out",
    "pron": "/muːv aʊt/",
    "meaning": "Desocupar el departamento y entregar las llaves al casero",
    "example": "El inquilino tuvo que move out a fin de mes."
  },
  {
    "term": "Muddle through",
    "pron": "/ˈmʌd.əl θruː/",
    "meaning": "Librarla a tropezones como Dios le dé a entender a uno",
    "example": "No hablaba bien inglés pero managed to muddle through en el aeropuerto."
  },
  {
    "term": "Muscle in",
    "pron": "/ˈmʌs.əl ɪn/",
    "meaning": "Meterse por la fuerza a quitarle el negocio o clientes a otro",
    "example": "Esa cadena grande wants to muscle in en el mercado local."
  },
  {
    "term": "Nail down",
    "pron": "/neɪl daʊn/",
    "meaning": "Amarrar un trato o fijar la fecha definitiva de una fiesta",
    "example": "Por fin logramos nail down la fecha para la boda de mi hermana."
  },
  {
    "term": "Name after",
    "pron": "/neɪm ˈæf.tɚ/",
    "meaning": "Ponerle al chamaco el mismo nombre del abuelo",
    "example": "Le pusieron Juan para name him after su abuelito paterno."
  },
  {
    "term": "Narrow down",
    "pron": "/ˈnær.oʊ daʊn/",
    "meaning": "Depurar la lista y reducir las opciones a las mejores",
    "example": "Pudimos narrow down los candidatos a los tres mejores perfiles."
  },
  {
    "term": "Nerd out",
    "pron": "/nɝːd aʊt/",
    "meaning": "Clavarse intensamente hablando de cómics o tecnología",
    "example": "Mis compas se pusieron a nerd out hablando de tarjetas gráficas."
  },
  {
    "term": "Nip out",
    "pron": "/nɪp aʊt/",
    "meaning": "Echarse una escapadita de cinco minutos por unos cigarros",
    "example": "Voy a nip out a la esquina a comprar unos chicles."
  },
  {
    "term": "Nod off",
    "pron": "/nɑːd ɔːf/",
    "meaning": "Dar el pestañazo o cabecear de sueño sentado",
    "example": "Me estaba nod off en la clase de historia por el calor."
  },
  {
    "term": "Note down",
    "pron": "/noʊt daʊn/",
    "meaning": "Anotar con precisión el recado en la libreta",
    "example": "Note down la dirección exacta para que no nos perdamos."
  },
  {
    "term": "Open up",
    "pron": "/ˈoʊ.pən ʌp/",
    "meaning": "Abrir el corazón y sincerarse con un amigo",
    "example": "Por fin se animó a open up y contarme lo que sentía."
  },
  {
    "term": "Opt in",
    "pron": "/ɑːpt ɪn/",
    "meaning": "Anotarse voluntariamente para participar en el torneo",
    "example": "Varios compañeros decidieron opt in en el curso de primeros auxilios."
  },
  {
    "term": "Opt out",
    "pron": "/ɑːpt aʊt/",
    "meaning": "Darse de baja voluntariamente o no querer participar",
    "example": "Decidió opt out de la tanda para no endeudarse."
  },
  {
    "term": "Order around",
    "pron": "/ˈɔːr.dɚ əˈraʊnd/",
    "meaning": "Andar mangoneando y mandoneando a todos en la casa",
    "example": "A nadie le gusta que lo anden ordering around como si fuera criado."
  },
  {
    "term": "Own up",
    "pron": "/oʊn ʌp/",
    "meaning": "Tener los pantalones de aceptar la culpa de su error",
    "example": "Fue muy valiente de su parte own up a lo que hizo."
  },
  {
    "term": "Pace back and forth",
    "pron": "/peɪs bæk ənd fɔːrθ/",
    "meaning": "Caminar de un lado a otro nervioso como león enjaulado",
    "example": "Estaba pacing back and forth en la sala esperando las noticias del doctor."
  },
  {
    "term": "Pack away",
    "pron": "/pæk əˈweɪ/",
    "meaning": "Guardar las cobijas o comerse una cantidad bárbara de tacos",
    "example": "Ese vato flaco can pack away diez tacos de suadero como si nada."
  },
  {
    "term": "Pack up",
    "pron": "/pæk ʌp/",
    "meaning": "Recoger todos los tiliches y triques para irse",
    "example": "Ya dieron las cinco, recojan sus cosas y pack up para salir."
  },
  {
    "term": "Pair off",
    "pron": "/per ɔːf/",
    "meaning": "Emparejarse en dúos para hacer la práctica de laboratorio",
    "example": "El profe les pidió que pair off para hacer la tarea en parejas."
  },
  {
    "term": "Palm off",
    "pron": "/pɑːm ɔːf/",
    "meaning": "Enjaretarle un billete falso o un tiliche inservible a alguien",
    "example": "Me quisieron palm off un celular clonado como si fuera original."
  },
  {
    "term": "Pan out",
    "pron": "/pæn aʊt/",
    "meaning": "Cuajar o salir bien las cosas según lo planeado",
    "example": "Esperemos que la propuesta de negocio pans out con éxito."
  },
  {
    "term": "Pass away",
    "pron": "/pæs əˈweɪ/",
    "meaning": "Fallecer o pasar a mejor vida con respeto",
    "example": "Mi abuelita passed away en paz rodeada de su familia."
  },
  {
    "term": "Pass down",
    "pron": "/pæs daʊn/",
    "meaning": "Pasar las recetas tradicionales de abuelas a nietas",
    "example": "Esta receta de mole fue passed down por cuatro generaciones."
  },
  {
    "term": "Pass off",
    "pron": "/pæs ɔːf/",
    "meaning": "Hacer pasar gato por liebre vendiendo piratería",
    "example": "Querían pass off carne corriente como si fuera corte fino."
  },
  {
    "term": "Pass on",
    "pron": "/pæs ɑːn/",
    "meaning": "Paso sin ver en la ronda de cartas o heredar un oficio",
    "example": "Esta ronda I pass on ella, mejor me espero a la siguiente."
  },
  {
    "term": "Pass out",
    "pron": "/pæs aʊt/",
    "meaning": "Desmayarse por el calor o quedarse noqueado de cansancio",
    "example": "Hacía tanto bochorno en el desfile que una señora passed out."
  },
  {
    "term": "Pass up",
    "pron": "/pæs ʌp/",
    "meaning": "Dejar ir una oferta o desaprovechar una oportunidad de oro",
    "example": "Esa oferta de trabajo era tan buena que no podía pass it up."
  },
  {
    "term": "Patch up",
    "pron": "/pætʃ ʌp/",
    "meaning": "Parchar una llanta ponchada o limar asperezas con la pareja",
    "example": "El vulcanizador supo patch up la llanta en diez minutos."
  },
  {
    "term": "Pay back",
    "pron": "/peɪ bæk/",
    "meaning": "Devolver el dinero prestado o cobrarse una factura",
    "example": "Te juro que te pay back cada centavo el día de pago."
  },
  {
    "term": "Pay down",
    "pron": "/peɪ daʊn/",
    "meaning": "Abonar a capital para bajarle a la deuda grande",
    "example": "Con el aguinaldo voy a pay down la deuda del crédito automotriz."
  },
  {
    "term": "Pay off",
    "pron": "/peɪ ɔːf/",
    "meaning": "Dar frutos el esfuerzo o terminar de pagar la deuda",
    "example": "Tantas noches de estudio por fin paid off con el diploma."
  },
  {
    "term": "Pencil in",
    "pron": "/ˈpen.səl ɪn/",
    "meaning": "Anotar tentativamente una cita sujeta a confirmación",
    "example": "Te voy a pencil in para el martes a las cuatro de la tarde."
  },
  {
    "term": "Perk up",
    "pron": "/pɝːk ʌp/",
    "meaning": "Revivir y agarrar energía con un buen café mañanero",
    "example": "Me tomé un café negro y de volada perked up para el trabajo."
  },
  {
    "term": "Peter out",
    "pron": "/ˈpiː.t̬ɚ aʊt/",
    "meaning": "Irse agotando la emoción o apagarse poco a poco la fiesta",
    "example": "La emoción del partido fue petering out conforme pasaban los minutos."
  },
  {
    "term": "Phase in",
    "pron": "/feɪz ɪn/",
    "meaning": "Ir implementando poco a poco las nuevas reglas de tránsito",
    "example": "Van a phase in el nuevo sistema de transporte durante el año."
  },
  {
    "term": "Phase out",
    "pron": "/feɪz aʊt/",
    "meaning": "Ir retirando paulatinamente del mercado los billetes viejos",
    "example": "El banco va a phase out los billetes de esa denominación."
  },
  {
    "term": "Pick at",
    "pron": "/pɪk æt/",
    "meaning": "Comer sin ganas picoteando el plato como pajarito",
    "example": "El niño nomás was picking at su comida porque andaba desganado."
  },
  {
    "term": "Pick on",
    "pron": "/pɪk ɑːn/",
    "meaning": "Agarrar a alguien de su puerquito o tirarle carrilla pesada",
    "example": "Ya no te estés metiendo con él, no lo vayas a pick on más."
  },
  {
    "term": "Pick out",
    "pron": "/pɪk aʊt/",
    "meaning": "Escoger a detalle la mejor fruta o camisa",
    "example": "Ayúdame a pick out una buena corbata para la entrevista."
  },
  {
    "term": "Pick up",
    "pron": "/pɪk ʌp/",
    "meaning": "Recoger a alguien en el carro / contestar la llamada",
    "example": "Paso a pick you up a tu casa a las siete en punto."
  },
  {
    "term": "Pile in",
    "pron": "/paɪl ɪn/",
    "meaning": "Subirse en bola apretados a la batea de la camioneta",
    "example": "Todos los primos nos piled in en la batea de la troca para ir al río."
  },
  {
    "term": "Pile on",
    "pron": "/paɪl ɑːn/",
    "meaning": "Echar montón todos contra uno en una discusión",
    "example": "En cuanto cometió un error todos se pusieron a pile on contra él."
  },
  {
    "term": "Pipe down",
    "pron": "/paɪp daʊn/",
    "meaning": "¡Guarden silencio y cierren el pico un momento!",
    "example": "¡Pipe down chamacos, que no dejan escuchar las noticias!"
  },
  {
    "term": "Pitch in",
    "pron": "/pɪtʃ ɪn/",
    "meaning": "Entrarle al quite ayudando en la faena comunitaria",
    "example": "Si todos pitch in terminamos de limpiar el jardín en media hora."
  },
  {
    "term": "Play along",
    "pron": "/pleɪ əˈlɑːŋ/",
    "meaning": "Seguirle el juego o la corriente para ver en qué termina",
    "example": "Nomás síguele la corriente y play along para que no sospeche nada."
  },
  {
    "term": "Play down",
    "pron": "/pleɪ daʊn/",
    "meaning": "Restarle importancia a una metida de pata para calmar aguas",
    "example": "El vocero tried to play down el error en las cifras oficiales."
  },
  {
    "term": "Plug in",
    "pron": "/plʌɡ ɪn/",
    "meaning": "Enchufar el cargador a la toma de corriente",
    "example": "Plug in el celular al enchufe que ya le queda 5% de pila."
  },
  {
    "term": "Plump for",
    "pron": "/plʌmp fɔːr/",
    "meaning": "Decidirse finalmente por una de dos ricas opciones de comida",
    "example": "Al final me decidí y plumped for los chiles en nogada."
  },
  {
    "term": "Point out",
    "pron": "/pɔɪnt aʊt/",
    "meaning": "Señalar un detalle importante que nadie había visto",
    "example": "El arquitecto pointed out una fisura peligrosa en el muro."
  },
  {
    "term": "Poke around",
    "pron": "/poʊk əˈraʊnd/",
    "meaning": "Andar curioseando y hurgando entre los tiliches viejos del desván",
    "example": "Me puse a poke around en el bazar y encontré un tocadiscos vintage."
  },
  {
    "term": "Polish up",
    "pron": "/ˈpɑː.lɪʃ ʌp/",
    "meaning": "Darle una pulida a tus habilidades o sacarle brillo a algo",
    "example": "Quiero polish up mi pronunciación antes de irme a Canadá."
  },
  {
    "term": "Pony up",
    "pron": "/ˈpoʊ.ni ʌp/",
    "meaning": "Mocarse con la lana que te toca cooperar",
    "example": "Es hora de pony up tu parte de la cuenta de los tacos."
  },
  {
    "term": "Pop in",
    "pron": "/pɑːp ɪn/",
    "meaning": "Echar una vuelta rápida de cinco minutos a la tienda",
    "example": "I will pop in a la panadería a comprar unas conchas de chocolate."
  },
  {
    "term": "Pop out",
    "pron": "/pɑːp aʊt/",
    "meaning": "Botar de repente / salir un segundo a la tiendita",
    "example": "Voy a pop out al Oxxo a comprar un refresco, ahorita regreso."
  },
  {
    "term": "Pop up",
    "pron": "/pɑːp ʌp/",
    "meaning": "Aparecerse de la nada una ventana molesta en la pantalla",
    "example": "Esa ventana de anuncio popped up de repente en el navegador."
  },
  {
    "term": "Pore over",
    "pron": "/pɔːr ˈoʊ.vɚ/",
    "meaning": "Estudiar minuciosamente con lupa las letras chiquitas del contrato",
    "example": "El abogado estuvo poring over las cláusulas del contrato toda la tarde."
  },
  {
    "term": "Power down",
    "pron": "/ˈpaʊ.ɚ daʊn/",
    "meaning": "Apagar la máquina industrial de forma segura",
    "example": "Antes de salir del taller acuérdate de power down los tornos."
  },
  {
    "term": "Power up",
    "pron": "/ˈpaʊ.ɚ ʌp/",
    "meaning": "Encender el generador de luz para iluminar el escenario",
    "example": "Vamos a power up la planta de luz para el sonido del baile."
  },
  {
    "term": "Press on",
    "pron": "/pres ɑːn/",
    "meaning": "Seguir marchando adelante a pesar del cansancio y la lluvia",
    "example": "A pesar del frío canijo tuvimos que press on hasta llegar al campamento."
  },
  {
    "term": "Pull apart",
    "pron": "/pʊl əˈpɑːrt/",
    "meaning": "Separar a dos compas que se estaban agarrando a golpes",
    "example": "Los vecinos tuvieron que pull apart a los dos que se estaban peleando."
  },
  {
    "term": "Pull away",
    "pron": "/pʊl əˈweɪ/",
    "meaning": "Arrancar el camión alejándose de la parada",
    "example": "El autobús pulled away justo cuando iba corriendo a alcanzarlo."
  },
  {
    "term": "Pull back",
    "pron": "/pʊl bæk/",
    "meaning": "Replegarse las tropas o recular en una negociación",
    "example": "Viendo la desventaja el general ordenó pull back a sus soldados."
  },
  {
    "term": "Pull down",
    "pron": "/pʊl daʊn/",
    "meaning": "Demoler una barda cuarteada por el sismo",
    "example": "Tuvieron que pull down la barda cuarteada antes de que se cayera."
  },
  {
    "term": "Pull off",
    "pron": "/pʊl ɔːf/",
    "meaning": "Lograr una hazaña complicadísima contra todo pronóstico",
    "example": "Estaba bien difícil pero lograron pull off la victoria en el último minuto."
  },
  {
    "term": "Pull out",
    "pron": "/pʊl aʊt/",
    "meaning": "Sacar algo del bolsillo / retirarse de una inversión",
    "example": "Decidió pull out su dinero antes de que cayera la bolsa."
  },
  {
    "term": "Pull over",
    "pron": "/pʊl ˈoʊ.vɚ/",
    "meaning": "Orillarse en el acotamiento de la carretera",
    "example": "La patrulla me pidió que me pulled over para una revisión."
  },
  {
    "term": "Pull through",
    "pron": "/pʊl θruː/",
    "meaning": "Salir de peligro o librarla milagrosamente de una enfermedad",
    "example": "Los médicos dijeron que la operación fue un éxito y he will pull through."
  },
  {
    "term": "Pull up",
    "pron": "/pʊl ʌp/",
    "meaning": "Llegar en carro y estacionarse / caerle a un lugar",
    "example": "I'm pulling up a la casa, salte de una vez con tus cosas."
  },
  {
    "term": "Push ahead",
    "pron": "/pʊʃ əˈhed/",
    "meaning": "Seguir empujando el proyecto contra viento y marea",
    "example": "A pesar de la falta de presupuesto decidieron push ahead con la obra."
  },
  {
    "term": "Push around",
    "pron": "/pʊʃ əˈraʊnd/",
    "meaning": "Andar sobajando y mangoneando a la gente indefensa",
    "example": "No permitas que nadie te push around en el trabajo."
  },
  {
    "term": "Push back",
    "pron": "/pʊʃ bæk/",
    "meaning": "Posponer una junta para la otra semana o rechazar una orden",
    "example": "Tuvimos que push back la fecha del evento por el mal tiempo."
  },
  {
    "term": "Push for",
    "pron": "/pʊʃ fɔːr/",
    "meaning": "Presionar insistiendo para conseguir un aumento de sueldo",
    "example": "El sindicato is pushing for un aumento salarial justo para los obreros."
  },
  {
    "term": "Put across",
    "pron": "/pʊt əˈkrɑːs/",
    "meaning": "Transmitir un mensaje con contundencia y elocuencia",
    "example": "El líder supo put across sus demandas con mucha claridad."
  },
  {
    "term": "Put aside",
    "pron": "/pʊt əˈsaɪd/",
    "meaning": "Guardar un dinerito bajo el colchón para las emergencias",
    "example": "Es bueno put aside unos pesitos cada quincena por si las moscas."
  },
  {
    "term": "Put away",
    "pron": "/pʊt əˈweɪ/",
    "meaning": "Guardar las cosas en su lugar después de usarlas",
    "example": "Lava los trastes y put away las ollas en la alacena."
  },
  {
    "term": "Put back",
    "pron": "/pʊt bæk/",
    "meaning": "Regresar la herramienta a su caja donde la encontraste",
    "example": "Put back el martillo en la caja de herramientas cuando termines."
  },
  {
    "term": "Put down",
    "pron": "/pʊt daʊn/",
    "meaning": "Hacer menos a alguien con burlas / soltar un objeto",
    "example": "No dejes que nadie te put down por cómo hablas."
  },
  {
    "term": "Put forward",
    "pron": "/pʊt ˈfɔːr.wɚd/",
    "meaning": "Proponer una solución innovadora en la junta de consejo",
    "example": "El arquitecto put forward una propuesta sustentable muy moderna."
  },
  {
    "term": "Put off",
    "pron": "/pʊt ɔːf/",
    "meaning": "Dejar las cosas para mañana / postergar la desidia",
    "example": "Ya no put off esa ida con el dentista, atiéndete de una vez."
  },
  {
    "term": "Put on",
    "pron": "/pʊt ɑːn/",
    "meaning": "Ponerse la chamarra / encender música",
    "example": "Put on una chamarrita que afuera está calando el frío."
  },
  {
    "term": "Put out",
    "pron": "/pʊt aʊt/",
    "meaning": "Apagar una fogata o un cigarro / causarle molestias a alguien",
    "example": "Asegúrate de put out la fogata antes de dormir."
  },
  {
    "term": "Put up with",
    "pron": "/pʊt ʌp wɪð/",
    "meaning": "Tolerar o aguantarse las impertinencias de alguien pesado",
    "example": "Ya no puedo put up with los berrinches de ese vecino ruidoso."
  },
  {
    "term": "Queue up",
    "pron": "/kjuː ʌp/",
    "meaning": "Formarse ordenadamente en la fila de las tortillas",
    "example": "Había un gentío queued up esperando a que abrieran la taquilla."
  },
  {
    "term": "Quiet down",
    "pron": "/ˈkwaɪ.ət daʊn/",
    "meaning": "Bajarle al escándalo y guardar silencio",
    "example": "¡Quiet down muchachos, que ya empezó la película!"
  },
  {
    "term": "Rake in",
    "pron": "/reɪk ɪn/",
    "meaning": "Llevarse la lana en carretilla por un negociazo",
    "example": "Con la venta de playeras en el concierto lograron rake in una fortuna."
  },
  {
    "term": "Ramp up",
    "pron": "/ræmp ʌp/",
    "meaning": "Acelerar a fondo la producción para entregar a tiempo",
    "example": "La fábrica had to ramp up la producción antes de las fiestas decembrinas."
  },
  {
    "term": "Rat on",
    "pron": "/ræt ɑːn/",
    "meaning": "Chismear o acusar de soplón a un compa con la autoridad",
    "example": "El vato ratted on sus cómplices para que le rebajaran la pena."
  },
  {
    "term": "Rattle off",
    "pron": "/ˈræt̬.əl ɔːf/",
    "meaning": "Recitar de memoria como perico las capitales de los estados",
    "example": "El chamaco can rattle off todos los estados de la república sin dudar."
  },
  {
    "term": "Reach out to",
    "pron": "/riːtʃ aʊt tuː/",
    "meaning": "Contactar a un conocido para pedir un favor o saludar",
    "example": "I will reach out to mi compadre para ver si sabe de alguna vacante."
  },
  {
    "term": "Read up on",
    "pron": "/riːd ʌp ɑːn/",
    "meaning": "Empaparse leyendo sobre la historia de la Revolución Mexicana",
    "example": "Tengo que read up on la historia de México para mi examen final."
  },
  {
    "term": "Rein in",
    "pron": "/reɪn ɪn/",
    "meaning": "Meter en cintura los gastos desmedidos del hogar",
    "example": "Hay que rein in los gastos hormiga si queremos ahorrar para las vacaciones."
  },
  {
    "term": "Rely on",
    "pron": "/rɪˈlaɪ ɑːn/",
    "meaning": "Tener fe y confiar ciegamente en una persona leal",
    "example": "Siempre puedes rely on tus mejores amigos en las buenas y en las malas."
  },
  {
    "term": "Ride out",
    "pron": "/raɪd aʊt/",
    "meaning": "Aguantar vara esperando a que pase el vendaval o la crisis",
    "example": "Nos quedamos en casa para ride out el huracán bajo techo seguro."
  },
  {
    "term": "Ring up",
    "pron": "/rɪŋ ʌp/",
    "meaning": "Marcar en la caja registradora los productos del mandado",
    "example": "La cajera del súper started to ring up todos los abarrotes."
  },
  {
    "term": "Rip off",
    "pron": "/rɪp ɔːf/",
    "meaning": "Cobrar un ojo de la cara / estafar descaradamente",
    "example": "Ese taxi me cobró el triple, it was a total rip off."
  },
  {
    "term": "Roll back",
    "pron": "/roʊl bæk/",
    "meaning": "Dar marcha atrás a una subida injusta de precios",
    "example": "La tienda had to roll back los precios por quejas de los clientes."
  },
  {
    "term": "Roll out",
    "pron": "/roʊl aʊt/",
    "meaning": "Lanzar al mercado una nueva versión o producto",
    "example": "Van a roll out la actualización de la app este fin de semana."
  },
  {
    "term": "Roll up",
    "pron": "/roʊl ʌp/",
    "meaning": "Arremangarse las mangas de la camisa para entrarle a la faena",
    "example": "Roll up tus mangas y ayúdame a amasar la harina para las conchas."
  },
  {
    "term": "Root for",
    "pron": "/ruːt fɔːr/",
    "meaning": "Echarle porras y buenas vibras a tu equipo favorito",
    "example": "Toda la familia está rooting for la selección mexicana de béisbol."
  },
  {
    "term": "Root out",
    "pron": "/ruːt aʊt/",
    "meaning": "Arrancar de raíz las malas yerbas del huerto",
    "example": "Tenemos que root out la corrupción desde la raíz sin contemplaciones."
  },
  {
    "term": "Rope in",
    "pron": "/roʊp ɪn/",
    "meaning": "Enredar o convencer a los amigos para que ayuden en la mudanza",
    "example": "Logré rope in a mis primos para que me ayuden a cargar el refrigerador."
  },
  {
    "term": "Round off",
    "pron": "/raʊnd ɔːf/",
    "meaning": "Redondear los centavos en el súper para donar al hospital",
    "example": "La cajera me preguntó si deseaba round off la cuenta para donar."
  },
  {
    "term": "Round up",
    "pron": "/raʊnd ʌp/",
    "meaning": "Juntar a toda la palomilla para armar la pachanga",
    "example": "Ayúdame a round up a los compas para irnos al estadio."
  },
  {
    "term": "Rub in",
    "pron": "/rʌb ɪn/",
    "meaning": "Echar en cara una derrota o error del pasado",
    "example": "Ya sé que me equivoqué, no me lo tienes que rub in a cada rato."
  },
  {
    "term": "Rub off on",
    "pron": "/rʌb ɔːf ɑːn/",
    "meaning": "Pegársele a uno las buenas costumbres o el entusiasmo de un compa",
    "example": "Su buena vibra y optimismo ended up rubbing off on todos nosotros."
  },
  {
    "term": "Rule out",
    "pron": "/ruːl aʊt/",
    "meaning": "Descartar una hipótesis o posibilidad por completo",
    "example": "El doctor ya ruled out cualquier fractura en la rodilla."
  },
  {
    "term": "Run across",
    "pron": "/rʌn əˈkrɔːs/",
    "meaning": "Encontrarse por casualidad un tesoro o documento viejo",
    "example": "Me ran across tu certificado de primaria guardado en el baúl."
  },
  {
    "term": "Run after",
    "pron": "/rʌn ˈæf.tɚ/",
    "meaning": "Corretear al camión que se fue sin esperarte",
    "example": "Tuve que run after el camión de la basura porque no dejé las bolsas."
  },
  {
    "term": "Run away",
    "pron": "/rʌn əˈweɪ/",
    "meaning": "Poner pies en polvorosa escapando de un problema",
    "example": "El perro se asustó con los cohetes y ran away por la calle."
  },
  {
    "term": "Run down",
    "pron": "/rʌn daʊn/",
    "meaning": "Andar desguanzado de salud o hablar pestes de la gente",
    "example": "Ando bien run down por tanta desvelada en el trabajo."
  },
  {
    "term": "Run into",
    "pron": "/rʌn ˈɪn.tuː/",
    "meaning": "Toparse de frente con un conocido en el súper",
    "example": "Adivina a quién me ran into en el centro comercial hoy."
  },
  {
    "term": "Run out of",
    "pron": "/rʌn aʊt əv/",
    "meaning": "Quedarse sin gas, sin pila o sin mercancía",
    "example": "Se nos ran out of gasolina a mitad del desierto."
  },
  {
    "term": "Run over",
    "pron": "/rʌn ˈoʊ.vɚ/",
    "meaning": "Atropellar o pasarse del tiempo límite",
    "example": "El expositor se ran over diez minutos de su turno."
  },
  {
    "term": "Run through",
    "pron": "/rʌn θruː/",
    "meaning": "Darle una repasada rápida al guion de la obra de teatro",
    "example": "Vamos a run through la presentación una vez más antes de entrar."
  },
  {
    "term": "Sail through",
    "pron": "/seɪl θruː/",
    "meaning": "Pasar el examen como Juan por su casa sin despeinarse",
    "example": "Estudió tanto que sailed through la prueba de manejo."
  },
  {
    "term": "Save up",
    "pron": "/seɪv ʌp/",
    "meaning": "Ahorrar peso sobre peso para comprarse algo grande",
    "example": "Estoy saving up para dar el enganche de mi casita."
  },
  {
    "term": "Scale back",
    "pron": "/skeɪl bæk/",
    "meaning": "Recortarle a los gastos o reducir el tamaño de la fiesta",
    "example": "Tuvimos que scale back la fiesta y nomás invitar a los más cercanos."
  },
  {
    "term": "Scale down",
    "pron": "/skeɪl daʊn/",
    "meaning": "Bajarle de escala al tamaño de un edificio o proyecto",
    "example": "Tuvieron que scale down el proyecto por falta de materiales."
  },
  {
    "term": "Scale up",
    "pron": "/skeɪl ʌp/",
    "meaning": "Llevar a gran escala la producción de tortillas artesanales",
    "example": "Con la máquina nueva logramos scale up la producción al doble."
  },
  {
    "term": "Scare away",
    "pron": "/sker əˈweɪ/",
    "meaning": "Espantar a los clientes con precios exagerados",
    "example": "Con esos precios tan caros vas a scare away a toda la clientela."
  },
  {
    "term": "Scare off",
    "pron": "/sker ɔːf/",
    "meaning": "Ahuyentar a los pájaros de la milpa con un espantapájaros",
    "example": "Pusimos un espantapájaros para scare off a los cuervos de la milpa."
  },
  {
    "term": "Scrape by",
    "pron": "/skreɪp baɪ/",
    "meaning": "Apenas si librarla raspando con las calificaciones o dinero",
    "example": "Apenas si managed to scrape by con un seis de panzazo."
  },
  {
    "term": "Screw up",
    "pron": "/skruː ʌp/",
    "meaning": "Regarla bien gacho o meter la pata hasta el fondo",
    "example": "I really screwed up borrando ese archivo sin tener copia de respaldo."
  },
  {
    "term": "See through",
    "pron": "/siː θruː/",
    "meaning": "Verle las malas mañas a alguien o no dejarse engañar",
    "example": "De volada I saw through sus mentiras baratas y no le creí nada."
  },
  {
    "term": "See to",
    "pron": "/siː tuː/",
    "meaning": "Encargarse personalmente de que todo salga a pedir de boca",
    "example": "No te preocupes por la comida, I will see to it personalmente."
  },
  {
    "term": "Sell off",
    "pron": "/sel ɔːf/",
    "meaning": "Rematar mercancía vieja a precio de ganga para hacer espacio",
    "example": "Tuvieron que sell off los saldos de ropa de invierno a mitad de precio."
  },
  {
    "term": "Sell out",
    "pron": "/sel aʊt/",
    "meaning": "Agotarse todas las entradas para el palenque o traicionar ideales",
    "example": "Los boletos para el palenque se sold out en menos de una hora."
  },
  {
    "term": "Set back",
    "pron": "/set bæk/",
    "meaning": "Retrasar el avance de una obra / costar una lana",
    "example": "La lluvia nos set back tres semanas en la construcción."
  },
  {
    "term": "Set off",
    "pron": "/set ɔːf/",
    "meaning": "Prender cuetes / detonar una alarma o partir de viaje",
    "example": "El humo de la carne asada set off la alarma de incendios."
  },
  {
    "term": "Set up",
    "pron": "/set ʌp/",
    "meaning": "Armar un changarro / tenderle una trampa a alguien",
    "example": "Lo arrestaron porque le set up una trampa con pruebas falsas."
  },
  {
    "term": "Settle down",
    "pron": "/ˈset̬.əl daʊn/",
    "meaning": "Sentar cabeza / calmarse o establecerse en familia",
    "example": "Ya anduvo mucho de fiesta, ahora decidió settle down y casarse."
  },
  {
    "term": "Settle for",
    "pron": "/ˈset̬.əl fɔːr/",
    "meaning": "Conformarse con poco teniendo para más",
    "example": "Eres muy chingón en tu jale, no te conformes ni settle for menos."
  },
  {
    "term": "Settle in",
    "pron": "/ˈset̬.əl ɪn/",
    "meaning": "Acomodarse y agarrarle el modo al nuevo hogar",
    "example": "Ya nos tomó unas semanas settle in en el nuevo vecindario."
  },
  {
    "term": "Settle up",
    "pron": "/ˈset̬.əl ʌp/",
    "meaning": "Ajustar cuentas saldando todas las deudas pendientes",
    "example": "Vamos a settle up lo que te debo de la gasolina del viaje."
  },
  {
    "term": "Shake off",
    "pron": "/ʃeɪk ɔːf/",
    "meaning": "Sacudirse la mala vibra o quitarse de encima una gripe",
    "example": "Tómate un té caliente para shake off ese resfriado canijo."
  },
  {
    "term": "Shake up",
    "pron": "/ʃeɪk ʌp/",
    "meaning": "Dar un vuelco sacudiendo la estructura de la empresa",
    "example": "El nuevo gerente vino a shake up todos los métodos de trabajo."
  },
  {
    "term": "Shoot down",
    "pron": "/ʃuːt daʊn/",
    "meaning": "Batear o desechar una propuesta de tajo sin considerarla",
    "example": "El comité shot down la propuesta porque salía demasiado costosa."
  },
  {
    "term": "Shop around",
    "pron": "/ʃɑːp əˈraʊnd/",
    "meaning": "Cotizar en varios puestos para buscar el mejor precio",
    "example": "Antes de comprar la tele deberías shop around en varias tiendas."
  },
  {
    "term": "Show off",
    "pron": "/ʃoʊ ɔːf/",
    "meaning": "Farolear / presumir algo nuevo para llamar la atención",
    "example": "Le encanta show off su carro deportivo nuevo en la cuadra."
  },
  {
    "term": "Show up",
    "pron": "/ʃoʊ ʌp/",
    "meaning": "Caerle a la cita o aparecerse cuando nadie lo esperaba",
    "example": "El cantante no quiso show up al evento y la gente se molestó."
  },
  {
    "term": "Shut down",
    "pron": "/ʃʌt daʊn/",
    "meaning": "Apagar un servidor o clausurar un negocio",
    "example": "Tuvieron que shut down la fábrica por violar normas de seguridad."
  },
  {
    "term": "Shut off",
    "pron": "/ʃʌt ɔːf/",
    "meaning": "Cortar la llave de paso del agua por una fuga",
    "example": "Acuérdate de shut off la llave de paso del gas antes de salir de viaje."
  },
  {
    "term": "Shut out",
    "pron": "/ʃʌt aʊt/",
    "meaning": "Dejar en ceros y blanquear al equipo rival en el partido",
    "example": "El portero logró shut out al rival atajando todos los disparos."
  },
  {
    "term": "Shut up",
    "pron": "/ʃʌt ʌp/",
    "meaning": "Callarse la boca / cerrar el pico",
    "example": "Le pidieron que shut up para poder escuchar la conferencia."
  },
  {
    "term": "Sign in",
    "pron": "/saɪn ɪn/",
    "meaning": "Iniciar sesión en una app o firmar la entrada",
    "example": "Tienes que sign in con tu correo institucional para ingresar."
  },
  {
    "term": "Sign off",
    "pron": "/saɪn ɔːf/",
    "meaning": "Despedirse de la transmisión de radio mandando saludos",
    "example": "El locutor signed off agradeciendo a toda la audiencia por sintonizar."
  },
  {
    "term": "Sign up",
    "pron": "/saɪn ʌp/",
    "meaning": "Anotarse en la lista del torneo o inscribirse al gimnasio",
    "example": "Me signed up en el gimnasio de boxeo para ponerme en forma."
  },
  {
    "term": "Single out",
    "pron": "/ˈsɪŋ.ɡəl aʊt/",
    "meaning": "Escoger o señalar a alguien en particular entre la multitud",
    "example": "El maestro singled out a Pedro por su excelente desempeño en clase."
  },
  {
    "term": "Sink in",
    "pron": "/sɪŋk ɪn/",
    "meaning": "Caer el veinte de una noticia fuerte o asimilar la verdad",
    "example": "Tardó varios días en sink in que se había ganado la lotería."
  },
  {
    "term": "Sit back",
    "pron": "/sɪt bæk/",
    "meaning": "Ponerse cómodo en el sillón a disfrutar la función",
    "example": "Sit back, relájate y disfruta del partido con unas palomitas."
  },
  {
    "term": "Sit through",
    "pron": "/sɪt θruː/",
    "meaning": "Chutarse una película aburridísima de tres horas hasta el final",
    "example": "Tuve que sit through un discurso de dos horas bien enfadoso."
  },
  {
    "term": "Size up",
    "pron": "/saɪz ʌp/",
    "meaning": "Tantearle el agua a los camotes o medir las fuerzas del rival",
    "example": "Los dos boxeadores se estuvieron sizing up en el primer asalto."
  },
  {
    "term": "Sleep in",
    "pron": "/sliːp ɪn/",
    "meaning": "Quedarse dormido hasta tarde el domingo sin despertador",
    "example": "Los domingos me encanta sleep in hasta el mediodía bien a gusto."
  },
  {
    "term": "Sleep off",
    "pron": "/sliːp ɔːf/",
    "meaning": "Dormirse la borrachera para despertar fresco al día siguiente",
    "example": "Se fue a acostar temprano para sleep off la cruda de la fiesta."
  },
  {
    "term": "Sleep over",
    "pron": "/sliːp ˈoʊ.vɚ/",
    "meaning": "Quedarse a dormir en casa de los primos en una pijamada",
    "example": "Los niños le pidieron permiso a su mamá para sleep over con sus primos."
  },
  {
    "term": "Slip up",
    "pron": "/slɪp ʌp/",
    "meaning": "Tener un resbalón o descuido involuntario en la chamba",
    "example": "Cualquiera can slip up de vez en cuando, no te martirices."
  },
  {
    "term": "Slow down",
    "pron": "/sloʊ daʊn/",
    "meaning": "Bajarle a la velocidad o llevarse las cosas con más calma",
    "example": "¡Slow down compa, que la curva está muy cerrada!"
  },
  {
    "term": "Smash up",
    "pron": "/smæʃ ʌp/",
    "meaning": "Hacer pedazos un jarrón de talavera por descuido",
    "example": "El carro quedó bien smashed up después del encontronazo."
  },
  {
    "term": "Snap out of",
    "pron": "/snæp aʊt əv/",
    "meaning": "¡Reacciona! Salir del trance o de la depresión",
    "example": "¡Snap out of it! Tienes que reaccionar y ponerte las pilas ya."
  },
  {
    "term": "Snap up",
    "pron": "/snæp ʌp/",
    "meaning": "Arrebatar las ofertas de temporada antes de que vuelen",
    "example": "La gente rushed to snap up las pantallas en barata del Buen Fin."
  },
  {
    "term": "Sneak in",
    "pron": "/sniːk ɪn/",
    "meaning": "Meterse de contrabando al concierto sin pagar boleto",
    "example": "Los chamacos managed to sneak in al cine por la puerta trasera."
  },
  {
    "term": "Sneak out",
    "pron": "/sniːk aʊt/",
    "meaning": "Salirse por la ventana a escondidas sin que los papás se enteren",
    "example": "El chamaco tried to sneak out a la fiesta por la puerta trasera."
  },
  {
    "term": "Soak up",
    "pron": "/soʊk ʌp/",
    "meaning": "Absorber como esponja los conocimientos o asolearse",
    "example": "Aprovecha la estancia en el taller para soak up toda la experiencia."
  },
  {
    "term": "Sort out",
    "pron": "/sɔːrt aʊt/",
    "meaning": "Poner orden en el relajo o arreglar un problema",
    "example": "Vamos a sentarnos a sort out este embrollo pacíficamente."
  },
  {
    "term": "Spark off",
    "pron": "/spɑːrk ɔːf/",
    "meaning": "Detonar un pleito mayúsculo por una tontería",
    "example": "Un simple empujón sparked off tremendo zafarrancho en la tribuna."
  },
  {
    "term": "Speak up",
    "pron": "/spiːk ʌp/",
    "meaning": "Hablar más fuerte porque no se oye / alzar la voz",
    "example": "Speak up que hay mucho ruido en el salón y no te escucho."
  },
  {
    "term": "Speed up",
    "pron": "/spiːd ʌp/",
    "meaning": "Meterle pata al acelerador o apurar el paso",
    "example": "Hay que speed up si queremos alcanzar el último camión."
  },
  {
    "term": "Spell out",
    "pron": "/spel aʊt/",
    "meaning": "Explicar con peras y manzanas algo para que no queden dudas",
    "example": "Te lo tengo que spell out paso a pasito para que no te equivoques."
  },
  {
    "term": "Spill over",
    "pron": "/spɪl ˈoʊ.vɚ/",
    "meaning": "Desparramarse el caldo o extenderse el pleito a la calle",
    "example": "El pleito del bar spilled over a la calle y se armó la campal."
  },
  {
    "term": "Spit out",
    "pron": "/spɪt aʊt/",
    "meaning": "Escupir la sopa caliente o soltar lo que tienes atorado en la garganta",
    "example": "¡Spit it out ya! Di de una vez qué fue lo que rompiste."
  },
  {
    "term": "Splash out",
    "pron": "/splæʃ aʊt/",
    "meaning": "Echar la casa por la ventana gastando sin medida en la fiesta",
    "example": "Los papás decided to splash out en los quince años de su hija."
  },
  {
    "term": "Split up",
    "pron": "/splɪt ʌp/",
    "meaning": "Separarse en parejas o cortar la relación amorosa",
    "example": "Después de diez años de casados decidieron split up por las buenas."
  },
  {
    "term": "Spread out",
    "pron": "/spred aʊt/",
    "meaning": "Desplegar el mapa en la mesa o dispersarse por el bosque",
    "example": "Los rescatistas se spread out por toda la sierra buscando al excursionista."
  },
  {
    "term": "Spring up",
    "pron": "/sprɪŋ ʌp/",
    "meaning": "Brotar como hongos negocios nuevos por todos lados",
    "example": "Puestos de café han sprung up por toda la colonia como hongos."
  },
  {
    "term": "Square away",
    "pron": "/skwer əˈweɪ/",
    "meaning": "Dejar todo en orden, cuadrado y resuelto sin pendientes",
    "example": "Dejamos todo squared away en la oficina antes de salir de puente."
  },
  {
    "term": "Stamp out",
    "pron": "/stæmp aʊt/",
    "meaning": "Extinguir un fuego pisándolo con las botas o erradicar una plaga",
    "example": "Lograron stamp out la plaga de gusanos en los sembradíos de maíz."
  },
  {
    "term": "Stand by",
    "pron": "/stænd baɪ/",
    "meaning": "Quedarse en guardia listo para entrar en acción",
    "example": "El equipo médico está en stand by para cualquier urgencia."
  },
  {
    "term": "Stand down",
    "pron": "/stænd daʊn/",
    "meaning": "Dejar el puesto de mando o retirarse de la guardia",
    "example": "El capitán le ordenó al centinela stand down tras cumplir su guardia."
  },
  {
    "term": "Stand for",
    "pron": "/stænd fɔːr/",
    "meaning": "Representar las iniciales o no tolerar faltas de respeto",
    "example": "Yo no stand for groserías ni faltas de respeto en mi casa."
  },
  {
    "term": "Stand in for",
    "pron": "/stænd ɪn fɔːr/",
    "meaning": "Hacer el paro sustituyendo al compañero que faltó por enfermedad",
    "example": "Tuve que stand in for mi compañero que se enfermó del estómago."
  },
  {
    "term": "Stand out",
    "pron": "/stænd aʊt/",
    "meaning": "Resaltar sobre los demás por talento o presencia",
    "example": "Ese muchacho siempre stands out por su disciplina para entrenar."
  },
  {
    "term": "Stand up to",
    "pron": "/stænd ʌp tuː/",
    "meaning": "Ponerse al brinco y plantarle cara al abusador sin miedo",
    "example": "Por fin se armó de valor y stood up to al bravucón del salón."
  },
  {
    "term": "Start off",
    "pron": "/stɑːrt ɔːf/",
    "meaning": "Arrancar la mañana con un buen café de olla caliente",
    "example": "Me gusta start off el día con un cafecito de olla y un pan dulce."
  },
  {
    "term": "Start over",
    "pron": "/stɑːrt ˈoʊ.vɚ/",
    "meaning": "Hacer borrón y cuenta nueva y empezar desde cero",
    "example": "Si el dibujo quedó chueco es mejor start over en hoja limpia."
  },
  {
    "term": "Start up",
    "pron": "/stɑːrt ʌp/",
    "meaning": "Echar a andar un negocio propio o arrancar el motor de la lancha",
    "example": "Los jóvenes se asociaron para start up una taquería gourmet."
  },
  {
    "term": "Stave off",
    "pron": "/steɪv ɔːf/",
    "meaning": "Sortear o torear una crisis económica temporalmente",
    "example": "Con ese préstamo familiar lograron stave off la quiebra del negocio."
  },
  {
    "term": "Stay up",
    "pron": "/steɪ ʌp/",
    "meaning": "Desvelarse hasta las tantas de la madrugada viendo series",
    "example": "Me quedé stayed up hasta las tres terminando la maqueta escolar."
  },
  {
    "term": "Step aside",
    "pron": "/step əˈsaɪd/",
    "meaning": "Hacerse a un lado para dejar pasar a los que van saliendo",
    "example": "El director decidió step aside para darle paso a las nuevas generaciones."
  },
  {
    "term": "Step back",
    "pron": "/step bæk/",
    "meaning": "Dar un paso atrás para ver el panorama completo",
    "example": "Hay que step back y analizar la situación con la cabeza fría."
  },
  {
    "term": "Step down",
    "pron": "/step daʊn/",
    "meaning": "Renunciar a un cargo importante o dejarle el puesto a otro",
    "example": "El presidente del club tuvo que step down por broncas de salud."
  },
  {
    "term": "Step forward",
    "pron": "/step ˈfɔːr.wɚd/",
    "meaning": "Dar un paso al frente ofreciéndose como voluntario",
    "example": "Varios vecinos stepped forward para donar víveres a los damnificados."
  },
  {
    "term": "Step in",
    "pron": "/step ɪn/",
    "meaning": "Meter las manos para frenar un pleito o intervenir",
    "example": "El árbitro tuvo que step in antes de que se agarraran a golpes."
  },
  {
    "term": "Step on it",
    "pron": "/step ɑːn ɪt/",
    "meaning": "¡Písale chancla! Acelerar el carro con prisa",
    "example": "Step on it chofer, que si no le metes pata pierdo el camión a Puebla."
  },
  {
    "term": "Step up",
    "pron": "/step ʌp/",
    "meaning": "Dar un paso al frente y fajarse los pantalones como líder",
    "example": "Es momento de step up y demostrar de qué estás hecho."
  },
  {
    "term": "Stick around",
    "pron": "/stɪk əˈraʊnd/",
    "meaning": "Quedarse un rato más conviviendo después de la fiesta",
    "example": "Stick around un rato más, al ratito van a partir el pastel."
  },
  {
    "term": "Stick out",
    "pron": "/stɪk aʊt/",
    "meaning": "Sobresalir como pulgar golpeado / llamar la atención",
    "example": "Con ese traje fluorescente vas a stick out entre toda la bola."
  },
  {
    "term": "Stick to",
    "pron": "/stɪk tuː/",
    "meaning": "Apegarse al plan original sin salirse por la tangente",
    "example": "Hay que stick to la receta al pie de la letra para que quede rica."
  },
  {
    "term": "Stir up",
    "pron": "/stɝː ʌp/",
    "meaning": "Moverle al atole en la olla o calentar los ánimos con cizaña",
    "example": "Ese vato cizañoso nomás vino a stir up pleitos en la familia."
  },
  {
    "term": "Stock up",
    "pron": "/stɑːk ʌp/",
    "meaning": "Surtirse de víveres en el súper antes de una tormenta",
    "example": "Fuimos al súper a stock up de víveres por la alerta de huracán."
  },
  {
    "term": "Stop by",
    "pron": "/stɑːp baɪ/",
    "meaning": "Darse una vuelta exprés por la tienda a comprar tortillas",
    "example": "Can you stop by la tienda y traerme un refresco bien frío?"
  },
  {
    "term": "Straighten out",
    "pron": "/ˈstreɪ.tən aʊt/",
    "meaning": "Enderezar el camino o aclarar los enredos financieros",
    "example": "Le tomó tiempo pero logró straighten out su situación con el SAT."
  },
  {
    "term": "Strike out",
    "pron": "/straɪk aʊt/",
    "meaning": "Poncharse en el béisbol con tres strikes o fracasar en un intento",
    "example": "El bateador estrella struck out con las bases llenas en la novena entrada."
  },
  {
    "term": "Suit up",
    "pron": "/suːt ʌp/",
    "meaning": "Uniformarse y ponerse la indumentaria de juego",
    "example": "Suit up muchachos, que en diez minutos salimos a la cancha."
  },
  {
    "term": "Sum up",
    "pron": "/sʌm ʌp/",
    "meaning": "Hacer un resumen ejecutivo sintetizando los puntos clave",
    "example": "Para sum up, el balance del año fue sumamente positivo para todos."
  },
  {
    "term": "Switch off",
    "pron": "/swɪtʃ ɔːf/",
    "meaning": "Desconectar la mente del trabajo y descansar el cerebro",
    "example": "Los fines de semana switch off por completo y no abro correos."
  },
  {
    "term": "Switch on",
    "pron": "/swɪtʃ ɑːn/",
    "meaning": "Encender las luces del árbol de navidad con alegría",
    "example": "En cuanto oscureció switched on las luces navideñas del jardín."
  },
  {
    "term": "Tack on",
    "pron": "/tæk ɑːn/",
    "meaning": "Agregar un anexo al final del documento o un costo adicional",
    "example": "Te quieren tack on una comisión por pagar con tarjeta; reclámales."
  },
  {
    "term": "Take aback",
    "pron": "/teɪk əˈbæk/",
    "meaning": "Dejar con el ojo cuadrado de la sorpresa a alguien",
    "example": "Su renuncia inesperada took everybody aback en la oficina."
  },
  {
    "term": "Take after",
    "pron": "/teɪk ˈæf.tɚ/",
    "meaning": "Heredar los gestos o el carácter de un pariente / salir igualito",
    "example": "El chamaco salió igualito y takes after a su papá en lo enojón."
  },
  {
    "term": "Take apart",
    "pron": "/teɪk əˈpɑːrt/",
    "meaning": "Desarmar pieza por pieza un motor o aparato",
    "example": "Le encanta take apart las licuadoras viejas para arreglarlas."
  },
  {
    "term": "Take away",
    "pron": "/teɪk əˈweɪ/",
    "meaning": "Pedir la comida para llevar a la casa o quitar un privilegio",
    "example": "Pedimos dos órdenes de tacos para take away y comer en familia."
  },
  {
    "term": "Take back",
    "pron": "/teɪk bæk/",
    "meaning": "Retractarse de un insulto o devolver mercancía con ticket",
    "example": "Retiro lo dicho, I take back lo que te dije cuando estaba molesto."
  },
  {
    "term": "Take down",
    "pron": "/teɪk daʊn/",
    "meaning": "Bajar un anuncio o derribar a un oponente en combate",
    "example": "El réferi marcó foul cuando logró take down a su rival."
  },
  {
    "term": "Take for",
    "pron": "/teɪk fɔːr/",
    "meaning": "Confundir a alguien o tomar a uno por tonto",
    "example": "¿Por quién me tomas? Don't take me for un tonto que no sabe nada."
  },
  {
    "term": "Take in",
    "pron": "/teɪk ɪn/",
    "meaning": "Darle posada a alguien necesitado o asimilar tanta información",
    "example": "Fue tanta sorpresa que todavía no logro take in todo lo sucedido."
  },
  {
    "term": "Take off",
    "pron": "/teɪk ɔːf/",
    "meaning": "Despegar el avión / quitarse la ropa o marcharse en friega",
    "example": "El avión está a punto de take off rumbo a Cancún."
  },
  {
    "term": "Take on",
    "pron": "/teɪk ɑːn/",
    "meaning": "Aceptar una chamba pesada o medirse a golpes con un rival",
    "example": "Decidió take on el reto de coordinar la sucursal completa."
  },
  {
    "term": "Take out",
    "pron": "/teɪk aʊt/",
    "meaning": "Sacar la basura al camión o invitar a cenar",
    "example": "No se te vaya a olvidar take out la basura antes de que pase el camión."
  },
  {
    "term": "Take over",
    "pron": "/teɪk ˈoʊ.vɚ/",
    "meaning": "Tomar el control de la empresa o asumir el volante",
    "example": "Déjame take over la manejada que tú ya te andas durmiendo."
  },
  {
    "term": "Take to",
    "pron": "/teɪk tuː/",
    "meaning": "Agarrarle cariño y gusto inmediato a una persona o actividad",
    "example": "El perrito took to mi abuelito desde el primer instante en que lo vio."
  },
  {
    "term": "Take up",
    "pron": "/teɪk ʌp/",
    "meaning": "Iniciar un nuevo pasatiempo o abarcar mucho espacio",
    "example": "Ese mueble grandote takes up casi toda la sala."
  },
  {
    "term": "Talk down to",
    "pron": "/tɔːk daʊn tuː/",
    "meaning": "Hablarle a alguien con aires de grandeza sobajándolo",
    "example": "No permitas que nadie te talk down to como si fueras un chamaco."
  },
  {
    "term": "Talk into",
    "pron": "/tɔːk ˈɪn.tuː/",
    "meaning": "Convencer o marear a alguien para que acepte algo",
    "example": "Mis amigos me lograron talk into ir a la fiesta con ellos."
  },
  {
    "term": "Talk out of",
    "pron": "/tɔːk aʊt əv/",
    "meaning": "Hacer entrar en razón a alguien para que no cometa una locura",
    "example": "Su hermano lo logró talk out of vender su carro para apostar."
  },
  {
    "term": "Talk over",
    "pron": "/tɔːk ˈoʊ.vɚ/",
    "meaning": "Platicar largo y tendido sobre una decisión importante",
    "example": "Vamos a sentarnos a talk over los pros y contras de mudarnos."
  },
  {
    "term": "Tap into",
    "pron": "/tæp ˈɪn.tuː/",
    "meaning": "Aprovechar un recurso valioso o explotar un nuevo mercado",
    "example": "Esa empresa supo tap into el mercado hispano con mucho éxito."
  },
  {
    "term": "Tear down",
    "pron": "/ter daʊn/",
    "meaning": "Tirar una pared o demoler un edificio abandonado",
    "example": "Van a tear down esa bodega vieja para construir una plaza."
  },
  {
    "term": "Tear into",
    "pron": "/ter ˈɪn.tuː/",
    "meaning": "Entrarle con saña a la comida o ponerle una regañada feroz a alguien",
    "example": "Los niños tore into la piñata hasta quebrarla en pedazos."
  },
  {
    "term": "Tell apart",
    "pron": "/tel əˈpɑːrt/",
    "meaning": "Distinguir quién es quién entre dos hermanos gemelos idénticos",
    "example": "Son tan parecidos que es casi imposible tell them apart."
  },
  {
    "term": "Tell off",
    "pron": "/tel ɔːf/",
    "meaning": "Ponerle una buena regañada / cantar las verdades",
    "example": "La jefa de manzana se puso a tell off al vecino cochino."
  },
  {
    "term": "Tell on",
    "pron": "/tel ɑːn/",
    "meaning": "Acusar con la mamá a los hermanos que hicieron una travesura",
    "example": "Mi hermanito me amenazó con tell on me si no le prestaba mi bici."
  },
  {
    "term": "Think over",
    "pron": "/θɪŋk ˈoʊ.vɚ/",
    "meaning": "Consultarlo con la almohada y meditar bien la decisión",
    "example": "Déjame think over tu propuesta de negocio este fin de semana."
  },
  {
    "term": "Think through",
    "pron": "/θɪŋk θruː/",
    "meaning": "Meditar bien las consecuencias antes de dar el paso",
    "example": "Tienes que think through los riesgos antes de renunciar a tu trabajo."
  },
  {
    "term": "Think up",
    "pron": "/θɪŋk ʌp/",
    "meaning": "Idearse o sacarse de la chistera una solución creativa",
    "example": "El creativo managed to think up un eslogan pegajoso para el producto."
  },
  {
    "term": "Throw away",
    "pron": "/θroʊ əˈweɪ/",
    "meaning": "Tirar cosas a la basura o desperdiciar una oportunidad de oro",
    "example": "No vayas a throw away esa oportunidad de trabajo tan buena."
  },
  {
    "term": "Throw out",
    "pron": "/θroʊ aʊt/",
    "meaning": "Echar a la basura la comida podrida o expulsar a alguien del juego",
    "example": "El árbitro decided to throw out al jugador por conducta antideportiva."
  },
  {
    "term": "Throw up",
    "pron": "/θroʊ ʌp/",
    "meaning": "Vomitar las tripas por comida descompuesta o mareo",
    "example": "Le cayó tan pesada la comida grasosa que tuvo que throw up."
  },
  {
    "term": "Tidy up",
    "pron": "/ˈtaɪ.di ʌp/",
    "meaning": "Darle una arregladita rápida al cuarto antes de que vengan visitas",
    "example": "Vamos a tidy up la sala que ya mero llegan mis suegros."
  },
  {
    "term": "Tighten up",
    "pron": "/ˈtaɪ.tən ʌp/",
    "meaning": "Apretar las tuercas flojas o ajustar el cinturón de gastos",
    "example": "Hay que tighten up los tornillos de la llanta para que no baile."
  },
  {
    "term": "Tip off",
    "pron": "/tɪp ɔːf/",
    "meaning": "Darle el pitazo o soplar una advertencia confidencial a un amigo",
    "example": "Alguien tipped off a los comerciantes de que venía la inspección."
  },
  {
    "term": "Tire out",
    "pron": "/taɪr aʊt/",
    "meaning": "Dejar bien rendido y cansado a alguien tras una caminata pesada",
    "example": "La subida al cerro me tired out por completo las piernas."
  },
  {
    "term": "Tone down",
    "pron": "/toʊn daʊn/",
    "meaning": "Bajarle dos rayitas a la intensidad o moderar el tono",
    "example": "Tienes que tone down tu lenguaje cuando hables con los clientes."
  },
  {
    "term": "Top off",
    "pron": "/tɑːp ɔːf/",
    "meaning": "Rellenar la taza de café hasta arriba o coronar el festejo",
    "example": "¿Gusta que le top off su cafecito de olla con un chorrito más?"
  },
  {
    "term": "Touch down",
    "pron": "/tʌtʃ daʊn/",
    "meaning": "Tocar tierra el avión en la pista de aterrizaje o anotar gol",
    "example": "El avión touched down en el aeropuerto de Guadalajara a tiempo."
  },
  {
    "term": "Toy with",
    "pron": "/tɔɪ wɪð/",
    "meaning": "Jugar con una idea sin tomarla del todo en serio",
    "example": "He estado toying with la idea de abrir una cafetería en el centro."
  },
  {
    "term": "Track down",
    "pron": "/træk daʊn/",
    "meaning": "Rastrear o dar con el paradero de algo difícil de hallar",
    "example": "Por fin pude track down esa pieza de colección que tanto buscaba."
  },
  {
    "term": "Trade in",
    "pron": "/treɪd ɪn/",
    "meaning": "Entregar el carro viejo a cuenta de enganche de uno nuevo",
    "example": "Dio su troca a trade in para sacar una camioneta familiar nueva."
  },
  {
    "term": "Trip over",
    "pron": "/trɪp ˈoʊ.vɚ/",
    "meaning": "Tropezar con un bache o piedra y casi darse en la torre",
    "example": "I tripped over el cable del ventilador y casi tiro la tele."
  },
  {
    "term": "Try on",
    "pron": "/traɪ ɑːn/",
    "meaning": "Probarse la ropa en el vestidor para ver si te queda",
    "example": "Pásale al vestidor a try on ese pantalón a ver cómo te luce."
  },
  {
    "term": "Try out",
    "pron": "/traɪ aʊt/",
    "meaning": "Hacer pruebas a un aparato nuevo o audicionar para un equipo",
    "example": "Fue a try out para el equipo de básquetbol municipal."
  },
  {
    "term": "Tuck in",
    "pron": "/tʌk ɪn/",
    "meaning": "Fajar la camisa adentro del pantalón o arropar al niño en la cama",
    "example": "Tuck in tu camisa para que te veas bien presentado en la entrevista."
  },
  {
    "term": "Tune out",
    "pron": "/tuːn aʊt/",
    "meaning": "Desconectarse y no escuchar el ruido de la calle ni los regaños",
    "example": "Se puso los audífonos para tune out todo el relajo del camión."
  },
  {
    "term": "Turn around",
    "pron": "/tɝːn əˈraʊnd/",
    "meaning": "Darle la vuelta a la manzana o rescatar un negocio en picada",
    "example": "El nuevo administrador logró turn around las finanzas del club."
  },
  {
    "term": "Turn away",
    "pron": "/tɝːn əˈweɪ/",
    "meaning": "Rechazar en la entrada por falta de cupo o boleto",
    "example": "Tuvieron que turn away a mucha gente porque el antro se llenó."
  },
  {
    "term": "Turn back",
    "pron": "/tɝːn bæk/",
    "meaning": "Dar la media vuelta y regresar por el camino andado",
    "example": "El río creció tanto que tuvimos que turn back y buscar otra ruta."
  },
  {
    "term": "Turn down",
    "pron": "/tɝːn daʊn/",
    "meaning": "Bajarle al volumen del estéreo o batear una oferta",
    "example": "Bájale tantito y turn down la música que los vecinos van a llamar a la patrulla."
  },
  {
    "term": "Turn in",
    "pron": "/tɝːn ɪn/",
    "meaning": "Entregar tareas a tiempo o irse a tirar a la cama a dormir",
    "example": "Ya es bien noche compadre, ya me voy a turn in a descansar."
  },
  {
    "term": "Turn off",
    "pron": "/tɝːn ɔːf/",
    "meaning": "Apagar las luces o el aire acondicionado",
    "example": "Asegúrate de turn off todas las luces antes de cerrar el local."
  },
  {
    "term": "Turn on",
    "pron": "/tɝːn ɑːn/",
    "meaning": "Prender la tele o la luz",
    "example": "Turn on la tele para ver el resumen del partido."
  },
  {
    "term": "Turn out",
    "pron": "/tɝːn aʊt/",
    "meaning": "Resultar ser algo totalmente distinto al final",
    "example": "Pensamos que iba a llover pero turned out ser un día súper soleado."
  },
  {
    "term": "Turn over",
    "pron": "/tɝːn ˈoʊ.vɚ/",
    "meaning": "Voltear la tortilla en el comal para que se dore parejo",
    "example": "Acuérdate de turn over la carne en el asador para que no se queme."
  },
  {
    "term": "Turn up",
    "pron": "/tɝːn ʌp/",
    "meaning": "Subirle al volumen a la cumbia o aparecerse de imprevisto",
    "example": "¡Turn up esa canción que me gusta mucho!"
  },
  {
    "term": "Unpack",
    "pron": "/ʌnˈpæk/",
    "meaning": "Desempacar las maletas al llegar de vacaciones",
    "example": "Llegando al hotel vamos a unpack las maletas para cambiarnos."
  },
  {
    "term": "Urge on",
    "pron": "/ɝːdʒ ɑːn/",
    "meaning": "Animar con porras y gritos al corredor en los últimos metros",
    "example": "Toda la porra was urging him on para que cruzara la meta en primer lugar."
  },
  {
    "term": "Use up",
    "pron": "/juːz ʌp/",
    "meaning": "Gastarse hasta la última gota o terminarse todo",
    "example": "Mi hermano used up toda el agua caliente de la regadera."
  },
  {
    "term": "Usher in",
    "pron": "/ˈʌʃ.ɚ ɪn/",
    "meaning": "Dar la bienvenida con bombo y platillo a una nueva época",
    "example": "Los fuegos artificiales ushered in el año nuevo con júbilo."
  },
  {
    "term": "Veer off",
    "pron": "/vɪr ɔːf/",
    "meaning": "Dar un volantazo y salirse de la carretera para esquivar algo",
    "example": "El carro veered off del camino para esquivar a un perro callejero."
  },
  {
    "term": "Vent out",
    "pron": "/vent aʊt/",
    "meaning": "Desahogarse platicando las frustraciones con un buen cuate",
    "example": "Necesitaba un café para vent out todo el estrés acumulado de la semana."
  },
  {
    "term": "Venture out",
    "pron": "/ˈven.tʃɚ aʊt/",
    "meaning": "Aventurarse a salir a la intemperie a pesar del temporal",
    "example": "Nadie se atrevió a venture out con la tremenda granizada."
  },
  {
    "term": "Vouch for",
    "pron": "/vaʊtʃ fɔːr/",
    "meaning": "Meter las manos al fuego por alguien / dar fe de su honradez",
    "example": "Yo puedo vouch for él, lo conozco de años y es muy honrado."
  },
  {
    "term": "Wade through",
    "pron": "/weɪd θruː/",
    "meaning": "Cruzar con el agua hasta las rodillas una calle inundada",
    "example": "Tuvimos que wade through el agua para llegar a la banqueta seca."
  },
  {
    "term": "Wait around",
    "pron": "/weɪt əˈraʊnd/",
    "meaning": "Estar haciendo antesala aburrido esperando a que te atiendan",
    "example": "Nos tuvieron waiting around dos horas en la sala de espera del banco."
  },
  {
    "term": "Wait on",
    "pron": "/weɪt ɑːn/",
    "meaning": "Atender a los comensales en el restaurante con buen servicio",
    "example": "El mesero que nos waited on en la fonda fue súper atento y rápido."
  },
  {
    "term": "Wait up",
    "pron": "/weɪt ʌp/",
    "meaning": "Quedarse despierto esperando a que el chamaco llegue de la fiesta",
    "example": "Mi mamá always waits up despierta hasta que llego a la casa."
  },
  {
    "term": "Wake up",
    "pron": "/weɪk ʌp/",
    "meaning": "Despertarse de golpe con la alarma",
    "example": "Me tengo que wake up a las cinco de la mañana para evitar el tráfico."
  },
  {
    "term": "Walk away",
    "pron": "/wɑːk əˈweɪ/",
    "meaning": "Darse la media vuelta y retirarse de un mal negocio",
    "example": "Si el trato no te conviene es mejor walk away sin remordimientos."
  },
  {
    "term": "Walk off with",
    "pron": "/wɑːk ɔːf wɪð/",
    "meaning": "Llevarse por descuido o robo algo ajeno sin pagar",
    "example": "Alguien walked off with mi sombrilla en la entrada del restaurante."
  },
  {
    "term": "Walk out on",
    "pron": "/wɔːk aʊt ɑːn/",
    "meaning": "Dejar botado a alguien en pleno apuro o abandonar el hogar",
    "example": "No es de hombres walk out on la familia cuando las cosas se ponen difíciles."
  },
  {
    "term": "Warm to",
    "pron": "/wɔːrm tuː/",
    "meaning": "Irle agarrando el gusto y cariño a una persona o propuesta",
    "example": "Al principio dudaban pero fueron warming to la idea de mudarse."
  },
  {
    "term": "Warm up",
    "pron": "/wɔːrm ʌp/",
    "meaning": "Calentar el motor de la troca o calentar músculos antes del ejercicio",
    "example": "Deja warm up el carro unos minutos antes de meter velocidad."
  },
  {
    "term": "Wash away",
    "pron": "/wɑːʃ əˈweɪ/",
    "meaning": "Llevarse la corriente de agua la tierra del sembradío",
    "example": "La fuerte corriente washed away el puente de madera del arroyo."
  },
  {
    "term": "Wash down",
    "pron": "/wɑːʃ daʊn/",
    "meaning": "Bajarse los tacos con un refresco bien helado",
    "example": "Nos echamos unos tacos de carnitas y los washed down con horchata."
  },
  {
    "term": "Wash off",
    "pron": "/wɑːʃ ɔːf/",
    "meaning": "Quitarse la mugre o la grasa de las manos con estropajo",
    "example": "Usa jabón de pasta para wash off la grasa de mecánico de las manos."
  },
  {
    "term": "Wash up",
    "pron": "/wɑːʃ ʌp/",
    "meaning": "Lavarse las manos y la cara antes de pasar a la mesa",
    "example": "Vete a wash up que ya casi vamos a comer."
  },
  {
    "term": "Waste away",
    "pron": "/weɪst əˈweɪ/",
    "meaning": "Consumirse o enflacar mucho por falta de alimento o tristeza",
    "example": "El perro estaba wasting away hasta que lo rescataron y alimentaron."
  },
  {
    "term": "Watch out",
    "pron": "/wɑːtʃ aʊt/",
    "meaning": "¡Aguas! / ¡Ponte trucha con los peligros del camino!",
    "example": "¡Watch out con ese bache enorme en la calle!"
  },
  {
    "term": "Watch out for",
    "pron": "/wɑːtʃ aʊt fɔːr/",
    "meaning": "Cuidar las espaldas de un amigo o estar alerta con los baches",
    "example": "Watch out for los baches hondos en esa carretera federal."
  },
  {
    "term": "Water down",
    "pron": "/ˈwɑː.t̬ɚ daʊn/",
    "meaning": "Bautizar la leche echándole agua o suavizar un mensaje",
    "example": "Parece que watered down el jugo porque casi no sabe a naranja."
  },
  {
    "term": "Wear down",
    "pron": "/wer daʊn/",
    "meaning": "Desgastar la paciencia de alguien a base de tanta terquedad",
    "example": "Tanto insistir terminó por wear down la resistencia del jefe."
  },
  {
    "term": "Wear off",
    "pron": "/wer ɔːf/",
    "meaning": "Pasársele el efecto a la anestesia o a la pastilla",
    "example": "El efecto del calmante empezó a wear off y le dolió la muela."
  },
  {
    "term": "Wear out",
    "pron": "/wer aʊt/",
    "meaning": "Desgastar las suelas de los zapatos o quedar muerto de cansancio",
    "example": "Esa jornada de doce horas me left completely worn out."
  },
  {
    "term": "Weigh in",
    "pron": "/weɪ ɪn/",
    "meaning": "Subirse a la báscula en el pesaje oficial de boxeo u opinar",
    "example": "El campeón weighed in marcando el límite exacto de peso pluma."
  },
  {
    "term": "While away",
    "pron": "/waɪl əˈweɪ/",
    "meaning": "Pasar las horas muertas platicando en la mecedora del zaguán",
    "example": "Nos gusta while away las tardes calurosas echando aguas frescas."
  },
  {
    "term": "Wiggle out of",
    "pron": "/ˈwɪɡ.əl aʊt əv/",
    "meaning": "Hacerse escurridizo para zafarse de una bronca o compromiso",
    "example": "Siempre encuentra el modo de wiggle out of ayudar en la limpieza."
  },
  {
    "term": "Win over",
    "pron": "/wɪn ˈoʊ.vɚ/",
    "meaning": "Ganarse el corazón de los suegros con educación y respeto",
    "example": "Con su amabilidad y buen humor logró win over a toda la familia."
  },
  {
    "term": "Wind down",
    "pron": "/waɪnd daʊn/",
    "meaning": "Relajarse y desconectarse del estrés al final de la jornada",
    "example": "Me gusta wind down leyendo un libro antes de pegar el ojo."
  },
  {
    "term": "Wind up",
    "pron": "/waɪnd ʌp/",
    "meaning": "Terminar yendo a parar a un callejón sin salida",
    "example": "Si sigues manejando sin GPS vas a wind up en otro estado."
  },
  {
    "term": "Wipe down",
    "pron": "/waɪp daʊn/",
    "meaning": "Pasar un trapo húmedo para limpiar la mesa o mostrador",
    "example": "Pásale una jerga para wipe down la mesa de la cocina."
  },
  {
    "term": "Wipe out",
    "pron": "/waɪp aʊt/",
    "meaning": "Darse un azotón tremendo en la bicicleta o exterminar",
    "example": "El chavo se dio un tremendo wipe out en la patineta."
  },
  {
    "term": "Wise up",
    "pron": "/waɪz ʌp/",
    "meaning": "Abrir los ojos y dejar de dejarse ver la cara de tonto",
    "example": "Ya es hora de que wises up y veas que ese vato no te conviene."
  },
  {
    "term": "Wolf down",
    "pron": "/wʊlf daʊn/",
    "meaning": "Tragarse la comida de un bocado sin masticar por la prisa",
    "example": "Iba con tanta prisa que wolfed down su torta de jamón en dos minutos."
  },
  {
    "term": "Work off",
    "pron": "/wɝːk ɔːf/",
    "meaning": "Quemar las calorías de los tamales corriendo en el parque",
    "example": "Fui a trotar al bosque para work off las calorías de la cena navideña."
  },
  {
    "term": "Work out",
    "pron": "/wɝːk aʊt/",
    "meaning": "Hacer ejercicio en el gimnasio o resolverse bien las cosas",
    "example": "No te preocupes compa, vas a ver que todo va a work out a tu favor."
  },
  {
    "term": "Work up",
    "pron": "/wɝːk ʌp/",
    "meaning": "Abrirse el apetito tras una jornada de trabajo físico pesado",
    "example": "Cargar tabiques me helped me work up un apetito de león."
  },
  {
    "term": "Wrap up",
    "pron": "/ræp ʌp/",
    "meaning": "Dar por concluida la junta o abrigarse bien contra el frío",
    "example": "Vamos a wrap up esta reunión que ya es hora de la comida."
  },
  {
    "term": "Wriggle out of",
    "pron": "/ˈrɪɡ.əl aʊt əv/",
    "meaning": "Zafarse con marrullerías de cumplir con un castigo",
    "example": "No te vas a poder wriggle out of pagar tu parte de la tanda."
  },
  {
    "term": "Write down",
    "pron": "/raɪt daʊn/",
    "meaning": "Anotar con pluma la dirección y el teléfono en la libreta",
    "example": "Write down estas señas para que no te vayas a perder en el camino."
  },
  {
    "term": "Write off",
    "pron": "/raɪt ɔːf/",
    "meaning": "Dar por perdido un carro destrozado o perdonar una deuda",
    "example": "La aseguradora decided to write off el carro como pérdida total."
  },
  {
    "term": "Write up",
    "pron": "/raɪt ʌp/",
    "meaning": "Redactar un reporte formal de incidencias laborales",
    "example": "El supervisor had to write up un reporte sobre el accidente en la obra."
  },
  {
    "term": "X out",
    "pron": "/ɛks aʊt/",
    "meaning": "Tachar con una cruz o eliminar renglones de una lista",
    "example": "Tacha con tinta roja: please X out the names of anyone who canceled."
  },
  {
    "term": "X off",
    "pron": "/ɛks ɔːf/",
    "meaning": "Tachar o marcar casillas conforme se completan los pendientes",
    "example": "Conforme liquides pendientes, make sure to X off each item on your board."
  },
  {
    "term": "Yearn for",
    "pron": "/jɝːn fɔːr/",
    "meaning": "Añorar con nostalgia los guisados de la abuela o la tierra natal",
    "example": "Estando lejos del país uno always yearns for unos buenos tacos al pastor."
  },
  {
    "term": "Yell out",
    "pron": "/jel aʊt/",
    "meaning": "Gritar a todo pulmón el nombre del ganador de la rifa",
    "example": "El animador yelled out el número ganador y todos aplaudieron."
  },
  {
    "term": "Yield to",
    "pron": "/jiːld tuː/",
    "meaning": "Ceder el paso en el cruce de calles a los peatones",
    "example": "Por reglamento vial tienes que yield to a los peatones en la esquina."
  },
  {
    "term": "Zero in on",
    "pron": "/ˈzɪr.oʊ ɪn ɑːn/",
    "meaning": "Enfocar toda la mira y concentración en el blanco",
    "example": "El delantero supo zero in on la portería y clavó el gol."
  },
  {
    "term": "Zip up",
    "pron": "/zɪp ʌp/",
    "meaning": "Subirse el cierre de la chamarra para que no entre el aire",
    "example": "Zip up la chamarra que el aire de la noche cala bien sabroso."
  },
  {
    "term": "Zone out",
    "pron": "/zoʊn aʊt/",
    "meaning": "Quedarse en la luna / perder el hilo de la conversación",
    "example": "Perdón, me quedé zoned out pensando en los pendientes de la casa."
  },
  {
    "term": "Zoom in",
    "pron": "/zuːm ɪn/",
    "meaning": "Hacer acercamiento con la cámara para capturar los detalles finos",
    "example": "Zoom in con el lente para enfocar la abeja posada sobre la flor."
  },
  {
    "term": "Zoom out",
    "pron": "/zuːm aʊt/",
    "meaning": "Alejar la vista de la cámara para ver todo el panorama",
    "example": "Zoom out la toma para que se aprecie toda la multitud en el zócalo."
  }
];

  // 2. Vocabulario Coloquial, Expresiones y Slang de México
  const COLLOQUIAL_VOCABULARY = [
  {
    "term": "A las vivas",
    "pron": "/ɑː lɑːs ˈviː.vɑːs/",
    "meaning": "Estar muy despierto, alerta y ágil para no dejarse engañar",
    "example": "Ponte a las vivas en el tianguis para que no te vayan a bolsear."
  },
  {
    "term": "A ojo de buen cubero",
    "pron": "/ɑː ˈoʊ.hoʊ deɪ bwen kuːˈbe.roʊ/",
    "meaning": "Calcular una medida al tanteo sin usar báscula ni regla",
    "example": "Le eché sal a la salsa a ojo de buen cubero y quedó perfecta."
  },
  {
    "term": "A poco",
    "pron": "/ɑː ˈpoʊ.koʊ/",
    "meaning": "¿De verdad? ¿En serio? Expresión de sorpresa",
    "example": "¿A poco te compraste esa moto nueva con tus puros ahorros?"
  },
  {
    "term": "A todo dar",
    "pron": "/ɑː ˈtoʊ.doʊ dɑːr/",
    "meaning": "Estar genial, excelente o pasársela de maravilla",
    "example": "La fiesta estuvo a todo dar, con música en vivo y rica comida."
  },
  {
    "term": "A walk in the park",
    "pron": "/ə wɔːk ɪn ðə pɑːrk/",
    "meaning": "Facilísimo, pan comido o regalado de hacer",
    "example": "Ese examen de inglés fue a walk in the park, saqué diez."
  },
  {
    "term": "Abrupt",
    "pron": "/əˈbrʌpt/",
    "meaning": "Abrupto, repentino y sin aviso previo",
    "example": "La junta tuvo un final muy abrupt cuando el director se paró enojado."
  },
  {
    "term": "Accompany",
    "pron": "/əˈkʌm.pə.ni/",
    "meaning": "Acompañar a alguien para que no vaya solo",
    "example": "Déjame accompany ti hasta la parada del autobús para que no andes sola."
  },
  {
    "term": "Agarrar la onda",
    "pron": "/ɑː.ɡɑːˈrɑːr lɑː ˈoʊn.dɑː/",
    "meaning": "Comprender la situación o captar la idea",
    "example": "Hasta que por fin agarró la onda de cómo resolver la ecuación."
  },
  {
    "term": "Aguas",
    "pron": "/ˈɑː.ɡwɑːs/",
    "meaning": "¡Cuidado! ¡Alerta con el peligro o tropezón!",
    "example": "¡Aguas con la cazuela caliente que acaba de salir de la lumbre!"
  },
  {
    "term": "Ahogarse en un vaso de agua",
    "pron": "/ɑː.oʊˈɡɑːr.se en uːn ˈvɑː.soʊ deɪ ˈɑː.ɡwɑː/",
    "meaning": "Afligirse exageradamente por una pequeñez sin importancia",
    "example": "No te ahogues en un vaso de agua por una calificación de siete."
  },
  {
    "term": "Al tiro",
    "pron": "/ɑːl ˈtiː.roʊ/",
    "meaning": "Estar atento, trucha y preparado para lo que venga",
    "example": "Ponte al tiro con el semáforo porque ahí siempre se paran los tránsitos."
  },
  {
    "term": "Andar con todo",
    "pron": "/ɑːnˈdɑːr koʊn ˈtoʊ.doʊ/",
    "meaning": "Estar en su mejor momento rindiendo al cien por ciento",
    "example": "Ese delantero anda con todo en el torneo, lleva diez goles."
  },
  {
    "term": "Armar un pancho",
    "pron": "/ɑːrˈmɑːr uːn ˈpɑːn.tʃoʊ/",
    "meaning": "Hacer un escándalo o berrinche en público",
    "example": "El cliente armó un pancho en la caja porque no le aceptaron el billete."
  },
  {
    "term": "Baffled",
    "pron": "/ˈbæf.əld/",
    "meaning": "Perplejo, sacadísimo de onda o que no entiende nada",
    "example": "I'm baffled, neta no me cabe en la cabeza por qué hizo esa tontería."
  },
  {
    "term": "Bajarle dos rayitas",
    "pron": "/bɑːˈhɑːr.le doʊs rɑːˈjiː.tɑːs/",
    "meaning": "Moderar el coraje o calmarse",
    "example": "Bájale dos rayitas a tu bronca que nadie te está faltando al respeto."
  },
  {
    "term": "Bare",
    "pron": "/ber/",
    "meaning": "Desnudo o pelón / cuarto totalmente vacío",
    "example": "The room was completely bare, no tenía ni una sola silla."
  },
  {
    "term": "Barefoot",
    "pron": "/ˈber.fʊt/",
    "meaning": "Andar a pata pelada / descalzo sobre el piso",
    "example": "No andes barefoot en el patio que te puedes enterrar una espina."
  },
  {
    "term": "Bench",
    "pron": "/bentʃ/",
    "meaning": "Banca del parque o asiento de madera",
    "example": "Nos sentamos en la bench del parque a comer unos churros."
  },
  {
    "term": "Betray",
    "pron": "/bɪˈtreɪ/",
    "meaning": "Traicionar la confianza de un amigo o puñalada por la espalda",
    "example": "Jamás pensé que mi socio me fuera a betray de esa manera."
  },
  {
    "term": "Blunt",
    "pron": "/blʌnt/",
    "meaning": "Directo al grano y sin rodeos / sin filo",
    "example": "Fue muy blunt y me dijo que no le gustaba mi trabajo."
  },
  {
    "term": "Blurry",
    "pron": "/ˈblɝː.i/",
    "meaning": "Borroso o que no se distingue bien la vista",
    "example": "Sin mis lentes de aumento veo todo completamente blurry."
  },
  {
    "term": "Botana",
    "pron": "/boʊˈtɑː.nɑː/",
    "meaning": "Aperitivo o antojito salado para botanear con amigos",
    "example": "Puse unos cacahuates y papitas de botana para ver el partido."
  },
  {
    "term": "Brake",
    "pron": "/breɪk/",
    "meaning": "El freno del carro o de la bicicleta",
    "example": "Písale al brake que se atravesó un perro en la calle."
  },
  {
    "term": "Brisk",
    "pron": "/brɪsk/",
    "meaning": "Enérgico, de paso rápido o un clima fresquecito",
    "example": "Nos dimos una caminata brisk para calentar el cuerpo en la mañana."
  },
  {
    "term": "Brusque",
    "pron": "/brʌsk/",
    "meaning": "Brusco, seco y cortante al tratar a la gente",
    "example": "El recepcionista me contestó de una manera muy brusque."
  },
  {
    "term": "Buscarle tres pies al gato",
    "pron": "/buːsˈkɑːr.le tres pjez ɑːl ˈɡɑː.toʊ/",
    "meaning": "Complicar las cosas sin necesidad buscando problemas",
    "example": "El asunto está clarito, no le busques tres pies al gato."
  },
  {
    "term": "Caer el veinte",
    "pron": "/kɑːˈer el ˈveɪn.te/",
    "meaning": "Darse cuenta por fin de una verdad evidente",
    "example": "Hasta ahorita me cayó el veinte de por qué no me contestaba las llamadas."
  },
  {
    "term": "Cage",
    "pron": "/keɪdʒ/",
    "meaning": "Jaula de animales o celda de protección",
    "example": "El loro se salió de su cage y anda volando en la cochera."
  },
  {
    "term": "Camarón que se duerme",
    "pron": "/kɑː.mɑːˈroʊn keɪ seɪ ˈdwer.me/",
    "meaning": "Dicho: Al que se descuida se lo lleva la corriente",
    "example": "Camarón que se duerme se lo lleva la corriente, ¡muévete ya!"
  },
  {
    "term": "Carefree",
    "pron": "/ˈker.friː/",
    "meaning": "Despreocupado, sin broncas en la cabeza o relajado",
    "example": "Ese muchacho vive una vida bien carefree, nada le quita el sueño."
  },
  {
    "term": "Carnal",
    "pron": "/kɑːrˈnɑːl/",
    "meaning": "Hermano, mejor amigo o compa del alma",
    "example": "Ya sabes que cuentas conmigo para lo que sea, mi carnal."
  },
  {
    "term": "Caterpillar",
    "pron": "/ˈkæt̬.ɚ.pɪl.ɚ/",
    "meaning": "Oruga de mariposa que come hojitas verdes",
    "example": "Vimos una caterpillar verde caminando sobre las hojas del rosal."
  },
  {
    "term": "Chafa",
    "pron": "/ˈtʃɑː.fɑː/",
    "meaning": "De mala calidad, pirata o corriente",
    "example": "Esos audífonos salieron bien chafas, se descompusieron a los dos días."
  },
  {
    "term": "Chamba",
    "pron": "/ˈtʃɑːm.bɑː/",
    "meaning": "Puesto de trabajo, empleo o labor diaria",
    "example": "Apenas conseguí chamba de diseñador gráfico en una agencia."
  },
  {
    "term": "Chela",
    "pron": "/ˈtʃe.lɑː/",
    "meaning": "Cerveza bien fría y espumosa",
    "example": "Vamos a echarnos una chela bien muerta para bajarnos el calorón."
  },
  {
    "term": "Chido",
    "pron": "/ˈtʃiː.doʊ/",
    "meaning": "Bonito, genial, agradable o bien hecho",
    "example": "¡Qué chido quedó el mural que pintaron en la barda de la escuela!"
  },
  {
    "term": "Chisme",
    "pron": "/ˈtʃiːs.me/",
    "meaning": "Comentario, rumor o noticia jugosa sobre la vida ajena",
    "example": "Se armó un chisme tremendo en el vecindario por el perro de don Paco."
  },
  {
    "term": "Clenching fists",
    "pron": "/ˈklen.tʃɪŋ fɪsts/",
    "meaning": "Apretando los puños del puro coraje",
    "example": "Estaba clenching his fists para no soltarle un golpe."
  },
  {
    "term": "Costar un ojo de la cara",
    "pron": "/koʊsˈtɑːr uːn ˈoʊ.hoʊ deɪ lɑː ˈkɑː.rɑː/",
    "meaning": "Ser excesivamente caro o carísimo de comprar",
    "example": "Esa refacción importada cuesta un ojo de la cara y no se consigue fácil."
  },
  {
    "term": "Crawl",
    "pron": "/krɔːl/",
    "meaning": "Gatear como bebé o avanzar a vuelta de rueda en el tráfico",
    "example": "El bebé apenas empezó a crawl por toda la sala."
  },
  {
    "term": "Cruda",
    "pron": "/ˈkruː.dɑː/",
    "meaning": "Malestar físico al día siguiente de una borrachera (resaca)",
    "example": "Tómate un caldo de camarón bien picoso para curarte la cruda."
  },
  {
    "term": "Cuate",
    "pron": "/ˈkwɑː.te/",
    "meaning": "Amigo entrañable o persona muy cercana",
    "example": "Don Roberto es un cuate de toda la vida de mi señor padre."
  },
  {
    "term": "Dar el avión",
    "pron": "/dɑːr el ɑːˈvjoʊn/",
    "meaning": "Darle el sí a alguien sin prestarle atención real",
    "example": "Nomás te está dando el avión para que ya no sigas alegando."
  },
  {
    "term": "Dar en la torre",
    "pron": "/dɑːr en lɑː ˈtoʊ.re/",
    "meaning": "Dar un golpe fuerte, descomponer algo o arruinar un plan",
    "example": "La granizada le dio en la torre a toda la cosecha de jitomate."
  },
  {
    "term": "Dar gato por liebre",
    "pron": "/dɑːr ˈɡɑː.toʊ pɔːr ˈlje.bre/",
    "meaning": "Engañar vendiendo algo de inferior calidad a precio de primera",
    "example": "En ese taller me dieron gato por liebre con una batería usada."
  },
  {
    "term": "Dar la cara",
    "pron": "/dɑːr lɑː ˈkɑː.rɑː/",
    "meaning": "Afrontar las consecuencias de los actos con valentía",
    "example": "Hay que ser hombrecito y dar la cara cuando uno comete un error."
  },
  {
    "term": "Dar lata",
    "pron": "/dɑːr ˈlɑː.tɑː/",
    "meaning": "Dar molestias o estar fallando un aparato",
    "example": "Esa lavadora vieja ya empezó a dar lata otra vez con el centrifugado."
  },
  {
    "term": "Darse un agarrón",
    "pron": "/ˈdɑːr.se uːn ɑː.ɡɑːˈroʊn/",
    "meaning": "Tener una discusión muy fuerte o pelearse cuerpo a cuerpo",
    "example": "Los dos diputados se dieron un agarrón en el debate de la televisión."
  },
  {
    "term": "De pelos",
    "pron": "/deɪ ˈpe.loʊs/",
    "meaning": "Sensacional, padrísimo o de maravilla",
    "example": "Nos la pasamos de pelos en la feria del pueblo el fin de semana."
  },
  {
    "term": "De volada",
    "pron": "/deɪ voʊˈlɑː.dɑː/",
    "meaning": "Hacer algo rapidísimo en un abrir y cerrar de ojos",
    "example": "Fui a la tienda de volada antes de que empezara el partido."
  },
  {
    "term": "Dormir como un tronco",
    "pron": "/dɔːrˈmiːr ˈkoʊ.moʊ uːn ˈtroʊŋ.koʊ/",
    "meaning": "Dormir profundamente sin despertarse con ningún ruido",
    "example": "Llegué tan agotado que dormí como un tronco toda la noche."
  },
  {
    "term": "Dull",
    "pron": "/dʌl/",
    "meaning": "Aburrido / sin chiste o un cuchillo sin filo (mocho)",
    "example": "Este cuchillo cebollero está bien dull, no corta ni la mantequilla."
  },
  {
    "term": "Echar carrilla",
    "pron": "/eɪˈtʃɑːr kɑːˈriː.jɑː/",
    "meaning": "Tirar bromas o mofarse amistosamente de un amigo",
    "example": "No te lo tomes a mal, nomás te estamos echando carrilla sana."
  },
  {
    "term": "Echar flores",
    "pron": "/eɪˈtʃɑːr ˈflɔː.res/",
    "meaning": "Llenar de elogios y halagos merecidos a alguien",
    "example": "El maestro le echó flores a la alumna por su brillante exposición."
  },
  {
    "term": "Echar la hueva",
    "pron": "/eɪˈtʃɑːr lɑː ˈweɪ.vɑː/",
    "meaning": "Estar en la holganza total descansando sin hacer nada",
    "example": "Los domingos me gusta echar la hueva tirado en el sillón."
  },
  {
    "term": "Echar la mano",
    "pron": "/eɪˈtʃɑːr lɑː ˈmɑː.noʊ/",
    "meaning": "Ayudar o auxiliar a alguien en un apuro",
    "example": "¿Me puedes echar la mano a empujar la troca que se quedó sin pila?"
  },
  {
    "term": "Echar pestes",
    "pron": "/eɪˈtʃɑːr ˈpes.tes/",
    "meaning": "Hablar muy mal y con mucho enojo de una persona o servicio",
    "example": "Salió echando pestes del restaurante porque tardaron una hora en servirle."
  },
  {
    "term": "Echar taco",
    "pron": "/eɪˈtʃɑːr ˈtɑː.koʊ/",
    "meaning": "Sentarse a comer unos ricos tacos en la calle o en casa",
    "example": "Vente carnal, vamos a echar taco a los puestos del mercado."
  },
  {
    "term": "Echarle ganas",
    "pron": "/eɪˈtʃɑːr.le ˈɡɑː.nɑːs/",
    "meaning": "Ponerle todo el empeño y corazón a una meta",
    "example": "Hay que echarle ganas al estudio para conseguir un buen porvenir."
  },
  {
    "term": "Estar cañón",
    "pron": "/esˈtɑːr kɑːˈnjoʊn/",
    "meaning": "Estar sumamente difícil o complicada la cosa",
    "example": "Ese examen de cálculo integral estuvo cañón de principio a fin."
  },
  {
    "term": "Estar en camote",
    "pron": "/esˈtɑːr en kɑːˈmoʊ.te/",
    "meaning": "Estar saturadísimo de trabajo en la cocina o taller",
    "example": "Los cocineros están en camote sacando cincuenta órdenes al mismo tiempo."
  },
  {
    "term": "Estar en la luna",
    "pron": "/esˈtɑːr en lɑː ˈluː.nɑː/",
    "meaning": "Estar distraído soñando despierto sin poner atención",
    "example": "El chamaco estaba en la luna y no escuchó la pregunta del profe."
  },
  {
    "term": "Estar hasta el gorro",
    "pron": "/esˈtɑːr ˈɑːs.tɑː el ˈɡoʊ.roʊ/",
    "meaning": "Estar harto y fastidiado de una situación injusta",
    "example": "Ya estoy hasta el gorro de que el vecino ponga música a las tres de la mañana."
  },
  {
    "term": "Estar hasta las manitas",
    "pron": "/esˈtɑːr ˈɑːs.tɑː lɑːs mɑːˈniː.tɑːs/",
    "meaning": "Estar sumamente ebrio o repleto de ocupaciones",
    "example": "Ese compa ya andaba hasta las manitas y lo mandaron en taxi a su casa."
  },
  {
    "term": "Follow in someone's footsteps",
    "pron": "/ˈfɑː.loʊ ɪn ˈsʌm.wʌnz ˈfʊt.steps/",
    "meaning": "Seguir los pasos o el ejemplo de superación de un familiar",
    "example": "Decidió estudiar medicina para follow in his father's footsteps."
  },
  {
    "term": "Garnacha",
    "pron": "/ɡɑːrˈnɑː.tʃɑː/",
    "meaning": "Comida callejera tradicional mexicana rica y frita",
    "example": "Los fines de semana nos encanta cenar garnachas en el tianguis."
  },
  {
    "term": "Get your feet wet",
    "pron": "/ɡet jʊr fiːt wet/",
    "meaning": "Dar el primer paso o probar las aguas para empezar algo nuevo",
    "example": "Anímate a hablar con nativos para get your feet wet en el idioma."
  },
  {
    "term": "Hacer de tripas corazón",
    "pron": "/ɑːˈser deɪ ˈtriː.pɑːs koʊ.rɑːˈzoʊn/",
    "meaning": "Sacar fuerzas de flaqueza y sobreponerse al miedo",
    "example": "Tuvo que hacer de tripas corazón y subir a cantar al escenario."
  },
  {
    "term": "Hacer el paro",
    "pron": "/ɑːˈser el ˈpɑː.roʊ/",
    "meaning": "Hacer un favor grande para sacar de un apuro a un compa",
    "example": "Hazme el paro de prestarme tu camioneta para la mudanza."
  },
  {
    "term": "Hacer un pancho",
    "pron": "/ɑːˈser uːn ˈpɑːn.tʃoʊ/",
    "meaning": "Armar un escándalo o berrinche por una pequeñez",
    "example": "El cliente hizo un pancho porque no le quisieron dar salsa extra gratis."
  },
  {
    "term": "Hacerla de emoción",
    "pron": "/ɑːˈser.lɑː deɪ eɪ.moʊˈsjoʊn/",
    "meaning": "Crear suspenso innecesario antes de dar una noticia",
    "example": "Ya no la hagas de emoción y dinos si te dieron la chamba o no."
  },
  {
    "term": "Hacerse pato",
    "pron": "/ɑːˈser.se ˈpɑː.toʊ/",
    "meaning": "Desentenderse de una obligación haciéndose el desentendido",
    "example": "No te hagas pato y ponte a barrer la entrada del local."
  },
  {
    "term": "Harsh",
    "pron": "/hɑːrʃ/",
    "meaning": "Severo, áspero o un regaño con palabras muy duras",
    "example": "Sus críticas fueron muy harsh, no tuvo pelos en la lengua."
  },
  {
    "term": "Hedgehog",
    "pron": "/ˈhedʒ.hɑːɡ/",
    "meaning": "Erizo con espinitas en la espalda",
    "example": "El hedgehog se hizo bolita con todas sus púas cuando se asustó."
  },
  {
    "term": "Hold a grudge",
    "pron": "/hoʊld ə ɡrʌdʒ/",
    "meaning": "Guardarle rencor o resentimiento añejo a alguien",
    "example": "He holds grudges por cualquier tontería, es muy resentido."
  },
  {
    "term": "Híjole",
    "pron": "/ˈiː.hoʊ.le/",
    "meaning": "¡Caramba! Expresión de lamento, sorpresa o asombro",
    "example": "¡Híjole, se me olvidó apagar el frijol en la estufa!"
  },
  {
    "term": "I got stained with",
    "pron": "/aɪ ɡɑːt steɪnd wɪð/",
    "meaning": "Me manché todo de algo por accidente",
    "example": "I got stained with salsa verde en mi camisa blanca."
  },
  {
    "term": "I stained myself with",
    "pron": "/aɪ steɪnd maɪˈself wɪð/",
    "meaning": "Me manché yo solito con algo sucio",
    "example": "I stained myself with pintura fresca por no fijarme."
  },
  {
    "term": "Jale",
    "pron": "/ˈhɑː.le/",
    "meaning": "Trabajo, empleo o faena que hay que sacar",
    "example": "Tengo mucho jale acumulado en el taller mecánico esta semana."
  },
  {
    "term": "Lamppost",
    "pron": "/ˈlæmp.poʊst/",
    "meaning": "Poste de luz de la calle o luminaria pública",
    "example": "Pegaron un anuncio de se busca perro en el lamppost."
  },
  {
    "term": "Lana",
    "pron": "/ˈlɑː.nɑː/",
    "meaning": "Dinero en efectivo o presupuesto disponible",
    "example": "Necesitamos juntar una lana para poder comprar las refacciones."
  },
  {
    "term": "Light pole",
    "pron": "/laɪt poʊl/",
    "meaning": "Poste de luz eléctrica",
    "example": "Un camión rozó el light pole y casi tira los cables."
  },
  {
    "term": "Locked in",
    "pron": "/lɑːkt ɪn/",
    "meaning": "Encerrados o súper concentrados en la jugada / metidos al cien",
    "example": "El equipo de eSports está totalmente locked in practicando para la final."
  },
  {
    "term": "Mal del puerco",
    "pron": "/mɑːl del ˈpwer.koʊ/",
    "meaning": "Pesadez y sueño profundo tras comer abundantemente",
    "example": "Después de comer tres platos de pozole me dio un tremendo mal del puerco."
  },
  {
    "term": "Mande",
    "pron": "/ˈmɑːn.de/",
    "meaning": "Respuesta respetuosa tradicional mexicana: ¿Dígame? o ¿Qué desea?",
    "example": "—¡Juanito! —¡Mande, abuelita, ya voy para la cocina!"
  },
  {
    "term": "Me da cosa",
    "pron": "/meɪ dɑː ˈkoʊ.sɑː/",
    "meaning": "Sentir repelús, ñañaras o incomodidad",
    "example": "Me da cosa meter la mano en ese rincón oscuro lleno de telarañas."
  },
  {
    "term": "Mess me around",
    "pron": "/mes miː əˈraʊnd/",
    "meaning": "Jugar conmigo, tomarme el pelo o hacerme perder el tiempo",
    "example": "Stop messing me around y dime de una vez si vas a comprar el carro o no."
  },
  {
    "term": "Meter la pata",
    "pron": "/meˈter lɑː ˈpɑː.tɑː/",
    "meaning": "Cometer un error vergonzoso o regarla",
    "example": "Metí la pata al felicitarla cuando en realidad no estaba embarazada."
  },
  {
    "term": "Nel",
    "pron": "/nel/",
    "meaning": "Negación rotunda: No, de ninguna manera",
    "example": "¿Le vas a prestar dinero a ese mala paga? —¡Nel, ni loco!"
  },
  {
    "term": "Ni modo",
    "pron": "/niː ˈmoʊ.doʊ/",
    "meaning": "No hay nada que hacer, resignación positiva",
    "example": "Se nos ponchó una llanta, ni modo, a cambiarla con calma."
  },
  {
    "term": "No dar pie con bola",
    "pron": "/noʊ dɑːr pje koʊn ˈboʊ.lɑː/",
    "meaning": "No atinarle a nada y equivocarse continuamente",
    "example": "Hoy ando tan desvelado que no doy pie con bola en el trabajo."
  },
  {
    "term": "No manches",
    "pron": "/noʊ ˈmɑːn.tʃes/",
    "meaning": "¡No puede ser! / Expresión de sorpresa o incredulidad total",
    "example": "¡No manches, no sabía que te habías sacado la beca de excelencia!"
  },
  {
    "term": "No tener abuela",
    "pron": "/noʊ teˈner ɑːˈbwe.lɑː/",
    "meaning": "No tener vergüenza ni escrúpulos para actuar mal",
    "example": "¡Ese vato no tiene abuela, le robó la bicicleta a un niño de la cuadra!"
  },
  {
    "term": "Pace",
    "pron": "/peɪs/",
    "meaning": "Ritmo, cadencia o paso de marcha",
    "example": "Aguanta el pace que todavía nos faltan tres kilómetros de subida."
  },
  {
    "term": "Partirse el lomo",
    "pron": "/pɑːrˈtiːr.se el ˈloʊ.moʊ/",
    "meaning": "Trabajar durísimo de sol a sol sin quejarse",
    "example": "Mi papá se partió el lomo en la milpa para darnos escuela a todos."
  },
  {
    "term": "Pisto",
    "pron": "/ˈpiːs.toʊ/",
    "meaning": "Bebida alcohólica para la fiesta o pachanga",
    "example": "Falta comprar el pisto y los hielos para la reunión de esta noche."
  },
  {
    "term": "Poner el dedo en la llaga",
    "pron": "/poʊˈner el ˈde.doʊ en lɑː ˈjɑː.ɡɑː/",
    "meaning": "Señalar con precisión el punto más doloroso o conflictivo",
    "example": "El periodista puso el dedo en la llaga al cuestionar el gasto público."
  },
  {
    "term": "Ponerse la del Puebla",
    "pron": "/poʊˈner.se lɑː del ˈpwe.blɑː/",
    "meaning": "Mocarse cooperando con dinero o compartiendo las ganancias al 50%",
    "example": "Ponte la del Puebla carnal y coopera con la gasolina del paseo."
  },
  {
    "term": "Ponerse las pilas",
    "pron": "/poʊˈner.se lɑːs ˈpiː.lɑːs/",
    "meaning": "Espabilarse, activarse y ponerse a trabajar con energía",
    "example": "Hay que ponerse las pilas porque la entrega del proyecto es mañana."
  },
  {
    "term": "Por si las moscas",
    "pron": "/pɔːr siː lɑːs ˈmoʊs.kɑːs/",
    "meaning": "Por si acaso, medida de precaución ante imprevistos",
    "example": "Llévate un paraguas por si las moscas, que se ve el cielo nublado."
  },
  {
    "term": "Pull up to the party",
    "pron": "/pʊl ʌp tuː ðə ˈpɑːr.t̬i/",
    "meaning": "¡Cáele a la fiesta! / Déjate caer con la banda",
    "example": "Pull up to the party en mi casa, va a haber carnita asada."
  },
  {
    "term": "Pulling up",
    "pron": "/ˈpʊl.ɪŋ ʌp/",
    "meaning": "Llegando en carro, ya voy en camino o apareciendo",
    "example": "I'm pulling up a la fiesta, salte a recibirme a la banqueta."
  },
  {
    "term": "Put your money where your mouth is",
    "pron": "/pʊt jʊr ˈmʌn.i wer jʊr maʊθ ɪz/",
    "meaning": "Menos palabras y más acción / cumple lo que prometes con hechos",
    "example": "Dices que tu equipo va a ganar, ¡put your money where your mouth is!"
  },
  {
    "term": "Quedarse de a seis",
    "pron": "/keɪˈdɑːr.se deɪ ɑː seɪs/",
    "meaning": "Quedar boquiabierto de la sorpresa o atónito",
    "example": "Me quedé de a seis cuando me enteré del precio de la camioneta."
  },
  {
    "term": "Qué padre",
    "pron": "/keɪ ˈpɑː.dre/",
    "meaning": "¡Qué bonito, qué genial o qué agradable!",
    "example": "¡Qué padre quedó la remodelación de la plaza principal!"
  },
  {
    "term": "Sacar de onda",
    "pron": "/sɑːˈkɑːr deɪ ˈoʊn.dɑː/",
    "meaning": "Desconcertar o confundir a alguien con una actitud extraña",
    "example": "Me sacó de onda que no se despidiera cuando se fue de la fiesta."
  },
  {
    "term": "Se me fue el avión",
    "pron": "/seɪ meɪ fweɪ el ɑːˈvjoʊn/",
    "meaning": "Perder el hilo de lo que se estaba diciendo",
    "example": "Perdón compa, se me fue el avión, ¿de qué estábamos platicando?"
  },
  {
    "term": "Ser buena onda",
    "pron": "/ser ˈbwe.nɑː ˈoʊn.dɑː/",
    "meaning": "Ser una persona agradable, simpática y alivianada",
    "example": "El nuevo vecino es súper buena onda, siempre saluda con una sonrisa."
  },
  {
    "term": "Sharp",
    "pron": "/ʃɑːrp/",
    "meaning": "Filoso como navaja de rasurar / muy abusado",
    "example": "Ten cuidado con ese machete que tiene un filo bien sharp."
  },
  {
    "term": "Shrill",
    "pron": "/ʃrɪl/",
    "meaning": "Estridente, chillón o un sonido muy agudo",
    "example": "Esa alarma vieja tiene un pitido bien shrill que taladra el oído."
  },
  {
    "term": "Simón",
    "pron": "/siːˈmoʊn/",
    "meaning": "Afirmación coloquial: Sí, seguro, claro que sí",
    "example": "¿Vas a ir a la carne asada al rato? —¡Simón, allá nos vemos!"
  },
  {
    "term": "Skip",
    "pron": "/skɪp/",
    "meaning": "Dar un brinquito o saltito / saltarse una lección",
    "example": "Iba dando skips de alegría cuando supo que pasó el examen."
  },
  {
    "term": "Snatched me",
    "pron": "/snætʃt miː/",
    "meaning": "Me jaló con fuerza o me arrebató de un tirón",
    "example": "El vato snatched me del brazo para que no me cayera a la zanja."
  },
  {
    "term": "Soltar la sopa",
    "pron": "/soʊlˈtɑːr lɑː ˈsoʊ.pɑː/",
    "meaning": "Confesar toda la verdad sin guardarse ningún detalle",
    "example": "Después de tanta presión el culpable tuvo que soltar la sopa."
  },
  {
    "term": "Speed",
    "pron": "/spiːd/",
    "meaning": "Velocidad o meterle rapidez a la marcha",
    "example": "Bájale a la speed que esta calle tiene muchos topes."
  },
  {
    "term": "Stride",
    "pron": "/straɪd/",
    "meaning": "Caminar a zancadas largas y con paso firme",
    "example": "Caminaba con un stride seguro hacia la oficina del jefe."
  },
  {
    "term": "Take a peek into",
    "pron": "/teɪk ə piːk ˈɪn.tuː/",
    "meaning": "Echar un vistazo o asomarse por curiosidad",
    "example": "Déjame take a peek into la cocina a ver qué huele tan rico."
  },
  {
    "term": "Tener agallas",
    "pron": "/teˈner ɑːˈɡɑː.jɑːs/",
    "meaning": "Tener valentía, arrojo y coraje para enfrentar retos",
    "example": "Se necesitan muchas agallas para emprender un negocio en tiempos difíciles."
  },
  {
    "term": "Tener pegue",
    "pron": "/teˈner ˈpe.ɡe/",
    "meaning": "Tener mucho atractivo y carisma para ligar",
    "example": "Ese muchacho tiene un pegue bárbaro con todas las muchachas del pueblo."
  },
  {
    "term": "Think on your feet",
    "pron": "/θɪŋk ɑːn jʊr fiːt/",
    "meaning": "Improvisar rápido con maña ante una pregunta difícil",
    "example": "En una entrevista de trabajo tienes que learn to think on your feet."
  },
  {
    "term": "Tiptoe",
    "pron": "/ˈtɪp.toʊ/",
    "meaning": "Caminar de puntitas para no hacer ruido ni despertar a nadie",
    "example": "Entró de tiptoe a la recámara para que no lo oyera su mamá."
  },
  {
    "term": "Tirar la casa por la ventana",
    "pron": "/tiˈrɑːr lɑː ˈkɑː.sɑː pɔːr lɑː venˈtɑː.nɑː/",
    "meaning": "Gastar sin reparar en gastos para celebrar un fiestón",
    "example": "Echaron la casa por la ventana para los quince años de su primogénita."
  },
  {
    "term": "Tirar la toalla",
    "pron": "/tiˈrɑːr lɑː toʊˈaɪ.ə/",
    "meaning": "Rendirse o darse por vencido ante una dificultad",
    "example": "Aunque la chamba esté pesada jamás voy a tirar la toalla."
  },
  {
    "term": "Tirar paro",
    "pron": "/tiˈrɑːr ˈpɑː.roʊ/",
    "meaning": "Hacer un favor grande o cubrir a un compañero",
    "example": "Tírame paro con la guardia del viernes y yo te cubro el domingo."
  },
  {
    "term": "Tomar el pelo",
    "pron": "/toʊˈmɑːr el ˈpe.loʊ/",
    "meaning": "Hacer una broma burlona o engañar amistosamente",
    "example": "No te creas lo que te dijo Pedro, nomás te estaba tomando el pelo."
  },
  {
    "term": "Traffic light",
    "pron": "/ˈtræf.ɪk laɪt/",
    "meaning": "El semáforo de la esquina",
    "example": "El traffic light se puso en rojo justo cuando iba a cruzar."
  },
  {
    "term": "Troca",
    "pron": "/ˈtroʊ.kɑː/",
    "meaning": "Camioneta pick-up de trabajo pesado",
    "example": "Suban las pacas de alfalfa a la batea de la troca para llevarlas al rancho."
  },
  {
    "term": "Valer gorro",
    "pron": "/vɑːˈler ˈɡoʊ.roʊ/",
    "meaning": "Arruinarse por completo o no tener importancia",
    "example": "Se fue la luz y valió gorro la masa que estaba en el horno."
  },
  {
    "term": "Walk in someone's shoes",
    "pron": "/wɔːk ɪn ˈsʌm.wʌnz ʃuːz/",
    "meaning": "Ponerte en los zapatos de otro antes de juzgarlo a la ligera",
    "example": "Try walking in his shoes antes de criticar su situación económica."
  },
  {
    "term": "Walk the talk",
    "pron": "/wɔːk ðə tɔːk/",
    "meaning": "Cumplir con lo que predicas y predicar con el ejemplo",
    "example": "Si prometes honestidad en tu empresa, you have to walk the talk."
  },
  {
    "term": "Órale",
    "pron": "/ˈoʊ.rɑː.le/",
    "meaning": "Expresión polivalente: ¡Vamos!, ¡Ándale!, o ¡Sorprendente!",
    "example": "¡Órale, qué buena jugada te acabas de aventar en la cancha!"
  }
];

  // 3. Vocabulario Visual de Luz, Brillo y Observación
  const VISUAL_LIGHT_VOCABULARY = [
  {
    "term": "Blinding",
    "pron": "/ˈblaɪn.dɪŋ/",
    "meaning": "Tan resplandeciente que lastima los ojos si lo miras directo",
    "example": "El relámpago cayó con una luz blinding en medio de la tormenta."
  },
  {
    "term": "Buoyant",
    "pron": "/ˈbɔɪ.ənt/",
    "meaning": "Capaz de flotar ligero sobre el agua como madera de balsa",
    "example": "La trajinera de Xochimilco es buoyant y navega por los canales."
  },
  {
    "term": "Burnished",
    "pron": "/ˈbɝː.nɪʃt/",
    "meaning": "Metal bruñido o pulido con frote hasta sacar brillo noble",
    "example": "La campana de cobre burnished adorna el campanario del templo."
  },
  {
    "term": "Colossal",
    "pron": "/kəˈlɑː.səl/",
    "meaning": "De dimensiones gigantescas y monumentales que imponen respeto",
    "example": "Las cabezas olmecas de piedra volcánica son esculturas colossal."
  },
  {
    "term": "Coruscating",
    "pron": "/ˈkɔːr.ə.skeɪ.tɪŋ/",
    "meaning": "Que emite destellos vivos y centelleantes",
    "example": "Las luces navideñas coruscating alegraban toda la plaza municipal."
  },
  {
    "term": "Crystalline",
    "pron": "/ˈkrɪs.təl.aɪn/",
    "meaning": "Puro y transparente como cristal de manantial",
    "example": "El agua crystalline del cenote dejaba ver los peces en el fondo."
  },
  {
    "term": "Dazzling",
    "pron": "/ˈdæz.lɪŋ/",
    "meaning": "Deslumbrante que cega momentáneamente por su brillo intenso",
    "example": "El sol de mediodía en el desierto es dazzling y cegador."
  },
  {
    "term": "Dim",
    "pron": "/dɪm/",
    "meaning": "Atenuar o bajarle el brillo a la lámpara para que no ciegue",
    "example": "Dim the lights para que podamos ver la película a gusto."
  },
  {
    "term": "Diminutive",
    "pron": "/dɪˈmɪn.jə.t̬ɪv/",
    "meaning": "De tamaño muy pequeñito y compacto pero bien proporcionado",
    "example": "La figurita diminutive de barro cabe en la palma de la mano."
  },
  {
    "term": "Emit",
    "pron": "/iˈmɪt/",
    "meaning": "Emitir o desprender un haz de luz o calor",
    "example": "Las lámparas LED emit una luz blanca muy brillante."
  },
  {
    "term": "Expansive",
    "pron": "/ɪkˈspæn.sɪv/",
    "meaning": "Amplio, despejado y extendido sin límites a la vista",
    "example": "La vista expansive del valle verde quita el aliento."
  },
  {
    "term": "Flash",
    "pron": "/flæʃ/",
    "meaning": "Destellar de golpe o soltar un fogonazo de luz rápida",
    "example": "El flash de la cámara fotográfica me encandiló por un segundo."
  },
  {
    "term": "Fluorescent",
    "pron": "/flɔːˈres.ənt/",
    "meaning": "Color chillón muy visible bajo luz ultravioleta",
    "example": "El chaleco fluorescent del obrero se ve a kilómetros de distancia."
  },
  {
    "term": "Gaze",
    "pron": "/ɡeɪz/",
    "meaning": "Contemplar embobado el cielo estrellado o un paisaje hermoso",
    "example": "Nos quedamos a gaze a las estrellas en el campo."
  },
  {
    "term": "Gilded",
    "pron": "/ˈɡɪl.dɪd/",
    "meaning": "Recubierto de una fina capa de oro resplandeciente",
    "example": "El retablo gilded de la catedral barroca asombra a los turistas."
  },
  {
    "term": "Glance",
    "pron": "/ɡlæns/",
    "meaning": "Echar un vistazo rápido de reojo sin que se note",
    "example": "Le dio un quick glance al reloj para ver qué hora era."
  },
  {
    "term": "Glimpse",
    "pron": "/ɡlɪmps/",
    "meaning": "Entrever o vislumbrar algo rapidísimo a la pasada",
    "example": "Apenas alcancé a catch a glimpse del cometa antes de que desapareciera."
  },
  {
    "term": "Glistening",
    "pron": "/ˈɡlɪs.ən.ɪŋ/",
    "meaning": "Reluciente como rocío de la mañana o superficie mojada",
    "example": "El pasto amaneció glistening con el rocío fresco de la mañana."
  },
  {
    "term": "Glossy",
    "pron": "/ˈɡlɑː.si/",
    "meaning": "Con acabado liso y reflectante como laca recién pulida",
    "example": "Le dio un acabado glossy a la guitarra de madera de cedro."
  },
  {
    "term": "Glow",
    "pron": "/ɡloʊ/",
    "meaning": "Brillar con una luz suave, cálida y constante",
    "example": "Las brasas de la fogata todavía glow en la oscuridad."
  },
  {
    "term": "Grainy",
    "pron": "/ˈɡreɪ.ni/",
    "meaning": "Con granos o textura arenosa como la piedra de molcajete",
    "example": "La superficie grainy de la piedra volcánica muele chiles con facilidad."
  },
  {
    "term": "Holographic",
    "pron": "/ˌhɑː.ləˈɡræf.ɪk/",
    "meaning": "Imagen tridimensional creada con rayos láser",
    "example": "El sello holographic del billete garantiza que sea auténtico."
  },
  {
    "term": "Illuminate",
    "pron": "/ɪˈluː.mə.neɪt/",
    "meaning": "Iluminar por completo un cuarto oscuro o despejar dudas",
    "example": "El farol del patio logra illuminate toda la entrada."
  },
  {
    "term": "Incandescent",
    "pron": "/ˌɪn.kænˈdes.ənt/",
    "meaning": "Al rojo vivo o emitiendo luz cálida por calor",
    "example": "El foco incandescent del taller da una luz cálida muy tradicional."
  },
  {
    "term": "Intricate",
    "pron": "/ˈɪn.trə.kət/",
    "meaning": "Con detalles finísimos, complejos y minuciosamente labrados",
    "example": "El rebozo de Santa María del Río tiene un tejido intricate fascinante."
  },
  {
    "term": "Iridescent",
    "pron": "/ˌɪr.əˈdes.ənt/",
    "meaning": "Que cambia de color según el ángulo de la luz",
    "example": "Las plumas del colibrí tienen un tono iridescent que parece joya."
  },
  {
    "term": "Luminous",
    "pron": "/ˈluː.mɪ.nəs/",
    "meaning": "Que emite una luz clara, brillante y resplandeciente",
    "example": "La luna llena reflejada en el lago crea una atmósfera luminous y mágica."
  },
  {
    "term": "Lustrous",
    "pron": "/ˈlʌs.trəs/",
    "meaning": "Con un brillo suave, elegante y satinado como las perlas",
    "example": "Las perlas cultivadas tienen un acabado lustrous y fino."
  },
  {
    "term": "Magnify",
    "pron": "/ˈmæɡ.nə.faɪ/",
    "meaning": "Aumentar el tamaño visual con lupa o exagerar una bronca",
    "example": "El microscopio sirve para magnify las células miles de veces."
  },
  {
    "term": "Matte",
    "pron": "/mæt/",
    "meaning": "Acabado opaco y sobrio que no refleja destellos",
    "example": "Pintó la troca de color negro matte para que se viera bien perrona."
  },
  {
    "term": "Minimalist",
    "pron": "/ˈmɪn.ə.məl.ɪst/",
    "meaning": "De diseño limpio y sencillo sin adornos innecesarios",
    "example": "La casa tiene una decoración minimalist con muebles de madera clara."
  },
  {
    "term": "Monumental",
    "pron": "/ˌmɑːn.jəˈmen.t̬əl/",
    "meaning": "De gran valor histórico, tamaño imponente y belleza arquitectónica",
    "example": "La pirámide del Sol en Teotihuacán es una obra monumental."
  },
  {
    "term": "Obsidian",
    "pron": "/əbˈsɪd.i.ən/",
    "meaning": "Negro profundo y vítreo como la piedra volcánica prehispánica",
    "example": "El cuchillo ceremonial de obsidian brilla con una elegancia prehispánica."
  },
  {
    "term": "Opalescent",
    "pron": "/ˌoʊ.pəˈles.ənt/",
    "meaning": "Con reflejos lechosos y cambiantes como el ópalo",
    "example": "El cielo al atardecer tenía un brillo opalescent sobre el mar."
  },
  {
    "term": "Phosphorescent",
    "pron": "/ˌfɑːs.fəˈres.ənt/",
    "meaning": "Que brilla en la oscuridad tras absorber luz solar",
    "example": "Las manecillas phosphorescent del reloj se ven claritas de noche."
  },
  {
    "term": "Pliable",
    "pron": "/ˈplaɪ.ə.bəl/",
    "meaning": "Flexible y fácil de doblar sin quebrarse como cuero curtido",
    "example": "La masa de maíz fresca es pliable y perfecta para hacer tlacoyos."
  },
  {
    "term": "Porous",
    "pron": "/ˈpɔːr.əs/",
    "meaning": "Con poros microscópicos que absorben líquidos como el barro cocido",
    "example": "El cántaro porous de barro mantiene el agua fresca todo el día."
  },
  {
    "term": "Prismatic",
    "pron": "/prɪzˈmæt.ɪk/",
    "meaning": "Que descompone la luz blanca en los colores del arcoíris",
    "example": "El cristal de la ventana proyecta destellos prismatic sobre la sala."
  },
  {
    "term": "Radiant",
    "pron": "/ˈreɪ.di.ənt/",
    "meaning": "Que irradia felicidad, salud o una luz radiante",
    "example": "La quinceañera se veía radiant bajando por las escaleras del salón."
  },
  {
    "term": "Radiate",
    "pron": "/ˈreɪ.di.eɪt/",
    "meaning": "Irradiar calor o irradiar una felicidad contagiosa",
    "example": "El sol de mediodía radiates un calor impresionante."
  },
  {
    "term": "Razor-sharp",
    "pron": "/ˈreɪ.zɚ.ʃɑːrp/",
    "meaning": "Con un filo agudo como navaja de rasurar que corta con solo rozar",
    "example": "El cuchillo del carnicero está razor-sharp para filetear la carne."
  },
  {
    "term": "Reflect",
    "pron": "/rɪˈflekt/",
    "meaning": "Reflejar la imagen o el rayo de luz en un espejo",
    "example": "El espejo retrovisor helps reflect los carros que vienen detrás."
  },
  {
    "term": "Reflective",
    "pron": "/rɪˈflek.tɪv/",
    "meaning": "Que rebota los rayos de luz alertando a los carros",
    "example": "Los señalamientos reflective de la carretera salvan vidas de noche."
  },
  {
    "term": "Seamless",
    "pron": "/ˈsiːm.ləs/",
    "meaning": "Completamente liso sin costuras visibles ni uniones toscas",
    "example": "La esfera de acero inoxidable tiene una superficie seamless perfecta."
  },
  {
    "term": "Shadowy",
    "pron": "/ˈʃæd.oʊ.i/",
    "meaning": "Lleno de sombras misteriosas y penumbra tenue",
    "example": "El callejón shadowy de Guanajuato guarda leyendas coloniales."
  },
  {
    "term": "Shimmer",
    "pron": "/ˈʃɪm.ɚ/",
    "meaning": "Titilar o brillar con una luz temblorosa y cristalina",
    "example": "El agua del lago parecía shimmer bajo la luz de la luna llena."
  },
  {
    "term": "Shimmering",
    "pron": "/ˈʃɪm.ɚ.ɪŋ/",
    "meaning": "Con un brillo trémulo y titilante como las estrellas",
    "example": "La arena de la playa se veía shimmering bajo el rayo del sol."
  },
  {
    "term": "Squint",
    "pron": "/skwɪnt/",
    "meaning": "Entrecerrar los ojos o hacer bizcos por el reflejo del sol",
    "example": "Tuve que squint porque el sol me daba de lleno en los ojos."
  },
  {
    "term": "Stare",
    "pron": "/ster/",
    "meaning": "Quedarse viendo fijamente sin parpadear o clavar la mirada",
    "example": "Es de mala educación stare a la gente en el transporte público."
  },
  {
    "term": "Sun-bleached",
    "pron": "/ˈsʌn.bliːtʃt/",
    "meaning": "Decolorado naturalmente por el sol y la intemperie",
    "example": "La madera sun-bleached de la cerca rústica tiene un encanto añejo."
  },
  {
    "term": "Sun-drenched",
    "pron": "/ˈsʌn.drentʃt/",
    "meaning": "Bañado completamente por los rayos cálidos del sol",
    "example": "El patio sun-drenched de la hacienda florece con bugambilias moradas."
  },
  {
    "term": "Textured",
    "pron": "/ˈteks.tʃɚd/",
    "meaning": "Con relieve perceptible al tacto como la cantera labrada",
    "example": "La pared textured de cantera rosa le da mucha calidez a la fachada."
  },
  {
    "term": "Translucent",
    "pron": "/trænˈsluː.sənt/",
    "meaning": "Que deja pasar la luz pero no permite ver figuras claras",
    "example": "El vidrio translucent del baño da privacidad sin perder claridad."
  },
  {
    "term": "Vitreous",
    "pron": "/ˈvɪt.ri.əs/",
    "meaning": "Con aspecto o brillo de vidrio transparente y liso",
    "example": "La cerámica vidriada tiene un acabado vitreous impermeable."
  }
];

  // Catálogo unificado indexado por clave limpia
  const UNIFIED_CATALOG = {};
  
  function registerCategory(items, categoryName) {
    items.forEach(item => {
      const cleanKey = item.term.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
      const entry = Object.assign({}, item, {
        id: cleanKey,
        category: categoryName,
        audioUrl: 'audio/vocab/' + cleanKey + '.wav'
      });
      UNIFIED_CATALOG[cleanKey] = entry;
      UNIFIED_CATALOG[item.term.toLowerCase()] = entry;
    });
  }

  registerCategory(PHRASAL_VERBS_A_Z, 'Phrasal Verb');
  registerCategory(COLLOQUIAL_VOCABULARY, 'Colloquial & Slang');
  registerCategory(VISUAL_LIGHT_VOCABULARY, 'Visual & Light');

  // API del Diccionario Global
  const World3DDictionaries = {
    phrasalVerbs: PHRASAL_VERBS_A_Z,
    colloquial: COLLOQUIAL_VOCABULARY,
    visualLight: VISUAL_LIGHT_VOCABULARY,
    catalog: UNIFIED_CATALOG,

    get: function(key) {
      if (!key) return null;
      const clean = String(key).toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
      return UNIFIED_CATALOG[clean] || UNIFIED_CATALOG[String(key).toLowerCase()] || null;
    },

    getAudioUrl: function(termOrKey) {
      const entry = this.get(termOrKey);
      if (entry) return entry.audioUrl;
      const clean = String(termOrKey).toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
      return 'audio/vocab/' + clean + '.wav';
    },

    search: function(query) {
      if (!query) return [];
      const q = String(query).toLowerCase().trim();
      return Object.values(UNIFIED_CATALOG).filter((item, idx, self) => 
        self.findIndex(t => t.id === item.id) === idx &&
        (item.term.toLowerCase().includes(q) || item.meaning.toLowerCase().includes(q) || (item.example && item.example.toLowerCase().includes(q)))
      );
    }
  };

  // Auto-enriquecimiento de window.MASTER_MODULES_DATA si ya está cargado
  if (global.MASTER_MODULES_DATA) {
    if (!global.MASTER_MODULES_DATA.phrasal_verbs) {
      global.MASTER_MODULES_DATA.phrasal_verbs = { title: "PHRASAL VERBS / VERBOS COMPUESTOS", level: "A1-B2", items: [] };
    }
    // Incorporar todos los phrasal verbs sin duplicados
    const existingPhrasals = new Set((global.MASTER_MODULES_DATA.phrasal_verbs.items || []).map(i => i.term.toLowerCase()));
    PHRASAL_VERBS_A_Z.forEach(pv => {
      if (!existingPhrasals.has(pv.term.toLowerCase())) {
        global.MASTER_MODULES_DATA.phrasal_verbs.items.push(pv);
        existingPhrasals.add(pv.term.toLowerCase());
      }
    });
    global.MASTER_MODULES_DATA.phrasal_verbs.total = global.MASTER_MODULES_DATA.phrasal_verbs.items.length;

    // Incorporar expresiones coloquiales a native_idioms
    if (global.MASTER_MODULES_DATA.native_idioms) {
      const existingIdioms = new Set((global.MASTER_MODULES_DATA.native_idioms.items || []).map(i => i.term.toLowerCase()));
      COLLOQUIAL_VOCABULARY.forEach(col => {
        if (!existingIdioms.has(col.term.toLowerCase())) {
          global.MASTER_MODULES_DATA.native_idioms.items.push(col);
          existingIdioms.add(col.term.toLowerCase());
        }
      });
      global.MASTER_MODULES_DATA.native_idioms.total = global.MASTER_MODULES_DATA.native_idioms.items.length;
    }

    // Incorporar vocabulario de luz a power_adjectives / difficult_verbs
    if (global.MASTER_MODULES_DATA.power_adjectives) {
      const existingAdj = new Set((global.MASTER_MODULES_DATA.power_adjectives.items || []).map(i => i.term.toLowerCase()));
      VISUAL_LIGHT_VOCABULARY.forEach(vl => {
        if (!existingAdj.has(vl.term.toLowerCase())) {
          global.MASTER_MODULES_DATA.power_adjectives.items.push(vl);
          existingAdj.add(vl.term.toLowerCase());
        }
      });
      global.MASTER_MODULES_DATA.power_adjectives.total = global.MASTER_MODULES_DATA.power_adjectives.items.length;
    }
  }

  global.World3DDictionaries = World3DDictionaries;
  global.WORLD3D_DICTIONARIES = World3DDictionaries;

})(typeof window !== 'undefined' ? window : globalThis);
