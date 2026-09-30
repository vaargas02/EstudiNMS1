// ============================================================
//  Raíz y nervio — contenido del tema (anatomía neuromuscular)
//  El motor (motor.js) no se toca: aquí van los datos, las
//  tarjetas que se generan con ellos, las láminas y la consulta.
// ============================================================

// ============================================================
//  Neuromusc — base de contenido
//  Raíces y nervios: Aids to the Examination of the Peripheral
//  Nervous System (O'Brien, 6.ª ed.). Raíz principal en `roots`,
//  accesorias en `minor`. Dermatomas: puntos clave ISNCSCI.
// ============================================================

const BLOQUES = [
  { id: 'ms',   name: 'Miembro superior',        short: 'MS',   weight: 3 },
  { id: 'mi',   name: 'Miembro inferior',        short: 'MI',   weight: 2 },
  { id: 'ax',   name: 'Craneal y axial',         short: 'Axial', weight: 1 },
  { id: 'refl', name: 'Reflejos',                short: 'Refl', weight: 1 },
  { id: 'mio',  name: 'Exploración por raíz',    short: 'Raíz', weight: 1 },
  { id: 'plex', name: 'Plexos',                  short: 'Plexo', weight: 1 },
  { id: 'derm', name: 'Dermatomas',              short: 'Derm', weight: 2 },
  { id: 'cut',  name: 'Territorios cutáneos',    short: 'Cut',  weight: 1 },
  { id: 'loc',  name: 'Localización raíz/nervio', short: 'Loc', weight: 1 },
  { id: 'emg',  name: 'Neurofisiología (EMG)',   short: 'EMG',  weight: 1 },
];

// Chips de raíces por región
const ROOT_CHIPS = {
  ms: ['C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1'],
  mi: ['L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3'],
  ax: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
};

// M(id, nombre, región, nervio, grupoNervio, raíces, accesorias, función, familia, inversa, explicación)
function M(id, n, r, nerve, group, roots, minor, act, fam, inv, ex) {
  return { id, n, r, nerve, group, roots, minor, act, fam, inv, ex };
}

const MUSCLES = [
  // ---------------- MIEMBRO SUPERIOR ----------------
  M('trapecio', 'Trapecio', 'ms', 'Accesorio espinal (XI)', 'xi', [], [], 'Elevación y retracción de la escápula', 'escapula', false,
    'Inervación motora por el XI par, con aferencias de C3-C4 por el plexo cervical. Su debilidad da escápula alada lateral (el ángulo inferior se desplaza hacia fuera) y hombro caído. Lesión típica: cirugía del triángulo posterior del cuello.'),
  M('romboides', 'Romboides', 'ms', 'Dorsal de la escápula', 'dorsesc', ['C5'], ['C4'], 'Retracción y elevación de la escápula', 'escapula', false,
    'El dorsal de la escápula sale directamente de la raíz C5. Por eso distingue una radiculopatía C5 (romboides afectado) de una lesión del tronco superior (romboides preservado).'),
  M('serrato', 'Serrato anterior', 'ms', 'Torácico largo', 'toraclargo', ['C5', 'C6', 'C7'], [], 'Protracción de la escápula y fijación contra el tórax', 'escapula', true,
    'Su debilidad produce escápula alada medial, más evidente al empujar contra la pared. El torácico largo nace directamente de las raíces: afectado en radiculopatías, preservado en lesiones de troncos. Frecuente en Parsonage-Turner.'),
  M('pectclav', 'Pectoral mayor (porción clavicular)', 'ms', 'Pectoral lateral', 'pect', ['C5', 'C6'], [], 'Flexión y aducción del brazo', 'pectoral', false,
    'La porción clavicular (C5-C6) y la esternocostal (C6-C8) tienen raíces distintas: útil para localizar lesiones del plexo.'),
  M('pectest', 'Pectoral mayor (porción esternocostal)', 'ms', 'Pectorales lateral y medial', 'pect', ['C6', 'C7', 'C8'], [], 'Aducción y rotación interna del brazo', 'rotint', false,
    'Recibe fibras del fascículo lateral y del medial. En lesiones del tronco inferior la porción esternocostal se afecta más que la clavicular.'),
  M('supraesp', 'Supraespinoso', 'ms', 'Supraescapular', 'supraesc', ['C5', 'C6'], [], 'Inicio de la abducción del brazo (0–15°)', 'abdhombro', true,
    'El supraescapular sale del tronco superior. Atrapamiento en la escotadura supraescapular (supra + infraespinoso) o en la espinoglenoidea (solo infraespinoso). Muy afectado en Parsonage-Turner.'),
  M('infraesp', 'Infraespinoso', 'ms', 'Supraescapular', 'supraesc', ['C5', 'C6'], [], 'Rotación externa del brazo', 'rotext', true,
    'Atrofia aislada del infraespinoso: piensa en el supraescapular en la escotadura espinoglenoidea (quiste del labrum, deportistas de lanzamiento).'),
  M('subesc', 'Subescapular', 'ms', 'Subescapulares superior e inferior', 'subesc', ['C5', 'C6'], [], 'Rotación interna del brazo', 'rotint', false,
    'Los nervios subescapulares salen del fascículo posterior.'),
  M('dorsalancho', 'Dorsal ancho', 'ms', 'Toracodorsal', 'toracodorsal', ['C6', 'C7', 'C8'], [], 'Aducción, extensión y rotación interna del brazo', 'rotint', false,
    'El toracodorsal sale del fascículo posterior, como el axilar y el radial. Se explora pidiendo al paciente que tosa mientras palpas el borde posterior de la axila.'),
  M('redmayor', 'Redondo mayor', 'ms', 'Subescapular inferior', 'subesc', ['C5', 'C6'], ['C7'], 'Aducción y rotación interna del brazo', 'rotint', false,
    'Inervado por el subescapular inferior, rama del fascículo posterior.'),
  M('deltoides', 'Deltoides', 'ms', 'Axilar', 'axilar', ['C5'], ['C6'], 'Abducción del brazo (15–90°)', 'abdhombro', true,
    'El axilar sale del fascículo posterior. Lesión típica en luxación de hombro o fractura del cuello quirúrgico del húmero; pérdida sensitiva en «parche regimental» sobre el deltoides.'),
  M('redmenor', 'Redondo menor', 'ms', 'Axilar', 'axilar', ['C5'], ['C6'], 'Rotación externa del brazo', 'rotext', false,
    'Segundo músculo del axilar. La rotación externa depende sobre todo del infraespinoso, por lo que su déficit aislado apenas se nota.'),
  M('biceps', 'Bíceps braquial', 'ms', 'Musculocutáneo', 'mc', ['C5', 'C6'], [], 'Flexión del codo y supinación del antebrazo', 'flexcodo', true,
    'Reflejo bicipital C5-C6. El musculocutáneo sale del fascículo lateral y termina como cutáneo antebraquial lateral (sensibilidad del borde radial del antebrazo).'),
  M('braquial', 'Braquial', 'ms', 'Musculocutáneo', 'mc', ['C5', 'C6'], [], 'Flexión del codo en cualquier posición del antebrazo', 'flexcodo', false,
    'Flexor puro del codo. Recibe además una pequeña contribución del radial en su parte lateral.'),
  M('triceps', 'Tríceps braquial', 'ms', 'Radial', 'radial', ['C7'], ['C6', 'C8'], 'Extensión del codo', 'extcodo', true,
    'Reflejo tricipital C7. Las ramas al tríceps salen en la axila y la parte alta del brazo: en la lesión en el canal de torsión («parálisis del sábado») el tríceps suele estar preservado.'),
  M('braquiorr', 'Braquiorradial', 'ms', 'Radial', 'radial', ['C5', 'C6'], [], 'Flexión del codo con el antebrazo en semipronación', 'flexcodo', true,
    'Reflejo estilorradial C5-C6. Es un músculo del radial que flexiona: útil para localizar lesiones radiales por encima del codo (afectado en el canal de torsión, preservado en el interóseo posterior).'),
  M('erlc', 'Extensor radial largo del carpo', 'ms', 'Radial', 'radial', ['C5', 'C6'], [], 'Extensión de la muñeca con desviación radial', 'extmuneca', false,
    'Inervado por el radial antes de su división. En la lesión del interóseo posterior la muñeca se extiende con desviación radial (ERLC preservado, extensor cubital afectado).'),
  M('supinador', 'Supinador', 'ms', 'Interóseo posterior', 'radial', ['C6', 'C7'], [], 'Supinación del antebrazo (con el codo extendido)', 'supin', false,
    'El interóseo posterior atraviesa el supinador por la arcada de Frohse, sitio típico de atrapamiento.'),
  M('ecc', 'Extensor cubital del carpo', 'ms', 'Interóseo posterior', 'radial', ['C7', 'C8'], [], 'Extensión de la muñeca con desviación cubital', 'extmuneca', false,
    'Primer extensor que se pierde en la lesión del interóseo posterior: por eso la muñeca se desvía hacia radial al extender.'),
  M('edc', 'Extensor de los dedos', 'ms', 'Interóseo posterior', 'radial', ['C7', 'C8'], [], 'Extensión de las metacarpofalángicas de los dedos', 'extdedos', true,
    'En la lesión del interóseo posterior hay dedos caídos sin déficit sensitivo: el nervio es puramente motor.'),
  M('alp', 'Abductor largo del pulgar', 'ms', 'Interóseo posterior', 'radial', ['C7', 'C8'], [], 'Abducción del pulgar en el plano de la palma', 'pulgarabd', false,
    'Abduce el pulgar hacia radial (en el plano de la palma), a diferencia del abductor corto, que lo hace perpendicular a la palma.'),
  M('elp', 'Extensor largo del pulgar', 'ms', 'Interóseo posterior', 'radial', ['C7', 'C8'], [], 'Extensión de la interfalángica del pulgar', 'pulgarext', false,
    'Se explora extendiendo la punta del pulgar con la mano apoyada. Puede romperse tras fractura de Colles.'),
  M('ecp', 'Extensor corto del pulgar', 'ms', 'Interóseo posterior', 'radial', ['C7', 'C8'], [], 'Extensión de la metacarpofalángica del pulgar', 'pulgarext', false,
    'Forma con el abductor largo el borde radial de la tabaquera anatómica.'),
  M('eip', 'Extensor propio del índice', 'ms', 'Interóseo posterior', 'radial', ['C7', 'C8'], [], 'Extensión del índice', 'extdedos', false,
    'Último músculo inervado por el interóseo posterior: útil en EMG para confirmar la extensión distal de la lesión.'),
  M('pronred', 'Pronador redondo', 'ms', 'Mediano', 'mediano', ['C6', 'C7'], [], 'Pronación del antebrazo', 'pron', true,
    'Primer músculo del mediano bajo el codo. Afectado en lesiones proximales del mediano y en C6-C7; preservado en el túnel carpiano. Útil en EMG de radiculopatía C6-C7.'),
  M('frc', 'Flexor radial del carpo', 'ms', 'Mediano', 'mediano', ['C6', 'C7'], [], 'Flexión de la muñeca con desviación radial', 'flexmuneca', false,
    'Útil para distinguir radiculopatía C7 (FRC y tríceps afectados) de una lesión radial (FRC normal).'),
  M('fsd', 'Flexor superficial de los dedos', 'ms', 'Mediano', 'mediano', ['C7', 'C8', 'T1'], [], 'Flexión de las interfalángicas proximales', 'flexdedos', false,
    'Se aísla sujetando los demás dedos en extensión y pidiendo flexionar uno solo en la IFP.'),
  M('fdp23', 'Flexor profundo de los dedos (índice y medio)', 'ms', 'Interóseo anterior', 'mediano', ['C7', 'C8'], [], 'Flexión de la interfalángica distal del índice y medio', 'fdp', false,
    'Con el flexor largo del pulgar forma el signo del «OK»: en la lesión del interóseo anterior el círculo pulgar-índice queda en «pico de pato». El interóseo anterior es motor puro.'),
  M('flp', 'Flexor largo del pulgar', 'ms', 'Interóseo anterior', 'mediano', ['C7', 'C8'], [], 'Flexión de la interfalángica del pulgar', 'pulgarflex', true,
    'También es el que compensa en el signo de Froment (debilidad del aductor del pulgar, cubital).'),
  M('pcuad', 'Pronador cuadrado', 'ms', 'Interóseo anterior', 'mediano', ['C7', 'C8'], [], 'Pronación con el codo flexionado', 'pron', false,
    'Se aísla con el codo en flexión completa, que anula al pronador redondo. Se afecta en la lesión del interóseo anterior.'),
  M('acp', 'Abductor corto del pulgar', 'ms', 'Mediano', 'mediano', ['T1'], ['C8'], 'Abducción del pulgar perpendicular a la palma', 'pulgarabd', true,
    'Músculo clave del túnel carpiano (atrofia tenar lateral). Raíz principal T1: también se afecta en lesiones C8-T1 o del tronco inferior (en el desfiladero torácico neurogénico se atrofia sobre todo el ACP).'),
  M('oponente', 'Oponente del pulgar', 'ms', 'Mediano', 'mediano', ['C8', 'T1'], [], 'Oposición del pulgar', 'pulgaropo', false,
    'Inervado por la rama motora recurrente del mediano tras el túnel carpiano.'),
  M('lumb12', 'Lumbricales I y II', 'ms', 'Mediano', 'mediano', ['C8', 'T1'], [], 'Flexión de la MCF con extensión de las IF (índice y medio)', 'lumb', false,
    'Los lumbricales I-II son del mediano y los III-IV del cubital: por eso la garra cubital es más marcada en 4.º y 5.º dedo.'),
  M('fcc', 'Flexor cubital del carpo', 'ms', 'Cubital', 'cubital', ['C7', 'C8'], ['T1'], 'Flexión de la muñeca con desviación cubital', 'flexmuneca', false,
    'Primer músculo del cubital en el antebrazo. Puede estar preservado en la neuropatía cubital en el codo si sus ramas salen proximales a la compresión.'),
  M('fdp45', 'Flexor profundo de los dedos (anular y meñique)', 'ms', 'Cubital', 'cubital', ['C7', 'C8'], [], 'Flexión de la interfalángica distal del anular y meñique', 'fdp', false,
    'Afectado en lesiones del cubital en el codo y preservado en el canal de Guyon. Por eso la garra es más marcada en lesiones distales («paradoja cubital»).'),
  M('adm', 'Abductor del meñique', 'ms', 'Cubital', 'cubital', ['C8', 'T1'], [], 'Abducción del meñique', 'abdmenique', true,
    'Músculo clave T1 de la ISNCSCI. Registro habitual de la conducción motora cubital.'),
  M('pid', 'Primer interóseo dorsal', 'ms', 'Cubital', 'cubital', ['C8', 'T1'], [], 'Abducción del índice', 'interoseos', true,
    'Inervado por la rama profunda del cubital. Registro útil en lesiones de esa rama (canal de Guyon), donde puede afectarse con el abductor del meñique preservado.'),
  M('intpalm', 'Interóseos palmares', 'ms', 'Cubital', 'cubital', ['C8', 'T1'], [], 'Aducción de los dedos', 'interoseos', false,
    'Se exploran sujetando un papel entre dos dedos extendidos.'),
  M('aductpulg', 'Aductor del pulgar', 'ms', 'Cubital', 'cubital', ['C8', 'T1'], [], 'Aducción del pulgar', 'pulgaradd', true,
    'Signo de Froment: al sujetar un papel entre pulgar e índice, el paciente flexiona la IF del pulgar (flexor largo, mediano) para compensar el aductor débil.'),
  M('lumb34', 'Lumbricales III y IV', 'ms', 'Cubital', 'cubital', ['C8', 'T1'], [], 'Flexión de la MCF con extensión de las IF (anular y meñique)', 'lumb', false,
    'Su debilidad, con la de los interóseos, produce la mano en garra cubital (hiperextensión MCF y flexión IF del 4.º y 5.º dedo).'),

  // ---------------- MIEMBRO INFERIOR ----------------
  M('iliopsoas', 'Iliopsoas', 'mi', 'Femoral y ramas del plexo lumbar', 'femoral', ['L1', 'L2', 'L3'], [], 'Flexión de la cadera', 'flexcadera', true,
    'Músculo clave L2 de la ISNCSCI. El ilíaco recibe el femoral y el psoas ramas directas del plexo: debilidad de flexión de cadera con resto del femoral normal sugiere lesión más proximal (plexo o raíz).'),
  M('sartorio', 'Sartorio', 'mi', 'Femoral', 'femoral', ['L2', 'L3'], [], 'Flexión, abducción y rotación externa de la cadera', 'flexcadera', false,
    'Posición «del sastre». El femoral sale de las divisiones posteriores de L2-L4.'),
  M('cuadriceps', 'Cuádriceps', 'mi', 'Femoral', 'femoral', ['L3', 'L4'], ['L2'], 'Extensión de la rodilla', 'extrodilla', true,
    'Reflejo rotuliano L3-L4. Cuádriceps y aductores débiles: L3-L4 o plexo lumbar. Solo cuádriceps: femoral. En RM muscular, el recto femoral y los vastos pueden afectarse de forma selectiva (ej. vasto en miositis por cuerpos de inclusión).'),
  M('aductlargo', 'Aductores largo y corto', 'mi', 'Obturador', 'obturador', ['L2', 'L3'], ['L4'], 'Aducción de la cadera', 'addcadera', true,
    'Distinguen neuropatía femoral (aductores normales) de radiculopatía L3-L4 o plexopatía lumbar (aductores débiles).'),
  M('gracil', 'Grácil (recto interno)', 'mi', 'Obturador', 'obturador', ['L2', 'L3'], [], 'Aducción de la cadera y flexión de la rodilla', 'addcadera', false,
    'Único aductor que cruza la rodilla. El obturador sale de las divisiones anteriores de L2-L4.'),
  M('aductmayor', 'Aductor mayor', 'mi', 'Obturador y ciático (división tibial)', 'obturador', ['L2', 'L3', 'L4'], [], 'Aducción y extensión de la cadera', 'addcadera', false,
    'Doble inervación: la porción aductora por el obturador y la isquiotibial por el ciático.'),
  M('gluteomedio', 'Glúteo medio y menor', 'mi', 'Glúteo superior', 'gluteosup', ['L5'], ['L4', 'S1'], 'Abducción y rotación interna de la cadera', 'abdcadera', true,
    'Clave en el pie caído: afectado en radiculopatía L5, preservado en neuropatía peroneal. Su debilidad produce marcha de Trendelenburg.'),
  M('tfl', 'Tensor de la fascia lata', 'mi', 'Glúteo superior', 'gluteosup', ['L4', 'L5'], ['S1'], 'Abducción y rotación interna de la cadera', 'abdcadera', false,
    'Comparte nervio con el glúteo medio y menor (glúteo superior, L4-S1).'),
  M('gluteomayor', 'Glúteo mayor', 'mi', 'Glúteo inferior', 'gluteoinf', ['L5', 'S1'], ['S2'], 'Extensión de la cadera', 'extcadera', true,
    'El glúteo inferior solo inerva el glúteo mayor. Debilidad: dificultad para levantarse de la silla y subir escaleras.'),
  M('semis', 'Semitendinoso y semimembranoso', 'mi', 'Ciático (división tibial)', 'ciatico', ['L5', 'S1'], ['S2'], 'Flexión de la rodilla y rotación interna de la pierna', 'isquio', false,
    'Reflejo isquiotibial medial: L5. Útil cuando el aquíleo (S1) y el rotuliano (L3-L4) son normales.'),
  M('bflarga', 'Bíceps femoral (cabeza larga)', 'mi', 'Ciático (división tibial)', 'ciatico', ['L5', 'S1'], ['S2'], 'Flexión de la rodilla y extensión de la cadera', 'isquio', false,
    'La cabeza larga es de la división tibial; la corta, de la peronea.'),
  M('bfcorta', 'Bíceps femoral (cabeza corta)', 'mi', 'Ciático (división peronea)', 'ciatico', ['L5', 'S1'], ['S2'], 'Flexión de la rodilla', 'isquio', false,
    'Único músculo del muslo inervado por la división peronea. Si está afectado en un pie caído, la lesión es proximal a la cabeza del peroné (ciático), no del peroneo común.'),
  M('tibant', 'Tibial anterior', 'mi', 'Peroneo profundo', 'peroneo', ['L4'], ['L5'], 'Dorsiflexión del tobillo', 'dorsiflex', true,
    'Músculo clave L4 de la ISNCSCI. Afectado tanto en radiculopatía L4-L5 como en neuropatía peroneal (pie caído).'),
  M('eldg', 'Extensor largo del dedo gordo', 'mi', 'Peroneo profundo', 'peroneo', ['L5'], ['S1'], 'Extensión del dedo gordo', 'extdedospie', true,
    'Músculo clave L5 de la ISNCSCI.'),
  M('eld', 'Extensor largo de los dedos', 'mi', 'Peroneo profundo', 'peroneo', ['L5', 'S1'], [], 'Extensión de los dedos del pie', 'extdedospie', false,
    'Inervado por el peroneo profundo junto al tibial anterior y el extensor del dedo gordo.'),
  M('pedio', 'Extensor corto de los dedos (pedio)', 'mi', 'Peroneo profundo', 'peroneo', ['L5', 'S1'], [], 'Extensión de los dedos (músculo del dorso del pie)', 'extdedospie', false,
    'Registro habitual de la conducción motora peroneal.'),
  M('peroneos', 'Peroneos largo y corto', 'mi', 'Peroneo superficial', 'peroneo', ['L5', 'S1'], [], 'Eversión del pie', 'eversion', true,
    'El peroneo superficial da la motora de los peroneos y la sensibilidad del dorso del pie y cara anterolateral de la pierna.'),
  M('tibpost', 'Tibial posterior', 'mi', 'Tibial', 'tibial', ['L4', 'L5'], [], 'Inversión del pie', 'inversion', true,
    'Clave del pie caído: afectado en radiculopatía L5 y lesión ciática, preservado en neuropatía peroneal. Explora la inversión con el pie en flexión plantar.'),
  M('gastro', 'Gastrocnemio (medial y lateral)', 'mi', 'Tibial', 'tibial', ['S1'], ['S2'], 'Flexión plantar del tobillo', 'plantar', true,
    'Reflejo aquíleo S1; músculo clave S1 de la ISNCSCI. En la RM muscular, el gastrocnemio medial se afecta precozmente en disferlinopatía (Miyoshi) y en otras miopatías distales.'),
  M('soleo', 'Sóleo', 'mi', 'Tibial', 'tibial', ['S1', 'S2'], [], 'Flexión plantar del tobillo con la rodilla flexionada', 'plantar', false,
    'Con la rodilla flexionada el gastrocnemio queda acortado y la flexión plantar depende del sóleo. Músculo donde se registra el reflejo H.'),
  M('fld', 'Flexor largo de los dedos', 'mi', 'Tibial', 'tibial', ['S1', 'S2'], [], 'Flexión de los dedos del pie', 'flexdedospie', false,
    'Compartimento posterior profundo, con el tibial posterior y el flexor largo del dedo gordo.'),
  M('fldg', 'Flexor largo del dedo gordo', 'mi', 'Tibial', 'tibial', ['S1', 'S2'], [], 'Flexión del dedo gordo', 'flexdedospie', false,
    'Compartimento posterior profundo de la pierna.'),
  M('abdhallux', 'Abductor del dedo gordo', 'mi', 'Plantar medial (tibial)', 'tibial', ['S1', 'S2'], [], 'Abducción del dedo gordo', 'abdhallux', false,
    'Registro habitual de la conducción motora tibial. Afectado en el síndrome del túnel del tarso.'),

  // ---------------- CRANEAL Y AXIAL ----------------
  M('ecm', 'Esternocleidomastoideo', 'ax', 'Accesorio espinal (XI)', 'xi', [], [], 'Rotación de la cabeza al lado contrario y flexión del cuello', 'cuello', false,
    'Con el trapecio, es el músculo del XI par. Su debilidad es frecuente en distrofia miotónica tipo 1 (con atrofia, «cuello de cisne»).'),
  M('diafragma', 'Diafragma', 'ax', 'Frénico', 'frenico', ['C3', 'C4', 'C5'], [], 'Inspiración', 'resp', true,
    '«C3, 4 y 5 mantienen vivo al diafragma». Clave en ELA, Pompe y miastenia: vigila la capacidad vital forzada (sobre todo en decúbito) y la respiración paradójica.'),
  M('flexcuello', 'Flexores del cuello', 'ax', 'Ramos anteriores cervicales (C1–C6)', 'ramant', [], [], 'Flexión del cuello', 'cuello', false,
    'Su debilidad es muy frecuente en miastenia, miositis y miopatías. Predice a menudo la debilidad respiratoria en el GBS y la crisis miasténica.'),
  M('paraesp', 'Extensores del cuello y paraespinales', 'ax', 'Ramos dorsales de los nervios espinales', 'ramdors', [], [], 'Extensión del cuello y del tronco', 'tronco', false,
    'Su debilidad cervical produce cabeza caída (ELA, miastenia, miopatía de extensores). En EMG, la denervación paraespinal localiza la lesión en la raíz, porque el ramo dorsal sale proximal al plexo.'),
  M('rectoabd', 'Recto abdominal', 'ax', 'Intercostales / toracoabdominales (T6–T12)', 'intercost', [], [], 'Flexión del tronco', 'tronco', false,
    'Signo de Beevor: el ombligo asciende al flexionar el cuello en decúbito por debilidad de la mitad inferior del recto (≈T10). Típico de la distrofia facioescapulohumeral.'),
  M('orbocular', 'Orbicular de los ojos', 'ax', 'Facial (VII)', 'facial', [], [], 'Cierre palpebral', 'facial', true,
    'Debilidad facial en miastenia, distrofia FSH, distrofia miotónica y GBS (diplejía facial). En miastenia, el cierre ocular débil es muy frecuente incluso en formas oculares.'),
  M('orbboca', 'Orbicular de la boca', 'ax', 'Facial (VII)', 'facial', [], [], 'Cierre de los labios (silbar, soplar)', 'facial', false,
    'No poder silbar ni hinchar las mejillas es típico de la distrofia facioescapulohumeral.'),
  M('masetero', 'Masetero y temporal', 'ax', 'Trigémino (V3, mandibular)', 'trigemino', [], [], 'Cierre de la mandíbula (masticación)', 'mandibula', false,
    'La debilidad del cierre mandibular es característica de la miastenia (el paciente se sujeta la mandíbula). En ELA puede haber reflejo maseterino exaltado (1.ª motoneurona bulbar).'),
  M('lengua', 'Musculatura de la lengua (geniogloso)', 'ax', 'Hipogloso (XII)', 'hipogloso', [], [], 'Protrusión de la lengua (se desvía hacia el lado débil)', 'lengua', true,
    'Atrofia y fasciculaciones linguales: signo de 2.ª motoneurona bulbar (ELA, enfermedad de Kennedy).'),
  M('elevpalp', 'Elevador del párpado superior', 'ax', 'Oculomotor (III)', 'oculomotor', [], [], 'Elevación del párpado', 'parpado', true,
    'Ptosis fatigable en miastenia. Ptosis con oftalmoparesia sin diplopía: piensa en miopatía mitocondrial (CPEO) u OPMD.'),
  M('rectolat', 'Recto lateral', 'ax', 'Abducens (VI)', 'abducens', [], [], 'Abducción del ojo', 'ojo', false,
    'Mnemotecnia de oculomotores: LR6 SO4, el resto III.'),
  M('oblsup', 'Oblicuo superior', 'ax', 'Troclear (IV)', 'troclear', [], [], 'Depresión del ojo en aducción (intorsión)', 'ojo', false,
    'Diplopía vertical al bajar escaleras o leer; el paciente inclina la cabeza hacia el lado sano.'),
  M('velo', 'Velo del paladar y faringe', 'ax', 'Glosofaríngeo y vago (IX, X)', 'ixx', [], [], 'Elevación del velo y deglución', 'bulbar', false,
    'Disfagia y voz nasal: miastenia, ELA bulbar, OPMD, miositis por cuerpos de inclusión.'),
];

