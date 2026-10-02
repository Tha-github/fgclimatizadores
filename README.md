# FG Climatizadores — Site institucional

Site estático em HTML, CSS e JavaScript puros. Não depende de nenhum serviço externo: fontes, ícones e scripts estão todos no próprio projeto. Só há um passo de build, a geração do CSS (ver abaixo).

- `index.html`: o site.
- `politica-de-privacidade.html`: aviso de privacidade (LGPD).
- `404.html`: página de erro.
- `styleguide.html`: guia de estilo **interno**, com cores, tipografia, botões, cards e formulário. Não deve ser publicado.

## Antes de publicar (checklist)

1. **CSS:** rode `node scripts/build-css.js`. Isso gera o `css/site.css` usado pelas páginas.
2. **Domínio:** rode `node scripts/definir-dominio.js https://www.seudominio.com.br`. O script preenche canonical, Open Graph, dados estruturados, `sitemap.xml` e `robots.txt`.
3. **HTTPS:** ative o certificado na hospedagem.
   - **Netlify / Cloudflare Pages:** automático. Os cabeçalhos de segurança e de cache estão em `_headers`.
   - **Apache / hospedagem compartilhada** (Hostinger, HostGator, Locaweb…): o `.htaccess` força HTTPS e define cabeçalhos, compressão, cache e a página 404.
   - **GitHub Pages:** marque "Enforce HTTPS". Essa hospedagem não aceita cabeçalhos próprios, então vale a CSP do `<meta>` em cada página.
4. **Arquivos a não publicar:** `styleguide.html`, `css/styleguide.css`, `README.md`, a pasta `scripts/` e os `*.md` de `assets/`. O `.htaccess` já bloqueia esses caminhos, mas o ideal é não enviá-los.
5. **Conteúdo provisório:** busque `TROCAR AQUI` e confira os `CREDITOS.md` (fotos provisórias) e o `assets/logo/LEIA-ME.md`.
6. **Privacidade:** a política descreve o site como ele é hoje, sem cookies e sem rastreamento. Se entrar analytics, pixel, mapa incorporado ou formulário com envio a servidor, **atualize a política e a CSP antes**.
7. **Google:** depois de publicar, envie o `sitemap.xml` no Google Search Console.

## Estrutura

```
index.html · politica-de-privacidade.html · 404.html · styleguide.html
robots.txt · sitemap.xml · site.webmanifest · _headers · .htaccess
css/
  main.css                 ← ÍNDICE dos módulos (fonte); importa tudo em camadas (@layer)
  site.css                 ← GERADO por scripts/build-css.js — não editar
  settings/tokens.css      ← cores, tipografia, espaços, bordas, sombras, breakpoints
  base/                    ← fontes, reset, tipografia base, comportamentos globais
  layout/                  ← container, section, grids (.grid, .split, .stack, .cluster)
  components/              ← button, eyebrow/badge, section-heading, card, media, form,
                             brand, header (topbar + navbar), footer, floating,
                             product-card, lightbox
  sections/                ← um arquivo por seção (hero, trust, locacao, venda, equipamentos,
                             eventos, sobre, atendimento, faq, contato)
  utilities/               ← utilitários pontuais (vencem tudo)
  styleguide.css           ← só para styleguide.html
js/
  config.js                ← WhatsApp, e-mail, Instagram e horário (fonte única)
  data/equipamentos.js     ← CATÁLOGO: cadastro dos equipamentos (editar aqui)
  modules/contact.js       ← preenche links de contato; links externos abrem em nova aba
  modules/header.js        ← sombra do header ao rolar
  modules/nav.js           ← gaveta do menu mobile + link ativo por seção
  modules/catalog.js       ← monta os cards do catálogo a partir dos dados
  modules/lightbox.js      ← visualização ampliada (qualquer link data-lightbox)
  modules/contact-form.js  ← formulário de contato que abre o WhatsApp
  modules/floating.js      ← oculta o botão flutuante perto de outros botões de WhatsApp
  modules/motion.js        ← pausa animações decorativas fora da tela
  main.js                  ← inicializa os módulos
scripts/
  build-css.js             ← junta os módulos de CSS em css/site.css
  definir-dominio.js       ← aplica o domínio real nas URLs absolutas
assets/
  fonts/                   ← Inter e Plus Jakarta Sans (woff2, licença OFL)
  favicon.svg, icons/      ← ícones (PROVISÓRIOS: monograma até o logo original)
  logo/                    ← logotipo do cliente (ver LEIA-ME.md; hoje é provisório)
  img/hero|locacao|galeria|sobre ← fotos PROVISÓRIAS do Unsplash (ver CREDITOS.md)
  img/equipamentos/        ← fotos do catálogo + ilustração genérica
  img/og-image.jpg         ← imagem de compartilhamento (1200×630)
```

## CSS: módulos e build

O CSS é escrito em módulos pequenos, listados em `css/main.css`. Para publicação, eles são juntados num arquivo único, porque `@import` em cadeia atrasava a primeira pintura no celular em mais de 1 s.

1. Edite os módulos normalmente.
2. Rode `node scripts/build-css.js`.
3. Confira no navegador. `index.html`, `politica-de-privacidade.html` e `404.html` carregam o `css/site.css`.

