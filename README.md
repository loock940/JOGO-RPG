# A Hero's Quest: The Upper Hand  
### AS CRÔNICAS DOS CINCO DEDOS – RPG de Texto em React

Este projeto é uma adaptação em **JavaScript/React** de um RPG textual originalmente desenvolvido em **Java** para um trabalho acadêmico de Programação Orientada a Objetos.

Na versão web, o jogador interage com um **terminal de texto estilizado**, digitando comandos (ex: `1`, `status`, `viajar 2`, `ajuda`) para explorar o mundo, conversar com NPCs, enfrentar os cinco Lordes Demoníacos e liberar as cidades corrompidas.

---

## 1. Tecnologias utilizadas

- **Linguagem**: JavaScript (ES6+)
- **Framework**: React
- **Estilização**:
  - Utility classes no estilo Tailwind CSS (classes do tipo `bg-black`, `text-red-500`, etc.)
  - CSS customizado injetado via componente `StyleSheet`
- **Ícones**:
  - [`lucide-react`](https://www.npmjs.com/package/lucide-react)
- **Fonte**:
  - `Press Start 2P` via Google Fonts (importada em CSS)

> Observação: a lógica de POO (PersonagemBase, Cavaleiro, Mago, Mapa, Regiao, Demonio, Inventario, etc.) é toda escrita em JavaScript, simulando o desenho de classes, herança, encapsulamento e polimorfismo do código Java.

---

## 2. Requisitos para rodar o projeto

Antes de rodar o jogo localmente, é necessário ter instalado:

1. **Node.js**  
   - Versão recomendada: **18.x** ou superior  
   - Download: https://nodejs.org/

2. **npm** (já vem junto com o Node)  
   - Alternativamente você pode usar `yarn`, se preferir, mas o projeto está descrito com `npm`.

3. **Git** (para clonar o repositório)  
   - Download: https://git-scm.com/

> Se estiver em laboratório de faculdade, normalmente basta conferir se `node -v`, `npm -v` e `git --version` funcionam no terminal.

---

## 3. Bibliotecas JavaScript / React

Uma vez dentro da pasta do projeto, o comando `npm install` deve instalar automaticamente todas as dependências listadas em `package.json`.

As principais dependências relacionadas a este jogo são:

- `react` e `react-dom`  
  Base da aplicação web.

- `lucide-react`  
  Biblioteca de ícones utilizada para:
  - Corações de HP
  - Ícone de mapa
  - Mochila (inventário)
  - Ícones das classes (Cavaleiro, Mago, etc.)

Se por algum motivo a instalação automática falhar, você pode instalar manualmente:

```bash
npm install react react-dom lucide-react
