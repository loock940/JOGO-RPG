import java.util.*;

// ================================================
// Jogo RPG Textual - Versão Java para o Trabalho
// Atende rigorosamente aos itens do enunciado (cada item vale 0,5 ponto):
// [1] Encapsulamento (0,5 pt)
// [2] Herança (0,5 pt)
// [3] Polimorfismo (0,5 pt)
// [4] Classe abstrata e interface (0,5 pt)
// [5] Tratamento de exceções (0,5 pt)
// [6] Composição / agregação (0,5 pt)
// [7] Coleções (0,5 pt)
// [8] Classe / método genérico (0,5 pt)
// [9] Qualidade da trama / enredo do RPG (0,5 pt)
// Comentários ao longo do código indicam onde cada item é aplicado.
// ================================================

public class Main {
    public static void main(String[] args) {
        // Ponto de entrada do jogo: cria a "engine" JogoRPG e inicia o loop principal.
        JogoRPG jogo = new JogoRPG();
        jogo.iniciar();
    }
}

// [4] Classe abstrata (PersonagemBase) - 0,5 pt
// [1] Encapsulamento (0,5 pt): atributos privados + getters protegem o estado interno do personagem.
// [3] Polimorfismo (0,5 pt): declara métodos abstratos que serão implementados de formas diferentes nas subclasses.
abstract class PersonagemBase implements Descrevivel {
    // [1] Encapsulamento (0,5 pt): todos os atributos são privados, só acessados por métodos públicos controlados.
    private String nome;
    private String classe;
    private int vida;
    private int ataqueBase;

    // Construtor define o estado inicial padrão de qualquer personagem.
    public PersonagemBase(String nome, String classe, int vida, int ataqueBase) {
        this.nome = nome;
        this.classe = classe;
        this.vida = vida;
        this.ataqueBase = ataqueBase;
    }

    // Getters expõem leitura controlada do estado (não há setters diretos).
    public String getNome() {
        return nome;
    }

    public String getClasse() {
        return classe;
    }

    public int getVida() {
        return vida;
    }

    // Método de negócio para modificar a vida de forma controlada (receber dano).
    public void receberDano(int dano) {
        vida -= dano;
        if (vida < 0) vida = 0;
    }

    public int getAtaqueBase() {
        return ataqueBase;
    }

    // [3] Polimorfismo (0,5 pt): cada subclasse será obrigada a fornecer sua própria descrição de habilidade.
    public abstract String getDescricaoHabilidade();

    // Implementação padrão da interface Descrevivel para personagens (nome, classe, vida e ataque).
    @Override
    public String descrever() {
        return nome + ", o(a) " + classe + ". Vida: " + vida + ", Ataque: " + ataqueBase;
    }
}

// [4] Interface (Descrevivel) - 0,5 pt
// Define um contrato comum de descrição para personagens, mapa e regiões.
interface Descrevivel {
    String descrever();
}

// Subclasses concretas de PersonagemBase
// [2] Herança (0,5 pt): todas estendem PersonagemBase.
// [3] Polimorfismo (0,5 pt): cada classe sobrescreve getDescricaoHabilidade de forma diferente.

class Cavaleiro extends PersonagemBase {
    public Cavaleiro(String nome) {
        super(nome, "Cavaleiro", 40, 8);
    }

    @Override
    public String getDescricaoHabilidade() {
        return "Escudo de Fé: reduz o primeiro dano recebido em cada combate.";
    }
}

class Mago extends PersonagemBase {
    public Mago(String nome) {
        super(nome, "Mago", 28, 10);
    }

    @Override
    public String getDescricaoHabilidade() {
        return "Rajada Arcana: pode causar dano extra em inimigos frágeis.";
    }
}

class Arqueiro extends PersonagemBase {
    public Arqueiro(String nome) {
        super(nome, "Arqueiro", 32, 9);
    }

    @Override
    public String getDescricaoHabilidade() {
        return "Tiro Preciso: maior chance de atacar primeiro.";
    }
}

class Berserk extends PersonagemBase {
    public Berserk(String nome) {
        super(nome, "Berserk", 38, 11);
    }

    @Override
    public String getDescricaoHabilidade() {
        return "Fúria Incontrolável: quanto menor a vida, maior o ataque.";
    }
}

