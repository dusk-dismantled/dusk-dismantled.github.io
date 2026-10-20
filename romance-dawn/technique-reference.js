const TECHNIQUE_HELP = {
  "Adicionar Cr\xEDtico": "Adiciona uma Margem de Acerto Cr\xEDtico na T\xE9cnica ou a aumenta a margem.\nCusto: 1 para que, ao tirar 20 na Jogada do dado de Ataque cause o dobro de Dados de Dano. +2 para aumentar a marge para 18-20.",
  "Adicionar Tipo de Dano": "Acrescente um tipo de Dano aos seus ataques, exceto Verdadeiro. O tipo deve ser escolhido durante a cria\xE7\xE3o da T\xE9cnica.\nCusto: 2 Pontos para qualquer tipo de Dano permitido, exceto Laser, que custa 6 Pontos.\nDura\xE7\xE3o Especial: Acrescente 3 Pontos ao custo para que o efeito dure 1 minuto.",
  "Aplicar Condi\xE7\xE3o": "Aplica uma Condi\xE7\xE3o da lista ao obter 15+ na Jogada de Ataque, desde que ela fa\xE7a sentido com a l\xF3gica da T\xE9cnica.\nCusto: De acordo com a Condi\xE7\xE3o escolhida.",
  "Ataque Sorrateiro": "Ignora uma quantidade de Dados da mec\xE2nica Aparar, definida na cria\xE7\xE3o da T\xE9cnica.\nCusto: 1 para cada 2 Dados de Aparar.",
  "Aumentar Dano": "Adiciona +1 Dado de Dano, at\xE9 o Dano M\xE1ximo do Rank da T\xE9cnica.\nCusto: 1 por Dado de Dano.",
  "Combo": "Realiza um Ataque adicional como parte da T\xE9cnica. Outros Ataques podem ser inclu\xEDdos al\xE9m do primeiro, mas cada um custar\xE1 1 PA.\nCusto: 2 + 1 para cada Ataque adicional al\xE9m do primeiro.",
  "Criar Arma": "Cria uma arma qualquer \xE0 sua escolha que causa 1d8 de dano, podendo gastar mais pontos para aumentar esse valor. \xC9 necess\xE1rio manter a Concentra\xE7\xE3o para manter a arma ativa, que dura at\xE9 1 minuto.\nCusto: 2 + 1 para aumentar em +1d8 o Dano, at\xE9 4d8.",
  "Dano Cont\xEDnuo": "Caso o ataque acerte o oponente, ele passa a receber uma quantidade de dano por turno, podendo encerrar esse efeito ao vencer uma Jogada definida pela T\xE9cnica, que pode ser repetida no in\xEDcio de cada um de seus turnos, antes de sofrer o dano.\nCusto: 6 + 1 para cada Dado de Dano.",
  "Destrutivo": "Ignora a Redu\xE7\xE3o de Dano de Constru\xE7\xF5es.\nCusto: 1.",
  "For\xE7ar Movimento": "Ao acertar o ataque, fa\xE7a o alvo se mover em uma dire\xE7\xE3o \xE0 sua escolha (desde que fa\xE7a sentido narrativo). Caso ele colida com um objeto de seu tamanho ou maior durante esse deslocamento, recebe 2d8 de dano.\nCusto: 1 para cada 3 metros de Deslocamento.",
  "Mira Teleguiada": "Mesmo que obtenha sucesso em uma A\xE7\xE3o de Esquiva, o alvo ainda recebe metade do dano total do ataque.\nCusto: 2 \xD7 Rank da T\xE9cnica.",
  "Quebrar Imunidade": "O dano da T\xE9cnica ignora a redu\xE7\xE3o concedida por Resist\xEAncia a um tipo de Dano e causa metade do dano que normalmente causaria a alvos imunes a esse tipo. Escolha o tipo de Dano durante a cria\xE7\xE3o da T\xE9cnica.\nCusto: 4 Pontos.\nDura\xE7\xE3o Especial: Acrescente 6 Pontos ao custo para que o efeito dure 1 minuto.",
  "Aplicar Vantagem/Desvantagem": "Aplica uma Vantagem ou Desvantagem na pr\xF3xima Jogada do alvo (podendo definir um tipo espec\xEDfico de Jogada, como Ataque, Esquiva ou uma Jogada que utilize o Atributo For\xE7a, por exemplo). Independentemente disso, o efeito dura apenas at\xE9 o final da rodada.\nCusto: 1 + 1 para cada outra Vantagem/Desvantagem que a T\xE9cnica j\xE1 aplica.\nDura\xE7\xE3o Especial: +4 de Custo para que a T\xE9cnica dure por 1 minuto, afetando a primeira Jogada de cada turno do alvo.",
  "Ataque em \xC1rea": "Transforma um ataque de alvo \xFAnico em um ataque que acerta uma \xE1rea completa. O Dado de Dano total da T\xE9cnica deve ser reduzido em 2 passos. Caso a \xE1rea seja em Cone, o alcance \xE9 reduzido \xE0 metade; caso seja em C\xEDrculo, para 1/4.\nCusto: 3.",
  "Aumentar Alcance": "Amplia o alcance da T\xE9cnica.\nCusto: 1 para cada 6 metros.",
  "Controle Cir\xFArgico": "Ignora uma quantidade de alvos dentro de um Ataque em \xC1rea, definida na cria\xE7\xE3o da T\xE9cnica.\nCusto: 1 para cada 3 alvos ignorados.",
  "Potencializar Aplica\xE7\xE3o": "Reduza em 2 o resultado m\xEDnimo necess\xE1rio no d20 para aplicar uma Condi\xE7\xE3o, at\xE9 o m\xEDnimo de 5.\nCusto: 4 Pontos na primeira aplica\xE7\xE3o deste Modificador. Cada aplica\xE7\xE3o adicional custa 2 Pontos a mais que a anterior.",
  "Quebrar Postura": "Caso a T\xE9cnica seja Aparada, o defensor n\xE3o poder\xE1 realizar o contra-ataque concedido por Aparar, mesmo que reduza o dano recebido a 0.\nCusto: 1 Ponto.",
  "T\xE9cnica Acelerada": "Reduz em 1 PA o custo de execu\xE7\xE3o da T\xE9cnica.\nCusto: 1 + Rank da T\xE9cnica.",
  "Acelerar Recupera\xE7\xE3o": "Aumenta em 1 passo um Dado de Recupera\xE7\xE3o de um alvo at\xE9 o final da rodada.\nCusto: 2 + 1 para cada passo que j\xE1 tenha sido aumentado por esse efeito na mesma T\xE9cnica.\nDura\xE7\xE3o Especial: +6 de Custo para que o efeito da T\xE9cnica dure por 1 minuto.",
  "Adicionar Deslocamento": "Aumenta, por uma rodada, o Deslocamento do alvo.\nCusto: 1 para cada 3 metros de Deslocamento ou Nado. Alternativamente, pode pagar +2 para transformar o Deslocamento atual do personagem em Voo.\nDura\xE7\xE3o Especial: +3 de Custo para que a T\xE9cnica dure por 1 minuto.",
  "Adquirir Imunidade": "Receba Imunidade a um tipo de Dano at\xE9 o final do seu pr\xF3ximo turno. O tipo de Dano deve ser escolhido durante a cria\xE7\xE3o da T\xE9cnica.\nCusto: 4 Pontos.\nDura\xE7\xE3o Especial: Acrescente 6 Pontos ao custo para que a Imunidade dure 1 minuto.",
  "Adquirir Resist\xEAncia": "Receba Resist\xEAncia a um tipo de Dano at\xE9 o final do seu pr\xF3ximo turno. O tipo de Dano deve ser escolhido durante a cria\xE7\xE3o da T\xE9cnica.\nCusto: 2 Pontos.\nDura\xE7\xE3o Especial: Acrescente 4 Pontos ao custo para que a Resist\xEAncia dure 1 minuto.",
  "Aplicar Cura": "Aplica uma quantidade de Dados de Cura (1d4) em um alvo ao alcance corpo a corpo do personagem.\nCusto: 1 para cada Dado de Cura.",
  "Conten\xE7\xE3o de Dano": "Todos os personagens ao alcance corpo a corpo do personagem recebem d6s que podem utilizar para reduzir o dano recebido at\xE9 o final do seu pr\xF3ximo turno.\nCusto: 1 para cada 1d6 de redu\xE7\xE3o.",
  "Dissipar Condi\xE7\xE3o": "Dissipe uma Condi\xE7\xE3o definida durante a cria\xE7\xE3o da T\xE9cnica.\nCusto: Custo da Condi\xE7\xE3o + 2 Pontos.",
  "Mitigar Dano": "Concede uma quantidade de d8s que o alvo pode utilizar para reduzir o dano recebido at\xE9 o final do seu pr\xF3ximo turno.\nCusto: 1 para cada 2d8 de redu\xE7\xE3o.",
  "Reduzir Movimento": "Reduz o Deslocamento do alvo at\xE9 o in\xEDcio do seu pr\xF3ximo turno.\nCusto: 1 para cada 3 metros.",
  "Carregar Poder": "O requisito de PA da T\xE9cnica aumenta em 1.\nRedutor: 3.",
  "Concentra\xE7\xE3o Crucial": "O personagem deve manter Concentra\xE7\xE3o na T\xE9cnica. S\xF3 \xE9 poss\xEDvel manter uma Concentra\xE7\xE3o por vez e, ao receber um valor de dano superior a 10% da sua Sa\xFAde em um turno, sua Concentra\xE7\xE3o \xE9 quebrada.\nRedutor: 2.",
  "Efeito Colateral": "Recebe o mesmo dano ou efeito negativo que a T\xE9cnica aplica em seu alvo.\nRedutor: Igual ao custo que o efeito teria na T\xE9cnica.",
  "Limitar Tipo de Dano": "Escolha um ataque que originalmente possa causar mais de um tipo de Dano e restrinja-o a apenas um desses tipos.\nRedutor: Reduza o custo em 2 Pontos pelo primeiro tipo de Dano exclu\xEDdo e em mais 1 Ponto por cada tipo adicional exclu\xEDdo.",
  "Queimar Recurso": "Consuma um recurso espec\xEDfico que o personagem possua. Pontos de Atributo n\xE3o podem ser utilizados para este Redutor.\nRedutor: Divida a capacidade m\xE1xima do recurso escolhido por 12 e arredonde o resultado para baixo. O valor obtido corresponde \xE0 redu\xE7\xE3o de custo concedida pelo consumo de uma unidade desse recurso.",
  "Reduzir \xC1rea": "Diminui o alcance total da T\xE9cnica.\nRedutor: 1 para cada 3 metros.",
  "Sacrif\xEDcio de Sangue": "Consuma sua pr\xF3pria vitalidade para sustentar o efeito da T\xE9cnica.\nRedutor: Reduza o custo em 2 Pontos para cada 1% de sua Sa\xFAde total perdido.",
  "T\xE9cnica Dependente": "Para utilizar esta T\xE9cnica, outra T\xE9cnica deve estar ativa.\nRedutor: Igual \xE0 metade do custo da T\xE9cnica requisito, at\xE9 o limite do Rank da T\xE9cnica.",
  "T\xE9cnica Desgastante": "Recebe um n\xEDvel de Exaust\xE3o, Estressado ou Exaurido, \xE0 sua escolha.\nRedutor: 2.",
  "T\xE9cnica Devoradora": "A execu\xE7\xE3o da T\xE9cnica extrai todo o Haki do personagem para ser realizada. Ap\xF3s utiliz\xE1-la, o personagem fica por 1 minuto sem poder usar Haki nem T\xE9cnicas que o utilizem como Fonte de Poder.\nRedutor: 6.",
  "T\xE9cnica N\xE3o-Ofensiva": "A T\xE9cnica n\xE3o pode causar dano nem aplicar qualquer Condi\xE7\xE3o.\nRedutor: Igual ao Rank da T\xE9cnica.",
  "Ofensivos": "",
  "Controle": "",
  "Suporte": "",
  "Redutores": "",
  "Converter Deslocamento em Voo": "Aumenta, por uma rodada, o Deslocamento do alvo.\nCusto: 1 para cada 3 metros de Deslocamento ou Nado. Alternativamente, pode pagar +2 para transformar o Deslocamento atual do personagem em Voo.\nDura\xE7\xE3o Especial: +3 de Custo para que a T\xE9cnica dure por 1 minuto."
};
const TECHNIQUE_CONDITIONS = {
  "Asfixiado": {
    "cost": 12,
    "max": 1,
    "text": "O personagem perde o acesso ao ar ou tem sua respira\xE7\xE3o severamente prejudicada. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Sofre Dano Verdadeiro igual a 1% de sua Sa\xFAde total por PA gasto, com um m\xEDnimo de 1% por rodada.\n\u2014 N\xE3o pode recuperar Pontos de Estamina.\n\u2014 A Condi\xE7\xE3o \xE9 dissipada assim que o personagem volta a respirar normalmente."
  },
  "Desidratado": {
    "cost": 6,
    "max": 1,
    "text": "O personagem sofre uma perda extrema de \xE1gua corporal, ficando pr\xF3ximo do colapso. Os seguintes efeitos s\xE3o aplicados:\n\u2014 N\xE3o pode utilizar a A\xE7\xE3o Recuperar para recuperar Pontos de Destreza, Agilidade, Constitui\xE7\xE3o, Estamina ou Reflexos.\n\u2014 Ao entrar em contato com uma fonte de \xE1gua pot\xE1vel, pode gastar 1 PA para dissipar a Condi\xE7\xE3o."
  },
  "Desorientado": {
    "cost": 2,
    "max": 1,
    "text": "Algo confunde os sentidos do personagem ou dificulta sua percep\xE7\xE3o do ambiente. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Todas as Jogadas realizadas como parte de Rea\xE7\xF5es recebem uma Desvantagem.\n\u2014 Os custos em Pontos de Instintos e Reflexos s\xE3o dobrados."
  },
  "Hipotermia": {
    "cost": 2,
    "max": 4,
    "text": "O personagem \xE9 exposto a uma fonte de frio extremo e perde rapidamente seu calor corporal. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Perde 1 PA por aplica\xE7\xE3o da Condi\xE7\xE3o.\n\u2014 Ao se afastar da fonte de frio, dissipa uma aplica\xE7\xE3o por rodada.\n\u2014 Caso se aproxime de uma fonte de calor, passa a dissipar duas aplica\xE7\xF5es por rodada."
  },
  "Oculto": {
    "cost": 4,
    "max": 1,
    "text": "O personagem se camufla perfeitamente. O seguinte efeito \xE9 aplicado:\n\u2014 Todos os demais personagens s\xE3o considerados Desprevenidos exclusivamente em rela\xE7\xE3o ao personagem Oculto."
  },
  "Restrito": {
    "cost": 1,
    "max": 1,
    "text": "Algo impede que o personagem se desloque livremente. O seguinte efeito \xE9 aplicado:\n\u2014 N\xE3o pode utilizar a A\xE7\xE3o Deslocar."
  },
  "B\xEAbado": {
    "cost": 2,
    "max": 1,
    "text": "O personagem ingeriu bebida alco\xF3lica em excesso. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Sua primeira Jogada em cada turno recebe uma Desvantagem.\n\u2014 Ap\xF3s realizar uma A\xE7\xE3o Deslocar, deve realizar uma Jogada de Agilidade + Reflexos contra Dificuldade 10. Em caso de falha, recebe a Condi\xE7\xE3o Ca\xEDdo.\n\u2014 Os custos em Pontos de Agilidade e Reflexos s\xE3o dobrados."
  },
  "Envenenado": {
    "cost": 4,
    "max": 5,
    "text": "Uma subst\xE2ncia t\xF3xica circula pelo organismo do personagem. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Ao final de cada um de seus turnos, escolha entre reduzir em um passo seu Dado de Recupera\xE7\xE3o de Constitui\xE7\xE3o ou Estamina, ou sofrer Dano Verdadeiro igual a 1% de sua Sa\xFAde total. Para cada aplica\xE7\xE3o adicional da Condi\xE7\xE3o, aumente a redu\xE7\xE3o em um passo ou o dano em 1 ponto percentual.\n\u2014 A Condi\xE7\xE3o pode ser dissipada com um ant\xEDdoto ou com tratamento m\xE9dico apropriado fora de combate."
  },
  "Fraturado": {
    "cost": 2,
    "max": 1,
    "text": "Um impacto forte deslocou ou quebrou um osso do personagem. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Jogadas de mec\xE2nicas que utilizem o membro afetado recebem uma Desvantagem.\n\u2014 O membro n\xE3o pode ser utilizado para realizar Jogadas de Ataque nem para segurar objetos.\n\u2014 Caso o membro seja necess\xE1rio para uma modalidade de Deslocamento, a dist\xE2ncia dessa modalidade \xE9 reduzida pela metade.\n\u2014 Um personagem treinado na Per\xEDcia Medicina pode gastar 2 PA e realizar uma Jogada de Destreza + Sagacidade (Medicina) contra Dificuldade 20 para recolocar o osso no lugar."
  },
  "Hemorragia": {
    "cost": 2,
    "max": 5,
    "text": "O personagem sofre um ferimento que provoca uma grande perda de sangue. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Ao final de cada um de seus turnos, escolha entre reduzir seu Dado de Recupera\xE7\xE3o de Constitui\xE7\xE3o em um passo ou sofrer Dano Verdadeiro igual a 1% de sua Sa\xFAde total. Para cada aplica\xE7\xE3o adicional da Condi\xE7\xE3o, aumente a redu\xE7\xE3o em um passo ou o dano em 1 ponto percentual.\n\u2014 O personagem pode limitar seu gasto a 2 PA na rodada para conter o sangramento e evitar o efeito descrito acima.\n\u2014 Outro personagem treinado na Per\xEDcia Medicina pode gastar 4 PA e realizar uma Jogada de Destreza + Sagacidade (Medicina) contra Dificuldade 20 para estabilizar o sangramento. Em caso de sucesso, o personagem afetado poder\xE1 gastar at\xE9 3 PA por rodada sem reabrir os ferimentos e voltar a sangrar devido ao esfor\xE7o.\n\u2014 A Condi\xE7\xE3o permanece at\xE9 que o personagem receba tratamento m\xE9dico fora de combate."
  },
  "Let\xE1rgico": {
    "cost": 6,
    "max": 1,
    "text": "O personagem sofre uma lentid\xE3o profunda que o impede de explorar todo o seu potencial. Os seguintes efeitos s\xE3o aplicados:\n\u2014 N\xE3o pode utilizar T\xE9cnicas.\n\u2014 N\xE3o pode manter mec\xE2nicas que exijam Concentra\xE7\xE3o.\n\u2014 Os custos em Pontos de For\xE7a, Destreza e Agilidade s\xE3o dobrados."
  },
  "Paralisado": {
    "cost": 2,
    "max": 1,
    "text": "Os movimentos do personagem s\xE3o severamente comprometidos. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Recebe apenas metade de seus PA padr\xE3o.\n\u2014 N\xE3o pode utilizar a A\xE7\xE3o Deslocar durante seu turno."
  },
  "Queimado": {
    "cost": 2,
    "max": 1,
    "text": "Queimaduras graves marcam a pele do personagem e dificultam suas a\xE7\xF5es. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Recebe uma Desvantagem em Jogadas de Ataque.\n\u2014 N\xE3o pode manter mec\xE2nicas que exijam Concentra\xE7\xE3o.\n\u2014 A Condi\xE7\xE3o s\xF3 pode ser dissipada ap\xF3s tratamento m\xE9dico fora de combate."
  },
  "Adrenalina": {
    "cost": 2,
    "max": 1,
    "text": "O personagem entra em um estado de euforia intensa. O seguinte efeito \xE9 aplicado:\n\u2014 Ao final de cada um de seus turnos, recebe 1 PA adicional e uma aplica\xE7\xE3o de Exaust\xE3o."
  },
  "Atordoado": {
    "cost": 2,
    "max": 1,
    "text": "Um choque deixa o personagem confuso e prejudica seu racioc\xEDnio. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Sua primeira Jogada em cada rodada recebe uma Desvantagem.\n\u2014 Os custos em Pontos de Instintos e Sagacidade s\xE3o dobrados."
  },
  "Catat\xF4nico": {
    "cost": null,
    "max": 1,
    "text": "Um trauma extremo deixa o personagem quase incapaz de reagir. O seguinte efeito \xE9 aplicado:\n\u2014 S\xF3 pode gastar PA na A\xE7\xE3o Esquivar, cuja Jogada recebe duas Desvantagens."
  },
  "Enfeiti\xE7ado": {
    "cost": 5,
    "max": 1,
    "text": "Algo prende a aten\xE7\xE3o do personagem ou o induz a um estado de distra\xE7\xE3o extrema. Os seguintes efeitos s\xE3o aplicados:\n\u2014 N\xE3o pode realizar Rea\xE7\xF5es at\xE9 ter recebido pelo menos 1 ponto de dano.\n\u2014 Todas as suas A\xE7\xF5es custam 1 PA adicional.\n\u2014 N\xE3o pode manter Concentra\xE7\xE3o."
  },
  "Hiperfoco": {
    "cost": 2,
    "max": 1,
    "text": "O personagem entra em um estado mental de extrema concentra\xE7\xE3o. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Caso j\xE1 esteja mantendo Concentra\xE7\xE3o, n\xE3o poder\xE1 perd\xEA-la em raz\xE3o de dano ou de outra Condi\xE7\xE3o.\n\u2014 Recupera automaticamente Pontos de Sagacidade, Instintos e Reflexos uma vez por rodada, ao final do pr\xF3prio turno.\n\u2014 Tamb\xE9m recebe uma aplica\xE7\xE3o de Estressado ao final de cada um de seus turnos. Hiperfoco termina quando qualquer um de seus Dados de Recupera\xE7\xE3o seria reduzido abaixo de d4."
  },
  "Irracional": {
    "cost": 3,
    "max": 1,
    "text": "O personagem perde a capacidade de raciocinar com clareza e passa a agir de maneira descontrolada. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Role 1d20 sem modificadores no inicio do seu turno. Com um resultado par, voc\xEA escolhe o alvo de seus ataques no turno. Com um resultado \xEDmpar, o narrador escolhe o alvo, considerando quem est\xE1 mais pr\xF3ximo e quem chama mais a aten\xE7\xE3o do personagem, sendo obrigado a Atacar ou usar a A\xE7\xE3o de Deslocamento para se aproximar de um alvo caso n\xE3o tenha nenhum em seu alcance.\n\u2014 N\xE3o pode utilizar mec\xE2nicas de redu\xE7\xE3o de dano que n\xE3o sejam passivas."
  },
  "Medo": {
    "cost": 2,
    "max": 1,
    "text": "O personagem \xE9 tomado pelo medo. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Ao final de cada um de seus turnos, realize uma Jogada de Presen\xE7a + Ambi\xE7\xE3o contra Dificuldade 15. Em caso de falha, o personagem receber\xE1 apenas metade de seus PA padr\xE3o no in\xEDcio do pr\xF3ximo turno."
  },
  "Quebrado": {
    "cost": null,
    "max": 1,
    "text": "A vontade do personagem \xE9 abalada, e suas ambi\xE7\xF5es desmoronam diante de uma verdade devastadora ou de uma for\xE7a absoluta. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Seu valor de Ambi\xE7\xE3o \xE9 reduzido a 0 e n\xE3o pode ser recuperado enquanto a Condi\xE7\xE3o estiver ativa.\n\u2014 N\xE3o pode utilizar nenhuma mec\xE2nica de Haki."
  },
  "Sangue Frio": {
    "cost": 2,
    "max": 1,
    "text": "A mente do personagem assume uma postura anal\xEDtica, afastando a interfer\xEAncia emocional. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Ignora a rolagem de 1d20 exigida pela Condi\xE7\xE3o Irracional para determinar quem escolhe o alvo dos ataques.\n\u2014 Recebe uma Vantagem nas Jogadas para resistir \xE0 aplica\xE7\xE3o de Condi\xE7\xF5es Mentais."
  },
  "Sonolento": {
    "cost": 2,
    "max": 1,
    "text": "O personagem se encontra em um estado de sonol\xEAncia profunda. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Os custos em Pontos de Reflexos e Instintos s\xE3o dobrados.\n\u2014 Caso n\xE3o receba dano durante a rodada, no come\xE7o do seu turno deve gastar 1 PA para se manter desperto ou realizar uma Jogada de Instintos + Ambi\xE7\xE3o (Prontid\xE3o) contra Dificuldade 15. Em caso de falha, recebe tamb\xE9m a Condi\xE7\xE3o Let\xE1rgico. Caso j\xE1 esteja Let\xE1rgico, uma nova falha nessa Jogada aplica a Condi\xE7\xE3o Inconsciente."
  },
  "Super Relaxado": {
    "cost": 8,
    "max": 1,
    "text": "O personagem atinge um estado de paz e relaxamento que favorece a recupera\xE7\xE3o do corpo, da mente e do esp\xEDrito. O seguinte efeito \xE9 aplicado:\n\u2014 Sempre que utilizar um Dado de Recupera\xE7\xE3o, obt\xE9m automaticamente seu valor m\xE1ximo, sem precisar rol\xE1-lo."
  },
  "Agarrado": {
    "cost": 1,
    "max": 1,
    "text": "O personagem est\xE1 preso por um agarr\xE3o, como o provocado pela Manobra Agarrar. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Para cada metro que tentar se deslocar, deve gastar 1 Ponto de For\xE7a. Quem o mant\xE9m agarrado pode gastar 1 Ponto de For\xE7a para impedir esse metro de deslocamento.\n\u2014 Todas as suas A\xE7\xF5es custam 1 PA adicional e precisam ser compat\xEDveis com os movimentos que o agarr\xE3o ainda permite realizar."
  },
  "Ca\xEDdo": {
    "cost": 1,
    "max": 1,
    "text": "O personagem est\xE1 ca\xEDdo no ch\xE3o, como ap\xF3s sofrer a Manobra Derrubar. Os seguintes efeitos s\xE3o aplicados:\n\u2014 N\xE3o pode utilizar a A\xE7\xE3o Deslocar.\n\u2014 Ataques corpo a corpo contra ele recebem uma Vantagem.\n\u2014 Disparos realizados contra ele a mais de 3 metros de dist\xE2ncia recebem uma Desvantagem.\n\u2014 Pode gastar 1 PA para se levantar e dissipar a Condi\xE7\xE3o."
  },
  "Desprevenido": {
    "cost": 1,
    "max": 1,
    "text": "O personagem foi pego despreparado. O seguinte efeito \xE9 aplicado:\n\u2014 N\xE3o pode realizar Rea\xE7\xF5es nem responder \xE0s A\xE7\xF5es que o afetem com mec\xE2nicas que exijam ativa\xE7\xE3o."
  },
  "Enfraquecido": {
    "cost": 4,
    "max": 1,
    "text": "O personagem sente suas for\xE7as se esva\xEDrem. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Todos os seus Dados de Dano s\xE3o reduzidos em dois passos.\n\u2014 Os gastos em Pontos de For\xE7a e Poder s\xE3o dobrados para produzir os mesmos efeitos."
  },
  "Estressado": {
    "cost": null,
    "max": 5,
    "text": "Um cansa\xE7o mental extremo compromete a concentra\xE7\xE3o e a capacidade de resposta do personagem. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Os Dados de Recupera\xE7\xE3o de Estamina, Sagacidade, Reflexos e Instintos s\xE3o reduzidos em um passo por aplica\xE7\xE3o, at\xE9 o m\xEDnimo de d4.\n\u2014 Ao acumular cinco aplica\xE7\xF5es, o personagem perde a capacidade de recuperar esses Atributos at\xE9 dissipar a Condi\xE7\xE3o."
  },
  "Exaurido": {
    "cost": null,
    "max": 5,
    "text": "A for\xE7a espiritual e a ambi\xE7\xE3o do personagem parecem se extinguir diante das dificuldades. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Os Dados de Recupera\xE7\xE3o de Presen\xE7a, Ambi\xE7\xE3o e Poder s\xE3o reduzidos em um passo por aplica\xE7\xE3o, at\xE9 o m\xEDnimo de d4.\n\u2014 Ao acumular cinco aplica\xE7\xF5es, o personagem perde a capacidade de recuperar esses Atributos at\xE9 dissipar a Condi\xE7\xE3o."
  },
  "Exaust\xE3o": {
    "cost": null,
    "max": 5,
    "text": "Os m\xFAsculos do personagem fraquejam ap\xF3s serem submetidos a um esfor\xE7o intenso e prolongado. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Os Dados de Recupera\xE7\xE3o de For\xE7a, Destreza, Agilidade e Constitui\xE7\xE3o s\xE3o reduzidos em um passo por aplica\xE7\xE3o, at\xE9 o m\xEDnimo de d4.\n\u2014 Ao acumular cinco aplica\xE7\xF5es, o personagem perde a capacidade de recuperar esses Atributos at\xE9 dissipar a Condi\xE7\xE3o."
  },
  "Inconsciente": {
    "cost": null,
    "max": 1,
    "text": "O personagem perde a consci\xEAncia e deixa de perceber ou responder ao que acontece ao seu redor. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Seus PA atuais s\xE3o reduzidos a 0.\n\u2014 N\xE3o recebe novos PA enquanto permanecer Inconsciente.\n\u2014 Tamb\xE9m sofre os efeitos da Condi\xE7\xE3o Desprevenido.\n\u2014 Um atacante que consiga se aproximar sem acord\xE1-lo pode gastar 2 PA adicionais em um ataque para causar +5 Dados de Dano."
  },
  "Metamorfo": {
    "cost": 8,
    "max": 1,
    "text": "O personagem entra em um estado que facilita mudan\xE7as na estrutura de seu corpo. Os seguintes efeitos s\xE3o aplicados:\n\u2014 Pode ignorar os pr\xE9-requisitos de transforma\xE7\xF5es ou seus custos em PA para assumir novas formas.\n\u2014 A Condi\xE7\xE3o dura 1 minuto."
  }
};
export {
  TECHNIQUE_CONDITIONS,
  TECHNIQUE_HELP
};