// ---------------- Tarjetas curadas ----------------
// Formato: [id, pregunta, correcta, 'distractor1|distractor2|distractor3', explicación, [tags de raíz]]

const REFLEXES = [
  ['r_bic', '¿Qué raíces valora el reflejo bicipital?', 'C5–C6', 'C7|C8–T1|C3–C4',
    'Arco a través del musculocutáneo. Mnemotecnia: «1-2 aquíleo, 3-4 rotuliano, 5-6 bíceps, 7-8 tríceps».', ['C5', 'C6']],
  ['r_estilo', '¿Qué raíces valora el reflejo estilorradial?', 'C5–C6', 'C7–C8|C8–T1|C4',
    'Braquiorradial, nervio radial. El reflejo invertido (abolición del estilorradial con respuesta de flexión de los dedos) sugiere lesión C5-C6 con afectación medular.', ['C5', 'C6']],
  ['r_tric', '¿Qué raíz valora principalmente el reflejo tricipital?', 'C7 (C6–C8)', 'C5–C6|C8–T1|C4–C5',
    'Nervio radial. Abolido en radiculopatía C7, la más frecuente del miembro superior junto con la C6.', ['C7']],
  ['r_flexded', '¿Qué raíz valora el reflejo flexor de los dedos?', 'C8', 'C6|C5|T1–T2',
    'Reflejo de los flexores de los dedos: C8. Hoffmann y Trömner, cuando son vivos, orientan a hiperreflexia (1.ª motoneurona).', ['C8']],
  ['r_rot', '¿Qué raíces valora el reflejo rotuliano?', 'L3–L4 (L2–L4)', 'L5|S1|L1–L2',
    'Arco a través del femoral. Abolido en radiculopatía L3-L4, neuropatía femoral y plexopatía lumbar (ej. amiotrofia diabética).', ['L3', 'L4']],
  ['r_adu', '¿Qué raíces valora el reflejo aductor?', 'L2–L4', 'L5–S1|S1–S2|T12–L1',
    'Arco a través del obturador. Rotuliano abolido con aductor normal apunta a lesión del femoral más que de raíz.', ['L2', 'L3', 'L4']],
  ['r_isq', '¿Qué raíz valora el reflejo isquiotibial medial?', 'L5', 'L3|S2|L1',
    'Es el único reflejo que explora L5. Útil en la radiculopatía L5, donde el aquíleo y el rotuliano suelen ser normales.', ['L5']],
  ['r_aqu', '¿Qué raíz valora el reflejo aquíleo?', 'S1 (S2)', 'L4|L5|S3–S4',
    'Arco a través del tibial. Abolido en radiculopatía S1 y en polineuropatías longitud-dependientes (a menudo es el primer reflejo que se pierde).', ['S1']],
  ['r_abd', '¿Qué niveles valoran los reflejos cutáneos abdominales?', 'T8–T12', 'T2–T4|L1–L2|T4–T6',
    'Supraumbilicales T8-T10, infraumbilicales T10-T12. Su abolición asimétrica sugiere lesión piramidal o radicular torácica.', []],
  ['r_anal', '¿Qué raíces valora el reflejo anal?', 'S2–S4', 'L4–L5|S1|L1–L2',
    'Clave en la sospecha de cauda equina, junto con la sensibilidad perianal (S4-S5).', []],
  ['r_crem', '¿Qué raíces valora el reflejo cremastérico?', 'L1–L2', 'S2–S4|L4–L5|T10–T11',
    'Aferencia por el ilioinguinal y eferencia por la rama genital del genitofemoral.', ['L1', 'L2']],
  ['r_mand', '¿Qué nervio forma el arco del reflejo mandibular (maseterino)?', 'Trigémino (V)', 'Facial (VII)|C1–C2|Hipogloso (XII)',
    'Aferente y eferente por el V par. Exaltado en lesiones por encima de la protuberancia: en ELA indica afectación de 1.ª motoneurona bulbar.', []],
];