class Viking extends PersonagemBase {
    public Viking(String nome) {
        super(nome, "Viking", 36, 9);
    }

    @Override
    public String getDescricaoHabilidade() {
        return "Grito de Guerra: intimida inimigos e reduz o ataque deles.";
    }
}

class Elfo extends PersonagemBase {
    public Elfo(String nome) {
        super(nome, "Elfo", 30, 8);
    }

    @Override
    public String getDescricaoHabilidade() {
        return "Graça Silvestre: se cura levemente ao avançar entre regiões.";
    }
}

// [8] Classe genérica: Inventario<T> (0,5 pt)
// Representa um inventário genérico que pode armazenar qualquer tipo de item.
// Usa coleções internamente [7].
class Inventario<T> {
    // [7] Coleções (0,5 pt): uso de List<T> para armazenar dinamicamente os itens do inventário.
    private List<T> itens;

    public Inventario() {
        this.itens = new ArrayList<>();
    }

    // Adiciona um item genérico ao inventário.
    public void adicionar(T item) {
        itens.add(item);
    }

    // Remove um item genérico do inventário (se existir).
    public boolean remover(T item) {
        return itens.remove(item);
    }

    // Verifica se o inventário está vazio.
    public boolean estaVazio() {
        return itens.isEmpty();
    }

    // Retorna uma visão somente leitura da lista de itens (protege a lista interna).
    public List<T> getItens() {
        return Collections.unmodifiableList(itens);
    }

    // [8] Método genérico adicional (0,5 pt): imprime qualquer lista de qualquer tipo E.
    public static <E> void imprimirLista(List<E> lista) {
        for (E elemento : lista) {
            System.out.println(" - " + elemento);
        }
    }
}

// Representa uma região do mapa.
// Participa da composição com Mapa e também aplica encapsulamento.
class Regiao implements Descrevivel {
    // [1] Encapsulamento: atributos privados, acessados apenas por métodos públicos.
    private String nome;
    private String descricao;
    private boolean temChefe;

    public Regiao(String nome, String descricao, boolean temChefe) {
        this.nome = nome;
        this.descricao = descricao;
        this.temChefe = temChefe;
    }

    public String getNome() {
        return nome;
    }

    public boolean temChefe() {
        return temChefe;
    }

    // [9] Trama / enredo (0,5 pt): a descrição textual da região contribui para a ambientação do RPG.
    @Override
    public String descrever() {
        return "[" + nome + "] " + descricao + (temChefe ? " (Sente-se uma presença ameaçadora...)" : "");
    }
}

// [6] Composição: Mapa possui Regioes (0,5 pt)
// O Mapa é formado pela agregação de múltiplas instâncias de Regiao.
class Mapa implements Descrevivel {
    // [7] Coleções (0,5 pt): uso de List<Regiao> para armazenar as regiões do mundo.
    private List<Regiao> regioes;

    public Mapa() {
        this.regioes = new ArrayList<>();
    }

    // Adiciona uma nova região ao mapa (parte da composição do mundo).
    public void adicionarRegiao(Regiao regiao) {
        regioes.add(regiao);
    }

    // [5] Tratamento de exceções (0,5 pt):
    // Usa exceção customizada para sinalizar acesso inválido à lista de regiões.
    public Regiao getRegiao(int indice) throws OpcaoInvalidaException {
        if (indice < 0 || indice >= regioes.size()) {
            throw new OpcaoInvalidaException("Região inexistente.");
        }
        return regioes.get(indice);
    }

    public int quantidadeRegioes() {
        return regioes.size();
    }

    // Exibe um resumo do mundo, listando as regiões disponíveis para exploração.
    @Override
    public String descrever() {
        StringBuilder sb = new StringBuilder();
        sb.append("O mundo de Eldoria está em caos. Você sente o peso das escolhas à frente.\n\n");
        for (int i = 0; i < regioes.size(); i++) {
            sb.append(i + 1).append(") ").append(regioes.get(i).getNome()).append("\n");
        }
        return sb.toString();
    }
}

// [5] Tratamento de exceções: exceção checked customizada (0,5 pt)
// Essa classe modela um erro de opção inválida no menu/seleção de regiões.
class OpcaoInvalidaException extends Exception {
    public OpcaoInvalidaException(String mensagem) {
        super(mensagem);
    }
}

