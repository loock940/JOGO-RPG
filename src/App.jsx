import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Facebook, Youtube, MessageCircle, Phone, DollarSign, Send, Sword, Shield, Zap, Skull, Trees, Axe, Map as MapIcon, Heart, Backpack, Castle } from 'lucide-react';

// ==============================================================================
// CAMADA WEB / REACT DO JOGO
// ------------------------------------------------------------------------------
// Esta versão em JavaScript/React é uma adaptação visual do mesmo RPG textual
// implementado em Java. Aqui ainda aparecem, de forma conceitual, vários itens
// do enunciado de POO:
//
// [1] Encapsulamento (0,5 pt)   -> uso de propriedades internas e getters em PersonagemBase
// [2] Herança (0,5 pt)          -> classes Cavaleiro, Mago, etc. estendem PersonagemBase
// [3] Polimorfismo (0,5 pt)     -> getDescricaoHabilidade sobrescrito nas subclasses
// [4] Classe abstrata (0,5 pt)  -> PersonagemBase simulada como abstrata em JS
// [5] Tratamento de erros (*)   -> uso de throw new Error para impedir uso incorreto
// [6] Composição (0,5 pt)       -> Regiao contém Demonio; Mapa contém Regiao; gameState agrega tudo
// [7] Coleções (0,5 pt)         -> arrays de regiões, classes visuais, histórico de mensagens
// [9] Trama / enredo (0,5 pt)   -> nomes de cidades, diálogos, descrição dos demônios e fluxo de história
//
// Obs.: [8] Classe genérica / método genérico é implementado na versão Java com Generics;
// em JavaScript não há Generics nativos, então o Inventario aqui é específico para poções.
// ==============================================================================


// ==============================================================================
// 🧠 MOTOR LÓGICO (SIMULAÇÃO DO JAVA EM JS)
// ==============================================================================

// [4] Classe Abstrata (0,5 pt) - PersonagemBase funciona como base "abstrata" em JS.
// [1] Encapsulamento (0,5 pt)  - uso de propriedades com prefixo _ + getters para controlar acesso.
class PersonagemBase {
  constructor(nome, classe, vida, ataqueBase) {
    // [4] Classe Abstrata (simulação): impede instanciar PersonagemBase diretamente.
    if (this.constructor === PersonagemBase) throw new Error("Abstrata");
    this._nome = nome;
    this._classe = classe;
    this._vida = vida;
    this._vidaMaxima = vida;
    this._ataqueBase = ataqueBase;
  }

  // Getters expõem apenas leitura segura do estado interno.
  getNome() { return this._nome; }
  getClasse() { return this._classe; }
  getVida() { return this._vida; }
  getAtaqueBase() { return this._ataqueBase; }
  
  // Setter controlado para ataque base (não expõe o campo diretamente).
  setAtaqueBase(novoAtaque) { this._ataqueBase = novoAtaque; }

  // Aplica dano ao personagem, garantindo que a vida não fique negativa.
  receberDano(dano) {
    this._vida -= dano;
    if (this._vida < 0) this._vida = 0;
  }

  // Cura o personagem até o máximo de vida permitido.
  curar(qtd) {
    this._vida += qtd;
    if (this._vida > this._vidaMaxima) this._vida = this._vidaMaxima;
  }

  // [3] Polimorfismo (0,5 pt):
  // contrato que obriga cada classe concreta a implementar sua descrição de habilidade.
  getDescricaoHabilidade() { throw new Error("Implementar"); } // [5] Tratamento de erro semântico
}

// [2] Herança (0,5 pt) - Classes jogáveis estendem PersonagemBase.
// [3] Polimorfismo (0,5 pt) - Cada classe sobrescreve getDescricaoHabilidade de forma diferente.
class Cavaleiro extends PersonagemBase {
  constructor(nome) { super(nome, "Cavaleiro", 120, 30); }
  getDescricaoHabilidade() { return "🛡️ Escudo de Fé: Começa com mais vida."; }
}
class Mago extends PersonagemBase {
  constructor(nome) { super(nome, "Mago", 90, 30); }
  getDescricaoHabilidade() { return "🔥 Rajada Arcana: Dano mágico instável."; }
}
class Arqueiro extends PersonagemBase {
  constructor(nome) { super(nome, "Arqueiro", 100, 30); }
  getDescricaoHabilidade() { return "🏹 Tiro Preciso: Críticos mais frequentes."; }
}
class Berserk extends PersonagemBase {
  constructor(nome) { super(nome, "Berserk", 110, 30); }
  getDescricaoHabilidade() { return "🩸 Fúria: Resiste à morte uma vez."; }
}
class Viking extends PersonagemBase {
  constructor(nome) { super(nome, "Viking", 115, 30); }
  getDescricaoHabilidade() { return "🪓 Grito: Intimida demônios."; }
}
class Elfo extends PersonagemBase {
  constructor(nome) { super(nome, "Elfo", 95, 30); }
  getDescricaoHabilidade() { return "🍃 Graça: Esquiva natural aprimorada."; }
}

