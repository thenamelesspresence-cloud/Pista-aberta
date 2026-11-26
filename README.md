# Pista Aberta — site de F1 em português de Portugal

Site estático (HTML + JSON). Sem frameworks nem dependências.

## Estrutura
- `site/index.html` — a página (contagem decrescente, calendário, notícias)
- `site/data/weekends.json` — fins de semana e horas das sessões (em UTC; o site mostra hora de Lisboa)
- `site/data/news.json` — notícias mostradas
- `site/data/feeds.json` — feeds RSS de onde vêm as notícias (podes acrescentar mais)
- `scripts/update.mjs` — atualiza o calendário (API Jolpica-F1) e as notícias (feeds)
- `.github/workflows/atualizar.yml` — corre o script de hora a hora e guarda as alterações

## Pôr online (grátis)
1. Cria um repositório no GitHub e envia estes ficheiros.
2. Em **Settings → Pages**, publica a partir da pasta `site` (ou liga o repositório ao Cloudflare Pages/Netlify com a pasta de publicação `site`).
3. Em **Actions**, corre uma vez "Atualizar dados" para testar. A partir daí atualiza sozinho.

## Testar no teu computador
```
cd site
python3 -m http.server 8000
```
Abre http://localhost:8000 (abrir o ficheiro diretamente não funciona, por causa do `fetch`).
Para atualizar os dados à mão: `node scripts/update.mjs`.

## Personalizar
Cores e tipos de letra estão no início do `<style>` do `index.html`. Para mudar fontes de notícias, edita `feeds.json`.
Pede-me alterações (equipa ou piloto favorito, novas secções, outro visual) e envia-me o ficheiro em causa; devolvo-o editado.