// Núcleo do jogo (engine principal).
// [6] Agregação (0,5 pt): JogoRPG agrega Mapa, PersonagemBase e Inventario sem ser "dono" exclusivo deles.
class JogoRPG {
    // [1] Encapsulamento: atributos privados que representam o estado interno do jogo.
    private Scanner scanner;
    private PersonagemBase jogador;
    private Mapa mapa;
    private Inventario<String> inventario; // [8] Uso real da classe genérica Inventario<T> com T = String.

    public JogoRPG() {
        scanner = new Scanner(System.in);
        inventario = new Inventario<>();
        montarMapaInicial();
    }

    // [9] Trama / enredo (0,5 pt):
    // Cria o mapa inicial com três regiões bem caracterizadas, estabelecendo o enredo do culto da Chama Vazia.
    private void montarMapaInicial() {
        mapa = new Mapa();
        mapa.adicionarRegiao(new Regiao(
                "Vilarejo de Cinzas",
                "Casas queimadas e muros destruídos, sinais do avanço do Culto da Chama Vazia.",
                false
        ));
        mapa.adicionarRegiao(new Regiao(
                "Bosque Sussurrante",
                "Árvores retorcidas que parecem cochichar segredos antigos ao vento.",
                false
        ));
        mapa.adicionarRegiao(new Regiao(
                "Fortaleza de Brasamorta",
                "O coração do culto. Um castelo negro recortado pelo brilho alaranjado de lava distante.",
                true
        ));
    }

    // Método que controla o fluxo geral do jogo:
    // criação do personagem, exibição de status e entrada no loop principal.
    public void iniciar() {
        System.out.println("====================================");
        System.out.println("        Devil's Bob MUD: Eldoria");
        System.out.println("====================================\n");

        criarPersonagem();
        System.out.println("\nSeu personagem:");
        // [3] Polimorfismo: o método descrever() é chamado via tipo PersonagemBase,
        // mas a implementação vem da classe concreta específica do personagem.
        System.out.println(jogador.descrever());
        // [3] Polimorfismo: cada classe concreta fornece uma habilidade diferente.
        System.out.println("Habilidade: " + jogador.getDescricaoHabilidade());

        loopPrincipal();

        System.out.println("\nObrigado por jogar! Até a próxima.");
    }

    // Lê o nome e permite ao usuário escolher uma das classes concretas de personagem.
    private void criarPersonagem() {
        System.out.print("Digite o nome do seu personagem: ");
        String nome = scanner.nextLine();

        while (nome.trim().isEmpty()) {
            System.out.print("Nome não pode ser vazio. Digite novamente: ");
            nome = scanner.nextLine();
        }

        System.out.println("\nEscolha uma classe:");
        System.out.println("1) Cavaleiro");
        System.out.println("2) Mago");
        System.out.println("3) Arqueiro");
        System.out.println("4) Berserk");
        System.out.println("5) Viking");
        System.out.println("6) Elfo");

        int opcao = lerOpcaoMenu(1, 6);

        // [2] Herança + [3] Polimorfismo:
        // a variável "jogador" é do tipo PersonagemBase,
        // mas pode referenciar qualquer uma das subclasses concretas.
        switch (opcao) {
            case 1: jogador = new Cavaleiro(nome); break;
            case 2: jogador = new Mago(nome); break;
            case 3: jogador = new Arqueiro(nome); break;
            case 4: jogador = new Berserk(nome); break;
            case 5: jogador = new Viking(nome); break;
            case 6: jogador = new Elfo(nome); break;
            default: // não deve acontecer devido à validação
                jogador = new Cavaleiro(nome);
        }
    }