// Exploración motora por raíz (la de la consulta, no la ISNCSCI)
// [raíz, movimiento que se explora, músculo(s), reflejo, perla, raíces que no valen como distractor]
const RAICES = [
  ['C5', 'Abducción del hombro', 'Deltoides (el supraespinoso inicia los primeros 15°)', 'Bicipital',
    'Bicipital y estilorradial son ambos C5-C6. El romboides es C5 casi puro: si está débil, la lesión es radicular y no del tronco superior.', ['C6']],
  ['C6', 'Flexión del codo y supinación', 'Bíceps y braquiorradial', 'Estilorradial',
    'Bíceps es C5-C6 y braquiorradial C5-C6: lo que inclina hacia C6 son las parestesias del pulgar y el pronador redondo débil.', ['C5']],
  ['C7', 'Extensión del codo', 'Tríceps, con extensión de muñeca y dedos', 'Tricipital',
    'La radiculopatía cervical más frecuente. El flexor radial del carpo es del mediano pero también C7: su debilidad junto a la del tríceps localiza la raíz.', []],
  ['C8', 'Flexión de los dedos', 'Flexor profundo de los dedos', 'Flexor de los dedos',
    'Parestesias en meñique y borde cubital. Si el cutáneo antebraquial medial está alterado, es C8 o tronco inferior, no neuropatía cubital.', ['T1']],
  ['T1', 'Abducción y aducción de los dedos', 'Interóseos y abductor del meñique', 'Ninguno',
    'Atrofia de intrínsecos. El abductor corto del pulgar (mediano) también es T1: su afectación con los intrínsecos cubitales señala la raíz.', ['C8']],
  ['L2', 'Flexión de la cadera', 'Iliopsoas', 'Aductor',
    'Iliopsoas débil con cuádriceps y aductores normales orienta a lesión más proximal (plexo lumbar o psoas).', ['L3']],
  ['L3', 'Extensión de la rodilla', 'Cuádriceps, con los aductores', 'Rotuliano',
    'Cuádriceps y aductores débiles juntos: raíz o plexo lumbar. Solo el cuádriceps: nervio femoral.', ['L4']],
  ['L4', 'Dorsiflexión e inversión del tobillo', 'Tibial anterior', 'Rotuliano',
    'El tibial anterior es L4-L5. Lo que separa L4 de L5 es el rotuliano (abolido en L4) y la sensibilidad del maléolo medial.', ['L5']],
  ['L5', 'Extensión del dedo gordo', 'Extensor largo del dedo gordo, con glúteo medio y tibial posterior', 'Isquiotibial medial',
    'Trío de la radiculopatía L5: dedo gordo, abducción de cadera e inversión del pie. Los tres son normales en la neuropatía peroneal.', []],
  ['S1', 'Flexión plantar y eversión', 'Gastrocnemio y sóleo, con los peroneos y el glúteo mayor', 'Aquíleo',
    'Explórala de pie, sobre una pierna: la debilidad leve de flexión plantar no se ve en camilla.', []],
];

const PLEXUS = [
  ['p_axilar', '¿De qué fascículo del plexo braquial sale el nervio axilar?', 'Fascículo posterior', 'Fascículo lateral|Fascículo medial|Tronco superior',
    'El fascículo posterior da axilar, radial, toracodorsal y subescapulares. Lesión del fascículo posterior: deltoides + extensores + dorsal ancho.', []],
  ['p_radial', '¿De qué fascículo sale el nervio radial?', 'Fascículo posterior', 'Fascículo lateral|Fascículo medial|Tronco medio',
    'Recibe fibras de C5 a T1 a través del fascículo posterior.', []],
  ['p_mc', '¿De qué fascículo sale el musculocutáneo?', 'Fascículo lateral', 'Fascículo posterior|Fascículo medial|Tronco inferior',
    'El fascículo lateral da el musculocutáneo, la raíz lateral del mediano y el pectoral lateral.', []],
  ['p_cub', '¿De qué fascículo sale el nervio cubital?', 'Fascículo medial', 'Fascículo lateral|Fascículo posterior|Tronco superior',
    'El fascículo medial (C8-T1) da el cubital, la raíz medial del mediano, el cutáneo braquial medial y el antebraquial medial.', ['C8', 'T1']],
  ['p_med', '¿De dónde procede el nervio mediano?', 'De los fascículos lateral y medial', 'Solo del fascículo medial|Del fascículo posterior|Del tronco superior',
    'La raíz lateral (C6-C7) lleva sobre todo fibras sensitivas y para el pronador y el FRC; la medial (C8-T1), fibras para la musculatura intrínseca tenar.', []],
  ['p_supraesc', '¿De dónde sale el nervio supraescapular?', 'Del tronco superior (C5-C6)', 'Del fascículo posterior|Del fascículo lateral|Directamente de la raíz C7',
    'Por eso se afecta en lesiones del tronco superior (Erb) pero no del fascículo posterior.', ['C5', 'C6']],
  ['p_toraclargo', '¿De dónde sale el nervio torácico largo?', 'Directamente de las raíces C5, C6 y C7', 'Del tronco superior|Del fascículo posterior|Del fascículo medial',
    'Al salir de las raíces, el serrato anterior ayuda a separar una radiculopatía de una lesión del plexo.', ['C5', 'C6', 'C7']],
  ['p_dorsesc', '¿De dónde sale el nervio dorsal de la escápula?', 'Directamente de la raíz C5', 'Del tronco superior|Del fascículo posterior|Del fascículo lateral',
    'Romboides afectado + deltoides afectado = raíz C5. Romboides normal + deltoides afectado = tronco superior o más distal.', ['C5']],
  ['p_toracodorsal', '¿De dónde sale el nervio toracodorsal (dorsal ancho)?', 'Fascículo posterior', 'Fascículo medial|Tronco inferior|Directamente de C7',
    'Rama del fascículo posterior, entre los dos subescapulares.', []],
  ['p_cabm', '¿De dónde sale el cutáneo antebraquial medial?', 'Fascículo medial (C8-T1)', 'Nervio cubital|Nervio mediano|Fascículo posterior',
    'Su territorio (borde cubital del antebrazo) NO es del cubital: se altera en lesiones C8-T1, del tronco inferior o del fascículo medial, y es normal en la neuropatía cubital.', ['C8', 'T1']],
  ['p_troncinf', '¿Qué raíces forman el tronco inferior del plexo braquial?', 'C8 y T1', 'C7|C5 y C6|C6 y C7',
    'Tronco superior C5-C6, medio C7, inferior C8-T1. Lesiones del tronco inferior: parálisis de Klumpke, tumor de Pancoast, desfiladero torácico neurogénico.', ['C8', 'T1']],
  ['p_femoral', '¿Qué raíces forman el nervio femoral?', 'L2–L4 (divisiones posteriores)', 'L4–S3|L1–L2|L5–S2',
    'El femoral y el obturador comparten raíces (L2-L4), pero el femoral sale de las divisiones posteriores y el obturador de las anteriores.', ['L2', 'L3', 'L4']],
  ['p_obt', '¿Qué raíces forman el nervio obturador?', 'L2–L4 (divisiones anteriores)', 'L4–S1|L5–S2|T12–L1',
    'Inerva los aductores y una pequeña zona cutánea de la cara medial del muslo.', ['L2', 'L3', 'L4']],
  ['p_fcl', '¿Qué raíces forman el femorocutáneo lateral?', 'L2–L3', 'L4–L5|S1–S2|L1',
    'Nervio sensitivo puro de la cara anterolateral del muslo. Su compresión bajo el ligamento inguinal produce la meralgia parestésica.', ['L2', 'L3']],
  ['p_ciatico', '¿Qué raíces forman el nervio ciático?', 'L4–S3', 'L2–L4|L1–L3|S2–S4',
    'Se divide en tibial (L4-S3) y peroneo común (L4-S2).', ['L4', 'L5', 'S1', 'S2']],
  ['p_glsup', '¿Qué raíces forman el nervio glúteo superior?', 'L4–S1', 'L5–S2|L2–L4|S2–S4',
    'Inerva glúteo medio, menor y tensor de la fascia lata.', ['L4', 'L5', 'S1']],
  ['p_glinf', '¿Qué raíces forman el nervio glúteo inferior?', 'L5–S2', 'L4–S1|L2–L4|S2–S4',
    'Inerva solo el glúteo mayor.', ['L5', 'S1', 'S2']],
  ['p_pud', '¿Qué raíces forman el nervio pudendo?', 'S2–S4', 'L4–S1|L1–L2|S1–S2',
    'Esfínteres, periné y sensibilidad genital. «S2, 3 y 4 mantienen el suelo pélvico».', []],
  ['p_divciat', '¿Por qué las lesiones del ciático pueden simular una neuropatía peroneal?', 'La división peronea es más vulnerable dentro del propio ciático', 'Porque el ciático no tiene fibras tibiales|Porque el peroneo sale del plexo lumbar|Porque el tibial no inerva ningún músculo de la pierna',
    'Las divisiones tibial y peronea viajan separadas dentro del ciático desde la pelvis. La peronea tiene menos tejido conectivo y está más fija: en lesiones ciáticas (inyección glútea, cirugía de cadera) puede dominar el pie caído. Busca la cabeza corta del bíceps femoral en EMG.', []],
];

// Secuencia de dermatomas
const DERM_LEVELS = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4-5'];

// Puntos clave ISNCSCI: [nivel, descripción, vista del dibujo]
const KEYPOINTS = [
  ['C2', 'Al menos 1 cm lateral a la protuberancia occipital (o unos 3 cm por detrás de la oreja)', 'back'],
  ['C3', 'Fosa supraclavicular, por detrás de la clavícula, en la línea medioclavicular', 'front'],
  ['C4', 'Sobre la articulación acromioclavicular', 'front'],
  ['C5', 'Cara lateral (radial) de la fosa antecubital, justo proximal al pliegue del codo', 'front'],
  ['C6', 'Dorso de la falange proximal del pulgar', 'hand'],
  ['C7', 'Dorso de la falange proximal del dedo medio', 'hand'],
  ['C8', 'Dorso de la falange proximal del meñique', 'hand'],
  ['T1', 'Cara medial (cubital) de la fosa antecubital, proximal al epicóndilo medial', 'front'],
  ['T2', 'Vértice de la axila', 'front'],
  ['T3', 'Línea medioclavicular, 3.er espacio intercostal', 'front'],
  ['T4', 'Línea medioclavicular, 4.º espacio intercostal (línea de los pezones)', 'front'],
  ['T5', 'Línea medioclavicular, 5.º espacio intercostal (entre T4 y T6)', 'front'],
  ['T6', 'Línea medioclavicular, a nivel del apéndice xifoides', 'front'],
  ['T7', 'Línea medioclavicular, a 1/4 de la distancia entre el xifoides y el ombligo', 'front'],
  ['T8', 'Línea medioclavicular, a mitad de camino entre el xifoides y el ombligo', 'front'],
  ['T9', 'Línea medioclavicular, a 3/4 de la distancia entre el xifoides y el ombligo', 'front'],
  ['T10', 'Línea medioclavicular, a nivel del ombligo', 'front'],
  ['T11', 'Línea medioclavicular, a mitad de camino entre el ombligo y el ligamento inguinal', 'front'],
  ['T12', 'Línea medioclavicular, punto medio del ligamento inguinal', 'front'],
  ['L1', 'A mitad de camino entre los puntos de T12 y L2 (parte alta de la cara anterior del muslo)', 'front'],
  ['L2', 'Cara anteromedial del muslo, en su punto medio', 'front'],
  ['L3', 'Cóndilo femoral medial, justo por encima de la rodilla', 'front'],
  ['L4', 'Maléolo medial', 'leg'],
  ['L5', 'Dorso del pie a nivel de la 3.ª articulación metatarsofalángica', 'leg'],
  ['S1', 'Cara lateral del talón (calcáneo)', 'leg'],
  ['S2', 'Línea media de la fosa poplítea', 'back'],
  ['S3', 'Tuberosidad isquiática o pliegue infraglúteo', 'back'],
  ['S4-5', 'Área perianal, a menos de 1 cm lateral a la unión mucocutánea', 'back'],
];

// Perlas clínicas por dermatoma (para la explicación)
const DERM_PEARLS = {
  C2: 'El C1 no suele tener dermatoma cutáneo. La cara es territorio del trigémino.',
  C3: 'Discrepancia clásica: la región supraclavicular es C4 en Keegan-Garrett y C3 en Foerster.',
  C4: 'Discrepancia clásica: el hombro es C4 en Foerster y C5 en Keegan-Garrett. La ISNCSCI usa la acromioclavicular para C4.',
  C5: 'C5 cubre la cara lateral del brazo. Radiculopatía C5: dolor en hombro y debilidad de deltoides y bíceps.',
  C6: 'Radiculopatía C6: parestesias en pulgar (± índice), bíceps y estilorradial hiporreflexicos.',
  C7: 'Radiculopatía C7 (la más frecuente): parestesias en el dedo medio, tricipital abolido, debilidad de tríceps y FRC.',
  C8: 'C8: meñique y borde cubital de la mano y antebrazo distal. Diferénciala del cubital por el antebrazo medial.',
  T1: 'T1 ocupa la cara medial del antebrazo proximal y del brazo.',
  T2: 'T2 llega al vértice axilar y la cara medial del brazo. T2 y C4 son adyacentes en el tórax anterior (C5-T1 se van al brazo).',
  T3: 'En el tórax, los dermatomas son bandas casi horizontales y ordenadas.',
  T4: 'Referencia clásica: T4 = línea de los pezones.',
  T5: 'Punto intermedio entre T4 (pezones) y T6 (xifoides).',
  T6: 'Referencia clásica: T6 = apéndice xifoides.',
  T7: 'Entre xifoides (T6) y ombligo (T10) se reparten T7, T8 y T9 en cuartos.',
  T8: 'Entre xifoides (T6) y ombligo (T10) se reparten T7, T8 y T9 en cuartos.',
  T9: 'Entre xifoides (T6) y ombligo (T10) se reparten T7, T8 y T9 en cuartos.',
  T10: 'Referencia clásica: T10 = ombligo.',
  T11: 'Entre el ombligo (T10) y el ligamento inguinal (T12).',
  T12: 'T12 = ligamento inguinal. L1 empieza justo por debajo (ingle).',
  L1: 'L1 = región inguinal y parte alta del muslo anterior.',
  L2: 'L2 recorre la cara anteromedial del muslo en diagonal.',
  L3: 'L3 llega hasta la cara medial de la rodilla. Radiculopatía L3-L4: debilidad de cuádriceps y aductores.',
  L4: 'L4: cara medial de la pierna hasta el maléolo medial. En el mapa de Lee, L4 cubre la cara medial de la pierna sin cruzar el muslo.',
  L5: 'L5: dorso del pie y dedo gordo. Radiculopatía L5: pie caído con inversión y abducción de cadera débiles.',
  S1: 'S1: borde lateral del pie, talón y planta. El dermatoma S1 es de los más constantes entre mapas.',
  S2: 'S2 ocupa la cara posterior del muslo y la pierna.',
  S3: 'S3-S5 forman la «silla de montar»: su afectación con retención urinaria sugiere cauda equina.',
  'S4-5': 'La sensibilidad y la contracción anal voluntaria (S4-5) definen si una lesión medular es completa o incompleta en la ISNCSCI.',
};

