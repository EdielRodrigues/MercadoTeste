# Mercado Fácil PRO V12 — correção de versão e Perfil

Correções desta build:
- título e manifest atualizados para V12;
- botão X do Perfil corrigido;
- toque no fundo do Perfil também fecha a janela;
- cache do PWA incrementado para evitar versão V8 antiga;
- integração Firebase Realtime Database mantida.

# Mercado Fácil PRO V9 — Firebase Real

Esta versão mantém o PWA V8 e adiciona integração com Firebase.

## Banco real
- Cloud Firestore: `products`, `orders`, `users`
- Firebase Authentication: login ADM por e-mail/senha + autenticação anônima para clientes
- Firebase Storage: regras preparadas para imagens de produtos
- Persistência offline do Firestore quando suportada
- Sincronização entre aparelhos

## Para ativar
1. No Firebase Console, crie/abra um projeto.
2. Adicione um aplicativo **Web** e copie o objeto `firebaseConfig`.
3. Cole os valores em `firebase-config.js`.
4. Authentication > Sign-in method: habilite **Email/Password** e **Anonymous**.
5. Authentication > Users: crie o usuário administrador com o e-mail definido em `FIREBASE_ADMIN_EMAIL`.
6. Firestore Database: crie o banco e publique o conteúdo de `firestore.rules` na aba Rules.
7. Storage: crie o bucket e publique `storage.rules`.
8. Hospede em HTTPS (Firebase Hosting, Render, Netlify etc.).

## Administrador
O e-mail administrativo padrão está em `firebase-config.js` e nas regras. Se mudar o e-mail, altere nos dois lugares.

## Segurança
A chave `apiKey` do Firebase Web não é uma senha. A proteção das gravações é feita pelo Firebase Authentication e pelas Security Rules. Para produção mais avançada, o ideal é migrar o papel de administrador para Custom Claims via Admin SDK/Cloud Functions.


## V10 — Organização do ADM
- Botão **Editar produto** restaurado e visível com texto.
- Botão **Excluir** separado.
- Cada produto possui quadro próprio com Produto, Destino, Preço, Estoque, Status e Ações.
- Cadastro organizado em quadrados independentes: identificação/categoria, preço, estoque e imagem/publicação.
- Layout responsivo para celular e computador.


## V11 — Firebase Realtime Database real
- Projeto conectado: `balanco-roupas`
- Database URL: `https://balanco-roupas-default-rtdb.firebaseio.com`
- Produtos: `/products/{id}`
- Pedidos: `/orders/{pedidoId}`
- Perfis: `/users/{uid}`
- Sincronização em tempo real com listeners do Realtime Database.
- `localStorage` mantido somente como cache/fallback.
- Regras em `database.rules.json`.

### Antes de testar gravação
No Firebase Console:
1. Authentication > Sign-in method: habilite **Anonymous** e **Email/Password**.
2. Authentication > Users: crie o administrador `diel_zi_nho25@hotmail.com` com a senha que você escolher.
3. Realtime Database > Rules: publique o conteúdo de `database.rules.json`.
4. Não use regras públicas `true` em produção.

A senha administrativa não deve ficar gravada no HTML. O Firebase Authentication valida a senha.

## V12 - Banco primeiro, cache depois
Dados sincronizados seguem a regra: Firebase Realtime Database confirma primeiro; somente depois produtos, pedidos e perfil são gravados no localStorage. Em caso de erro do banco, esses dados não são gravados localmente. Carrinho e favoritos continuam locais por serem preferências temporárias do aparelho.


## V12.5 - correção do Perfil
- Botão X do perfil corrigido para Android/touch.
- Fechamento por pointerdown, touchstart, touchend e click.
- Cabeçalho do perfil com prioridade de toque e z-index próprio.