// [6] Composição (0,5 pt) - Demonio é parte de uma Regiao.
class Demonio {
  constructor(nome, titulo, hpMax) {
    this.nome = nome;
    this.titulo = titulo;
    this.hp = hpMax;
    this.hpMax = hpMax;
  }
}

// [6] Composição - Regiao agrega um Demonio + dados narrativos.
// [9] Trama / enredo: nomes de aldeões, falas e descrições das cidades.
class Regiao {
  constructor(id, nome, descricao, nomeAldeao, dialogoAldeao, demonio) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.nomeAldeao = nomeAldeao;
    this.dialogoAldeao = dialogoAldeao;
    this.demonio = demonio; 
    this.libertada = false;
  }
}

// [7] Coleções (0,5 pt) - Mapa mantém uma lista de Regioes.
// [6] Composição - Mapa é composto por várias Regioes, incluindo a região final.
class Mapa {
  constructor() {
    // Hub central do jogo (castelo seguro, equivalente ao "menu principal" de exploração).
    this.hub = new Regiao(
      0,
      "Castelo Real (Hub)",
      "O último bastião seguro. Daqui você planeja seus ataques aos Cinco Dedos.",
      "Rei",
      "Guerreiro, liberte as 4 regiões para abrir o portão do Castelo Demoníaco.",
      null
    );
    
    // [7] Coleções: array de Regiao representa o "mundo" de jogo.
    // [9] Trama / enredo: descrição completa das 4 cidades + castelo demoníaco.
    this.regioes = [
      new Regiao(
        1,
        "Vila Lúminia",
        "Uma cidade de luz enfraquecida pela corrupção.",
        "Lian de Lúminia",
        "Lorde Nocthar corrompeu nossa luz... Ele está no templo!",
        new Demonio("Nocthar", "Dedo da Luz Corrompida", 120)
      ),
      new Regiao(
        2,
        "Porto Brumal",
        "Um porto cercado por neblina eterna e navios fantasmas.",
        "Bruna de Brumal",
        "A névoa nunca passa. É obra de Nerith. Cuidado com as sombras.",
        new Demonio("Nerith", "Dedo da Névoa", 120)
      ),
      new Regiao(
        3,
        "Bosque Cinéreo",
        "Árvores cinzentas, quase petrificadas pelo medo.",
        "Ciro do Cinéreo",
        "A floresta não respira mais. Sylvrak sugou a vida dela.",
        new Demonio("Sylvrak", "Dedo das Sombras", 120)
      ),
      new Regiao(
        4,
        "Fortaleza Rubra",
        "Marcada por batalhas antigas sob um céu vermelho sangue.",
        "Rúbia da Fortaleza",
        "Kharzun queima tudo o que toca. A fortaleza é um forno.",
        new Demonio("Kharzun", "Dedo da Chama", 120)
      ),
      // Região Final (portão só abre após 4 cidades libertadas).
      new Regiao(
        5,
        "Castelo Demoníaco",
        "A morada final do mal supremo.",
        "Ninguém",
        "...",
        new Demonio("Obscuron", "O Quinto Dedo", 200)
      )
    ];
  }

  // Acesso ao hub principal.
  getHub() { return this.hub; }
  
  // Retorna região por id (0 = hub, demais = cidades/fortaleza).
  getRegiao(id) {
    if (id === 0) return this.hub;
    return this.regioes.find(r => r.id === id);
  }

  // Verifica condição de vitória parcial:
  // todas as 4 cidades iniciais precisam estar libertadas.
  todasCidadesLibertadas() {
    return this.regioes.slice(0, 4).every(r => r.libertada);
  }
}

// Inventário de poções da versão web.
// Aqui é específico (poções), ao contrário do Inventario<T> genérico do Java.
class Inventario {
  constructor() {
    this.pocoes = 0;
  }
  adicionarPocao(qtd) { this.pocoes += qtd; }
  usarPocao() {
    if (this.pocoes > 0) {
      this.pocoes--;
      return true;
    }
    return false;
  }
}