// Zonas de dermatoma (imagen con zona resaltada)
const DERM_ZONES = [
  ['dz_c6', 'C6', 'hand', 'Pulgar'],
  ['dz_c7', 'C7', 'hand', 'Dedo medio'],
  ['dz_c8', 'C8', 'hand', 'Meñique y borde cubital de la mano'],
  ['dz_l4', 'L4', 'leg', 'Cara medial de la pierna hasta el maléolo medial'],
  ['dz_l5', 'L5', 'leg', 'Cara anterolateral de la pierna, dorso del pie y dedo gordo'],
  ['dz_s1', 'S1', 'leg', 'Borde lateral del pie y quinto dedo'],
  ['dz_t4', 'T4', 'body', 'Banda a la altura de los pezones'],
  ['dz_t10', 'T10', 'body', 'Banda a la altura del ombligo'],
  ['dz_l1', 'L1', 'body', 'Región inguinal'],
];

// Territorios cutáneos con imagen: [id, nervio correcto, dibujo, zona, 'distractores', explicación]
const CUT_IMG = [
  ['ci_medpalm', 'Mediano', 'palm', 'median', 'Cubital|Radial superficial|Musculocutáneo',
    'Palma radial y cara palmar de pulgar, índice, medio y mitad radial del anular. La rama cutánea palmar (eminencia tenar) sale antes del túnel carpiano: en el túnel carpiano la sensibilidad tenar se conserva.'],
  ['ci_cubpalm', 'Cubital', 'palm', 'ulnar', 'Mediano|Radial superficial|Cutáneo antebraquial medial',
    'Mitad cubital del anular y meñique. El «anular partido» (mitad radial normal, cubital alterada) apoya lesión del cubital frente a C8, que afecta todo el anular.'],
  ['ci_raddors', 'Radial superficial', 'dorsum', 'radial', 'Mediano|Cubital (rama dorsal)|Cutáneo antebraquial lateral',
    'Dorso radial de la mano y dorso proximal de los tres primeros dedos. Neuropatía de Wartenberg: compresión por relojes o esposas. El territorio autónomo es el primer espacio interóseo dorsal.'],
  ['ci_cubdors', 'Cubital (rama cutánea dorsal)', 'dorsum', 'ulnardors', 'Radial superficial|Mediano|Cutáneo antebraquial medial',
    'La rama dorsal sale unos 5-8 cm proximal a la muñeca: su territorio está alterado en la lesión del codo y preservado en el canal de Guyon.'],
  ['ci_meddors', 'Mediano', 'dorsum', 'mediandors', 'Radial superficial|Cubital (rama cutánea dorsal)|Musculocutáneo',
    'El mediano también inerva el dorso de las falanges distales del índice, medio y mitad radial del anular.'],
  ['ci_safeno', 'Safeno (rama del femoral)', 'leg', 'saphenous', 'Peroneo superficial|Sural|Femorocutáneo lateral',
    'Rama sensitiva terminal del femoral: cara medial de la pierna y borde medial del pie. Si está alterado junto a debilidad de cuádriceps, la lesión es femoral o L4.'],
  ['ci_perosup', 'Peroneo superficial', 'leg', 'supperoneal', 'Peroneo profundo|Safeno|Sural',
    'Cara anterolateral distal de la pierna y dorso del pie (salvo el primer espacio). Da además la motora de los peroneos.'],
  ['ci_peroprof', 'Peroneo profundo', 'leg', 'deepperoneal', 'Peroneo superficial|Sural|Safeno',
    'Territorio sensitivo pequeño: el primer espacio interdigital dorsal. Útil para distinguir lesiones del peroneo profundo (pie caído + solo primer espacio) de las del peroneo común.'],
  ['ci_sural', 'Sural', 'leg', 'sural', 'Peroneo superficial|Safeno|Plantar lateral',
    'Borde lateral del pie y maléolo lateral. Es el nervio sensitivo estándar en neurografía y biopsia de nervio. En el GBS suele estar preservado («sural sparing»).'],
];

// Territorios cutáneos descritos: [id, pregunta, correcta, distractores, explicación, tags]
const CUT_DESC = [
  ['cd_axilar', '¿Qué nervio da la sensibilidad de la piel lateral del hombro, sobre el deltoides («parche regimental»)?', 'Axilar', 'Supraescapular|Musculocutáneo|Radial',
    'El supraescapular es motor para la exploración práctica (no tiene territorio cutáneo útil). Parche regimental + debilidad de abducción tras luxación = axilar.', []],
  ['cd_cabl', '¿Qué nervio inerva la piel del borde radial (lateral) del antebrazo?', 'Cutáneo antebraquial lateral (musculocutáneo)', 'Cutáneo antebraquial medial|Radial superficial|Mediano',
    'Rama terminal del musculocutáneo. Puede lesionarse en venopunciones en la flexura del codo.', []],
  ['cd_cabm', '¿Qué nervio inerva la piel del borde cubital (medial) del antebrazo?', 'Cutáneo antebraquial medial', 'Cubital|Cutáneo antebraquial lateral|Mediano',
    'Sale directamente del fascículo medial (C8-T1). Su alteración con déficit cubital en la mano indica lesión C8/tronco inferior, no neuropatía cubital.', ['C8', 'T1']],
  ['cd_fcl', '¿Qué nervio inerva la cara anterolateral del muslo?', 'Femorocutáneo lateral', 'Femoral (ramas cutáneas anteriores)|Obturador|Genitofemoral',
    'Meralgia parestésica: dolor urente y hipoestesia anterolateral del muslo, sin debilidad ni cambios de reflejos. Factores: obesidad, embarazo, cinturones ajustados.', ['L2', 'L3']],
  ['cd_obt', '¿Qué nervio inerva una pequeña zona de la cara medial del muslo?', 'Obturador', 'Femoral|Femorocutáneo lateral|Safeno',
    'El obturador es sobre todo motor (aductores). Neuropatía del obturador: cirugía pélvica, parto, hernia obturatriz.', []],
  ['cd_femant', '¿Qué nervio inerva la piel de la cara anterior del muslo?', 'Femoral (ramas cutáneas anteriores)', 'Femorocutáneo lateral|Obturador|Genitofemoral',
    'Las ramas cutáneas anteriores cubren el muslo anterior y el safeno la cara medial de la pierna.', []],
  ['cd_plantar', '¿Qué nervio inerva la planta del pie?', 'Tibial (plantares medial y lateral)', 'Sural|Peroneo superficial|Safeno',
    'El tibial da los plantares medial y lateral y las ramas calcáneas. Túnel del tarso: parestesias plantares con sensibilidad del talón a menudo preservada (las ramas calcáneas pueden salir antes).', []],
  ['cd_palmmed', '¿Qué rama inerva la piel de la eminencia tenar y por qué importa?', 'Rama cutánea palmar del mediano, que sale antes del túnel carpiano', 'Rama motora recurrente del mediano|Radial superficial, que cruza la palma|Rama profunda del cubital',
    'Si la sensibilidad de la eminencia tenar está alterada, la lesión del mediano es proximal al túnel carpiano.', []],
  ['cd_cfp', '¿Qué nervio inerva la cara posterior del muslo?', 'Cutáneo femoral posterior', 'Ciático|Femorocutáneo lateral|Obturador',
    'Nervio sensitivo (S1-S3) que no forma parte del ciático. Por eso la sensibilidad posterior del muslo suele conservarse en lesiones del ciático.', []],
  ['cd_cubdors', 'Hipoestesia de 4.º-5.º dedo con dorso cubital de la mano normal. ¿Dónde está la lesión del cubital?', 'En la muñeca (canal de Guyon), distal a la rama dorsal', 'En el codo|En la axila|En el fascículo medial',
    'La rama cutánea dorsal sale antes de la muñeca. Dorso alterado = lesión proximal (codo); dorso preservado = Guyon.', []],
];

const LOCALIZATION = [
  ['l_pie_l5', 'Pie caído con debilidad de la inversión y de la abducción de la cadera. ¿Localización más probable?', 'Radiculopatía L5', 'Neuropatía peroneal en la cabeza del peroné|Lesión del peroneo profundo|Neuropatía tibial',
    'El tibial posterior (tibial, L4-L5) y el glúteo medio (glúteo superior, L5) no dependen del peroneo: su debilidad sitúa la lesión en la raíz L5 (o en el ciático/plexo).', ['L5']],
  ['l_pie_per', 'Pie caído con inversión normal, hipoestesia del dorso del pie y cabeza corta del bíceps femoral normal. ¿Localización?', 'Neuropatía peroneal común (cabeza del peroné)', 'Radiculopatía L5|Lesión del ciático|Radiculopatía S1',
    'Inversión y abducción de cadera normales descartan L5. Cabeza corta del bíceps normal descarta lesión ciática. Causas: cruzar las piernas, pérdida de peso, yesos, posición en cuclillas.', []],
  ['l_pie_ciat', 'Pie caído con denervación de la cabeza corta del bíceps femoral y paraespinales normales. ¿Localización?', 'Ciático (división peronea), proximal a la rodilla', 'Neuropatía peroneal en el peroné|Radiculopatía L5|Peroneo profundo',
    'La cabeza corta del bíceps es el único músculo del muslo de la división peronea. Paraespinales normales hacen menos probable la radiculopatía.', []],
  ['l_radial_canal', 'Mano caída, tríceps normal, braquiorradial débil e hipoestesia dorsorradial de la mano. ¿Localización?', 'Radial en el canal de torsión del húmero', 'Interóseo posterior|Radiculopatía C7|Radial en la axila',
    'Tríceps preservado = lesión distal a sus ramas. Braquiorradial y sensibilidad afectados = proximal al codo. «Parálisis del sábado» o fractura de húmero.', []],
  ['l_nip', 'Dedos caídos sin caída de la muñeca (extiende con desviación radial) y sin déficit sensitivo. ¿Localización?', 'Interóseo posterior', 'Radial en el canal de torsión|Radiculopatía C7|Radial superficial',
    'El ERLC y el braquiorradial salen antes de la división, y el interóseo posterior es motor puro. Causas: arcada de Frohse, masas, artritis reumatoide del codo.', []],
  ['l_c7', 'Debilidad de extensión de muñeca y codo con debilidad del flexor radial del carpo y reflejo tricipital abolido. ¿Localización?', 'Radiculopatía C7', 'Radial en la axila|Radial en el canal de torsión|Interóseo posterior',
    'El FRC es del mediano (C6-C7): su debilidad junto a músculos radiales solo se explica por la raíz C7.', ['C7']],
  ['l_c8', 'Atrofia de intrínsecos con debilidad del abductor corto y del flexor largo del pulgar e hipoestesia del borde cubital del antebrazo. ¿Localización?', 'Radiculopatía C8 o tronco inferior', 'Neuropatía cubital en el codo|Túnel carpiano|Canal de Guyon',
    'Mezcla de músculos del mediano (ACP, FLP) y del cubital, más el territorio del cutáneo antebraquial medial: el denominador común es C8-T1.', ['C8', 'T1']],
  ['l_cub_codo', 'Debilidad del primer interóseo dorsal, abductor del meñique y flexor profundo IV-V, hipoestesia de 4.º-5.º dedo incluido el dorso, antebrazo normal. ¿Localización?', 'Neuropatía cubital en el codo', 'Canal de Guyon|Radiculopatía C8|Tronco inferior',
    'Flexor profundo IV-V y dorso cubital de la mano alterados = lesión proximal a la muñeca. Antebrazo medial normal = no es C8.', []],
  ['l_guyon', 'Debilidad del primer interóseo dorsal con sensibilidad normal y flexor profundo IV-V normal. ¿Localización?', 'Rama profunda del cubital (canal de Guyon)', 'Cubital en el codo|Radiculopatía C8|Interóseo anterior',
    'La rama profunda es motora. Causas: ciclistas, uso de herramientas, gangliones. Si la lesión es distal a la rama al abductor del meñique, este puede estar preservado.', []],
  ['l_tc', 'Parestesias del 1.º al 3.er dedo, sensibilidad tenar conservada, atrofia del abductor corto del pulgar y pronador redondo normal. ¿Localización?', 'Túnel carpiano', 'Mediano en el codo|Radiculopatía C6|Interóseo anterior',
    'La rama cutánea palmar (eminencia tenar) sale antes del túnel. El pronador redondo normal descarta lesión proximal.', []],
  ['l_nia', 'No puede hacer el signo del «OK» (flexión de la IFD del índice y la IF del pulgar) y la sensibilidad es normal. ¿Localización?', 'Interóseo anterior', 'Túnel carpiano|Radiculopatía C7|Neuropatía cubital',
    'Nervio motor puro. Causa frecuente: neuralgia amiotrófica (Parsonage-Turner), que puede afectarlo de forma aislada.', []],
  ['l_tronco_sup', 'Debilidad de abducción y rotación externa del hombro y de flexión del codo, con romboides y serrato normales. ¿Localización?', 'Tronco superior del plexo braquial', 'Radiculopatía C5-C6|Nervio axilar|Nervio supraescapular',
    'Romboides (dorsal de la escápula) y serrato (torácico largo) salen de las raíces: si son normales, la lesión es distal a la raíz. Parálisis de Erb.', []],
  ['l_l34', 'Debilidad de extensión de rodilla y aducción de cadera con rotuliano abolido. ¿Localización?', 'Radiculopatía L3-L4 o plexo lumbar', 'Neuropatía femoral|Neuropatía del obturador|Radiculopatía L5',
    'Femoral y obturador comparten raíces: la combinación indica raíz o plexo. Piensa también en amiotrofia diabética.', ['L3', 'L4']],
  ['l_femoral', 'Debilidad de extensión de rodilla con aductores normales e hipoestesia de la cara anterior del muslo y medial de la pierna. ¿Localización?', 'Neuropatía femoral', 'Radiculopatía L4|Plexopatía lumbar|Neuropatía del obturador',
    'Aductores normales separan femoral de L3-L4. Causas: hematoma del psoas (anticoagulados), cirugía pélvica o de cadera, cateterismo femoral.', []],
  ['l_meralgia', 'Dolor urente e hipoestesia en la cara anterolateral del muslo, sin debilidad ni cambios de reflejos. ¿Diagnóstico?', 'Meralgia parestésica (femorocutáneo lateral)', 'Radiculopatía L2-L3|Neuropatía femoral|Neuropatía del obturador',
    'Nervio sensitivo puro: la ausencia de déficit motor y reflejo lo diferencia de L2-L3 y del femoral.', []],
  ['l_serrato', 'Escápula alada medial al empujar contra la pared, sin otro déficit. ¿Nervio afectado?', 'Torácico largo', 'Accesorio espinal|Dorsal de la escápula|Axilar',
    'Serrato débil: el borde medial se separa al empujar. Trapecio débil (XI): escápula desplazada lateralmente y hombro caído, más evidente al abducir.', []],
  ['l_espinogl', 'Debilidad de la rotación externa del hombro con atrofia del infraespinoso y supraespinoso normal. ¿Localización?', 'Supraescapular en la escotadura espinoglenoidea', 'Supraescapular en la escotadura supraescapular|Nervio axilar|Radiculopatía C5',
    'En la escotadura supraescapular se afectan ambos músculos; en la espinoglenoidea, solo el infraespinoso.', []],
  ['l_axilar', 'Hipoestesia en «parche» sobre el deltoides y debilidad de abducción tras una luxación de hombro. ¿Nervio?', 'Axilar', 'Supraescapular|Musculocutáneo|Tronco superior',
    'El axilar rodea el cuello quirúrgico del húmero y se estira en la luxación anterior.', []],
  ['l_s1', 'Debilidad de flexión plantar, aquíleo abolido e hipoestesia del borde lateral del pie. ¿Localización?', 'Radiculopatía S1', 'Túnel del tarso|Radiculopatía L5|Neuropatía peroneal',
    'Aquíleo abolido + gastrocnemio débil + territorio sural: S1. El reflejo H también estará ausente.', ['S1']],
  ['l_tarso', 'Parestesias plantares con debilidad del abductor del dedo gordo, gastrocnemio y aquíleo normales. ¿Localización?', 'Túnel del tarso (tibial en el tobillo)', 'Radiculopatía S1|Neuropatía peroneal|Neuropatía sural',
    'Gastrocnemio y aquíleo normales descartan S1 y lesión tibial proximal.', []],
];

