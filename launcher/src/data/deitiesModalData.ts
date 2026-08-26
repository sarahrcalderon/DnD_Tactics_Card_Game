
export const DEITY_FULL_DATA: Record<string, any> = {
  tyr: {
    description:
      'Tyr é o deus da justiça, lei, coragem e dever. Ele representa a aplicação justa da lei e protege os inocentes, exigindo que os culpados sejam responsabilizados por seus atos.',

    generalAdvantage: {
      name: 'Mão da Justiça',
      description:
        'Quando uma carta causa dano a um inimigo sob um Debuff, causa +1 de dano.',
    },

    enemyAdvantage: {
      name: 'Julgamento dos Ímpios',
      description:
        'Contra Demônios, Diabos, Mortos-Vivos malignos e criaturas corrompidas, ataques recebem +2 de dano.',
    },

    disadvantage: {
      name: 'Dever Inflexível',
      description:
        'Cartas baseadas em Roubo, Furtividade, Engano ou Aleatoriedade têm seus efeitos reduzidos em 1.',
    },

    strongAgainst: [
      'Demônios',
      'Diabos',
      'Mortos-Vivos malignos',
      'Corrompidos',
    ],
    weakAgainst: ['Enganadores', 'Ladrões', 'Assassinos'],
  },
  tempus: {
    description:
      'Tempus é o deus da guerra e da batalha. Ele representa a força, o conflito e o espírito guerreiro, favorecendo aqueles que enfrentam seus inimigos diretamente e respeitam a natureza da guerra.',

    generalAdvantage: {
      name: 'Fúria da Batalha',
      description:
        'Após causar dano a um inimigo, seu próximo Ataque recebe +1 de dano. O bônus é perdido se passar um turno sem atacar.',
    },

    enemyAdvantage: {
      name: 'Desafio do Guerreiro',
      description:
        'Contra Guerreiros, Campeões e criaturas especializadas em combate corpo a corpo, seus Ataques recebem +2 de dano.',
    },

    disadvantage: {
      name: 'A Guerra Não Espera',
      description:
        'Se passar um turno sem causar dano, perde todos os bônus de Ataque acumulados.',
    },

    strongAgainst: ['Guerreiros', 'Campeões', 'Berserkers', 'Combatentes'],
    weakAgainst: ['Assassinos', 'Ladrões', 'Criaturas furtivas'],
  },
  mystra: {
    description:
      'Mystra é a deusa da magia e da Trama, a força que permite aos mortais canalizar o poder mágico. Ela protege a magia e busca preservar seu uso responsável e sua continuidade.',

    generalAdvantage: {
      name: 'Domínio da Trama',
      description:
        'A primeira carta de Magia ou Habilidade lançada a cada turno custa 1 Mana a menos.',
    },

    enemyAdvantage: {
      name: 'Senhora da Magia',
      description:
        'Contra criaturas que utilizam Magia, efeitos mágicos causam +2 de dano.',
    },

    disadvantage: {
      name: 'Ruptura da Trama',
      description:
        'Se ficar sem Mana, a próxima carta de Magia ou Habilidade custa +1 Mana.',
    },

    strongAgainst: ['Magos', 'Conjuradores', 'Criaturas mágicas'],
    weakAgainst: [
      'Antimagia',
      'Criaturas resistentes à magia',
      'Dissipadores de magia',
    ],
  },
  moradin: {
    description:
      'Moradin é o deus anão da criação, forja, artesanato, proteção e comunidade. Ele representa o trabalho árduo, a resistência e a criação de coisas duradouras.',

    generalAdvantage: {
      name: 'Bênção da Forja',
      description:
        'Equipamentos utilizados recebem +1 Ataque ou +1 Defesa, conforme sua função.',
    },

    enemyAdvantage: {
      name: 'Martelo do Ferreiro',
      description:
        'Contra Constructos, Armaduras e criaturas fortemente protegidas, ataques físicos recebem +2 de dano.',
    },

    disadvantage: {
      name: 'Peso da Armadura',
      description:
        'Cartas de Furtividade e Esquiva têm seus efeitos reduzidos em 1.',
    },

    strongAgainst: ['Constructos', 'Armaduras', 'Defensores'],
    weakAgainst: ['Criaturas furtivas', 'Ladrões', 'Infiltradores'],
  },
  mask: {
    description:
      'Mask é o deus dos ladrões, sombras, furtividade, intriga e segredos. Ele favorece aqueles que obtêm aquilo que desejam sem serem percebidos.',

    generalAdvantage: {
      name: 'Mão das Sombras',
      description:
        'A primeira carta de Furtividade, Roubo ou Engano de cada turno custa 1 Mana a menos.',
    },

    enemyAdvantage: {
      name: 'Golpe Invisível',
      description:
        'Contra inimigos que não detectaram sua presença, Ataques surpresa causam +3 de dano.',
    },

    disadvantage: {
      name: 'Revelado',
      description:
        'Se for revelado por uma carta ou habilidade de Detecção, perde 1 ação no próximo turno.',
    },

    strongAgainst: ['Guardas', 'Sentinelas', 'Inimigos sem Detecção'],
    weakAgainst: [
      'Detectores',
      'Sentinelas mágicas',
      'Criaturas com percepção elevada',
    ],
  },
  silvanus: {
    description:
      'Silvanus é o deus da natureza selvagem. Ele protege o equilíbrio natural, as florestas e as criaturas que vivem nelas, opondo-se à destruição da natureza e à expansão excessiva da civilização.',

    generalAdvantage: {
      name: 'Força Selvagem',
      description:
        'Enquanto controlar uma criatura natural, suas criaturas recuperam 1 HP no início do seu turno.',
    },

    enemyAdvantage: {
      name: 'Natureza Contra o Artifício',
      description:
        'Contra Constructos, Máquinas e outras criaturas artificiais, criaturas naturais causam +2 de dano.',
    },

    disadvantage: {
      name: 'Chamado da Natureza',
      description:
        'Cartas que representam Construção, Equipamento artificial ou efeitos de controle da natureza têm seus efeitos reduzidos em 1.',
    },

    strongAgainst: ['Constructos', 'Máquinas', 'Criaturas artificiais'],
    weakAgainst: [
      'Civilizações',
      'Construtos',
      'Inimigos especializados em destruir a natureza',
    ],
  },

  bahamut: {
    description:
      'Bahamut é o deus da virtude, justiça, proteção e dragões. Ele é o protetor dos justos e o inimigo dos dragões malignos.',
    generalAdvantage: {
      name: 'Juramento de Virtude',
      description:
        'Ao cumprir uma condição de honra, recebe 1 Marca de Virtude. Com 3 Marcas, próxima carta de Ataque ou Defesa recebe +2.',
    },
    enemyAdvantage: {
      name: 'Caçador de Dragões',
      description: '+3 dano contra Dragões malignos e Demônios.',
    },
    disadvantage: {
      name: 'Código de Honra',
      description:
        'Não pode utilizar Ataque pelas costas, Roubo, Sacrifício de aliados ou certas cartas de Veneno.',
    },
    strongAgainst: ['Dragões malignos', 'Demônios'],
    weakAgainst: ['Deuses do Engano', 'Deuses da Furtividade'],
  },
  kelemvor: {
    description:
      'Kelemvor é o deus dos mortos e do julgamento das almas. Ele representa a ordem natural da vida e da morte e rejeita a criação de mortos-vivos que desafiem esse ciclo.',

    generalAdvantage: {
      name: 'Senhor dos Mortos',
      description:
        'Quando uma criatura morre, recebe 1 Alma. A cada 3 Almas, a próxima carta relacionada à Morte custa 1 Mana a menos.',
    },

    enemyAdvantage: {
      name: 'Fim dos Mortos-Vivos',
      description:
        'Contra Mortos-Vivos, criaturas ressuscitadas artificialmente e outras formas de não-vida, ataques recebem +2 de dano.',
    },

    disadvantage: {
      name: 'Ordem Natural',
      description:
        'Efeitos que impedem permanentemente uma criatura de morrer têm sua eficácia reduzida em 1.',
    },

    strongAgainst: [
      'Mortos-Vivos',
      'Necromantes',
      'Criaturas ressuscitadas artificialmente',
    ],
    weakAgainst: ['Criaturas vivas', 'Efeitos de Vida', 'Curandeiros'],
  },
  amaunator: {
  description:
    'Amaunator é o deus do sol, ordem, lei e autoridade. Ele representa a disciplina, a regularidade e o cumprimento rigoroso das leis e acordos.',

  generalAdvantage: {
    name: 'Luz do Meio-Dia',
    description:
      'No início do turno, se nenhum efeito de Furtividade estiver ativo, a primeira carta ofensiva recebe +1 de dano.',
  },

  enemyAdvantage: {
    name: 'Lei Implacável',
    description:
      'Contra Mortos-Vivos, criaturas corrompidas e inimigos que utilizam Furtividade ou Engano, ataques recebem +2 de dano.',
  },

  disadvantage: {
    name: 'Ordem Solar',
    description:
      'Cartas baseadas em Engano, Roubo ou Furtividade têm seus efeitos reduzidos em 1.',
  },

  strongAgainst: ['Mortos-Vivos', 'Corrompidos', 'Inimigos furtivos'],
  weakAgainst: ['Enganadores', 'Ladrões', 'Criaturas das sombras'],
},

chauntea: {
  description:
    'Chauntea é a deusa da agricultura, colheita, fertilidade e vida. Ela representa o crescimento, a abundância e a relação entre os mortais e a terra.',

  generalAdvantage: {
    name: 'Bênção da Colheita',
    description:
      'No início do seu turno, se controlar pelo menos uma criatura viva, recupera 1 recurso ou 1 HP de uma criatura aliada.',
  },

  enemyAdvantage: {
    name: 'Fertilidade da Terra',
    description:
      'Contra criaturas que corrompem ou destroem a natureza, suas criaturas vivas causam +2 de dano.',
  },

  disadvantage: {
    name: 'Ciclo da Vida',
    description:
      'Efeitos que sacrificam criaturas vivas ou impedem sua recuperação têm seus benefícios reduzidos em 1.',
  },

  strongAgainst: ['Criaturas artificiais', 'Corrompidos', 'Destruidores da natureza'],
  weakAgainst: ['Mortos-Vivos', 'Criaturas que destroem a natureza'],
},

corellon: {
  description:
    'Corellon é a divindade élfica da magia, arte, música, beleza e criatividade. Ele representa a liberdade, a expressão artística e a natureza mutável dos elfos.',

  generalAdvantage: {
    name: 'Graça Élfica',
    description:
      'A primeira carta de Magia, Arte ou Furtividade jogada a cada turno recebe -1 Mana.',
  },

  enemyAdvantage: {
    name: 'Lâmina e Magia',
    description:
      'Contra Orcs e criaturas que buscam destruir ou escravizar povos élficos, ataques recebem +2 de dano.',
  },

  disadvantage: {
    name: 'Espírito Livre',
    description:
      'Efeitos que obrigam uma criatura a permanecer em uma posição, seguir uma ordem ou agir de forma previsível têm seus efeitos reduzidos em 1.',
  },

  strongAgainst: ['Orcs', 'Invasores', 'Escravizadores'],
  weakAgainst: ['Tiranos', 'Controladores', 'Criaturas que anulam magia'],
},

gond: {
  description:
    'Gond é o deus da invenção, artesanato, engenharia e inovação. Ele favorece aqueles que criam novas ferramentas, mecanismos e tecnologias.',

  generalAdvantage: {
    name: 'Engenho de Gond',
    description:
      'A primeira carta de Equipamento ou Constructo utilizada a cada turno recebe -1 Mana ou +1 Defesa.',
  },

  enemyAdvantage: {
    name: 'Mestre dos Mecanismos',
    description:
      'Contra Constructos e criaturas fortemente equipadas, seus Equipamentos causam +2 de dano.',
  },

  disadvantage: {
    name: 'Fascínio pela Invenção',
    description:
      'Cartas de Equipamento não podem receber benefícios adicionais de Furtividade e têm seus efeitos reduzidos em 1 quando usadas para ações furtivas.',
  },

  strongAgainst: ['Constructos', 'Máquinas', 'Inimigos equipados'],
  weakAgainst: ['Natureza selvagem', 'Criaturas incorpóreas', 'Inimigos furtivos'],
},

helm: {
  description:
    'Helm é o deus da vigilância, proteção, guardiões e dever. Ele permanece atento mesmo diante de perigos, protegendo aqueles sob sua responsabilidade.',

  generalAdvantage: {
    name: 'Vigilância Eterna',
    description:
      'Enquanto não estiver sob um efeito de Atordoamento ou Incapacitação, recebe +1 Defesa.',
  },

  enemyAdvantage: {
    name: 'Olhos do Guardião',
    description:
      'Contra inimigos que utilizam Furtividade, Roubo ou Ataques surpresa, suas defesas recebem +2.',
  },

  disadvantage: {
    name: 'Dever do Guardião',
    description:
      'Se abandonar ou deixar um aliado desprotegido, perde seus bônus defensivos até o próximo turno.',
  },

  strongAgainst: ['Assassinos', 'Ladrões', 'Inimigos furtivos'],
  weakAgainst: ['Inimigos que ignoram Defesa', 'Ataques indiretos'],
},

ilmater: {
  description:
    'Ilmater é o deus do sofrimento, perseverança, compaixão e resistência. Ele ensina a suportar a dor e aliviar o sofrimento dos outros.',

  generalAdvantage: {
    name: 'Resistência do Mártir',
    description:
      'Quando perder HP, ganha 1 Marca de Sofrimento. Cada Marca concede +1 Defesa até o fim do combate.',
  },

  enemyAdvantage: {
    name: 'Alívio do Sofrimento',
    description:
      'Contra inimigos que causam efeitos de Sangramento, Dor ou Debuff, aliados recebem +2 Defesa contra esses efeitos.',
  },

  disadvantage: {
    name: 'Sacrifício Compassivo',
    description:
      'Ao recusar ajuda ou deixar um aliado incapacitado, perde 1 Marca de Sofrimento acumulada.',
  },

  strongAgainst: ['Torturadores', 'Inimigos que causam Debuffs', 'Criaturas cruéis'],
  weakAgainst: ['Inimigos de explosão de dano', 'Efeitos que ignoram Defesa'],
},

lathander: {
  description:
    'Lathander é o deus da alvorada, renovação, nascimento, juventude e esperança. Ele representa novos começos e a luz que surge depois da escuridão.',

  generalAdvantage: {
    name: 'Renascimento da Alvorada',
    description:
      'No início do combate, recupera 2 HP. Uma vez por combate, ao cair abaixo de 25% de HP, recupera 3 HP.',
  },

  enemyAdvantage: {
    name: 'Luz da Alvorada',
    description:
      'Contra Mortos-Vivos e criaturas associadas à escuridão, ataques de Luz causam +3 de dano.',
  },

  disadvantage: {
    name: 'Novo Amanhecer',
    description:
      'Efeitos que dependem de escuridão, furtividade ou emboscadas têm seus efeitos reduzidos em 1.',
  },

  strongAgainst: ['Mortos-Vivos', 'Criaturas das sombras', 'Corrompidos'],
  weakAgainst: ['Criaturas furtivas', 'Inimigos da luz'],
},

leira: {
  description:
    'Leira é a deusa da ilusão, névoa e engano. Ela está associada aos mistérios, às aparências falsas e à incerteza.',

  generalAdvantage: {
    name: 'Senhora das Ilusões',
    description:
      'A primeira carta de Ilusão ou Engano de cada turno custa 1 Mana a menos e não pode ser imediatamente anulada.',
  },

  enemyAdvantage: {
    name: 'Véu da Ilusão',
    description:
      'Contra inimigos sem Detecção mágica, ataques realizados sob Furtividade ou Ilusão recebem +3 de dano.',
  },

  disadvantage: {
    name: 'Verdade Revelada',
    description:
      'Se uma ilusão for detectada, perde 1 ação no próximo turno.',
  },

  strongAgainst: ['Inimigos sem Detecção', 'Guardas', 'Sentinelas'],
  weakAgainst: ['Detectores mágicos', 'Inimigos com alta percepção'],
},

lliira: {
  description:
    'Lliira é a deusa da alegria, dança, liberdade e celebração. Ela representa a felicidade, a expressão espontânea e a libertação do sofrimento.',

  generalAdvantage: {
    name: 'Alegria Contagiante',
    description:
      'Quando remover um Debuff de um aliado, esse aliado recebe +1 Ataque e +1 Defesa até o final do turno.',
  },

  enemyAdvantage: {
    name: 'Dança da Liberdade',
    description:
      'Contra inimigos que utilizam Medo, Encantamento ou efeitos de Controle, aliados recebem +2 Defesa.',
  },

  disadvantage: {
    name: 'Espírito Indomável',
    description:
      'Efeitos que exigem permanecer parado ou seguir ordens rígidas têm seus efeitos reduzidos em 1.',
  },

  strongAgainst: ['Controladores', 'Inimigos que causam Medo', 'Encantadores'],
  weakAgainst: ['Tiranos', 'Efeitos de Controle', 'Inimigos que restringem movimento'],
},

mielikki: {
  description:
    'Mielikki é a deusa das florestas, guardiões da natureza, criaturas selvagens e patrulheiros. Ela protege aqueles que vivem e viajam pelos ambientes selvagens.',

  generalAdvantage: {
    name: 'Passos da Floresta',
    description:
      'Criaturas naturais recebem +1 Defesa enquanto estiverem sob Furtividade ou em terreno natural.',
  },

  enemyAdvantage: {
    name: 'Caçadora da Floresta',
    description:
      'Contra criaturas que invadem ou destroem ambientes naturais, ataques recebem +2 de dano.',
  },

  disadvantage: {
    name: 'Chamado Selvagem',
    description:
      'Em ambientes artificiais ou fortemente urbanizados, seus bônus de Furtividade e Defesa são reduzidos em 1.',
  },

  strongAgainst: ['Invasores', 'Destruidores da natureza', 'Criaturas artificiais'],
  weakAgainst: ['Constructos', 'Inimigos urbanos', 'Criaturas que ignoram terreno'],
},

oghma: {
  description:
    'Oghma é o deus do conhecimento, inspiração, invenção e informação. Ele valoriza o conhecimento por si mesmo e a preservação e disseminação de ideias.',

  generalAdvantage: {
    name: 'Conhecimento é Poder',
    description:
      'Ao revelar uma fraqueza ou habilidade de um inimigo, a próxima carta utilizada contra ele recebe +2 de efeito.',
  },

  enemyAdvantage: {
    name: 'Conhecimento Proibido',
    description:
      'Contra inimigos que dependem de uma habilidade especial identificável, seus ataques recebem +2 de dano após essa habilidade ser revelada.',
  },

  disadvantage: {
    name: 'Fome de Conhecimento',
    description:
      'Efeitos que impedem a obtenção, revelação ou compartilhamento de informações têm seus efeitos reduzidos em 1.',
  },

  strongAgainst: ['Inimigos previsíveis', 'Conjuradores', 'Criaturas com habilidades identificáveis'],
  weakAgainst: ['Criaturas imprevisíveis', 'Enganadores', 'Ilusões'],
},

savras: {
  description:
    'Savras é o deus da adivinhação, destino, profecia e visão. Ele representa a capacidade de perceber aquilo que está oculto e compreender acontecimentos futuros.',

  generalAdvantage: {
    name: 'Visão do Destino',
    description:
      'Uma vez por turno, pode olhar a próxima carta do seu baralho e decidir mantê-la ou colocá-la no fundo.',
  },

  enemyAdvantage: {
    name: 'Olhar Onisciente',
    description:
      'Contra inimigos que utilizam Furtividade, Ilusão ou Engano, ataques recebem +2 de dano.',
  },

  disadvantage: {
    name: 'Fardo da Visão',
    description:
      'Efeitos baseados em Aleatoriedade têm seus bônus reduzidos em 1.',
  },

  strongAgainst: ['Inimigos furtivos', 'Ilusionistas', 'Enganadores'],
  weakAgainst: ['Caos', 'Aleatoriedade', 'Criaturas imprevisíveis'],
},

selune: {
  description:
    'Selûne é a deusa da lua, estrelas, navegação, viajantes e luz na escuridão. Ela é uma inimiga ancestral de Shar e representa esperança, liberdade e orientação.',

  generalAdvantage: {
    name: 'Luz da Lua',
    description:
      'Durante efeitos de Escuridão, suas cartas de Luz causam +1 de dano e seus aliados recebem +1 Defesa.',
  },

  enemyAdvantage: {
    name: 'Luz Contra as Trevas',
    description:
      'Contra Mortos-Vivos, criaturas das sombras e servos de forças de escuridão, ataques de Luz causam +2 de dano.',
  },

  disadvantage: {
    name: 'Caminho da Lua',
    description:
      'Enquanto estiver em ambientes completamente iluminados por luz intensa, seus efeitos de Furtividade têm eficácia reduzida em 1.',
  },

  strongAgainst: ['Mortos-Vivos', 'Criaturas das sombras', 'Servos da escuridão'],
  weakAgainst: ['Inimigos de Luz intensa', 'Detectores', 'Criaturas que anulam magia'],
},

tymora: {
  description:
    'Tymora é a deusa da boa sorte, aventura e acaso favorável. Ela favorece aqueles que assumem riscos e confiam na própria sorte.',

  generalAdvantage: {
    name: 'Sorriso da Fortuna',
    description:
      'Uma vez por turno, após falhar em uma ação, pode repetir a tentativa. O segundo resultado deve ser aceito.',
  },

  enemyAdvantage: {
    name: 'Fortuna dos Audazes',
    description:
      'Contra inimigos de nível ou poder superior, seus Ataques recebem +2 de dano quando realizados após uma falha.',
  },

  disadvantage: {
    name: 'A Sorte Muda',
    description:
      'Não pode acumular mais de um bônus proveniente de efeitos de Aleatoriedade ao mesmo tempo.',
  },

  strongAgainst: ['Inimigos mais poderosos', 'Desafios de alto risco'],
  weakAgainst: ['Inimigos previsíveis', 'Efeitos que anulam Aleatoriedade'],
},

sune: {
  description:
    'Sune é a deusa do amor, beleza, paixão e desejo. Ela representa a beleza física e espiritual, o romance e a apreciação das coisas belas.',

  generalAdvantage: {
    name: 'Beleza de Sune',
    description:
      'Contra um inimigo que possa ser afetado por Encantamento, a primeira carta de Controle ou Encantamento de cada turno custa 1 Mana a menos.',
  },

  enemyAdvantage: {
    name: 'Fascínio Irresistível',
    description:
      'Contra Humanóides e criaturas suscetíveis a Encantamento, efeitos de Encantamento têm +2 de eficácia.',
  },

  disadvantage: {
    name: 'Coração Apaixonado',
    description:
      'Contra criaturas sem mente ou imunes a Encantamento, seus efeitos de Controle têm eficácia reduzida em 1.',
  },

  strongAgainst: ['Humanóides', 'Criaturas suscetíveis a Encantamento', 'Inimigos conscientes'],
  weakAgainst: ['Constructos', 'Mortos-Vivos', 'Criaturas imunes a Encantamento'],
},
};