O `styleguide.html` carrega o `css/main.css` direto, então mostra as mudanças sem build. É útil durante o desenvolvimento.

## Segurança e privacidade

- **Content-Security-Policy:** o site só carrega recursos de si mesmo, sem scripts, estilos ou fontes de terceiros. Por isso não use `style="…"` nem `<script>` inline no HTML: a CSP bloqueia. Use classes, como os utilitários `.object-y-*` para ajustar o recorte de imagens.
- **HTML não confiável:** o JS nunca usa `innerHTML` com dados; textos entram por `textContent`.
- **Formulário:** não há backend. O formulário só monta a mensagem e abre o WhatsApp, e nada é enviado ou armazenado. Isso elimina spam e vazamento de dados pelo site. **Se um dia houver envio a servidor**, valide tudo no servidor, adicione proteção anti-spam (honeypot e limite de taxa), atualize a política de privacidade e libere o domínio do endpoint em `connect-src` / `form-action`.
- **Sem cookies, analytics ou rastreamento.** Fontes locais, então nenhum dado do visitante vai para o Google ao carregar a página.

## Convenções

- **Tokens sempre.** Componentes não usam cor, espaço ou sombra soltos. Usam apenas as variáveis `--color-*`, `--space-*`, `--shadow-*` etc. de `tokens.css`.
- **Contraste AA.** Os tokens de texto (`--neutral-500`, `--sky-600`) foram ajustados para pelo menos 4,5:1 sobre todos os fundos claros. Ao criar combinações novas, confira o contraste.
- **Camadas de cascata.** A ordem é `settings → base → layout → components → sections → utilities`. Uma camada posterior vence a anterior.
- **Mobile-first.** Media queries em 480 / 768 / 1024 / 1280 / 1536px. O menu vira horizontal a partir de 1024px.
- **Nomes de classe** no padrão BEM: `.bloco`, `.bloco__elemento`, `.bloco--variacao`. Estados usam `.is-*`.
- **Imagens:** sempre com `width`/`height` (evita deslocamento de layout), `loading="lazy"` fora da primeira dobra, WebP com `srcset` e `alt` descritivo. Fotos decorativas levam `alt=""`.
- **Animações:** respeitam `prefers-reduced-motion`. Animações contínuas decorativas levam `data-anim`, para pausar fora da tela.
- **Links em nova aba:** use `data-whatsapp` / `data-instagram`. O `contact.js` aplica `rel="noopener"` e o aviso "(abre em nova aba)" para leitores de tela.
- **Ícones:** vêm do sprite SVG inline no topo do `index.html`, no formato `<svg class="icon"><use href="#i-nome"></use></svg>`. O sprite está duplicado no `styleguide.html`; mantenha os dois iguais.
- **`TROCAR AQUI`** marca conteúdo provisório.

## Navegação

O menu tem os itens Início, Locação, Equipamentos, Eventos, Sobre nós e Contato. Cada `href="#id"` aponta para uma `<section id="id">` do `<main>`.

- **Destaque do menu:** o link da seção visível fica destacado (`.is-active` + `aria-current="location"`). Nas seções fora do menu (Venda, Área de atendimento, FAQ), nenhum link fica ativo.
- **Gaveta do celular:** com ela aberta, o foco fica preso dentro dela, e o resto da página recebe `inert`, por meio dos elementos marcados com `data-menu-inert`.
- **Novo item no menu:** acrescente um `<li>` em `.nav__list` e uma `<section>` com o mesmo `id`. Atualize também o rodapé e o `sitemap.xml`, caso seja uma página nova.

## Catálogo de equipamentos

Os cards são gerados a partir de [js/data/equipamentos.js](js/data/equipamentos.js). Para cadastrar um modelo:

1. Coloque a foto em `assets/img/equipamentos/`. Prefira fundo claro, formato quadrado, 1200×1200 px, em WebP.
2. No arquivo de dados, preencha `nome`, `descricao`, `modalidades`, `imagem` e `imagemAlt`.
3. Em `especificacoes`, inclua **só características confirmadas pelo cliente**.
4. Troque `placeholder: true` por `false`.

O botão de cada card abre o WhatsApp com o nome e a referência do equipamento. O filtro Todos / Locação / Venda aparece sozinho quando algum item tiver `modalidades`.

## Como adicionar uma seção

1. Em `index.html`, crie a `<section>` usando os componentes existentes.
2. Se precisar de estilos próprios, crie `css/sections/<nome>.css`, adicione o `@import` em `css/main.css` e rode o build do CSS.
3. Se a seção tiver comportamento próprio, crie `js/modules/<nome>.js`, inclua o `<script defer>` antes do `main.js` e chame o `init()` no `main.js`.

## Logotipo

O logo atual é um **espaço reservado**. O arquivo original deve entrar em `assets/logo/`, sem alterações (ver [assets/logo/LEIA-ME.md](assets/logo/LEIA-ME.md)). Com ele em mãos, gere também o favicon e os ícones de `assets/icons/`, e refaça a `assets/img/og-image.jpg`.