const EMG = [
  ['e_axonal', '¿Qué hallazgo de la neurografía orienta a una lesión axonal?', 'Amplitud reducida (CMAP/SNAP) con latencias y velocidades casi normales', 'Velocidad muy enlentecida con latencias prolongadas|Bloqueo de conducción|Dispersión temporal',
    'La amplitud refleja el número de axones conducentes. En la pérdida axonal grave la velocidad puede caer levemente por pérdida de las fibras más rápidas, pero no a rango desmielinizante.'],
  ['e_desm', '¿Qué conjunto de hallazgos sugiere desmielinización?', 'Latencias distales prolongadas, VC enlentecida, bloqueo de conducción y dispersión temporal', 'Amplitud reducida con VC normal|Fibrilaciones y ondas positivas|PUMs grandes y polifásicos',
    'La mielina determina la velocidad. El bloqueo de conducción (caída de amplitud proximal frente a distal) indica desmielinización focal.'],
  ['e_uniforme', 'Enlentecimiento uniforme y difuso de la conducción, sin bloqueos ni dispersión. ¿Qué sugiere?', 'Polineuropatía desmielinizante hereditaria (ej. CMT1)', 'CIDP|Guillain-Barré (AIDP)|Neuropatía axonal',
    'Las desmielinizantes hereditarias son uniformes. Las adquiridas (AIDP, CIDP, neuropatía motora multifocal) son no uniformes: bloqueos, dispersión y afectación parcheada.'],
  ['e_cmt', '¿Qué punto de corte de VC motora del mediano (antebrazo) separa clásicamente CMT1 de CMT2?', '38 m/s', '25 m/s|50 m/s|60 m/s',
    'CMT1 < 38 m/s (desmielinizante), CMT2 > 38 m/s (axonal). El CMT intermedio queda aproximadamente entre 25 y 45 m/s.'],
  ['e_snap_rad', 'En una radiculopatía con hipoestesia en el dermatoma, ¿cómo está el SNAP de ese territorio?', 'Normal (lesión preganglionar)', 'Ausente|Reducido a la mitad|Con latencia prolongada',
    'El ganglio raquídeo dorsal está en el foramen, distal a la raíz. La lesión preganglionar no desconecta el axón periférico de su soma. Lo mismo ocurre en la avulsión radicular.'],
  ['e_snap_plex', 'SNAP ausente en un territorio con hipoestesia y debilidad, con paraespinales normales. ¿Qué indica?', 'Lesión postganglionar (plexo o nervio)', 'Radiculopatía|Avulsión radicular|Lesión medular',
    'El SNAP cae cuando la lesión está distal al ganglio raquídeo dorsal: plexopatías y neuropatías.'],
  ['e_paraesp', '¿Para qué sirve explorar los paraespinales en la EMG?', 'Para localizar la lesión en la raíz', 'Para valorar la unión neuromuscular|Para distinguir miopatía de neuropatía|Para medir la velocidad de conducción',
    'El ramo dorsal que inerva los paraespinales sale proximal al plexo. Su denervación sugiere radiculopatía (o enfermedad de motoneurona). Pueden estar normales si la radiculopatía es leve o crónica.'],
  ['e_fib_tiempo', 'Tras una lesión axonal aguda, ¿cuándo aparecen las fibrilaciones en los músculos distales?', 'A las 3-4 semanas (antes en paraespinales, hacia los 10-14 días)', 'Inmediatamente|A las 24-48 horas|A los 6 meses',
    'Por eso una EMG muy precoz puede ser normal. Lo ideal es esperar unas 3 semanas para valorar denervación.'],
  ['e_walleriana', 'Tras una sección nerviosa, ¿cuándo cae la amplitud del CMAP distal?', 'En los primeros días, con el mínimo hacia el día 7-9 (el SNAP, hacia el día 10-11)', 'Nunca, si la estimulación es distal|En la primera hora|A partir de la cuarta semana',
    'Antes de unos 10 días, la estimulación distal no permite distinguir neuroapraxia (bloqueo) de axonotmesis.'],
  ['e_fib', '¿Qué significan las fibrilaciones y ondas positivas?', 'Fibras musculares denervadas (denervación activa)', 'Reinervación crónica|Actividad normal de placa motora|Bloqueo de conducción',
    'Aparecen en procesos neurógenos y también en miopatías con necrosis o inflamación (las fibras se «desconectan» de su placa).'],
  ['e_neuro', 'PUMs de gran amplitud, larga duración y polifásicos, con reclutamiento reducido. ¿Qué patrón es?', 'Neurógeno crónico (reinervación)', 'Miopático|Normal|Trastorno de la unión neuromuscular',
    'Las unidades supervivientes adoptan fibras denervadas por reinervación colateral, por lo que crecen en tamaño.'],
  ['e_mio', 'PUMs pequeños, de corta duración y polifásicos, con reclutamiento precoz. ¿Qué patrón es?', 'Miopático', 'Neurógeno crónico|Neurógeno agudo|Normal',
    'Cada unidad tiene menos fibras funcionales: para generar fuerza se reclutan muchas unidades con poco esfuerzo.'],
  ['e_recl', '¿Qué significa reclutamiento reducido?', 'Pocas unidades motoras disparando a alta frecuencia', 'Muchas unidades motoras con poco esfuerzo|Unidades motoras de baja amplitud|Ausencia de actividad espontánea',
    'Es el signo más precoz de pérdida axonal o de bloqueo de conducción: la frecuencia de descarga sube (>20 Hz) antes de que se sumen nuevas unidades.'],
  ['e_miotonia', '¿Cómo son las descargas miotónicas?', 'Descargas de fibra muscular que aumentan y disminuyen en frecuencia y amplitud («bombardero en picado»)', 'Frecuencia constante con inicio y final bruscos|Descargas agrupadas de PUMs|Descargas de 150-300 Hz decrecientes',
    'Típicas de distrofia miotónica tipo 1 y 2, miotonías congénitas y paramiotonía. También en Pompe, miopatías necrotizantes e hipotiroidea.'],
  ['e_pompe', 'Descargas miotónicas en paraespinales sin miotonía clínica en un paciente con debilidad de cinturas. ¿Qué debes sospechar?', 'Enfermedad de Pompe', 'Distrofia miotónica tipo 1|Miastenia gravis|ELA',
    'Explorar paraespinales torácicos es clave en la sospecha de Pompe del adulto. Confirmar con actividad de alfa-glucosidasa ácida en gota seca.'],
  ['e_drc', '¿Qué caracteriza a las descargas repetitivas complejas?', 'Frecuencia constante con inicio y final bruscos; indican cronicidad', 'Frecuencia y amplitud crecientes y decrecientes|Descarga aislada de un PUM al azar|Salvas agrupadas de un PUM',
    'Se originan por transmisión efáptica entre fibras musculares. Aparecen en procesos neurógenos o miopáticos crónicos.'],
  ['e_mioquimia', 'Descargas mioquímicas en una plexopatía braquial en una paciente con cáncer de mama previo. ¿Qué sugieren?', 'Plexopatía rádica más que infiltración tumoral', 'Infiltración tumoral|Radiculopatía C8|Síndrome de Parsonage-Turner',
    'Las descargas mioquímicas (salvas agrupadas de un mismo PUM) son típicas de la plexopatía por radiación. Otras causas: mioquimia facial por EM o tumor de tronco.'],
  ['e_neuromio', 'Descargas neuromiotónicas (150-300 Hz, decrecientes). ¿En qué pensar?', 'Síndrome de Isaacs (hiperexcitabilidad nerviosa periférica, anti-CASPR2)', 'Distrofia miotónica tipo 2|Enfermedad de Pompe|Síndrome de Lambert-Eaton',
    'Clínicamente: mioquimias, calambres, rigidez y sudoración. Puede asociarse a timoma. Síndrome de Morvan si hay afectación central.'],
  ['e_awaji', '¿Qué valor tienen las fasciculaciones en ELA según los criterios de Awaji?', 'Equivalen a fibrilaciones/ondas positivas si hay cambios neurógenos crónicos', 'Ninguno|Son diagnósticas por sí solas|Indican miopatía asociada',
    'Awaji incorporó las fasciculaciones (sobre todo complejas) como signo de denervación activa, aumentando la sensibilidad sin perder especificidad.'],
  ['e_ela_snap', 'En la ELA, ¿cómo están los SNAPs?', 'Normales', 'Reducidos en todos los nervios|Ausentes|Con latencias muy prolongadas',
    'La ELA es una enfermedad de motoneurona. SNAPs bajos obligan a replantear: la enfermedad de Kennedy (atrofia bulboespinal) asocia neuronopatía sensitiva con SNAPs reducidos.'],
  ['e_rns', 'Estimulación repetitiva a 3 Hz en la miastenia gravis. ¿Qué hallazgo es positivo?', 'Decremento del CMAP >10% entre el 1.º y el 4.º-5.º estímulo', 'Incremento >100% tras el ejercicio|Decremento >50% seguido de incremento|Respuesta siempre normal',
    'Más sensible en músculos proximales y faciales (trapecio, deltoides, nasal/orbicular). El frío reduce el decremento: calienta la extremidad.'],
  ['e_lems', '¿Qué patrón neurofisiológico sugiere síndrome de Lambert-Eaton?', 'CMAP basal bajo con incremento >100% tras 10 s de ejercicio', 'CMAP normal con decremento aislado|Fibrilaciones difusas|Enlentecimiento uniforme de la conducción',
    'Trastorno presináptico (anticuerpos anti canales de calcio P/Q). Un incremento ≥60% ya es muy sugestivo. Busca carcinoma microcítico de pulmón.'],
  ['e_sfemg', '¿Cuál es la prueba neurofisiológica más sensible para la miastenia gravis?', 'EMG de fibra única (jitter aumentado)', 'Estimulación repetitiva a 3 Hz|Neurografía motora|EMG con aguja concéntrica',
    'Muy sensible pero poco específica: el jitter también aumenta en ELA, neuropatías con reinervación y miopatías.'],
  ['e_botul', '¿Qué hallazgo neurofisiológico es típico del botulismo?', 'CMAP bajos con incremento a alta frecuencia y neurografía sensitiva normal', 'Decremento a 3 Hz con CMAP normal|SNAPs ausentes|Enlentecimiento difuso de la conducción',
    'Trastorno presináptico como el Lambert-Eaton. Clínica descendente con afectación pupilar precoz.'],
  ['e_frio', '¿Qué efecto tiene el frío en la neurografía?', 'Prolonga latencias y reduce la velocidad de conducción (amplitudes algo mayores)', 'Acorta latencias y aumenta la velocidad|No tiene efecto|Reduce la amplitud y acelera la conducción',
    'Controla la temperatura (idealmente >32 °C en la mano). Un miembro frío puede simular una neuropatía desmielinizante.'],
  ['e_f_gbs', '¿Qué alteración suele aparecer primero en la neurografía de un Guillain-Barré precoz?', 'Ondas F ausentes o prolongadas', 'Fibrilaciones difusas|PUMs neurógenos crónicos|Decremento en estimulación repetitiva',
    'Las ondas F exploran el segmento proximal, donde empieza la desmielinización. El reflejo H también se pierde pronto.'],
  ['e_sural', '¿Qué es el «sural sparing» y en qué se ve?', 'SNAP de mediano o cubital anormal con sural normal; típico de AIDP', 'Sural anormal con mediano normal; típico de AIDP|Sural ausente en ELA|Sural normal en neuropatía diabética avanzada',
    'El patrón contrario (sural afectado primero) es el de la polineuropatía axonal longitud-dependiente.'],
  ['e_h', '¿Qué es el reflejo H?', 'El equivalente eléctrico del aquíleo (S1); ausente en radiculopatía S1', 'Una respuesta antidrómica motora pura|El equivalente eléctrico del rotuliano (L4)|Una prueba de la unión neuromuscular',
    'Arco monosináptico (aferente Ia) registrado en el sóleo. Se pierde también en polineuropatías y en el GBS precoz; también puede obtenerse en el FRC (C6-C7).'],
  ['e_fvsh', '¿Qué diferencia la onda F del reflejo H?', 'La F es una respuesta antidrómica motora variable; el H es un reflejo monosináptico estable', 'La F es un reflejo monosináptico; el H es antidrómico|Ambas son reflejos sensitivos|La F solo se obtiene en el sóleo',
    'La F se obtiene en casi todos los nervios motores y cambia de latencia y morfología en cada estímulo. El H usa la vía aferente Ia y aparece a intensidades bajas.'],
  ['e_cubcodo', '¿Qué criterio de conducción apoya una neuropatía cubital en el codo?', 'VC motora a través del codo <50 m/s o caída >10 m/s respecto al antebrazo', 'Latencia distal motora prolongada|SNAP sural ausente|VC del antebrazo <38 m/s',
    'Realiza la conducción con el codo flexionado. El inching puede localizar el punto exacto (retroepicondíleo o túnel cubital).'],
  ['e_stc', '¿Cuál es el hallazgo más sensible en el síndrome del túnel carpiano?', 'Latencia sensitiva distal del mediano prolongada (mejor con técnicas comparativas)', 'Denervación del abductor corto del pulgar|Caída del CMAP del mediano|Enlentecimiento en el antebrazo',
    'Las comparaciones mediano-cubital (palmar) o mediano-radial (pulgar) aumentan la sensibilidad. La denervación del ACP indica casos avanzados.'],
  ['e_cortic', '¿Qué suele mostrar la EMG en la miopatía por corticoides?', 'EMG a menudo normal, sin actividad espontánea', 'Fibrilaciones abundantes|Descargas miotónicas|Patrón neurógeno crónico',
    'Afecta sobre todo a fibras tipo 2, que contribuyen poco a los PUMs de baja fuerza. Una EMG con fibrilaciones en un paciente con corticoides sugiere reactivación de la miositis.'],
  ['e_mio_fib', '¿Qué miopatías cursan típicamente con fibrilaciones?', 'Miopatías inflamatorias y necrotizantes (y distrofias como Duchenne)', 'Miopatía por corticoides|Atrofia por desuso|Miopatía mitocondrial sin necrosis',
    'La necrosis segmentaria separa parte de la fibra de su placa motora y la «denerva».'],
  ['e_ibm', '¿Qué patrón EMG es típico de la miositis por cuerpos de inclusión?', 'Mezcla de PUMs miopáticos y PUMs grandes de aspecto neurógeno, con fibrilaciones', 'Patrón neurógeno puro|EMG normal|Solo descargas miotónicas',
    'La mezcla puede confundirse con enfermedad de motoneurona. Clínica: debilidad de flexores de los dedos y cuádriceps, a menudo asimétrica.'],
  ['e_mcmanis', 'Prueba de ejercicio largo (McManis) en una parálisis periódica. ¿Qué es característico?', 'Caída progresiva de la amplitud del CMAP >40% tras el ejercicio', 'Incremento >100% tras el ejercicio|Decremento a 3 Hz|Sin cambios',
    'Útil en parálisis periódicas primarias entre ataques. La prueba de ejercicio corto ayuda a diferenciar las canalopatías miotónicas.'],
  ['e_cim', '¿Qué orienta a miopatía del paciente crítico frente a polineuropatía del crítico?', 'CMAP bajos de duración aumentada, SNAPs normales e inexcitabilidad a la estimulación muscular directa', 'SNAPs ausentes con CMAP normales|Enlentecimiento desmielinizante difuso|Decremento a 3 Hz',
    'La polineuropatía del crítico es axonal sensitivomotora (SNAP y CMAP bajos). Ambas pueden coexistir.'],
  ['e_aman', '¿Qué patrón neurofisiológico tiene la neuropatía axonal motora aguda (AMAN)?', 'CMAP bajos sin signos de desmielinización, con SNAPs normales', 'Enlentecimiento desmielinizante difuso|SNAPs ausentes con CMAP normales|Decremento a 3 Hz',
    'Asociada a Campylobacter y anticuerpos anti-GM1/GD1a. Puede haber fallo de conducción reversible que simula desmielinización.'],
  ['e_placa', 'Potenciales de placa motora (ruido y espigas de placa). ¿Qué significan?', 'Hallazgo normal: la aguja está cerca de la placa motora', 'Denervación activa|Descarga miotónica|Fasciculación',
    'Suelen doler. Las espigas de placa pueden confundirse con fibrilaciones: fíjate en su onda inicial negativa y su disparo irregular.'],
  ['e_radic', 'Denervación en paraespinales y en músculos de un mismo miotoma inervados por nervios distintos, con SNAPs normales. ¿Diagnóstico?', 'Radiculopatía', 'Plexopatía|Mononeuropatía múltiple|Miopatía',
    'Tres claves: patrón de miotoma (varios nervios, una raíz), paraespinales afectados y SNAPs normales.'],
];