// Dados Visuais para a tela de seleção de classe.
// [7] Coleções: array de objetos descreve classes jogáveis + ícones e imagens.
const CLASSES_VISUAIS = [
  { id: 'cavaleiro', nome: 'Cavaleiro', img: '/imagem/Cavaleiro.png', icon: Shield, desc: 'Defesa alta e honra.' },
  { id: 'mago', nome: 'Mago', img: '/imagem/Mago.png', icon: Zap, desc: 'Poder arcano destrutivo.' },
  { id: 'arqueiro', nome: 'Arqueiro', img: '/imagem/Arqueiro.png', icon: Trees, desc: 'Precisão letal.' },
  { id: 'berserk', nome: 'Berserk', img: '/imagem/Berserk.png', icon: Skull, desc: 'Fúria incontrolável.' },
  { id: 'viking', nome: 'Viking', img: '/imagem/Viking.png', icon: Axe, desc: 'Guerreiro do norte.' },
  { id: 'elfo', nome: 'Elfo', img: '/imagem/Elfo.png', icon: Trees, desc: 'Guardião da natureza.' },
];

// ==============================================================================
// COMPONENTE PRINCIPAL (CAMADA DE REACT)
// ------------------------------------------------------------------------------
// Este componente coordena as telas (home, setup, seleção, jogo) e mantém o
// estado global do jogo via hooks (useState).
// ==============================================================================

export default function App() {
  const [screen, setScreen] = useState('home'); 
  const [userName, setUserName] = useState('');
  
  // gameState centraliza o "modelo" de jogo na camada web.
  // [6] Agregação: combina jogador, mapa, inventário, localização, estado de batalha etc.
  const [gameState, setGameState] = useState({
    jogador: null,
    mapa: new Mapa(),
    inventario: new Inventario(),
    localAtualId: 0, // 0 = Hub
    emBatalha: false,
    faseBatalha: 'TURNO_JOGADOR',
    danoPendente: 0,
    tipoAtaqueInimigo: '',
    gameOver: false,
    vitoriaFinal: false
  });

  // Transição da tela inicial para a configuração de personagem.
  const handlePlay = () => {
    setScreen('zooming');
    setTimeout(() => setScreen('setup'), 1500);
  };

  // Confirmação de nome do personagem e avanço para seleção de classe.
  const handleCreateChar = (name) => {
    setUserName(name);
    setScreen('char_select');
  };

  // Cria efetivamente o personagem a partir da classe selecionada.
  // [2]/[3]: instância uma das subclasses de PersonagemBase com base na escolha do jogador.
  const handleSelectClass = (classId) => {
    let novoJogador;
    switch(classId) {
      case 'cavaleiro': novoJogador = new Cavaleiro(userName); break;
      case 'mago': novoJogador = new Mago(userName); break;
      case 'arqueiro': novoJogador = new Arqueiro(userName); break;
      case 'berserk': novoJogador = new Berserk(userName); break;
      case 'viking': novoJogador = new Viking(userName); break;
      case 'elfo': novoJogador = new Elfo(userName); break;
      default: novoJogador = new Cavaleiro(userName);
    }
    
    // Inventário inicial com 1 poção.
    const inv = new Inventario();
    inv.adicionarPocao(1);

    setGameState(prev => ({ 
      ...prev, 
      jogador: novoJogador, 
      inventario: inv 
    }));
    setScreen('game');
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P',_monospace] overflow-hidden selection:bg-red-900 selection:text-white relative">
      <StyleSheet />
      <div className="scanline"></div>

      {/* Telas principais controladas pela máquina de estados de tela */}
      {screen === 'home' || screen === 'zooming' ? (
        <div className={`absolute inset-0 z-20 ${screen === 'zooming' ? 'animate-zoom-in origin-center' : ''}`}>
           <HomeScreen onPlay={handlePlay} />
        </div>
      ) : null}

      {screen === 'setup' && <SetupScreen onConfirm={handleCreateChar} />}
      
      {screen === 'char_select' && (
        <CharacterSelectionScreen 
          playerName={userName}
          onSelect={handleSelectClass} 
        />
      )}

      {screen === 'game' && gameState.jogador && (
        <GameScreen 
          gameState={gameState} 
          setGameState={setGameState} 
        />
      )}
    </div>
  );
}

// ==============================================================================
// TELA DO JOGO / TERMINAL RPG
// ------------------------------------------------------------------------------
// GameScreen é a UI que simula um terminal de texto: mostra histórico de
// mensagens, processa comandos e atualiza o gameState.
// ==============================================================================