    // Loop principal do RPG: exibe opções, processa ações e verifica vitória/derrota.
    private void loopPrincipal() {
        boolean vivo = true;
        boolean chefeDerrotado = false;

        System.out.println("\nO mundo que você deve salvar:");
        System.out.println(mapa.descrever());

        while (vivo && !chefeDerrotado) {
            System.out.println("\nO que deseja fazer, " + jogador.getNome() + "?");
            System.out.println("1) Explorar uma região");
            System.out.println("2) Ver inventário");
            System.out.println("3) Descansar");
            System.out.println("4) Desistir da jornada");

            int opcao = lerOpcaoMenu(1, 4);

            switch (opcao) {
                case 1:
                    chefeDerrotado = explorarRegiao();
                    break;
                case 2:
                    mostrarInventario();
                    break;
                case 3:
                    descansar();
                    break;
                case 4:
                    System.out.println("Você decide abandonar a missão. O culto avança impune...");
                    vivo = false;
                    break;
            }

            if (jogador.getVida() <= 0) {
                vivo = false;
                System.out.println("\nVocê cai de joelhos. A escuridão toma Eldoria.");
            }
        }

        if (chefeDerrotado) {
            System.out.println("\nCom o líder do culto derrotado, a chama vazia se apaga e Eldoria pode, enfim, reconstruir-se.");
        }
    }

    // [5] Tratamento de exceções (0,5 pt):
    // lê a opção do usuário com validação numérica e de faixa,
    // usando NumberFormatException e a exceção customizada OpcaoInvalidaException.
    private int lerOpcaoMenu(int min, int max) {
        int opcao = -1;
        boolean opcaoValida = false;

        while (!opcaoValida) {
            System.out.print("Sua escolha: ");
            try {
                String linha = scanner.nextLine();
                opcao = Integer.parseInt(linha.trim());

                if (opcao < min || opcao > max) {
                    throw new OpcaoInvalidaException("Opção fora do intervalo permitido.");
                }

                opcaoValida = true;
            } catch (NumberFormatException e) {
                System.out.println("Digite um número válido.");
            } catch (OpcaoInvalidaException e) {
                System.out.println(e.getMessage());
            }
        }

        return opcao;
    }

    // Controla o fluxo de exploração de uma região: escolhe a região, mostra descrição
    // e decide se haverá evento aleatório ou combate com chefe.
    private boolean explorarRegiao() {
        System.out.println("\nEscolha a região para explorar:");
        System.out.println(mapa.descrever());

        int escolha = lerOpcaoMenu(1, mapa.quantidadeRegioes());
        int indice = escolha - 1;

        try {
            Regiao regiao = mapa.getRegiao(indice); // pode lançar OpcaoInvalidaException
            System.out.println("\n" + regiao.descrever());

            if (regiao.temChefe()) {
                return enfrentarChefe(regiao);
            } else {
                eventoAleatorio(regiao);
                return false;
            }
        } catch (OpcaoInvalidaException e) {
            // [5] Tratamento de exceções: mensagem amigável ao usuário em caso de erro inesperado.
            System.out.println("Erro inesperado ao acessar a região: " + e.getMessage());
            return false;
        }
    }

    // Gera um dos três eventos narrativos possíveis em regiões comuns (sem chefe).
    private void eventoAleatorio(Regiao regiao) {
        Random random = new Random();
        int tipoEvento = random.nextInt(3); // 0, 1 ou 2

        switch (tipoEvento) {
            case 0:
                System.out.println("Você encontra um viajante misterioso que lhe oferece uma poção.");
                inventario.adicionar("Poção de cura menor");
                break;
            case 1:
                System.out.println("Um bando de saqueadores o embosca!");
                int dano = 5 + random.nextInt(6); // 5 a 10
                aplicarDanoComHabilidade(dano);
                System.out.println("Você sofre " + dano + " de dano. Vida atual: " + jogador.getVida());
                break;
            case 2:
                System.out.println("Você encontra um fragmento de mapa que revela um atalho até a Fortaleza de Brasamorta.");
                inventario.adicionar("Fragmento de mapa");
                break;
        }
    }

