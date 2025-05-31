# IGarden 🌱

IGarden é um projeto voltado para o gerenciamento e monitoramento de jardins inteligentes. Ele permite aos usuários acompanhar o estado de suas plantas, controlar sistemas de irrigação automatizados e receber notificações sobre cuidados necessários.

## 📑 Tabela de Conteúdos

- [IGarden 🌱](#igarden-)
  - [📑 Tabela de Conteúdos](#-tabela-de-conteúdos)
  - [✨ Funcionalidades](#-funcionalidades)
  - [🚀 Como Rodar o Projeto](#-como-rodar-o-projeto)
  - [🛠️ Tecnologias](#️-tecnologias)
  - [📝 Licença](#-licença)

## ✨ Funcionalidades

- Cadastro de plantas personalizável, com seleção de ícone ou upload de imagem.
- Monitoramento em tempo real do estado das plantas (umidade do solo, luz, temperatura).
- **Organização personalizada dos cards**: arraste e solte (drag-and-drop) para reordenar suas plantas.
- Ordenação dos cards por favoritos, data (mais novo/mais velho) ou ordem personalizada.
- Marcação de plantas favoritas.
- Visualização detalhada de cada planta, incluindo recomendações de temperatura, umidade e luz.
- Notificações automáticas sobre cuidados e lembretes para cada planta.
- Resumo visual do estado das plantas (barras de saudável, excesso de água, pouca água).
- Integração com API de clima para exibir temperatura e umidade local.
- **Progressive Web App (PWA)**: funciona offline e pode ser instalado no dispositivo.
- Interface responsiva e amigável para dispositivos móveis e desktop.
- Suporte a múltiplos tipos de plantas com recomendações específicas.
- Persistência de dados no navegador (localStorage).
- Proxy backend Node.js para integração segura com APIs externas.

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para preparar e executar o projeto IGarden:

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd IGarden
   ```

2. **Acesse a pasta do proxy**:
   ```bash
   cd proxy
   ```

3. **Instale as dependências**:
   Certifique-se de ter o Node.js instalado. Em seguida, execute:
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias, como credenciais de acesso e configurações específicas.

5. **Inicie o servidor**:
   Certifique-se de estar na pasta `.\proxy\` e execute o comando:
   ```bash
   npm start
   ```

6. **Acesse a aplicação**:
   Abra o navegador e acesse `http://localhost:3000` para usar o IGarden.

7. **Instale como PWA**:
   - Acesse a aplicação no navegador.
   - Clique no ícone de instalação na barra de endereços para instalar o IGarden como um aplicativo no seu dispositivo.

8. **Recomendação**:
   Para facilitar o desenvolvimento e visualização da aplicação, recomendamos o uso da extensão "Live Preview" do VSCode. Ela permite visualizar alterações em tempo real diretamente no editor.

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), [Font Awesome](https://fontawesome.com/), Google Fonts (Roboto)
- **Backend/Proxy:** Node.js, Express.js, Axios, OAuth 1.0a, dotenv
- **APIs externas:** The Noun Project (ícones), OpenWeatherMap (clima)
- **PWA:** Manifest, Service Worker
- **Armazenamento:** localStorage do navegador
- **Outros:** Progressive Web App, Drag-and-drop nativo HTML5

## 📝 Licença

Este projeto está licenciado sob os termos da licença MIT.  
Consulte o arquivo [LICENSE](LICENSE) para mais informações.