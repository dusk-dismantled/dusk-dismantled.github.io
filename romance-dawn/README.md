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
window.ROMANCE_DAWN_APP_ACCESS = 'members';
if (!document.getElementById('rd-bord-app-loader')) {
  var script = document.createElement('script');
  script.id = 'rd-bord-app-loader';
  script.src = 'https://dusk-dismantled.github.io/romance-dawn/forum-launcher.js';
  script.charset = 'utf-8';
  document.head.appendChild(script);
}
```

O lançador adiciona o botão, o modal, as fontes e a folha de estilos externa da ficha. Não é necessário copiar o CSS para cada postagem nem alterar as cores da skin. HTML deve estar habilitado no fórum e no perfil do jogador.

A criação e a solicitação de atualização estão liberadas para membros logados. A edição direta exige associação ao grupo Staff (`g1`), verificada na seção de grupos de que o usuário é membro em `/groups`. Cor do nome e cargo de administrador não concedem acesso à edição. As fontes e os estilos das fichas continuam disponíveis para todos os leitores.

Use `window.ROMANCE_DAWN_APP_ACCESS = 'members'` para o acesso ao botão. O aplicativo estático no GitHub Pages continua público; operações no fórum usam a sessão do usuário e verificam suas permissões novamente antes de enviar.

## Solicitações dos jogadores e edição da Staff

Em **Solicitar atualização**, carregue o link direto da postagem da sua ficha ou importe seu código/backup e informe esse link. Apenas o autor da postagem pode solicitar sua atualização. Em Registro, informe as premiações e seus comprovantes (links de tópicos do Romance Dawn), gastos e treinamentos; edite as outras abas e confira a prévia. Aumentos de atributos e dados de recuperação são cobrados automaticamente mesmo quando digitados diretamente. Outras melhorias usam os gastos manuais e exigem conferência da Staff. A ficha oficial não é alterada por essa solicitação.

Se já existe um tópico do personagem em Atualizações, informe seu link antes de enviar: a solicitação será uma resposta nele. Sem link, a listagem de f22 é verificada, incluindo paginação, antes de criar `[Atualizações] Nome`. Comprovantes, saldos, custos e alterações compõem o resumo; listas mostram apenas entradas alteradas, adicionadas ou removidas. O tópico inclui um código `RD-UPDATE:` para copiar/importar na edição da Staff. Esse código usa compressão gzip, contém a ficha-base, os dados propostos e os comprovantes, e não substitui a aprovação da equipe.

Em **Editar ficha — Staff**, carregue a postagem original, código ou backup. Para aplicar uma solicitação, cole `RD-UPDATE:` ou carregue o link direto da mensagem de solicitação. Confira os comprovantes e a prévia e ajuste os campos livremente, sem orçamento ou tetos de criação e sem cobrança automática. Na Revisão, informe o link original e confirme a edição no modal do fórum. O título, a autoria e os textos externos ao bloco da ficha são preservados. Se a ficha-base mudar, a operação é bloqueada antes do envio. Backups e rascunhos mantêm a base original e a proposta separadas; edições confirmadas ficam no histórico local.

Os formulários nativos de resposta e edição foram inspecionados e a substituição de uma ficha real foi validada sem POST. Os testes de escrita, permissões, conflito e transferência entre módulos usam fórum simulado.

## Envio de fichas

1. Abra o Diário de Bordo pelo botão no Romance Dawn e entre em sua conta do fórum.
2. Preencha o personagem. A criação aplica os tetos por geração e o orçamento total; recuperação começa em d4 e os Passados melhoram as escolhas para d6, sem acumular. Gerações elegíveis podem vincular uma Complicação adicional ao bônus de pontos.
3. Em Revisão, corrija os campos e escolhas apontados. O botão de envio depende dessa conferência.
4. Clique em **Enviar ficha para avaliação**. O fórum abre uma janela com título, destino e prévia final. Voltar à edição ou Escape cancela sem postar.
5. **Confirmar envio para avaliação** cria um tópico em **Criação de Personagens (f12)**. O link só aparece como publicado quando a resposta do fórum confirma o tópico.

O aplicativo aberto diretamente no GitHub Pages ou no servidor local permite editar e guardar backups. O envio exige que ele seja aberto pelo botão instalado no fórum.

## Atualizações

Registre recompensas, comprovantes, custos, treinamentos e alterações em Solicitar atualização. Confira o resumo e use **Enviar atualização para avaliação**: o fórum publica a solicitação em **Atualizações (f22)**. A Staff aplica as mudanças pelo módulo de edição, com uma confirmação separada. O pedido do jogador não concede aprovação nem altera a ficha oficial.

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

Novas postagens usam `<ficha versao="2">` com dados em tags em português, sem classes, estilos ou cópia Base64. Identidade fica em `<identidade>`; atributos, vitalidade, recursos e registros têm seus próprios blocos. Cada lista usa `<item>`, com `<id>` e `<dados>`. `nulo=""` distingue valores não informados de zero. URLs de capa e retrato são textos nas tags correspondentes. Os textos são escapados e as quebras internas viram `<br>` (o leitor também aceita `&#10;`): a postagem continua em linha única.

O lançador monta essas tags com o renderizador original, para membros e visitantes, incluindo mensagens inseridas dinamicamente. JavaScript precisa estar ativo para montar o formato novo. Fichas anteriores permanecem intactas. A recuperação aceita HTML antigo, snapshots gzip, tags compactas, o HTML já montado e backups JSON. O backup JSON continua sendo o arquivo que preserva o histórico de execução; a postagem armazena o estado atual. O limite de postagem permanece: conteúdos que excedem 65.000 bytes são bloqueados antes do envio.

```powershell
yarn sheet:build
yarn sheet:dev
```

Abra http://127.0.0.1:4173. `RD_APP_PORT` permite mudar a porta. Não abra `index.html` diretamente pelo explorador.

Fontes TypeScript: `src/sheet-app`. O build gera os módulos e o lançador empacotado. O modelo de referência permanece em `design/character-sheet`; após alterá-lo, execute `node design/character-sheet/build-html.cjs` antes do build do aplicativo.

As regras consultadas ficam em `inspections/character-sheet/app-rules.json`. Os formulários de f12 e f22 foram verificados com a sessão real em 08/10/2026, sem enviar postagem de teste. Os testes de envio usam um fórum simulado em outra origem.

O servidor local exibe os módulos para desenvolvimento. No fórum, criação e solicitações atendem membros logados; edição atende a Staff. Fora do fórum, a hospedagem estática não autoriza operações sobre postagens.
