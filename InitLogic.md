# Sequência de inicialização

## \<script>

Fazendo a injeção:
```html
<!-- Sem identificação dos usuários -->
<script>window.conpassMeta = {};</script>
<script src="https://fast.conpass.io/hashDoCliente.js"></script>

<!-- Identificando o usuário -->
<script>
  window.conpassMeta = {
    userId: "identificador do cliente",
    userName: "nome do cliente",
    userCustom: {
      
    }
  };
</script>
<script src="https://fast.conpass.io/hashDoCliente.js"></script>
```

O cliente é obrigado a nos enviar o `conpassMeta`, mesmo vazio, para que o Pixel continue com a aplicação. Uma thread ficará rodando a procura do `conpassMeta` durante um tempo, enviando um aviso caso não receba nada. Isso para não termos problemas com a segmentação.

Antes de tudo, verificaremos o `window.conpassMeta`. Caso tenho um usuário válido (com pelo menos `userId` e `userName`), esse será o usuário da sessão. Senão, tentaremos identificar o usuário na inicialização procurando pela informação do mesmo no `localStorage`. Não achando, tentará na API pelo `browserId` (em ambos poderá ser um usuário anônimo).

Por último, não tendo nenhum deles, criará um novo usuário anônimo.

## Tarefas de pré-inicialização

- [x] Cria a tag `<conpass id="conpass-tag">`
- [x] Verifica a existência da tag `<conpass>`
  - [x] Se sim, injeta a tag topo do `body` do cliente
- [x] Inicializa a API externa `window.Conpass`
  - [ ] _Legado_: `Conpass.init(user)`
  - [ ] `Conpass.startFlow(flowId, options)`
  - [ ] Outros métodos e variáveis...
- [ ] Verifica se há `user` no `localStorage`
  - [ ] Se sim, salva em `window.Conpass.user`
  - [ ] Se não, verifica se há um `user` com o mesmo `browserId` na API
    - [ ] Se sim, salva em `window.Conpass.user`
- [ ] Verifica o `window.conpassMeta`
  - [ ] Se houver usuário válido, salva em `window.Conpass.user` e no `localStorage`
  - [ ] Se não, verifica se há um user do passo anterior
    - [ ] Se sim, salva no `localStorage`
    - [ ] Se não, cria um novo usuário anônimo
- [x] Cria o `observer` de mudança de URL

### Init (método que se repetirá nas mudanças de url)
- [ ] Inicializa o `<App>` na tag `<conpass>`

### App (componente principal)
- [ ] Identifica o token do cliente (`window.cpt`)
- [ ] Identifica usuário pelo `Conpass.meta.user`
- [ ] Identifica segmentação pelo `Conpass.meta.custom`
- [ ] Chama o flow se `startFlow` foi chamado **ou**
- [ ] Chama o flow se há flow na url
