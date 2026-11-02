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
    "term": "Add up",
    "pron": "/æd ʌp/",
    "meaning": "Tener sentido o cuadrar una historia",
    "example": "Lo que me cuenta Juan no me add up para nada."
  },
  {
    "term": "Allow for",
    "pron": "/əˈlaʊ fɔːr/",
    "meaning": "Tomar en cuenta o prever un imprevisto / tiempo extra",
    "example": "Hay que allow for el tráfico de periférico en hora pico."
  },
  {
    "term": "Answer back",
    "pron": "/ˈæn.sɚ bæk/",
    "meaning": "Contestarle feo a alguien o ser respondón",
    "example": "No le vayas a answer back a tu jefa porque te va peor."
  },
  {
    "term": "Ask after",
    "pron": "/æsk ˈæf.tɚ/",
    "meaning": "Preguntar por la salud o cómo le va a alguien",
    "example": "Tu tía vino ayer y se puso a ask after ti."
  },
  {
    "term": "Ask out",
    "pron": "/æsk aʊt/",
    "meaning": "Invitar a salir a alguien en plan de ligue",
    "example": "Júntate valor y anímate a ask her out al cine."
  },
  {
    "term": "Back down",
    "pron": "/bæk daʊn/",
    "meaning": "Echarse para atrás o rajarse en una discusión",
    "example": "Cuando vio la bronca que se armaba, prefirió back down."
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
    "term": "Bargain for",
    "pron": "/ˈbɑːr.ɡɪn fɔːr/",
    "meaning": "Esperarse algo imprevisto (más de lo que pedías)",
    "example": "Esta chamba resultó ser más difícil de lo que I bargained for."
  },
  {
    "term": "Beat up",
    "pron": "/biːt ʌp/",
    "meaning": "Ponerle una golpiza a alguien o estar madreado por el uso",
    "example": "Ese carro viejo ya está bien beat up pero todavía jala."
  },
  {
    "term": "Blow away",
    "pron": "/bloʊ əˈweɪ/",
    "meaning": "Dejar con la boca abierta o fascinar por completo",
    "example": "Ese concierto de rock me blow away por completo."
  },
  {
    "term": "Blow up",
    "pron": "/bloʊ ʌp/",
    "meaning": "Explotar de coraje / estallar o volverse viral de golpe",
    "example": "El profe va a blow up si ve que nadie hizo la tarea."
  },
  {
    "term": "Boil down to",
    "pron": "/bɔɪl daʊn tuː/",
    "meaning": "Reducirse todo al meollo del asunto",
    "example": "Todo este rollo se boil down to que falta lana."
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
    "term": "Bring about",
    "pron": "/brɪŋ əˈbaʊt/",
    "meaning": "Provocar o traer como consecuencia un cambio",
    "example": "Las nuevas tecnologías van a bring about una revolución total."
  },
  {
    "term": "Bring up",
    "pron": "/brɪŋ ʌp/",
    "meaning": "Sacar un tema a la plática o criar a los hijos",
    "example": "Ni se te ocurra bring up ese tema delicado en la comida familiar."
  },
  {
    "term": "Brush up on",
    "pron": "/brʌʃ ʌp ɑːn/",
    "meaning": "Darle una repasada a algo que ya tenías olvidado",
    "example": "Tengo que brush up on mi inglés conversacional antes de la entrevista."
  },
  {
    "term": "Bump into",
    "pron": "/bʌmp ˈɪn.tuː/",
    "meaning": "Toparse a alguien de pura casualidad en la calle",
    "example": "Ayer me bump into mi compadre en el tianguis."
  },
  {
    "term": "Burn out",
    "pron": "/bɝːn aʊt/",
    "meaning": "Quedar fundido o agotado por exceso de chamba",
    "example": "Si sigues trabajando doce horas diarias te vas a burn out."
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
    "term": "Chip in",
    "pron": "/tʃɪp ɪn/",
    "meaning": "Ponerse la del Puebla / hacer una vaquita para cooperar",
    "example": "Vamos a chip in diez dólares cada quien para las pizzas."
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
    "term": "Count on",
    "pron": "/kaʊnt ɑːn/",
    "meaning": "Contar con el apoyo incondicional de alguien",
    "example": "Sabes que puedes count on mí para las que sean."
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
    "term": "Eat out",
    "pron": "/iːt aʊt/",
    "meaning": "Salir a comer fuera a unos tacos o restaurante",
    "example": "Hoy no cocines nada, vámonos a eat out al centro."
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
    "term": "Face up to",
    "pron": "/feɪs ʌp tuː/",
    "meaning": "Afrontar la realidad y dar la cara a los problemas",
    "example": "Tienes que face up to tus errores y no echarle la culpa a otros."
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
    "term": "Find out",
    "pron": "/faɪnd aʊt/",
    "meaning": "Enterarse de un chisme o descubrir la verdad",
    "example": "Al final nos venimos a find out de todo lo que pasó."
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
    "term": "Freak out",
    "pron": "/friːk aʊt/",
    "meaning": "Paniquearse o ponerse histérico por un susto",
    "example": "Mi mamá va a freak out si ve el raspón en la puerta."
  },
  {
    "term": "Get across",
    "pron": "/ɡet əˈkrɔːs/",
    "meaning": "Hacerse entender claramente / transmitir una idea",
    "example": "El ponente logró get across su punto con mucha claridad."
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
    "term": "Get away with",
    "pron": "/ɡet əˈweɪ wɪð/",
    "meaning": "Salirse con la suya sin que lo cachen o castiguen",
    "example": "Pensó que se iba a get away with la trampa pero lo torcieron."
  },
  {
    "term": "Get by",
    "pron": "/ɡet baɪ/",
    "meaning": "Irla pasando o sobrevivir apenas con los gastos",
    "example": "Con este sueldo apenas alcanzamos para get by la quincena."
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
    "term": "Go ahead",
    "pron": "/ɡoʊ əˈhed/",
    "meaning": "¡Dale con confianza! / Seguir adelante con el plan",
    "example": "Si ya tienes todo listo, go ahead y lánzate al ruedo."
  },
  {
    "term": "Go back on",
    "pron": "/ɡoʊ bæk ɑːn/",
    "meaning": "Romper su promesa o no sostener la palabra dada",
    "example": "Jamás vayas a go back on una promesa hecha a un amigo."
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
    "term": "Go over",
    "pron": "/ɡoʊ ˈoʊ.vɚ/",
    "meaning": "Darle una revisada minuciosa a las cuentas o papeles",
    "example": "Vamos a go over los números para asegurarnos que cuadren."
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
    "term": "Iron out",
    "pron": "/ˈaɪ.ɚn aʊt/",
    "meaning": "Planchar las asperezas / resolver detallitos de un trato",
    "example": "Nos falta iron out un par de detallitos del contrato."
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
    "term": "Jump at",
    "pron": "/dʒʌmp æt/",
    "meaning": "Abalanzarse sobre una oportunidad sin pensarlo dos veces",
    "example": "Yo en tu lugar jump at esa oferta de chamba de volada."
  },
  {
    "term": "Keep away",
    "pron": "/kiːp əˈweɪ/",
    "meaning": "Mantenerse alejado del peligro o de las malas mañas",
    "example": "Keep away del enchufe descompuesto para que no te dé toques."
  },
  {
    "term": "Keep on",
    "pron": "/kiːp ɑːn/",
    "meaning": "Seguir terco dale y dale con lo mismo",
    "example": "A pesar del cansancio decidió keep on corriendo hasta la meta."
  },
  {
    "term": "Keep up with",
    "pron": "/kiːp ʌp wɪð/",
    "meaning": "Seguirle el paso o el ritmo a alguien más rápido",
    "example": "Es bien difícil keep up with las nuevas tendencias de redes."
  },
  {
    "term": "Kick back",
    "pron": "/kɪk bæk/",
    "meaning": "Tirarse a la flojera a descansar con una chela",
    "example": "El domingo sólo quiero kick back en el sillón y descansar."
  },
  {
    "term": "Kick off",
    "pron": "/kɪk ɔːf/",
    "meaning": "Arrancar un evento o dar la patada inicial del partido",
    "example": "El festival de música va a kick off a las cuatro de la tarde."
  },
  {
    "term": "Knock down",
    "pron": "/nɑːk daʊn/",
    "meaning": "Demoler una barda o noquear a alguien",
    "example": "Van a knock down esa construcción vieja para hacer un parque."
  },
  {
    "term": "Knock out",
    "pron": "/nɑːk aʊt/",
    "meaning": "Noquear al rival en el ring o quedar noqueado del sueño",
    "example": "Esa pastilla para la gripa me knocked out toda la noche."
  },
  {
    "term": "Lay off",
    "pron": "/leɪ ɔːf/",
    "meaning": "Despedir personal por recorte o dejar de estar molestando",
    "example": "La empresa tuvo que lay off a veinte empleados por la crisis."
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
    "term": "Line up",
    "pron": "/laɪn ʌp/",
    "meaning": "Hacer fila india o cuadrar una serie de citas",
    "example": "Tuvimos que line up desde las seis de la mañana por boletos."
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
    "term": "Move on",
    "pron": "/muːv ɑːn/",
    "meaning": "Pasar la página y seguir adelante con tu vida",
    "example": "Ya no te martirices por el pasado, hay que move on."
  },
  {
    "term": "Narrow down",
    "pron": "/ˈnær.oʊ daʊn/",
    "meaning": "Depurar la lista y reducir las opciones a las mejores",
    "example": "Pudimos narrow down los candidatos a los tres mejores perfiles."
  },
  {
    "term": "Nod off",
    "pron": "/nɑːd ɔːf/",
    "meaning": "Dar el pestañazo o cabecear de sueño sentado",
    "example": "Me estaba nod off en la clase de historia por el calor."
  },
  {
    "term": "Open up",
    "pron": "/ˈoʊ.pən ʌp/",
    "meaning": "Abrir el corazón y sincerarse con un amigo",
    "example": "Por fin se animó a open up y contarme lo que sentía."
  },
  {
    "term": "Opt out",
    "pron": "/ɑːpt aʊt/",
    "meaning": "Darse de baja voluntariamente o no querer participar",
    "example": "Decidió opt out de la tanda para no endeudarse."
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
    "term": "Pass away",
    "pron": "/pæs əˈweɪ/",
    "meaning": "Fallecer o pasar a mejor vida con respeto",
    "example": "Mi abuelita passed away en paz rodeada de su familia."
  },
  {
    "term": "Pass out",
    "pron": "/pæs aʊt/",
    "meaning": "Desmayarse por el calor o quedarse noqueado de cansancio",
    "example": "Hacía tanto bochorno en el desfile que una señora passed out."
  },
  {
    "term": "Pay back",
    "pron": "/peɪ bæk/",
    "meaning": "Devolver el dinero prestado o cobrarse una factura",
    "example": "Te juro que te pay back cada centavo el día de pago."
  },
  {
    "term": "Pay off",
    "pron": "/peɪ ɔːf/",
    "meaning": "Dar frutos el esfuerzo o terminar de pagar la deuda",
    "example": "Tantas noches de estudio por fin paid off con el diploma."
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
    "term": "Point out",
    "pron": "/pɔɪnt aʊt/",
    "meaning": "Señalar un detalle importante que nadie había visto",
    "example": "El arquitecto pointed out una fisura peligrosa en el muro."
  },
  {
    "term": "Polish up",
    "pron": "/ˈpɑː.lɪʃ ʌp/",
    "meaning": "Darle una pulida a tus habilidades o sacarle brillo a algo",
    "example": "Quiero polish up mi pronunciación antes de irme a Canadá."
  },
  {
    "term": "Pop out",
    "pron": "/pɑːp aʊt/",
    "meaning": "Botar de repente / salir un segundo a la tiendita",
    "example": "Voy a pop out al Oxxo a comprar un refresco, ahorita regreso."
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
    "meaning": "Llegar en coche y estacionarse / caerle a un lugar",
    "example": "I'm pulling up a la casa, salte de una vez con tus cosas."
  },
  {
    "term": "Put away",
    "pron": "/pʊt əˈweɪ/",
    "meaning": "Guardar las cosas en su lugar después de usarlas",
    "example": "Lava los trastes y put away las ollas en la alacena."
  },
  {
    "term": "Put down",
    "pron": "/pʊt daʊn/",
    "meaning": "Hacer menos a alguien con burlas / soltar un objeto",
    "example": "No dejes que nadie te put down por cómo hablas."
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
    "term": "Quiet down",
    "pron": "/ˈkwaɪ.ət daʊn/",
    "meaning": "Bajarle al escándalo y guardar silencio",
    "example": "¡Quiet down muchachos, que ya empezó la película!"
  },
  {
    "term": "Rip off",
    "pron": "/rɪp ɔːf/",
    "meaning": "Cobrar un ojo de la cara / estafar descaradamente",
    "example": "Ese taxi me cobró el triple, it was a total rip off."
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
    "term": "Save up",
    "pron": "/seɪv ʌp/",
    "meaning": "Ahorrar peso sobre peso para comprarse algo grande",
    "example": "Estoy saving up para dar el enganche de mi casita."
  },
  {
    "term": "Settle down",
    "pron": "/ˈset̬.əl daʊn/",
    "meaning": "Sentar cabeza / calmarse o establecerse en familia",
    "example": "Ya anduvo mucho de fiesta, ahora decidió settle down y casarse."
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
    "term": "Sink in",
    "pron": "/sɪŋk ɪn/",
    "meaning": "Caer el veinte de una noticia fuerte o asimilar la verdad",
    "example": "Tardó varios días en sink in que se había ganado la lotería."
  },
  {
    "term": "Slow down",
    "pron": "/sloʊ daʊn/",
    "meaning": "Bajarle a la velocidad o llevarse las cosas con más calma",
    "example": "¡Slow down compa, que la curva está muy cerrada!"
  },
  {
    "term": "Sort out",
    "pron": "/sɔːrt aʊt/",
    "meaning": "Poner orden en el relajo o arreglar un problema",
    "example": "Vamos a sentarnos a sort out este embrollo pacíficamente."
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
    "term": "Stand by",
    "pron": "/stænd baɪ/",
    "meaning": "Quedarse en guardia listo para entrar en acción",
    "example": "El equipo médico está en stand by para cualquier urgencia."
  },
  {
    "term": "Stand out",
    "pron": "/stænd aʊt/",
    "meaning": "Resaltar sobre los demás por talento o presencia",
    "example": "Ese muchacho siempre stands out por su disciplina para entrenar."
  },
  {
    "term": "Step down",
    "pron": "/step daʊn/",
    "meaning": "Renunciar a un cargo importante o dejarle el puesto a otro",
    "example": "El presidente del club tuvo que step down por broncas de salud."
  },
  {
    "term": "Step in",
    "pron": "/step ɪn/",
    "meaning": "Meter las manos para frenar un pleito o intervenir",
    "example": "El árbitro tuvo que step in antes de que se agarraran a golpes."
  },
  {
    "term": "Step up",
    "pron": "/step ʌp/",
    "meaning": "Dar un paso al frente y fajarse los pantalones como líder",
    "example": "Es momento de step up y demostrar de qué estás hecho."
  },
  {
    "term": "Stick to",
    "pron": "/stɪk tuː/",
    "meaning": "Apegarse al plan original sin salirse por la tangente",
    "example": "Hay que stick to la receta al pie de la letra para que quede rica."
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
    "term": "Take up",
    "pron": "/teɪk ʌp/",
    "meaning": "Iniciar un nuevo pasatiempo o abarcar mucho espacio",
    "example": "Ese mueble grandote takes up casi toda la sala."
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
    "term": "Tear down",
    "pron": "/ter daʊn/",
    "meaning": "Tirar una pared o demoler un edificio abandonado",
    "example": "Van a tear down esa bodega vieja para construir una plaza."
  },
  {
    "term": "Tell off",
    "pron": "/tel ɔːf/",
    "meaning": "Ponerle una buena regañada / cantar las verdades",
    "example": "La jefa de manzana se puso a tell off al vecino cochino."
  },
  {
    "term": "Think over",
    "pron": "/θɪŋk ˈoʊ.vɚ/",
    "meaning": "Consultarlo con la almohada y meditar bien la decisión",
    "example": "Déjame think over tu propuesta de negocio este fin de semana."
  },
  {
    "term": "Throw away",
    "pron": "/θroʊ əˈweɪ/",
    "meaning": "Tirar cosas a la basura o desperdiciar una oportunidad de oro",
    "example": "No vayas a throw away esa oportunidad de trabajo tan buena."
  },
  {
    "term": "Throw up",
    "pron": "/θroʊ ʌp/",
    "meaning": "Vomitar las tripas por comida descompuesta o mareo",
    "example": "Le cayó tan pesada la comida grasosa que tuvo que throw up."
  },
  {
    "term": "Track down",
    "pron": "/træk daʊn/",
    "meaning": "Rastrear o dar con el paradero de algo difícil de hallar",
    "example": "Por fin pude track down esa pieza de colección que tanto buscaba."
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
    "term": "Turn away",
    "pron": "/tɝːn əˈweɪ/",
    "meaning": "Rechazar en la entrada por falta de cupo o boleto",
    "example": "Tuvieron que turn away a mucha gente porque el antro se llenó."
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
    "term": "Turn up",
    "pron": "/tɝːn ʌp/",
    "meaning": "Subirle al volumen a la cumbia o aparecerse de imprevisto",
    "example": "¡Turn up esa canción que me gusta mucho!"
  },
  {
    "term": "Use up",
    "pron": "/juːz ʌp/",
    "meaning": "Gastarse hasta la última gota o terminarse todo",
    "example": "Mi hermano used up toda el agua caliente de la regadera."
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
    "term": "Wake up",
    "pron": "/weɪk ʌp/",
    "meaning": "Despertarse de golpe con la alarma",
    "example": "Me tengo que wake up a las cinco de la mañana para evitar el tráfico."
  },
  {
    "term": "Walk out on",
    "pron": "/wɔːk aʊt ɑːn/",
    "meaning": "Dejar botado a alguien en pleno apuro o abandonar el hogar",
    "example": "No es de hombres walk out on la familia cuando las cosas se ponen difíciles."
  },
  {
    "term": "Warm up",
    "pron": "/wɔːrm ʌp/",
    "meaning": "Calentar el motor de la troca o calentar músculos antes del ejercicio",
    "example": "Deja warm up el carro unos minutos antes de meter velocidad."
  },
  {
    "term": "Wash up",
    "pron": "/wɑːʃ ʌp/",
    "meaning": "Lavarse las manos y la cara antes de pasar a la mesa",
    "example": "Vete a wash up que ya casi vamos a comer."
  },
  {
    "term": "Watch out",
    "pron": "/wɑːtʃ aʊt/",
    "meaning": "¡Aguas! / ¡Ponte trucha con los peligros del camino!",
    "example": "¡Watch out con ese bache enorme en la calle!"
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
    "term": "Wipe out",
    "pron": "/waɪp aʊt/",
    "meaning": "Darse un azotón tremendo en la bicicleta o exterminar",
    "example": "El chavo se dio un tremendo wipe out en la patineta."
  },
  {
    "term": "Work out",
    "pron": "/wɝːk aʊt/",
    "meaning": "Hacer ejercicio en el gimnasio o resolverse bien las cosas",
    "example": "No te preocupes compa, vas a ver que todo va a work out a tu favor."
  },
  {
    "term": "Wrap up",
    "pron": "/ræp ʌp/",
    "meaning": "Dar por concluida la junta o abrigarse bien contra el frío",
    "example": "Vamos a wrap up esta reunión que ya es hora de la comida."
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
    "term": "Zone out",
    "pron": "/zoʊn aʊt/",
    "meaning": "Quedarse en la luna / perder el hilo de la conversación",
    "example": "Perdón, me quedé zoned out pensando en los pendientes de la casa."
  }
];

  // 2. Vocabulario Coloquial, Expresiones y Slang de México
  const COLLOQUIAL_VOCABULARY = [
  {
    "term": "Snatched me",
    "pron": "/snætʃt miː/",
    "meaning": "Me jaló con fuerza o me arrebató de un tirón",
    "example": "El vato snatched me del brazo para que no me cayera a la zanja."
  },
  {
    "term": "Baffled",
    "pron": "/ˈbæf.əld/",
    "meaning": "Perplejo, sacadísimo de onda o que no entiende nada",
    "example": "I'm baffled, neta no me cabe en la cabeza por qué hizo esa tontería."
  },
  {
    "term": "Pulling up",
    "pron": "/ˈpʊl.ɪŋ ʌp/",
    "meaning": "Llegando en coche, ya voy en camino o apareciendo",
    "example": "I'm pulling up a la fiesta, salte a recibirme a la banqueta."
  },
  {
    "term": "Pull up to the party",
    "pron": "/pʊl ʌp tuː ðə ˈpɑːr.t̬i/",
    "meaning": "¡Cáele a la fiesta! / Déjate caer con la banda",
    "example": "Pull up to the party en mi casa, va a haber carnita asada."
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
    "term": "Dull",
    "pron": "/dʌl/",
    "meaning": "Aburrido / sin chiste o un cuchillo sin filo (mocho)",
    "example": "Este cuchillo cebollero está bien dull, no corta ni la mantequilla."
  },
  {
    "term": "Sharp",
    "pron": "/ʃɑːrp/",
    "meaning": "Filoso como navaja de rasurar / muy abusado",
    "example": "Ten cuidado con ese machete que tiene un filo bien sharp."
  },
  {
    "term": "Blurry",
    "pron": "/ˈblɝː.i/",
    "meaning": "Borroso o que no se distingue bien la vista",
    "example": "Sin mis lentes de aumento veo todo completamente blurry."
  },
  {
    "term": "Clenching fists",
    "pron": "/ˈklen.tʃɪŋ fɪsts/",
    "meaning": "Apretando los puños del puro coraje",
    "example": "Estaba clenching his fists para no soltarle un golpe."
  },
  {
    "term": "Brisk",
    "pron": "/brɪsk/",
    "meaning": "Enérgico, de paso rápido o un clima fresquecito",
    "example": "Nos dimos una caminata brisk para calentar el cuerpo en la mañana."
  },
  {
    "term": "Carefree",
    "pron": "/ˈker.friː/",
    "meaning": "Despreocupado, sin broncas en la cabeza o relajado",
    "example": "Ese muchacho vive una vida bien carefree, nada le quita el sueño."
  },
  {
    "term": "Brusque",
    "pron": "/brʌsk/",
    "meaning": "Brusco, seco y cortante al tratar a la gente",
    "example": "El recepcionista me contestó de una manera muy brusque."
  },
  {
    "term": "Abrupt",
    "pron": "/əˈbrʌpt/",
    "meaning": "Abrupto, repentino y sin aviso previo",
    "example": "La junta tuvo un final muy abrupt cuando el director se paró enojado."
  },
  {
    "term": "Harsh",
    "pron": "/hɑːrʃ/",
    "meaning": "Severo, áspero o un regaño con palabras muy duras",
    "example": "Sus críticas fueron muy harsh, no tuvo pelos en la lengua."
  },
  {
    "term": "Blunt",
    "pron": "/blʌnt/",
    "meaning": "Directo al grano y sin rodeos / sin filo",
    "example": "Fue muy blunt y me dijo que no le gustaba mi trabajo."
  },
  {
    "term": "Stride",
    "pron": "/straɪd/",
    "meaning": "Caminar a zancadas largas y con paso firme",
    "example": "Caminaba con un stride seguro hacia la oficina del jefe."
  },
  {
    "term": "Shrill",
    "pron": "/ʃrɪl/",
    "meaning": "Estridente, chillón o un sonido muy agudo",
    "example": "Esa alarma vieja tiene un pitido bien shrill que taladra el oído."
  },
  {
    "term": "Skip",
    "pron": "/skɪp/",
    "meaning": "Dar un brinquito o saltito / saltarse una lección",
    "example": "Iba dando skips de alegría cuando supo que pasó el examen."
  },
  {
    "term": "Pace",
    "pron": "/peɪs/",
    "meaning": "Ritmo, cadencia o paso de marcha",
    "example": "Aguanta el pace que todavía nos faltan tres kilómetros de subida."
  },
  {
    "term": "Speed",
    "pron": "/spiːd/",
    "meaning": "Velocidad o meterle rapidez a la marcha",
    "example": "Bájale a la speed que esta calle tiene muchos topes."
  },
  {
    "term": "Tiptoe",
    "pron": "/ˈtɪp.toʊ/",
    "meaning": "Caminar de puntitas para no hacer ruido ni despertar a nadie",
    "example": "Entró de tiptoe a la recámara para que no lo oyera su mamá."
  },
  {
    "term": "Crawl",
    "pron": "/krɔːl/",
    "meaning": "Gatear como bebé o avanzar a vuelta de rueda en el tráfico",
    "example": "El bebé apenas empezó a crawl por toda la sala."
  },
  {
    "term": "Barefoot",
    "pron": "/ˈber.fʊt/",
    "meaning": "Andar a pata pelada / descalzo sobre el piso",
    "example": "No andes barefoot en el patio que te puedes enterrar una espina."
  },
  {
    "term": "Bare",
    "pron": "/ber/",
    "meaning": "Desnudo o pelón / cuarto totalmente vacío",
    "example": "The room was completely bare, no tenía ni una sola silla."
  },
  {
    "term": "Mess me around",
    "pron": "/mes miː əˈraʊnd/",
    "meaning": "Jugar conmigo, tomarme el pelo o hacerme perder el tiempo",
    "example": "Stop messing me around y dime de una vez si vas a comprar el carro o no."
  },
  {
    "term": "Hold a grudge",
    "pron": "/hoʊld ə ɡrʌdʒ/",
    "meaning": "Guardarle rencor o resentimiento añejo a alguien",
    "example": "He holds grudges por cualquier tontería, es muy resentido."
  },
  {
    "term": "Take a peek into",
    "pron": "/teɪk ə piːk ˈɪn.tuː/",
    "meaning": "Echar un vistazo o asomarse por curiosidad",
    "example": "Déjame take a peek into la cocina a ver qué huele tan rico."
  },
  {
    "term": "Accompany",
    "pron": "/əˈkʌm.pə.ni/",
    "meaning": "Acompañar a alguien para que no vaya solo",
    "example": "Déjame accompany ti hasta la parada del autobús para que no andes sola."
  },
  {
    "term": "Locked in",
    "pron": "/lɑːkt ɪn/",
    "meaning": "Encerrados o súper concentrados en la jugada / metidos al cien",
    "example": "El equipo de eSports está totalmente locked in practicando para la final."
  },
  {
    "term": "Betray",
    "pron": "/bɪˈtreɪ/",
    "meaning": "Traicionar la confianza de un amigo o puñalada por la espalda",
    "example": "Jamás pensé que mi socio me fuera a betray de esa manera."
  },
  {
    "term": "A walk in the park",
    "pron": "/ə wɔːk ɪn ðə pɑːrk/",
    "meaning": "Facilísimo, pan comido o regalado de hacer",
    "example": "Ese examen de inglés fue a walk in the park, saqué diez."
  },
  {
    "term": "Get your feet wet",
    "pron": "/ɡet jʊr fiːt wet/",
    "meaning": "Dar el primer paso o probar las aguas para empezar algo nuevo",
    "example": "Anímate a hablar con nativos para get your feet wet en el idioma."
  },
  {
    "term": "Follow in someone's footsteps",
    "pron": "/ˈfɑː.loʊ ɪn ˈsʌm.wʌnz ˈfʊt.steps/",
    "meaning": "Seguir los pasos o el ejemplo de superación de un familiar",
    "example": "Decidió estudiar medicina para follow in his father's footsteps."
  },
  {
    "term": "Think on your feet",
    "pron": "/θɪŋk ɑːn jʊr fiːt/",
    "meaning": "Improvisar rápido con maña ante una pregunta difícil",
    "example": "En una entrevista de trabajo tienes que learn to think on your feet."
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
    "term": "Put your money where your mouth is",
    "pron": "/pʊt jʊr ˈmʌn.i wer jʊr maʊθ ɪz/",
    "meaning": "Menos palabras y más acción / cumple lo que prometes con hechos",
    "example": "Dices que tu equipo va a ganar, ¡put your money where your mouth is!"
  },
  {
    "term": "Brake",
    "pron": "/breɪk/",
    "meaning": "El freno del carro o de la bicicleta",
    "example": "Písale al brake que se atravesó un perro en la calle."
  },
  {
    "term": "Cage",
    "pron": "/keɪdʒ/",
    "meaning": "Jaula de animales o celda de protección",
    "example": "El loro se salió de su cage y anda volando en la cochera."
  },
  {
    "term": "Traffic light",
    "pron": "/ˈtræf.ɪk laɪt/",
    "meaning": "El semáforo de la esquina",
    "example": "El traffic light se puso en rojo justo cuando iba a cruzar."
  },
  {
    "term": "Lamppost",
    "pron": "/ˈlæmp.poʊst/",
    "meaning": "Poste de luz de la calle o luminaria pública",
    "example": "Pegaron un anuncio de se busca perro en el lamppost."
  },
  {
    "term": "Light pole",
    "pron": "/laɪt poʊl/",
    "meaning": "Poste de luz eléctrica",
    "example": "Un camión rozó el light pole y casi tira los cables."
  },
  {
    "term": "Bench",
    "pron": "/bentʃ/",
    "meaning": "Banca del parque o asiento de madera",
    "example": "Nos sentamos en la bench del parque a comer unos churros."
  },
  {
    "term": "Caterpillar",
    "pron": "/ˈkæt̬.ɚ.pɪl.ɚ/",
    "meaning": "Oruga de mariposa que come hojitas verdes",
    "example": "Vimos una caterpillar verde caminando sobre las hojas del rosal."
  },
  {
    "term": "Hedgehog",
    "pron": "/ˈhedʒ.hɑːɡ/",
    "meaning": "Erizo con espinitas en la espalda",
    "example": "El hedgehog se hizo bolita con todas sus púas cuando se asustó."
  }
];

  // 3. Vocabulario Visual de Luz, Brillo y Observación
  const VISUAL_LIGHT_VOCABULARY = [
  {
    "term": "Emit",
    "pron": "/iˈmɪt/",
    "meaning": "Emitir o desprender un haz de luz o calor",
    "example": "Las lámparas LED emit una luz blanca muy brillante."
  },
  {
    "term": "Glow",
    "pron": "/ɡloʊ/",
    "meaning": "Brillar con una luz suave, cálida y constante",
    "example": "Las brasas de la fogata todavía glow en la oscuridad."
  },
  {
    "term": "Shimmer",
    "pron": "/ˈʃɪm.ɚ/",
    "meaning": "Titilar o brillar con una luz temblorosa y cristalina",
    "example": "El agua del lago parecía shimmer bajo la luz de la luna llena."
  },
  {
    "term": "Flash",
    "pron": "/flæʃ/",
    "meaning": "Destellar de golpe o soltar un fogonazo de luz rápida",
    "example": "El flash de la cámara fotográfica me encandiló por un segundo."
  },
  {
    "term": "Reflect",
    "pron": "/rɪˈflekt/",
    "meaning": "Reflejar la imagen o el rayo de luz en un espejo",
    "example": "El espejo retrovisor helps reflect los carros que vienen detrás."
  },
  {
    "term": "Illuminate",
    "pron": "/ɪˈluː.mə.neɪt/",
    "meaning": "Iluminar por completo un cuarto oscuro o despejar dudas",
    "example": "El farol del patio logra illuminate toda la entrada."
  },
  {
    "term": "Radiate",
    "pron": "/ˈreɪ.di.eɪt/",
    "meaning": "Irradiar calor o irradiar una felicidad contagiosa",
    "example": "El sol de mediodía radiates un calor impresionante."
  },
  {
    "term": "Dim",
    "pron": "/dɪm/",
    "meaning": "Atenuar o bajarle el brillo a la lámpara para que no ciegue",
    "example": "Dim the lights para que podamos ver la película a gusto."
  },
  {
    "term": "Glance",
    "pron": "/ɡlæns/",
    "meaning": "Echar un vistazo rápido de reojo sin que se note",
    "example": "Le dio un quick glance al reloj para ver qué hora era."
  },
  {
    "term": "Stare",
    "pron": "/ster/",
    "meaning": "Quedarse viendo fijamente sin parpadear o clavar la mirada",
    "example": "Es de mala educación stare a la gente en el transporte público."
  },
  {
    "term": "Gaze",
    "pron": "/ɡeɪz/",
    "meaning": "Contemplar embobado el cielo estrellado o un paisaje hermoso",
    "example": "Nos quedamos a gaze a las estrellas en el campo."
  },
  {
    "term": "Glimpse",
    "pron": "/ɡlɪmps/",
    "meaning": "Entrever o vislumbrar algo rapidísimo a la pasada",
    "example": "Apenas alcancé a catch a glimpse del cometa antes de que desapareciera."
  },
  {
    "term": "Squint",
    "pron": "/skwɪnt/",
    "meaning": "Entrecerrar los ojos o hacer bizcos por el reflejo del sol",
    "example": "Tuve que squint porque el sol me daba de lleno en los ojos."
  },
  {
    "term": "Magnify",
    "pron": "/ˈmæɡ.nə.faɪ/",
    "meaning": "Aumentar el tamaño visual con lupa o exagerar una bronca",
    "example": "El microscopio sirve para magnify las células miles de veces."
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