// Nervios para enunciados "¿cuál NO inerva...?"
const NOT_NERVE = [
  ['nn_radial', 'radial', 'el nervio radial (incluido el interóseo posterior)', 'ms'],
  ['nn_mediano', 'mediano', 'el nervio mediano (incluido el interóseo anterior)', 'ms'],
  ['nn_cubital', 'cubital', 'el nervio cubital', 'ms'],
  ['nn_femoral', 'femoral', 'el nervio femoral', 'mi'],
  ['nn_obt', 'obturador', 'el nervio obturador', 'mi'],
  ['nn_tibial', 'tibial', 'el nervio tibial', 'mi'],
  ['nn_peroneo', 'peroneo', 'el nervio peroneo (profundo o superficial)', 'mi'],
];

// ============================================================
//  Dibujos SVG propios (esquemáticos, offline)
// ============================================================

// Curva suave cerrada (Catmull-Rom -> Bézier)
function smoothClosed(pts) {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

// Extremidad a partir de una línea media con anchuras [[x,y,w],...]
function limb(points) {
  const L = [], R = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1; tx /= len; ty /= len;
    const nx = -ty, ny = tx, w = points[i][2] / 2;
    L.push([points[i][0] + nx * w, points[i][1] + ny * w]);
    R.push([points[i][0] - nx * w, points[i][1] - ny * w]);
  }
  // puntas redondeadas
  const first = points[0], last = points[points.length - 1];
  const tl = [points[points.length - 1][0] - points[points.length - 2][0], points[points.length - 1][1] - points[points.length - 2][1]];
  const tlen = Math.hypot(tl[0], tl[1]) || 1;
  const tip = [last[0] + tl[0] / tlen * last[2] * 0.35, last[1] + tl[1] / tlen * last[2] * 0.35];
  const tf = [points[1][0] - first[0], points[1][1] - first[1]];
  const flen = Math.hypot(tf[0], tf[1]) || 1;
  const base = [first[0] - tf[0] / flen * first[2] * 0.2, first[1] - tf[1] / flen * first[2] * 0.2];
  return smoothClosed([...L, tip, ...R.reverse(), base]);
}

const mirrorPts = (pts, W) => pts.map(p => [W - p[0], p[1], p[2]]);

// ---------- Cuerpo completo ----------
const BODY_W = 220;
function bodyShapes() {
  const s = [];
  s.push(`<ellipse cx="110" cy="36" rx="19" ry="24"/>`);
  s.push(`<path d="${limb([[110, 50, 20], [110, 62, 21], [110, 76, 26]])}"/>`);
  s.push(`<path d="M72,78 C90,70 130,70 148,78 C153,95 153,112 148,130 C146,160 140,180 138,195 C144,210 146,222 144,236 L110,250 L76,236 C74,222 76,210 82,195 C80,180 74,160 72,130 C67,112 67,95 72,78Z"/>`);
  const arm = [[77, 84, 25], [67, 110, 22], [60, 140, 20], [54, 165, 18], [48, 200, 16], [42, 238, 13]];
  const hand = [[42, 236, 14], [39, 252, 16], [37, 268, 13], [36, 280, 9]];
  const thumb = [[39, 244, 7], [32, 254, 6.5], [28, 263, 5.5]];
  const leg = [[93, 232, 38], [90, 270, 32], [88, 305, 26], [87, 338, 21], [86, 370, 20], [86, 398, 14], [86, 418, 12]];
  const foot = [[86, 418, 16], [84, 432, 20], [83, 446, 17]];
  for (const P of [arm, hand, thumb, leg, foot]) {
    s.push(`<path d="${limb(P)}"/>`);
    s.push(`<path d="${limb(mirrorPts(P, BODY_W))}"/>`);
  }
  return s.join('');
}

const TORSO_PATH = 'M72,78 C90,70 130,70 148,78 C153,95 153,112 148,130 C146,160 140,180 138,195 C144,210 146,222 144,236 L110,250 L76,236 C74,222 76,210 82,195 C80,180 74,160 72,130 C67,112 67,95 72,78Z';

function bodyLandmarks(view) {
  if (view === 'front') {
    return `<g class="lm">
      <path d="M108,76 Q94,74 78,81"/><path d="M112,76 Q126,74 142,81"/>
      <path d="M110,136 l0,6"/>
      <circle cx="90" cy="118" r="1.8" class="lmdot"/><circle cx="130" cy="118" r="1.8" class="lmdot"/>
      <ellipse cx="110" cy="195" rx="2" ry="2.6" class="lmdot"/>
      <path d="M79,212 Q92,228 104,240"/><path d="M141,212 Q128,228 116,240"/>
      <ellipse cx="87" cy="338" rx="6" ry="7"/><ellipse cx="133" cy="338" rx="6" ry="7"/>
      <path d="M110,212 L110,248"/>
    </g>`;
  }
  return `<g class="lm">
    <path d="M110,64 L110,226" stroke-dasharray="2 3"/>
    <path d="M84,92 L100,96 L96,128 Z"/><path d="M136,92 L120,96 L124,128 Z"/>
    <path d="M110,222 L110,244"/>
    <path d="M76,238 Q92,252 108,246"/><path d="M144,238 Q128,252 112,246"/>
    <path d="M79,337 Q87,341 95,337"/><path d="M125,337 Q133,341 141,337"/>
    <circle cx="110" cy="42" r="1.8" class="lmdot"/>
  </g>`;
}

// Coordenadas de puntos clave (lado derecho del paciente)
const BODY_POINTS = {
  front: {
    C3: [89, 79], C4: [74, 82], C5: [47, 160], T1: [61, 164], T2: [77, 101],
    T3: [90, 106], T4: [90, 118], T5: [90, 130], T6: [90, 142], T7: [90, 155], T8: [90, 168], T9: [90, 182],
    T10: [90, 195], T11: [90, 211], T12: [91, 226], L1: [95, 253], L2: [99, 284], L3: [94, 328],
  },
  back: { C2: [119, 40], S2: [133, 336], S3: [127, 245], 'S4-5': [113, 241] },
};

const BODY_BANDS = { T4: [111, 125], T10: [188, 202], L1: [214, 238] };

function svgBody(view, opts = {}) {
  const pts = BODY_POINTS[view];
  let extra = '';
  if (opts.band && BODY_BANDS[opts.band]) {
    const [y1, y2] = BODY_BANDS[opts.band];
    extra += `<clipPath id="torsoclip"><path d="${TORSO_PATH}"/></clipPath>
      <rect x="60" y="${y1}" width="100" height="${y2 - y1}" class="zone" clip-path="url(#torsoclip)"/>`;
  }
  let dots = '';
  if (opts.all) {
    const right = { C3: [5, -4], T1: [5, 5], C2: [6, 0], S2: [6, 3], S3: [7, 5] };
    const left = { 'S4-5': [-6, -4] };
    for (const [k, [x, y]] of Object.entries(pts)) {
      let dx = view === 'front' ? -6 : 6, dy = 3, anc = view === 'front' ? 'end' : 'start';
      if (right[k]) { [dx, dy] = right[k]; anc = 'start'; }
      if (left[k]) { [dx, dy] = left[k]; anc = 'end'; }
      dots += `<circle cx="${x}" cy="${y}" r="2.6" class="kp"/><text x="${x + dx}" y="${y + dy}" class="kplabel" text-anchor="${anc}">${k}</text>`;
    }
  }
  if (opts.point && pts[opts.point]) {
    const [x, y] = pts[opts.point];
    dots += `<circle cx="${x}" cy="${y}" r="9" class="kp-halo"/><circle cx="${x}" cy="${y}" r="4.2" class="kp-on"/>`;
  }
  const side = view === 'front'
    ? `<text x="30" y="16" class="side">D</text><text x="190" y="16" class="side">I</text>`
    : `<text x="30" y="16" class="side">I</text><text x="190" y="16" class="side">D</text>`;
  return `<svg viewBox="0 0 220 460" class="fig fig-body" role="img" aria-label="Silueta ${view === 'front' ? 'anterior' : 'posterior'}">
    ${side}
    <g class="sil-out">${bodyShapes()}</g><g class="sil">${bodyShapes()}</g>
    ${extra}${bodyLandmarks(view)}${dots}
    <text x="110" y="456" class="caption" text-anchor="middle">${view === 'front' ? 'Vista anterior' : 'Vista posterior'}</text>
  </svg>`;
}

// ---------- Mano (derecha) ----------
const HAND_REGIONS = {
  hand_rad: 'M56,118 L114,118 L114,236 Q84,235 66,214 Q58,196 57,170 Z',
  hand_uln: 'M114,118 L152,118 Q153,150 150,176 Q146,218 114,236 Z',
  idx_p: rr(58, 84, 20, 36), idx_d: rr(58, 42, 20, 44, true),
  mid_p: rr(81, 78, 20, 42), mid_d: rr(81, 28, 20, 52, true),
  ringR_p: 'M104,82 L114,82 L114,120 L104,120 Z', ringR_d: 'M104,48 Q104,38 114,38 L114,84 L104,84 Z',
  ringU_p: 'M114,82 L124,82 L124,120 L114,120 Z', ringU_d: 'M114,38 Q124,38 124,48 L124,84 L114,84 Z',
  lit_p: rr(127, 93, 18, 29), lit_d: rr(127, 62, 18, 33, true),
  thumb_p: limb([[70, 204, 27], [58, 184, 25], [48, 166, 22]]),
  thumb_d: limb([[49, 168, 22], [40, 151, 20], [34, 139, 17]]),
};
function rr(x, y, w, h, top) {
  const r = w / 2;
  if (top) return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
  return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}
const HAND_ZONES = {
  C6: ['thumb_p', 'thumb_d'], C7: ['mid_p', 'mid_d'], C8: ['lit_p', 'lit_d', 'ringU_p', 'ringU_d', 'hand_uln'],
  median: ['thumb_p', 'thumb_d', 'idx_p', 'idx_d', 'mid_p', 'mid_d', 'ringR_p', 'ringR_d', 'hand_rad'],
  ulnar: ['ringU_p', 'ringU_d', 'lit_p', 'lit_d', 'hand_uln'],
  radial: ['hand_rad', 'thumb_p', 'thumb_d', 'idx_p', 'mid_p', 'ringR_p'],
  ulnardors: ['hand_uln', 'ringU_p', 'ringU_d', 'lit_p', 'lit_d'],
  mediandors: ['idx_d', 'mid_d', 'ringR_d'],
};
const HAND_POINTS = { C6: [59, 185], C7: [91, 100], C8: [136, 108] };

function svgHand(view, opts = {}) {
  const zone = opts.zone ? (HAND_ZONES[opts.zone] || []) : [];
  const shapes = Object.entries(HAND_REGIONS).map(([k, d]) =>
    `<path d="${d}" class="${zone.includes(k) ? 'zone' : ''}"/>`).join('');
  const base = Object.values(HAND_REGIONS).map(d => `<path d="${d}"/>`).join('');
  let marks = '';
  if (view === 'dorsum') {
    marks = `<g class="lm">
      <rect x="62" y="46" width="12" height="11" rx="4"/><rect x="85" y="32" width="12" height="11" rx="4"/>
      <rect x="108" y="42" width="12" height="11" rx="4"/><rect x="130" y="66" width="10" height="9" rx="3.5"/>
            <path d="M68,120 q0,-3 4,-3"/><path d="M90,119 q0,-3 4,-3"/><path d="M113,119 q0,-3 4,-3"/><path d="M134,120 q0,-3 4,-3"/>
    </g>`;
  } else {
    marks = `<g class="lm"><path d="M60,150 Q100,160 150,146"/><path d="M78,190 Q84,160 110,130"/><path d="M66,178 Q70,150 90,132"/></g>`;
  }
  let dots = '';
  if (opts.point && HAND_POINTS[opts.point]) {
    const [x, y] = HAND_POINTS[opts.point];
    dots = `<circle cx="${x}" cy="${y}" r="9" class="kp-halo"/><circle cx="${x}" cy="${y}" r="4.2" class="kp-on"/>`;
  }
  if (opts.all) {
    dots = Object.entries(HAND_POINTS).map(([k, [x, y]]) =>
      `<circle cx="${x}" cy="${y}" r="3" class="kp"/><text x="${x}" y="${y - 7}" class="kplabel" text-anchor="middle">${k}</text>`).join('');
  }
  const tf = view === 'palm' ? 'transform="translate(200,0) scale(-1,1)"' : '';
  const dotsG = view === 'palm' ? `<g ${tf}>${dots.replace(/<text[^>]*>[^<]*<\/text>/g, '')}</g>` : dots;
  return `<svg viewBox="0 0 200 262" class="fig fig-hand" role="img" aria-label="Mano derecha, ${view === 'palm' ? 'palma' : 'dorso'}">
    <g ${tf}><g class="sil-out">${base}</g><g class="sil seg">${shapes}</g>${marks}</g>${dotsG}
    <text x="100" y="256" class="caption" text-anchor="middle">Mano derecha, ${view === 'palm' ? 'palma' : 'dorso'}</text>
  </svg>`;
}

