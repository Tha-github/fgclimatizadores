# Logotipo

O `logo.svg` desta pasta é **provisório**. Ele só reserva o espaço até chegar o arquivo original do cliente.

## Ao receber o logotipo original

1. Salve o arquivo aqui. Prefira SVG; se não houver, use PNG com fundo transparente e pelo menos 2× a altura exibida, ou seja, no mínimo 104 px de altura.
2. Use o nome `logo.svg`, ou troque o `src` das duas tags `<img class="brand__logo">` no `index.html`. Uma fica no header e a outra no footer.
3. Se o cliente tiver uma **versão negativa oficial** (para fundo escuro), salve como `logo-negativo.svg`. Depois use essa versão no footer e remova a classe `brand--plate`.

## Regras de preservação

- O logotipo é usado exatamente como foi entregue. **Não** aplicar filtros, recolorir, distorcer, cortar nem adicionar efeitos.
- No CSS, só a **altura** é controlada (`--logo-height` em `css/settings/tokens.css`). A largura acompanha a proporção original.
- Sobre fundo escuro, sem versão negativa oficial, o logo fica sobre uma placa branca (`.brand--plate`). Ele nunca é invertido.