function GameScreen({ gameState, setGameState }) {
  const scrollRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // [7] Coleções: histórico de mensagens do "console" do RPG.
  const [history, setHistory] = useState([]);

  // Rolar d20 para testes de ataque/esquiva.
  const d20 = () => Math.floor(Math.random() * 20) + 1;

  // Renderizar Menu Contextual de acordo com o estado atual do jogo.
  // Isso centraliza o texto "ajuda/menu" em um único lugar.
  const getMenuText = (overrideState) => {
    const state = overrideState || gameState;
    const { mapa, localAtualId, emBatalha, faseBatalha } = state;
    let menu = "\n\nOpções:\n";

    if (emBatalha) {
      if (faseBatalha === 'ESPERANDO_ESQUIVA') {
        return menu + "⚠️ O INIMIGO ATACA! Tentar esquivar? (s/n)\n";
      }
      return menu + "1) Atacar (d20)\n2) Usar Poção\n3) Tentar Fugir\n";
    }

    if (localAtualId === 0) {
      menu += "viajar [número] - Escolha um destino:\n";
      mapa.regioes.forEach(r => {
        if (r.id === 5 && !mapa.todasCidadesLibertadas()) return; 
        const status = r.libertada ? "[LIBERTADA]" : "[DOMINADA]";
        menu += `   ${r.id}. ${r.nome} ${status}\n`;
      });
      menu += "status - Ver ficha\n";
      menu += "ajuda / ajudar - listar comandos\n";
      return menu;
    }

    // Safety check para garantir que a região existe
    const regiao = mapa.getRegiao(localAtualId);
    if (!regiao) return menu; 

    menu += "1) Conversar com Aldeão\n";
    if (!regiao.libertada) {
      menu += "2) ENFRENTAR LORDE " + (regiao.demonio ? regiao.demonio.nome.toUpperCase() : "DEMONIO") + "\n";
    }
    menu += "3) Voltar ao Castelo\n";
    menu += "status - Ver ficha\n";
    menu += "ajuda / ajudar - listar comandos\n";
    
    return menu;
  };

  // Inicialização da tela de jogo: mensagem de introdução + menu inicial.
  useEffect(() => {
    const { jogador, mapa, localAtualId } = gameState;
    
    // Garante que a região atual existe; se não, volta para o hub.
    const regiao = mapa.getRegiao(localAtualId) || mapa.getHub();

    const intro = `
========================================
      AS CRÔNICAS DOS CINCO DEDOS
========================================
Bem-vindo, ${jogador ? jogador.getNome() : "Viajante"}.
O mundo caiu. Cinco Lordes Demoníacos governam as terras.
Você está no Castelo Real, o único lugar seguro.

Sua missão: Viajar para as 4 cidades, derrotar os Lordes e liberar o caminho para o Castelo Demoníaco.

${getMenuText()}
`;
    addToHistory('system', intro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adiciona uma nova entrada ao histórico (system ou user).
  const addToHistory = (type, text) => {
    setHistory(prev => [...prev, { type, text }]);
    setIsTyping(true);
  };

  // Mantém o scroll sempre no final, simulando console/terminal.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isTyping]);

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  // ======================================================
  // LÓGICA PRINCIPAL (PROCESSADOR DE COMANDOS)
  // ------------------------------------------------------
  // Este bloco é o "motor" de regras da versão web: interpreta
  // texto digitado, manipula o gameState e retorna strings de resposta.
  // ======================================================
  const processCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    const { jogador, mapa, inventario, localAtualId, emBatalha, faseBatalha } = gameState;
    let response = "";
    
    if (gameState.gameOver) return "Você caiu em combate. F5 para tentar de novo.";
    if (gameState.vitoriaFinal) return "O mundo está salvo! Você é uma lenda.";

    // --- LÓGICA DE BATALHA ----------------------------------------------------
    if (emBatalha) {
      const regiao = mapa.getRegiao(localAtualId);
      const demonio = regiao.demonio;

      // FASE 1: TURNO DO JOGADOR
      if (faseBatalha === 'TURNO_JOGADOR') {
        // ajuda em batalha
        if (command === 'ajuda' || command === 'ajudar') {
          return getMenuText({ ...gameState, emBatalha: true, faseBatalha: 'TURNO_JOGADOR' });
        }

        if (command === '1' || command === 'atacar') {
          const rolagem = d20();
          const dano = Math.floor(jogador.getAtaqueBase() * (rolagem / 20));
          
          demonio.hp -= dano;
          response =
            `Você atacou! Dado: ${rolagem}/20.\n` +
            `Dano causado: ${dano}.\n` +
            `HP do ${demonio.nome}: ${demonio.hp > 0 ? demonio.hp : 0}/${demonio.hpMax}`;

          if (demonio.hp <= 0) {
            // Vitória na batalha: marca região como libertada e sorteia drop de poção.
            regiao.libertada = true;
            
            const sorte = Math.random();
            let dropMsg = "";
            if (sorte < 0.25) {
              inventario.adicionarPocao(2); dropMsg = "Drop: 2 Poções!";
            } else if (sorte < 0.75) {
              inventario.adicionarPocao(1); dropMsg = "Drop: 1 Poção.";
            } else {
              dropMsg = "Nenhuma poção encontrada.";
            }

            setGameState(prev => ({ ...prev, emBatalha: false }));
            
            // Se for o último boss (Castelo Demoníaco), dispara vitória final.
            if (regiao.id === 5) {
              setGameState(prev => ({ ...prev, vitoriaFinal: true }));
              return `\nVOCÊ DESTRUIU O QUINTO DEDO!\n${demonio.nome} cai gritando.\nO mundo foi purificado.\n\nFIM DE JOGO.`;
            }

            return (
              `${response}\n\n🏆 VITÓRIA!\nVocê libertou ${regiao.nome}!\n${dropMsg}\n` +
              "(Digite '3' para voltar ao Castelo)" +
              getMenuText({ ...gameState, emBatalha: false })
            );
          } else {
            // Prepara turno do Inimigo: define tipo de ataque e dano pendente.
            const tipoAtaqueRoll = Math.random();
            let danoInimigo = 0;
            let nomeAtaque = "";
            let tipo = "";

            if (tipoAtaqueRoll < 0.5) {
              danoInimigo = 10; nomeAtaque = "Ataque Médio"; tipo = "MEDIO";
            } else if (tipoAtaqueRoll < 0.8) {
              danoInimigo = 15; nomeAtaque = "ATAQUE FORTE"; tipo = "FORTE";
            } else {
              danoInimigo = 10; nomeAtaque = "Drenagem de Vida"; tipo = "DRENAGEM";
            }

            response += `\n\n⚠️ TURNO DE ${demonio.nome.toUpperCase()}!\nEle prepara um ${nomeAtaque} (${danoInimigo} dano).`;
            
            setGameState(prev => ({
              ...prev,
              faseBatalha: 'ESPERANDO_ESQUIVA',
              danoPendente: danoInimigo,
              tipoAtaqueInimigo: tipo
            }));
            
            return response + getMenuText({
              ...gameState,
              emBatalha: true,
              faseBatalha: 'ESPERANDO_ESQUIVA'
            });
          }
        }
        else if (command === '2' || command === 'usar pocao') {
          if (inventario.usarPocao()) {
            jogador.curar(30);
            const msg = `Você bebeu uma poção. HP: ${jogador.getVida()}.\n(Ainda é seu turno de atacar)`;
            return msg + getMenuText({
              ...gameState,
              emBatalha: true,
              faseBatalha: 'TURNO_JOGADOR'
            });
          } else {
            const msg = "Você não tem poções!";
            return msg + getMenuText({
              ...gameState,
              emBatalha: true,
              faseBatalha: 'TURNO_JOGADOR'
            });
          }
        }
        else if (command === '3' || command === 'fugir') {
          const future = { ...gameState, emBatalha: false, faseBatalha: 'TURNO_JOGADOR' };
          setGameState(prev => ({ ...prev, emBatalha: false, faseBatalha: 'TURNO_JOGADOR' }));
          return "Você fugiu covardemente para a entrada da cidade." + getMenuText(future);
        }
        else {
          const msg = "Comando inválido em batalha. Use 1, 2 ou 3.";
          return msg + getMenuText({ ...gameState, emBatalha: true });
        }
      }

      // FASE 2: RESPOSTA DE ESQUIVA
      if (faseBatalha === 'ESPERANDO_ESQUIVA') {
        if (command === 'ajuda' || command === 'ajudar') {
          return getMenuText({
            ...gameState,
            emBatalha: true,
            faseBatalha: 'ESPERANDO_ESQUIVA'
          });
        }

        let danoFinal = gameState.danoPendente;
        let msgEsquiva = "";

        if (command === 's' || command === 'sim') {
          const rolagemEsquiva = d20();
          const reducao = rolagemEsquiva / 20;
          danoFinal = Math.floor(danoFinal * (1 - reducao));
          msgEsquiva =
            `Você tentou esquivar! Dado: ${rolagemEsquiva}/20.\n` +
            `Dano reduzido para: ${danoFinal}.`;
        } else {
          msgEsquiva = "Você aceitou o golpe de peito aberto!";
        }

        jogador.receberDano(danoFinal);
        
        let msgCuraBoss = "";
        if (gameState.tipoAtaqueInimigo === 'DRENAGEM') {
          demonio.hp += 10;
          if (demonio.hp > demonio.hpMax) demonio.hp = demonio.hpMax;
          msgCuraBoss = `\nO demônio drenou sua vida e curou 10 HP!`;
        }

        if (jogador.getVida() <= 0) {
          setGameState(prev => ({ ...prev, gameOver: true }));
          return `${msgEsquiva}\n${msgCuraBoss}\nVocê sofreu dano fatal.\n\n💀 GAME OVER`;
        }

        setGameState(prev => ({ ...prev, faseBatalha: 'TURNO_JOGADOR' }));
        return (
          `${msgEsquiva}\n${msgCuraBoss}\nVocê tem ${jogador.getVida()} HP.\n\nSua vez! O que fará?` +
          getMenuText({
            ...gameState,
            emBatalha: true,
            faseBatalha: 'TURNO_JOGADOR'
          })
        );
      }
    }

    // --- LÓGICA DE EXPLORAÇÃO (FORA DE BATALHA) ------------------------------

    // HUB (CASTELO REAL)
    if (localAtualId === 0) {

      if (command === 'ajuda' || command === 'ajudar') {
        return getMenuText({ ...gameState, localAtualId: 0, emBatalha: false });
      }
      
      let destino = null;
      // Aceita tanto "viajar 1" quanto apenas "1"
      if (command.startsWith('viajar')) {
        destino = parseInt(command.split(' ')[1]);
      } else if (!isNaN(parseInt(command))) {
        destino = parseInt(command);
      }

      if (destino) {
        const regiaoAlvo = mapa.getRegiao(destino);

        if (!regiaoAlvo) {
          const msg = "Destino inválido.";
          return msg + getMenuText({ ...gameState, localAtualId: 0, emBatalha: false });
        }
        
        if (regiaoAlvo.id === 5 && !mapa.todasCidadesLibertadas()) {
          const msg = "O Portão do Castelo Demoníaco está selado! Liberte as 4 cidades primeiro.";
          return msg + getMenuText({ ...gameState, localAtualId: 0, emBatalha: false });
        }

        const future = { ...gameState, localAtualId: destino, emBatalha: false, faseBatalha: 'TURNO_JOGADOR' };
        setGameState(prev => ({ ...prev, localAtualId: destino, emBatalha: false, faseBatalha: 'TURNO_JOGADOR' }));
        
        if (regiaoAlvo.id === 5) {
          // Buff de ataque para o combate final.
          jogador.setAtaqueBase(50);
          return (
            `Você entra no CASTELO DEMONÍACO. A atmosfera é pesada.\n` +
            `Seu poder aumentou para enfrentar o mal final (Ataque Base: 50).\n\n` +
            `"${regiaoAlvo.descricao}"\n` +
            getMenuText(future)
          );
        }

        return (
          `Você viajou para ${regiaoAlvo.nome}.\n"${regiaoAlvo.descricao}"\n` +
          getMenuText(future)
        );
      }
      else if (command === 'status') {
        const msg =
          `[STATUS]\n` +
          `Nome: ${jogador.getNome()}\n` +
          `HP: ${jogador.getVida()}\n` +
          `Poções: ${inventario.pocoes}\n` +
          `Cidades Libertadas: ${mapa.regioes.filter(r => r.libertada && r.id < 5).length}/4`;
        return msg + getMenuText({ ...gameState, localAtualId: 0, emBatalha: false });
      }
      else {
        const msg = "Comando inválido. Digite o número do destino (ex: 1).";
        return msg + getMenuText({ ...gameState, localAtualId: 0, emBatalha: false });
      }
    }

    // CIDADES / REGIÕES (fora do castelo)
    else {
      const regiao = mapa.getRegiao(localAtualId);

      if (command === 'ajuda' || command === 'ajudar') {
        return getMenuText(gameState);
      }

      if (command === '1' || command === 'conversar') {
        const msg = `[${regiao.nomeAldeao} diz]:\n"${regiao.dialogoAldeao}"`;
        return msg + getMenuText(gameState);
      }
      else if (command === '2' || command.includes('enfrentar')) {
        if (regiao.libertada) {
          const msg = "Esta região já está salva. O povo te adora.";
          return msg + getMenuText(gameState);
        }
        
        const future = { ...gameState, emBatalha: true, faseBatalha: 'TURNO_JOGADOR' };
        setGameState(prev => ({ ...prev, emBatalha: true, faseBatalha: 'TURNO_JOGADOR' }));
        return (
          `⚔️ BATALHA INICIADA ⚔️\n` +
          `Lorde ${regiao.demonio.nome} aparece!\n` +
          `HP Inimigo: ${regiao.demonio.hp}\n` +
          getMenuText(future)
        );
      }
      else if (command === '3' || command.includes('voltar')) {
        const future = { ...gameState, localAtualId: 0, emBatalha: false, faseBatalha: 'TURNO_JOGADOR' };
        setGameState(prev => ({ ...prev, localAtualId: 0, emBatalha: false, faseBatalha: 'TURNO_JOGADOR' }));
        return "Você retorna ao Castelo Real para descansar e planejar." + getMenuText(future);
      }
      else if (command === 'status') {
        const msg = `[STATUS]\nHP: ${jogador.getVida()}\nPoções: ${inventario.pocoes}`;
        return msg + getMenuText(gameState);
      }
      else {
        const msg = "Comando inválido.";
        return msg + getMenuText(gameState);
      }
    }
  };

  // Submissão de comando pelo input de texto.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const cmd = inputValue;
    setInputValue('');
    setHistory(prev => [...prev, { type: 'user', text: cmd }]);
    
    setTimeout(() => {
      const res = processCommand(cmd);
      addToHistory('system', res);
    }, 300);
  };

  // Helper seguro para obter região atual no HUD.
  const currentRegion = gameState.mapa.getRegiao(gameState.localAtualId) || gameState.mapa.getHub();

  return (
    <div className="flex flex-col h-screen w-full bg-black p-2 md:p-6 animate-fade-appear">
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto mb-4 font-mono text-xs md:text-sm lg:text-base space-y-2 p-4 border border-gray-800 rounded-md bg-black/95 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
      >
        {history.map((line, index) => {
          const isLastMessage = index === history.length - 1;
          const shouldAnimate = isLastMessage && line.type === 'system' && isTyping;
          return (
            <div key={index} className={`${getLineColor(line.type)} break-words leading-relaxed whitespace-pre-wrap mb-2`}>
              {line.type === 'user' && <span className="text-yellow-400 mr-2">{'>'}</span>}
              {shouldAnimate ? <Typewriter text={line.text} onComplete={() => setIsTyping(false)} /> : line.text}
            </div>
          );
        })}
      </div>

      {/* Campo de entrada de comandos do jogador */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
        <form onSubmit={handleSubmit} className="relative flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping || gameState.gameOver}
            className="w-full bg-black border-2 border-yellow-900 text-yellow-100 p-4 rounded-l-md focus:border-yellow-500 outline-none font-mono placeholder-gray-700"
            placeholder={isTyping ? "..." : "Digite sua ação..."}
            autoFocus
          />
          <button 
            type="submit" 
            disabled={isTyping || gameState.gameOver}
            className="bg-yellow-900/30 border-2 border-l-0 border-yellow-900 text-yellow-500 px-6 rounded-r-md hover:bg-yellow-900/50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      
      {/* HUD Superior com informações de HP, localização e poções */}
      <div className="fixed top-4 right-6 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-red-500 border border-red-900/50 p-2 rounded bg-black/80">
          <Heart size={14} /> 
          <span>HP: {gameState.jogador ? gameState.jogador.getVida() : 0}</span>
        </div>
        <div className="flex items-center gap-2 text-blue-400 border border-blue-900/50 p-2 rounded bg-black/80">
          <MapIcon size={14} /> 
          <span>{currentRegion.id === 0 ? "HUB" : "Cidade " + currentRegion.id}</span>
        </div>
        <div className="flex items-center gap-2 text-green-400 border border-green-900/50 p-2 rounded bg-black/80">
          <Backpack size={14} /> 
          <span>Poções: {gameState.inventario.pocoes}</span>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// TELAS DE UI (HOME, SETUP, SELEÇÃO DE CLASSE)
// ------------------------------------------------------------------------------
// Essas telas cuidam apenas da parte visual e navegação de fluxo, sem regras
// complexas de jogo. São o "front-end" da experiência.
// ==============================================================================

function HomeScreen({ onPlay }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-12 bg-black">
      <h1 className="text-4xl md:text-6xl text-red-600 drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] tracking-widest uppercase mt-10"> A Hero's quest: The Upper Hand</h1>
      <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-7 border border-dashed border-gray-800 p-4 rounded">
        AS CRÔNICAS DOS CINCO DEDOS<br/>
        Um RPG de texto hardcore.
      </p>
      <div className="py-8">
        <button
          onClick={onPlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative px-12 py-6 text-xl border-4 border-white hover:bg-white hover:text-black bg-black transition-all"
        >
          {isHovered && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 text-xl animate-pulse">
              ❤️
            </span>
          )}
          <span className={isHovered ? "ml-6" : ""}>JOGAR »</span>
        </button>
      </div>
    </div>
  );
}

// Tela para digitar o nome do personagem antes de escolher a classe.
function SetupScreen({ onConfirm }) {
  const [name, setName] = useState('');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black z-30 animate-fade-appear px-4">
      <div className="border-4 border-white p-8 max-w-lg w-full bg-gray-900 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
        <h2 className="text-center text-red-500 mb-8 text-xl tracking-widest">QUEM É VOCÊ?</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-500 text-[10px] mb-2">NOME DO PERSONAGEM</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border-2 border-gray-600 p-3 text-white focus:border-red-500 outline-none font-mono"
              placeholder="Ex: Aragorn"
            />
          </div>
          <button
            onClick={() => { if(name) onConfirm(name); }}
            className="w-full bg-red-900 hover:bg-red-700 text-white py-4 mt-4 border-2 border-red-500 transition-all uppercase text-sm tracking-widest"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
}

// Tela de seleção de classe com cards clicáveis.
function CharacterSelectionScreen({ playerName, onSelect }) {
  const [hoveredClass, setHoveredClass] = useState(null);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black z-30 animate-zoom-out-enter relative">
      <div className="absolute top-10 text-center">
        <h2 className="text-yellow-400 text-xl md:text-3xl mb-2 uppercase tracking-widest text-shadow-glow">ESCOLHA SEU DESTINO</h2>
        <p className="text-gray-500 text-xs">JOGADOR: {playerName}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl px-4 mt-10">
        {CLASSES_VISUAIS.map((cls) => (
          <div
            key={cls.id}
            className="group flex flex-col items-center cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredClass(cls.id)}
            onMouseLeave={() => setHoveredClass(null)}
            onClick={() => onSelect(cls.id)}
          >
            <div
              className={
                `w-20 h-20 md:w-28 md:h-28 border-4 ` +
                (hoveredClass === cls.id
                  ? 'border-red-500 scale-110 shadow-[0_0_20px_rgba(220,38,38,0.6)]'
                  : 'border-gray-700 grayscale') +
                ' bg-gray-900 overflow-hidden rounded-lg transition-all duration-300 relative'
              }
            >
              <img
                src={cls.img}
                alt={cls.nome}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-gray-800 text-gray-500">
                <cls.icon size={32} />
              </div>
            </div>
            <span
              className={
                `mt-3 text-[10px] md:text-xs uppercase tracking-wider ` +
                (hoveredClass === cls.id ? 'text-white' : 'text-gray-600')
              }
            >
              {cls.nome}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-6 flex justify-center">
        <div className="bg-gray-900/90 border-t-2 border-white p-6 w-full max-w-3xl min-h-[100px] text-center backdrop-blur-sm">
          {hoveredClass ? (
            <div className="animate-fade-appear">
              <h3 className="text-red-500 text-sm mb-1 uppercase">
                {CLASSES_VISUAIS.find(c => c.id === hoveredClass).nome}
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {CLASSES_VISUAIS.find(c => c.id === hoveredClass).desc}
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-xs animate-pulse">
              PASSE O MOUSE PARA VER OS DETALHES
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// UTILITÁRIOS VISUAIS
// ------------------------------------------------------------------------------
// Typewriter: efeito de texto "digitando" usado nas mensagens do sistema.
// getLineColor: colore linhas de usuário x sistema.
// StyleSheet: injeta CSS customizado (scanline, animações, etc.).
// ==============================================================================

function Typewriter({ text, speed = 10, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= text.length) {
      if (onComplete) onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedText(p => p + text[idx]);
      setIdx(p => p + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [idx, text, speed, onComplete]);
  return (
    <span>
      {displayedText}
      {idx < text.length && <span className="text-green-500 animate-pulse">_</span>}
    </span>
  );
}

function getLineColor(type) {
  switch (type) {
    case 'system': return 'text-green-400';
    case 'user': return 'text-yellow-400 font-bold';
    default: return 'text-gray-300';
  }
}

function StyleSheet() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      .scanline {
        width: 100%;
        height: 100px;
        z-index: 10;
        background: linear-gradient(
          0deg,
          rgba(0,0,0,0) 0%,
          rgba(255, 255, 255, 0.04) 50%,
          rgba(0,0,0,0) 100%
        );
        opacity: 0.1;
        position: absolute;
        bottom: 100%;
        animation: scanline 10s linear infinite;
        pointer-events: none;
      }
      @keyframes scanline {
        0% { bottom: 100%; }
        100% { bottom: -100%; }
      }
      .animate-zoom-in {
        animation: zoomIn 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
      }
      @keyframes zoomIn {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(20); opacity: 0; display: none; }
      }
      .animate-zoom-out-enter {
        animation: zoomOutEnter 0.8s ease-out forwards;
      }
      @keyframes zoomOutEnter {
        0% { transform: scale(2); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-fade-appear {
        animation: fadeAppear 1s ease-out forwards;
      }
      @keyframes fadeAppear {
        0% { opacity: 0; transform: scale(0.98); }
        100% { opacity: 1; transform: scale(1); }
      }
      .text-shadow-glow {
        text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
      }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #000; }
      ::-webkit-scrollbar-thumb {
        background: #333;
        border: 1px solid #555;
      }
    `}</style>
  );
}