// ---------- Pierna y pie (derecha, vista anterior) ----------
const LEG_REGIONS = {
  leg_ant: 'M64,10 L114,10 L110,70 L106,128 L82,130 L72,70 Z',
  leg_med: 'M114,10 L136,10 L128,70 L118,126 L106,128 L110,70 Z',
  foot_lat: 'M82,130 L92,134 L78,180 L70,222 L58,222 L66,180 Z',
  foot_med: 'M118,126 L134,176 L146,222 L134,222 L122,178 L108,130 Z',
  foot_dor: 'M92,134 L108,130 L122,178 L134,222 L70,222 L78,180 Z',
  mall_lat: 'M72,136 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 Z',
  mall_med: 'M112,129 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 Z',
  toe5: 'M56,229 a6,9 0 1,0 12,0 a6,9 0 1,0 -12,0 Z',
  toe4: 'M69,235 a7,11 0 1,0 14,0 a7,11 0 1,0 -14,0 Z',
  toe3: 'M84.5,238 a7.5,12 0 1,0 15.0,0 a7.5,12 0 1,0 -15.0,0 Z',
  toe2: 'M101,239 a8,13 0 1,0 16,0 a8,13 0 1,0 -16,0 Z',
  toe1: 'M120,235 a12,17 0 1,0 24,0 a12,17 0 1,0 -24,0 Z',
  web1: 'M113,221 L127,221 L120,236 Z',
};
const LEG_ZONES = {
  L4: ['leg_med', 'foot_med', 'mall_med'],
  L5: ['leg_ant', 'foot_dor', 'toe1', 'toe2', 'toe3', 'toe4', 'web1'],
  S1: ['foot_lat', 'mall_lat', 'toe5'],
  saphenous: ['leg_med', 'foot_med', 'mall_med'],
  supperoneal: ['leg_ant', 'foot_dor', 'toe1', 'toe2', 'toe3', 'toe4'],
  deepperoneal: ['web1'],
  sural: ['foot_lat', 'mall_lat', 'toe5'],
};
const LEG_POINTS = { L4: [120, 129], L5: [97, 212], S1: [71, 156] };

function svgLeg(opts = {}) {
  const zone = opts.zone ? (LEG_ZONES[opts.zone] || []) : [];
  const order = ['leg_ant', 'leg_med', 'foot_lat', 'foot_med', 'foot_dor', 'mall_lat', 'mall_med', 'toe5', 'toe4', 'toe3', 'toe2', 'toe1', 'web1'];
  const base = order.filter(k => k !== 'web1').map(k => `<path d="${LEG_REGIONS[k]}"/>`).join('');
  const shapes = order.map(k => {
    const cls = zone.includes(k) ? 'zone' : (k === 'web1' ? 'hide' : '');
    return `<path d="${LEG_REGIONS[k]}" class="${cls}"/>`;
  }).join('');
  let dots = '';
  if (opts.point && LEG_POINTS[opts.point]) {
    const [x, y] = LEG_POINTS[opts.point];
    dots = `<circle cx="${x}" cy="${y}" r="9" class="kp-halo"/><circle cx="${x}" cy="${y}" r="4.2" class="kp-on"/>`;
  }
  if (opts.all) {
    dots = Object.entries(LEG_POINTS).map(([k, [x, y]]) =>
      `<circle cx="${x}" cy="${y}" r="3" class="kp"/><text x="${x + (k === 'S1' ? -7 : 8)}" y="${y + 3}" class="kplabel" text-anchor="${k === 'S1' ? 'end' : 'start'}">${k}</text>`).join('');
  }
  return `<svg viewBox="0 0 200 272" class="fig fig-leg" role="img" aria-label="Pierna y pie derechos, vista anterior">
    <text x="58" y="18" class="side" text-anchor="end">lateral</text><text x="142" y="18" class="side">medial</text>
    <g class="sil-out">${base}</g><g class="sil seg">${shapes}</g>
    <g class="lm"><ellipse cx="100" cy="14" rx="14" ry="6"/></g>
    ${dots}
    <text x="100" y="268" class="caption" text-anchor="middle">Pierna y pie derechos, vista anterior</text>
  </svg>`;
}

// ---------- Plexo braquial ----------
function svgBrachialPlexus() {
  const R = { C5: 40, C6: 80, C7: 120, C8: 160, T1: 200 };
  const T = { sup: 60, med: 120, inf: 180 };
  const C = { lat: 70, post: 130, med: 190 };
  const B = { mc: 36, ax: 98, rad: 140, medi: 184, cub: 236 };
  const x = { r: 40, t: 120, c: 200, b: 280 };
  const ln = (x1, y1, x2, y2, cls) => `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}" class="${cls}"/>`;
  let s = '';
  s += ln(x.r, R.C5, x.t, T.sup, 'pl-a') + ln(x.r, R.C6, x.t, T.sup, 'pl-a') + ln(x.r, R.C7, x.t, T.med, 'pl-b') + ln(x.r, R.C8, x.t, T.inf, 'pl-c') + ln(x.r, R.T1, x.t, T.inf, 'pl-c');
  s += ln(x.t, T.sup, x.c, C.lat, 'pl-lat') + ln(x.t, T.med, x.c, C.lat, 'pl-lat');
  s += ln(x.t, T.sup, x.c, C.post, 'pl-post') + ln(x.t, T.med, x.c, C.post, 'pl-post') + ln(x.t, T.inf, x.c, C.post, 'pl-post');
  s += ln(x.t, T.inf, x.c, C.med, 'pl-med');
  s += ln(x.c, C.lat, x.b, B.mc, 'pl-lat') + ln(x.c, C.lat, x.b, B.medi, 'pl-lat');
  s += ln(x.c, C.post, x.b, B.ax, 'pl-post') + ln(x.c, C.post, x.b, B.rad, 'pl-post');
  s += ln(x.c, C.med, x.b, B.medi, 'pl-med') + ln(x.c, C.med, x.b, B.cub, 'pl-med');
  // ramas colaterales
  s += `<path d="M${x.r + 8},${R.C5} L${x.r + 22},${R.C5 - 22}" class="pl-side"/><text x="${x.r + 24}" y="${R.C5 - 24}" class="pl-small">dorsal escápula</text>`;
  s += `<path d="M${x.t - 6},${T.sup - 2} L${x.t + 8},${T.sup - 34}" class="pl-side"/><text x="${x.t + 10}" y="${T.sup - 36}" class="pl-small">supraescapular</text>`;
  s += `<path d="M${x.r + 6},${R.C5 + 3} Q ${x.r + 14},${R.C6} ${x.r + 12},${R.C7}" class="pl-side"/><path d="M${x.r + 6},${R.C6 + 3} L${x.r + 12},${R.C7 - 6}" class="pl-side"/><path d="M${x.r + 12},${R.C7} Q ${x.r + 18},${R.T1 - 10} ${x.r + 16},${R.T1 + 16}" class="pl-side"/>`;
  s += `<text x="${x.r + 20}" y="${R.T1 + 24}" class="pl-small">torácico largo (C5-C7)</text>`;
  const node = (xx, yy, t, anchor = 'middle', dx = 0) => `<circle cx="${xx}" cy="${yy}" r="4" class="pl-node"/><text x="${xx + dx}" y="${yy - 8}" text-anchor="${anchor}" class="pl-lab">${t}</text>`;
  for (const [k, y] of Object.entries(R)) s += `<circle cx="${x.r}" cy="${y}" r="4" class="pl-node"/><text x="${x.r - 9}" y="${y + 4}" text-anchor="end" class="pl-lab">${k}</text>`;
  s += node(x.t, T.sup, 'superior') + node(x.t, T.med, 'medio') + node(x.t, T.inf, 'inferior');
  s += node(x.c, C.lat, 'lateral') + node(x.c, C.post, 'posterior') + node(x.c, C.med, 'medial');
  const br = (y, t) => `<circle cx="${x.b}" cy="${y}" r="4" class="pl-node"/><text x="${x.b + 8}" y="${y + 4}" class="pl-lab pl-br">${t}</text>`;
  s += br(B.mc, 'Musculocutáneo') + br(B.ax, 'Axilar') + br(B.rad, 'Radial') + br(B.medi, 'Mediano') + br(B.cub, 'Cubital');
  s += `<text x="${x.r}" y="262" text-anchor="middle" class="pl-col">Raíces</text><text x="${x.t}" y="262" text-anchor="middle" class="pl-col">Troncos</text><text x="${x.c}" y="262" text-anchor="middle" class="pl-col">Fascículos</text><text x="${x.b + 8}" y="262" class="pl-col">Nervios</text>`;
  return `<svg viewBox="0 0 400 272" class="fig fig-plexus" role="img" aria-label="Esquema del plexo braquial">${s}</svg>`;
}

// ---------- Plexo lumbosacro (barras de raíces) ----------
function svgLumbosacral() {
  const roots = ['T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4'];
  const nerves = [
    ['Iliohipogástrico / ilioinguinal', 'L1', 'L1'],
    ['Genitofemoral', 'L1', 'L2'],
    ['Femorocutáneo lateral', 'L2', 'L3'],
    ['Femoral', 'L2', 'L4'],
    ['Obturador', 'L2', 'L4'],
    ['Glúteo superior', 'L4', 'S1'],
    ['Glúteo inferior', 'L5', 'S2'],
    ['Ciático', 'L4', 'S3'],
    ['  Tibial', 'L4', 'S3'],
    ['  Peroneo común', 'L4', 'S2'],
    ['Cutáneo femoral posterior', 'S1', 'S3'],
    ['Pudendo', 'S2', 'S4'],
  ];
  const x0 = 188, cw = 20, top = 30, rh = 22;
  let s = roots.map((r, i) => `<text x="${x0 + i * cw + cw / 2}" y="20" text-anchor="middle" class="pl-lab">${r}</text>
    <line x1="${x0 + i * cw + cw / 2}" y1="26" x2="${x0 + i * cw + cw / 2}" y2="${top + nerves.length * rh}" class="grid"/>`).join('');
  nerves.forEach(([n, a, b], j) => {
    const y = top + j * rh + 10;
    const i1 = roots.indexOf(a), i2 = roots.indexOf(b);
    const sub = n.startsWith('  ');
    s += `<text x="${x0 - 8}" y="${y + 4}" text-anchor="end" class="pl-lab ${sub ? 'pl-sub' : ''}">${n.trim()}</text>
      <rect x="${x0 + i1 * cw + 3}" y="${y - 6}" width="${(i2 - i1 + 1) * cw - 6}" height="12" rx="6" class="${j < 5 ? 'bar-l' : 'bar-s'}"/>`;
  });
  return `<svg viewBox="0 0 400 ${top + nerves.length * rh + 12}" class="fig fig-ls" role="img" aria-label="Raíces de los nervios del plexo lumbosacro">${s}</svg>`;
}

// ---------- Dispatcher ----------
function renderFig(spec) {
  if (!spec) return '';
  switch (spec.kind) {
    case 'body': return svgBody(spec.view, spec);
    case 'hand': return svgHand(spec.view, spec);
    case 'leg': return svgLeg(spec);
    case 'bplex': return svgBrachialPlexus();
    case 'lsplex': return svgLumbosacral();
  }
  return '';
}

// ============================================================
//  Raíz y nervio — lógica de la app

// ---------- generación de tarjetas ----------

const RELATED = { ciatico: ['tibial', 'peroneo', 'obturador'], tibial: ['ciatico'], peroneo: ['ciatico'], obturador: ['ciatico'] };
const muscleById = Object.fromEntries(MUSCLES.map(m => [m.id, m]));

let IMG = {};   // img/index.json (opcional)
function muscleImg(id) {
  const e = IMG[id];
  if (!e || !e.file) return '';
  return `<figure class="mimg"><button class="mimg-btn" data-zoom="${esc(e.file)}" aria-label="Ampliar imagen"><img src="${esc(e.file)}" alt="Lámina anatómica: ${esc(muscleById[id].n)}" loading="lazy"></button>
    ${e.credit ? `<figcaption>${esc(e.credit)}</figcaption>` : ''}</figure>`;
}

function muscleProfile(m) {
  return `<dl class="profile">
    <dt>Nervio</dt><dd>${esc(m.nerve)}</dd>
    ${m.roots.length ? `<dt>Raíces</dt><dd>${esc(fmtRoots(m.roots, m.minor))}</dd>` : ''}
    <dt>Función</dt><dd>${esc(m.act)}</dd></dl>`;
}

// Dentro del bloque craneal y axial, los distractores solo pueden salir de la
// misma zona: si no, al elevador del párpado le salen opciones del abdomen.
const ZONA = {
  parpado: 'ocular', ojo: 'ocular',
  facial: 'craneal', mandibula: 'craneal', lengua: 'craneal', bulbar: 'craneal',
  cuello: 'axial', tronco: 'axial', resp: 'axial',
};
const ORDEN_ZONA = {
  ocular: ['ocular', 'craneal', 'axial'],
  craneal: ['craneal', 'ocular', 'axial'],
  axial: ['axial', 'craneal', 'ocular'],
};
// candidatos de la misma zona; solo si no llegan a tres se pasa a la de al lado
function zonaPool(m, lista) {
  if (m.r !== 'ax') return lista;
  const out = [];
  for (const z of (ORDEN_ZONA[ZONA[m.fam]] || ['craneal', 'ocular', 'axial'])) {
    out.push(...lista.filter(x => ZONA[x.fam] === z));
    if (out.length >= 3) break;
  }
  return out;
}

