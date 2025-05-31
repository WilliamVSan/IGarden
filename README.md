# IGarden

IGarden é um projeto voltado para o gerenciamento e monitoramento de jardins inteligentes. Ele permite aos usuários acompanhar o estado de suas plantas, controlar sistemas de irrigação automatizados e receber notificações sobre cuidados necessários.

## Funcionalidades

- Cadastro de plantas personalizável.
- Monitoramento em tempo real do estado das plantas (umidade do solo, luz, temperatura).
- **Progressive Web App (PWA)**: Funciona offline e pode ser instalado no dispositivo.

## Como Rodar o Projeto

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