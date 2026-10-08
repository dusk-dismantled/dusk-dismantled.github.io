# Romance Dawn — Diário de Bordo

Aplicativo desktop de criação e atualização de Vivre Cards. O formulário preenche o modelo original de 900 px. O jogador confere a prévia e envia a ficha para avaliação diretamente no fórum, com a conta já conectada. Não há exportação de HTML/CSS na interface; o backup JSON continua disponível.

## Hospedagem

Repositório: `dusk-dismantled/dusk-dismantled.github.io`, branch `main`.

Aplicativo: https://dusk-dismantled.github.io/romance-dawn/

Os arquivos ficam em `romance-dawn/`, preservando `styles/` e os demais arquivos existentes. O GitHub Pages está configurado para publicar `main` a partir da raiz. O aplicativo é estático: não recebe cookies, senhas, tokens do fórum ou chaves de API.

Para preparar uma nova versão, na raiz do ForumAgent, com Yarn Classic 1.22.19:

```powershell
yarn typecheck
yarn sheet:test
yarn sheet:pages
```

O último comando gera somente os arquivos públicos necessários em `artifacts/github-pages/romance-dawn`, com um manifesto de hashes em `artifacts/github-pages-manifest.json`. Envie o conteúdo dessa pasta para `romance-dawn/` no repositório. Arquivos `.env`, sessões, inspeções privadas e o restante do ForumAgent não fazem parte do pacote.

## Instalação no fórum

Em **Painel de administração → Módulos → HTML e JavaScript → Gestão dos códigos JavaScript**, crie um código para todas as páginas:

```javascript
window.ROMANCE_DAWN_APP_URL = 'https://dusk-dismantled.github.io/romance-dawn/index.html';
window.ROMANCE_DAWN_APP_ACCESS = 'staff';
if (!document.getElementById('rd-bord-app-loader')) {
  var script = document.createElement('script');
  script.id = 'rd-bord-app-loader';
  script.src = 'https://dusk-dismantled.github.io/romance-dawn/forum-launcher.js';
  script.charset = 'utf-8';
  document.head.appendChild(script);
}
```

O lançador adiciona o botão, o modal, as fontes e a folha de estilos externa da ficha. Não é necessário copiar o CSS para cada postagem nem alterar as cores da skin. HTML deve estar habilitado no fórum e no perfil do jogador.

A instalação do botão ainda está pendente. Durante os testes, o padrão `staff` exige sessão ativa e associação ao grupo Staff (`g1`), verificada na seção de grupos de que o usuário é membro em `/groups`. Cor do nome e cargo de administrador não concedem acesso. Visitantes, outros membros e falhas na consulta deixam o botão oculto; o acesso é conferido novamente antes de preparar e confirmar uma postagem. As fontes e os estilos das fichas continuam disponíveis para todos os leitores.

Para liberar futuramente o botão a todos os usuários logados, use `window.ROMANCE_DAWN_APP_ACCESS = 'members'`. Essa configuração controla o botão e o envio pelo fórum; o aplicativo estático no GitHub Pages continua público.

## Envio de fichas

1. Abra o Diário de Bordo pelo botão no Romance Dawn e entre em sua conta do fórum.
2. Preencha o personagem. A criação aplica os tetos por geração e o orçamento total; recuperação começa em d4 e os Passados melhoram as escolhas para d6, sem acumular. Gerações elegíveis podem vincular uma Complicação adicional ao bônus de pontos.
3. Em Revisão, corrija os campos e escolhas apontados. O botão de envio depende dessa conferência.
4. Clique em **Enviar ficha para avaliação**. O fórum abre uma janela com título, destino e prévia final. Voltar à edição ou Escape cancela sem postar.
5. **Confirmar envio para avaliação** cria um tópico em **Criação de Personagens (f12)**. O link só aparece como publicado quando a resposta do fórum confirma o tópico.

O aplicativo aberto diretamente no GitHub Pages ou no servidor local permite editar e guardar backups. O envio exige que ele seja aberto pelo botão instalado no fórum.

## Atualizações

Registre recompensas, custos, treinamentos e alterações no módulo de atualização. Confira o resumo e confirme o registro local conforme a aprovação da narração. Depois use **Enviar atualização para avaliação**: o fórum publica o resumo e a ficha em **Atualizações (f22)**. O aplicativo não edita a ficha aprovada nem concede aprovação por conta própria.

Os custos automáticos cobrem Atributos e Dados de Recuperação. Outros benefícios, exceções e custos são registrados manualmente conforme as regras. Desfazer um registro local não desfaz um tópico já enviado.

## Sessão, falhas e armazenamento

- O script do fórum lê o formulário nativo e preserva seus campos de autorização e tempo. Esses valores nunca são enviados para o GitHub Pages. As mensagens entre a página e o iframe verificam origem e remetente.
- Preparar e cancelar são operações sem postagem. Somente a confirmação na janela do fórum dispara um POST.
- Cliques repetidos e reabertura do aplicativo na mesma aba não reenviam uma criação ou atualização já confirmada. Se a rede falhar depois do envio, o mesmo pedido fica bloqueado nessa sessão até conferir a área do fórum. Não existe repetição automática do POST.
- A proteção não é uma transação do servidor: fechar a sessão, usar outra aba ou outro dispositivo pode permitir repetir um envio. Confira os tópicos existentes antes de enviar novamente.
- O rascunho e o diário ficam no navegador, na origem do GitHub Pages. Guarde backups JSON para trocar de dispositivo. O diário aceita até 100 atualizações e projetos até 5 MB.
- A postagem tem HTML em uma única linha. O fórum ainda pode impor limite de tamanho, permissões, captcha ou moderação; uma resposta sem confirmação nunca é apresentada como sucesso. O rascunho permanece disponível.
- O importador aceita JSON e HTML próprio do aplicativo. O HTML inclui estado e checksum; se o fórum remover ou alterar esses dados, recupere pelo JSON.

## Desenvolvimento local

```powershell
yarn sheet:build
yarn sheet:dev
```

Abra http://127.0.0.1:4173. `RD_APP_PORT` permite mudar a porta. Não abra `index.html` diretamente pelo explorador.

Fontes TypeScript: `src/sheet-app`. O build gera os módulos e o lançador empacotado. O modelo de referência permanece em `design/character-sheet`; após alterá-lo, execute `node design/character-sheet/build-html.cjs` antes do build do aplicativo.

As regras consultadas ficam em `inspections/character-sheet/app-rules.json`. Os formulários de f12 e f22 foram verificados com a sessão real em 08/10/2026, sem enviar postagem de teste. Os testes de envio usam um fórum simulado em outra origem.