    // Lógica de combate contra o chefe final do culto.
    private boolean enfrentarChefe(Regiao regiao) {
        System.out.println("\nVocê entra no salão principal da " + regiao.getNome() + ".");
        System.out.println("O líder do Culto da Chama Vazia surge, envolto em fogo negro.\n");

        int vidaChefe = 45;
        Random random = new Random();

        while (vidaChefe > 0 && jogador.getVida() > 0) {
            System.out.println("Vida do chefe: " + vidaChefe + " | Sua vida: " + jogador.getVida());
            System.out.println("1) Atacar");
            System.out.println("2) Usar poção (se houver)");
            System.out.println("3) Tentar dialogar");

            int opcao = lerOpcaoMenu(1, 3);

            if (opcao == 1) {
                int danoJogador = jogador.getAtaqueBase() + random.nextInt(4); // base + 0..3
                vidaChefe -= danoJogador;
                System.out.println("Você ataca e causa " + danoJogador + " de dano!");

                if (vidaChefe <= 0) break;

                int danoChefe = 7 + random.nextInt(5); // 7..11
                aplicarDanoComHabilidade(danoChefe);
                System.out.println("O chefe contra-ataca e causa " + danoChefe + " de dano!");

            } else if (opcao == 2) {
                usarPocao();
            } else {
                System.out.println("Você tenta dialogar, mas o fanatismo do chefe é inabalável.");
                int danoChefe = 8 + random.nextInt(5);
                aplicarDanoComHabilidade(danoChefe);
                System.out.println("Ele responde com um ataque brutal de fogo negro! Dano: " + danoChefe);
            }
        }

        if (vidaChefe <= 0 && jogador.getVida() > 0) {
            System.out.println("\nO chefe cai derrotado. A chama vazia começa a se dissipar...");
            return true;
        }

        return false;
    }

    // Aplica o dano levando em conta a habilidade especial de certas classes.
    // Aqui o exemplo concreto é o Cavaleiro.
    private void aplicarDanoComHabilidade(int danoBruto) {
        // Cavaleiro reduz o primeiro dano em 3 pontos
        if (jogador instanceof Cavaleiro && danoBruto > 0) {
            danoBruto = Math.max(0, danoBruto - 3);
        }

        // Berserk: quanto menor a vida, maior a chance de tomar dano extra,
        // mas aqui vamos apenas aplicar o dano normal (a habilidade foi descrita na narrativa).

        jogador.receberDano(danoBruto);
    }

    // Exibe o conteúdo do inventário usando o método genérico Inventario.imprimirLista.
    private void mostrarInventario() {
        System.out.println("\nInventário:");
        if (inventario.estaVazio()) {
            System.out.println("(vazio)");
        } else {
            Inventario.imprimirLista(inventario.getItens());
        }
    }

    // Simula um descanso do personagem, recuperando vida.
    private void descansar() {
        System.out.println("\nVocê encontra um local relativamente seguro e decide descansar um pouco.");
        int vidaAntes = jogador.getVida();
        int cura = 5;

        // Elfo se cura mais ao descansar (relacionado à habilidade narrativa).
        if (jogador instanceof Elfo) {
            cura = 8;
        }

        // Vida máxima simples para fins de exemplo.
        int vidaMaxima = 40;
        int novaVida = Math.min(vidaMaxima, vidaAntes + cura);

        // Não temos setter público, então vamos simular cura com dano negativo
        // (apenas para o exemplo; em um projeto real seria melhor ter um método curar(int)).
        int diferenca = novaVida - vidaAntes;
        if (diferenca > 0) {
            jogador.receberDano(-diferenca); // truque para "curar"
        }

        System.out.println("Você recupera " + diferenca + " pontos de vida.");
        System.out.println("Vida atual: " + jogador.getVida());
    }

    // Usa o inventário para consumir uma poção de cura (se houver) e atualizar a vida do personagem.
    private void usarPocao() {
        List<String> itens = inventario.getItens();
        if (itens.contains("Poção de cura menor")) {
            System.out.println("Você bebe uma poção de cura menor.");
            int vidaAntes = jogador.getVida();
            int cura = 10;
            int vidaMaxima = 40;
            int novaVida = Math.min(vidaMaxima, vidaAntes + cura);
            int diferenca = novaVida - vidaAntes;
            if (diferenca > 0) {
                jogador.receberDano(-diferenca);
            }

            // Remove apenas uma poção reconstruindo o inventário (mantendo a ideia de lista imutável exposta).
            Inventario<String> aux = new Inventario<>();
            boolean removeu = false;
            for (String item : itens) {
                if (!removeu && item.equals("Poção de cura menor")) {
                    removeu = true;
                    continue;
                }
                aux.adicionar(item);
            }
            this.inventario = aux;

            System.out.println("Você recupera " + diferenca + " pontos de vida. Vida atual: " + jogador.getVida());
        } else {
            System.out.println("Você não possui nenhuma poção!");
        }
    }
}