function buildCards() {
  const cards = [];
  const add = c => cards.push(c);
  const curated = (block, arr, extra = {}) => arr.forEach(([id, q, ok, ds, ex, tags]) => add({
    id, block, kind: 'mcq', q, tags: tags || [], answer: ok,
    make: () => ({ options: shuffle([ok, ...ds.split('|')]), correct: ok, ex: esc(ex) }), ...extra,
  }));

  // Músculos
  for (const m of MUSCLES) {
    const region = MUSCLES.filter(x => x.r === m.r);
    const tags = m.roots.slice();
    const exFullFn = () => `<p class="ex-title">${esc(m.n)}</p>${muscleProfile(m)}<p>${esc(m.ex)}</p>${muscleImg(m.id)}`;
    if (m.roots.length) add({
      id: m.id + ':raiz', block: m.r, kind: 'multi', title: m.n, q: '¿Qué raíces lo inervan?',
      hint: 'Marca las raíces principales. Las accesorias no restan.', chips: ROOT_CHIPS[m.r], main: m.roots, minor: m.minor,
      tags, answer: fmtRoots(m.roots, m.minor), make: () => ({ ex: exFullFn() }),
    });
    add({
      id: m.id + ':nervio', block: m.r, kind: 'mcq', title: m.n, q: '¿Qué nervio lo inerva?', tags, answer: m.nerve,
      make: () => {
        const bad = [m.group, ...(RELATED[m.group] || [])];
        const pool = uniq(zonaPool(m, region.filter(x => !bad.includes(x.group) && x.nerve !== m.nerve)).map(x => x.nerve));
        return { options: shuffle([m.nerve, ...pick(pool, 3)]), correct: m.nerve, ex: exFullFn() };
      },
    });
    add({
      id: m.id + ':funcion', block: m.r, kind: 'mcq', title: m.n, q: '¿Cuál es su función principal?', tags, answer: m.act,
      make: () => {
        const pool = uniq(zonaPool(m, region.filter(x => x.fam !== m.fam && x.act !== m.act)).map(x => x.act));
        return { options: shuffle([m.act, ...pick(pool, 3)]), correct: m.act, ex: exFullFn() };
      },
    });
    if (m.inv) add({
      id: m.id + ':inv', block: m.r, kind: 'mcq', title: m.act, q: '¿Qué músculo se encarga principalmente de esto?', tags, answer: m.n,
      make: () => {
        const pool = uniq(zonaPool(m, region.filter(x => x.fam !== m.fam && x.act !== m.act)).map(x => x.n));
        return { options: shuffle([m.n, ...pick(pool, 3)]), correct: m.n, ex: exFullFn() };
      },
    });
  }
  // ¿Cuál NO inerva…?
  for (const [id, group, label, r] of NOT_NERVE) {
    const inG = MUSCLES.filter(m => m.group === group);
    const excl = new Set(['braquial', 'aductmayor']);
    // el intruso debe compartir raíces con los del nervio: si no, se acierta por descarte
    const raicesG = new Set(inG.flatMap(m => m.roots));
    const out = MUSCLES.filter(m => m.r === r && m.group !== group && !excl.has(m.id)
      && !(['tibial', 'peroneo'].includes(group) && m.group === 'ciatico')
      && m.roots.some(x => raicesG.has(x)));
    add({
      id, block: r, kind: 'mcq', q: `¿Cuál de estos músculos NO está inervado por ${label}?`, tags: [],
      answer: `Inerva: ${inG.map(m => m.n).join(', ')}.`,
      make: () => {
        const odd = pick(out, 1)[0];
        const ins = pick(inG, 3);
        return {
          options: shuffle([odd.n, ...ins.map(m => m.n)]), correct: odd.n,
          ex: `<p><strong>${esc(odd.n)}</strong> depende del nervio ${esc(odd.nerve.toLowerCase())} (${esc(fmtRoots(odd.roots, odd.minor) || 'pares craneales')}).</p><p>Músculos de ${esc(label)} en la base: ${esc(inG.map(m => m.n).join(', '))}.</p>`,
        };
      },
    });
  }

  curated('refl', REFLEXES);

  // Raíces: exploración motora
  const raizLista = RAICES.map(([r, mov]) => `${r}: ${mov.toLowerCase()}`).join('; ');
  const raizEx = ([r, mov, mus, refl, perla]) => `<p class="ex-title">Raíz ${esc(r)}</p>
    <dl class="profile"><dt>Exploración</dt><dd>${esc(mov)}</dd><dt>Músculos</dt><dd>${esc(mus)}</dd><dt>Reflejo</dt><dd>${esc(refl)}</dd></dl>
    <p>${esc(perla)}</p><p class="note">${esc(raizLista)}.</p>`;
  RAICES.forEach((fila, i) => {
    const [r, mov, mus, refl, , evitar] = fila;
    const brazo = x => ['C', 'T'].includes(x[0]);
    const otras = RAICES.filter(x => x[0] !== r && brazo(x[0]) === brazo(r));
    add({
      id: 'raiz_expl_' + r, block: 'mio', kind: 'mcq', title: 'Raíz ' + r, q: '¿Qué movimiento exploras para valorarla?', tags: [r], answer: mov,
      make: () => ({ options: shuffle([mov, ...pick(otras.map(x => x[1]), 3)]), correct: mov, ex: raizEx(fila) }),
    });
    add({
      id: 'raiz_mov_' + r, block: 'mio', kind: 'mcq', title: mov, q: '¿Qué raíz valora sobre todo?', tags: [r], answer: r,
      make: () => {
        const mismaExtremidad = x => (['C', 'T'].includes(x[0])) === (['C', 'T'].includes(r[0]));
        const libres = RAICES.map(x => x[0]).filter(x => x !== r && mismaExtremidad(x) && !(evitar || []).includes(x));
        const cerca = libres.filter(x => Math.abs(RAICES.findIndex(y => y[0] === x) - i) <= 3);
        const pool = uniq([...pick(cerca, 3), ...libres]);
        return { options: shuffle([r, ...pool.slice(0, 3)]), correct: r, ex: raizEx(fila) };
      },
    });
    if (refl !== 'Ninguno') add({
      id: 'raiz_refl_' + r, block: 'mio', kind: 'mcq', title: 'Raíz ' + r, q: '¿Qué reflejo la acompaña?', tags: [r], answer: refl,
      make: () => ({ options: shuffle([refl, ...pick(uniq(otras.map(x => x[3]).filter(x => x !== 'Ninguno' && x !== refl)), 3)]), correct: refl, ex: raizEx(fila) }),
    });
  });

  curated('plex', PLEXUS);

  // Dermatomas
  const dermOpts = lvl => {
    const i = DERM_LEVELS.indexOf(lvl);
    const near = DERM_LEVELS.filter((x, j) => j !== i && Math.abs(j - i) <= 3);
    return shuffle([lvl, ...pick(near, 3)]);
  };
  const figFor = (lvl, view) => view === 'hand' ? { kind: 'hand', view: 'dorsum', point: lvl }
    : view === 'leg' ? { kind: 'leg', point: lvl } : { kind: 'body', view, point: lvl };
  for (const [lvl, desc, view] of KEYPOINTS) {
    const ex = `<p><strong>${lvl}</strong>: ${esc(desc)}.</p><p>${esc(DERM_PEARLS[lvl] || '')}</p>`;
    add({
      id: 'dk_img_' + lvl, block: 'derm', kind: 'mcq', fig: figFor(lvl, view), q: '¿Qué dermatoma corresponde al punto marcado?', tags: [lvl], answer: lvl,
      make: () => ({ options: dermOpts(lvl), correct: lvl, ex }),
    });
    add({
      id: 'dk_desc_' + lvl, block: 'derm', kind: 'mcq', title: desc, q: '¿Qué dermatoma es este punto clave?', tags: [lvl], answer: lvl,
      make: () => ({ options: dermOpts(lvl), correct: lvl, ex }),
    });
  }
  for (const [id, lvl, kind, desc] of DERM_ZONES) {
    const fig = kind === 'hand' ? { kind: 'hand', view: 'dorsum', zone: lvl } : kind === 'leg' ? { kind: 'leg', zone: lvl } : { kind: 'body', view: 'front', band: lvl };
    add({
      id, block: 'derm', kind: 'mcq', fig, q: '¿Qué dermatoma corresponde a la zona resaltada?', tags: [lvl], answer: `${lvl}: ${desc}`,
      make: () => ({ options: dermOpts(lvl), correct: lvl, ex: `<p><strong>${lvl}</strong>: ${esc(desc.toLowerCase())}.</p><p>${esc(DERM_PEARLS[lvl] || '')} Los dermatomas se solapan y varían entre personas: las zonas son aproximadas.</p>` }),
    });
  }

  // Territorios cutáneos
  for (const [id, ok, figk, zone, ds, ex] of CUT_IMG) {
    const fig = figk === 'leg' ? { kind: 'leg', zone } : { kind: 'hand', view: figk, zone };
    add({
      id, block: 'cut', kind: 'mcq', fig, q: '¿Qué nervio da la sensibilidad de la zona resaltada?', tags: [], answer: ok,
      make: () => ({ options: shuffle([ok, ...ds.split('|')]), correct: ok, ex: esc(ex) }),
    });
  }
  curated('cut', CUT_DESC);
  curated('loc', LOCALIZATION);
  curated('emg', EMG.map(e => [...e, []]));
  return cards;
}


// ---------- orden de presentación ----------

function ordenarBloque(b, ids) {
  // dentro de miembro superior/inferior/axial, espaciar las tarjetas del mismo músculo
  if (['ms', 'mi', 'ax'].includes(b)) {
    const waves = { raiz: [], nervio: [], funcion: [], inv: [], other: [] };
    ids.forEach(id => { const t = id.split(':')[1]; (waves[t] || waves.other).push(id); });
    const out = [];
    const n = Math.max(...Object.values(waves).map(w => w.length));
    for (let i = 0; i < n + 14; i++) {
      if (waves.nervio[i]) out.push(waves.nervio[i]);
      if (waves.raiz[i - 2]) out.push(waves.raiz[i - 2]);
      if (waves.funcion[i - 4]) out.push(waves.funcion[i - 4]);
      if (waves.inv[i - 6]) out.push(waves.inv[i - 6]);
      if (waves.other[i - 12]) out.push(waves.other[i - 12]);
    }
    return uniq(out.concat(waves.inv, waves.other, ids));
  }
  // dermatomas: imagen y descripción del mismo nivel separadas
  if (b === 'derm') {
    const img = ids.filter(id => id.startsWith('dk_img')), desc = ids.filter(id => id.startsWith('dk_desc')), zones = ids.filter(id => id.startsWith('dz_'));
    const out = [];
    for (let i = 0; i < img.length + 14; i++) {
      if (img[i]) out.push(img[i]);
      if (i % 3 === 2 && zones[(i - 2) / 3]) out.push(zones[(i - 2) / 3]);
      if (desc[i - 12]) out.push(desc[i - 12]);
    }
    return uniq(out.concat(ids));
  }
  return ids;
}

// ---------- mapa segmentario ----------

const MAPA = {
  titulo: 'Mapa segmentario',
  render(st, sel, cls) {
    const rows = [
      ['Cervical', ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']],
      ['Torácico', ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']],
      ['Lumbar', ['L1', 'L2', 'L3', 'L4', 'L5']],
      ['Sacro', ['S1', 'S2', 'S3', 'S4-5']],
    ];
    return rows.map(([name, lv]) => `<div class="seg-row"><span class="seg-name">${name}</span><div class="seg-cells ${name === 'Torácico' ? 'dense' : ''}">
      ${lv.map(l => `<button class="seg ${cls(st[l])} ${sel === l ? 'sel' : ''}" data-seg="${l}" aria-label="${l}">${name === 'Torácico' ? l.slice(1) : l.replace('S4-5', 'S4')}</button>`).join('')}</div></div>`).join('');
  },
};

// ---------- consulta ----------

let cQ = '', cReg = 'all';

function tabMusculos() {
  const q = cQ.trim().toLowerCase();
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const list = MUSCLES.filter(m => (cReg === 'all' || m.r === cReg) &&
    (!q || norm(`${m.n} ${m.nerve} ${m.group} ${m.roots.join(' ')} ${m.minor.join(' ')} ${m.act}`).includes(norm(q))));
  return `<input class="search" id="cq" type="search" placeholder="Buscar músculo, nervio, raíz o función" value="${esc(cQ)}" autocomplete="off">
    <div class="filters">${[['all', 'Todos'], ['ms', 'Miembro superior'], ['mi', 'Miembro inferior'], ['ax', 'Axial']].map(([k, l]) =>
      `<button class="pill ${cReg === k ? 'on' : ''}" data-reg="${k}">${l}</button>`).join('')}</div>
    <p class="count-line">${list.length} ${list.length === 1 ? 'músculo' : 'músculos'}</p>
    <ul class="mlist">${list.map(m => `<li><details><summary><span class="mn">${esc(m.n)}</span>
      <span class="mr">${m.roots.length ? esc(fmtRoots(m.roots, m.minor)) : esc(m.nerve.match(/\(([^)]+)\)/)?.[1] || '')}</span></summary>
      ${muscleProfile(m)}<p class="mex">${esc(m.ex)}</p>${muscleImg(m.id)}</details></li>`).join('')}</ul>`;
}


function viewDrawings() {
  const handZones = (view, map) => {
    let svg = svgHand(view, {});
    for (const [zone, cls] of map) for (const reg of HAND_ZONES[zone]) svg = svg.replace(`<path d="${HAND_REGIONS[reg]}" class=""`, `<path d="${HAND_REGIONS[reg]}" class="${cls}"`);
    return svg;
  };
  const legZones = map => {
    let svg = svgLeg({});
    for (const [zone, cls] of map) for (const reg of LEG_ZONES[zone]) svg = svg.split(`<path d="${LEG_REGIONS[reg]}" class="hide"`).join(`<path d="${LEG_REGIONS[reg]}" class="${cls}"`).split(`<path d="${LEG_REGIONS[reg]}" class=""`).join(`<path d="${LEG_REGIONS[reg]}" class="${cls}"`);
    return svg;
  };
  return `
  <article class="draw"><h3>Puntos clave de dermatomas (ISNCSCI)</h3>
    <div class="fig-pair">${svgBody('front', { all: true })}${svgBody('back', { all: true })}</div>
    <p class="note">C6, C7, C8, L4, L5 y S1 se ven mejor en los dibujos de mano y pie. Puntos marcados en el lado derecho.</p></article>
  <article class="draw"><h3>Mano: puntos clave C6–C8</h3><div class="fig-wrap">${svgHand('dorsum', { all: true })}</div></article>
  <article class="draw"><h3>Mano: territorios de nervios</h3>
    <div class="fig-pair">${handZones('palm', [['median', 'z1'], ['ulnar', 'z2']])}${handZones('dorsum', [['radial', 'z3'], ['ulnardors', 'z2'], ['mediandors', 'z1']])}</div>
    ${legend([['z1', 'Mediano'], ['z2', 'Cubital'], ['z3', 'Radial superficial']])}</article>
  <article class="draw"><h3>Pierna y pie: dermatomas</h3><div class="fig-wrap">${legZones([['L4', 'z1'], ['L5', 'z2'], ['S1', 'z3']])}</div>
    ${legend([['z1', 'L4'], ['z2', 'L5'], ['z3', 'S1']])}</article>
  <article class="draw"><h3>Pierna y pie: territorios de nervios</h3><div class="fig-wrap">${legZones([['saphenous', 'z1'], ['supperoneal', 'z2'], ['deepperoneal', 'z4'], ['sural', 'z3']])}</div>
    ${legend([['z1', 'Safeno'], ['z2', 'Peroneo superficial'], ['z4', 'Peroneo profundo'], ['z3', 'Sural']])}</article>
  <article class="draw"><h3>Plexo braquial</h3><div class="fig-wrap wide">${svgBrachialPlexus()}</div>
    ${legend([['pl-lat-i', 'Fascículo lateral'], ['pl-post-i', 'Fascículo posterior'], ['pl-med-i', 'Fascículo medial']])}</article>
  <article class="draw"><h3>Plexo lumbosacro: raíces de cada nervio</h3><div class="fig-wrap wide">${svgLumbosacral()}</div></article>
  <article class="draw"><h3>Reflejos</h3><table class="ref">
    <tr><td>Bicipital</td><td>C5–C6</td></tr><tr><td>Estilorradial</td><td>C5–C6</td></tr><tr><td>Tricipital</td><td>C7</td></tr>
    <tr><td>Flexor de los dedos</td><td>C8</td></tr><tr><td>Abdominales</td><td>T8–T12</td></tr><tr><td>Cremastérico</td><td>L1–L2</td></tr>
    <tr><td>Aductor</td><td>L2–L4</td></tr><tr><td>Rotuliano</td><td>L3–L4</td></tr><tr><td>Isquiotibial medial</td><td>L5</td></tr>
    <tr><td>Aquíleo</td><td>S1</td></tr><tr><td>Anal</td><td>S2–S4</td></tr></table></article>
  <article class="draw"><h3>Exploración motora por raíz</h3><table class="ref">${RAICES.map(([r, mov, mus]) => `<tr><td>${r}</td><td>${mov}<br><span class="sub">${mus}</span></td></tr>`).join('')}</table></article>`;
}


// ============================================================
//  Interfaz con el motor
// ============================================================
const MI_TEMA = {
  bloques: BLOQUES,
  mapa: MAPA,
  ordenarBloque,
  figura: spec => renderFig(spec),
  async preparar({ cargarJSON }) {
    try { IMG = await cargarJSON('img/index.json'); } catch (e) { IMG = {}; }
  },
  construirTarjetas() { return buildCards(); },
  consulta: {
    pestanas: [
      { id: 'musculos', etiqueta: 'Músculos', render: tabMusculos },
      { id: 'dibujos', etiqueta: 'Dibujos', render: viewDrawings },
    ],
    bind(render) {
      document.querySelectorAll('[data-reg]').forEach(b => b.onclick = () => { cReg = b.dataset.reg; render(); });
      const cq = document.querySelector('#cq');
      if (cq) cq.oninput = () => {
        cQ = cq.value; const pos = cq.selectionStart; render();
        const n = document.querySelector('#cq'); n.focus(); n.setSelectionRange(pos, pos);
      };
    },
  },
};

iniciar(MI_TEMA);
