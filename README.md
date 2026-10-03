# Music Farming Race

Recriação do relatório Power BI em HTML/CSS/JavaScript para GitHub Pages, com histórico e fotos locais. Sem dependências de produção e sem licença do Power BI.

## Rodar localmente

Requer Node.js 22 ou posterior:

```sh
npm test
npm run build
npm run dev
```

Abra http://127.0.0.1:4173. A pasta publicada é `dist/`.

## Dados e atualização diária

Importação inicial de 02/10/2026: **7.952 registros, 100 artistas e 3 ouvintes**, preservados em `data/history.json`. Os CSVs originais ficam em `data/` para auditoria.

O workflow `.github/workflows/pages.yml` executa às **03h17 de São Paulo (06h17 UTC)**. Também pode ser iniciado em Actions → Daily listening and GitHub Pages → Run workflow.

- Gera 6 rodadas, 1–6 registros por ouvinte por rodada e 1–15 minutos por registro, usando as mesmas listas de artistas do Apps Script.
- Usa `America/Sao_Paulo` e datas com ano completo.
- Uma data já importada ou gerada não é sorteada novamente.
- Gera apenas o dia da execução, como o script original; dias de eventual pausa não são preenchidos retroativamente.
- Salva o histórico em um commit antes de publicar. Se a publicação falhar, repetir a execução não duplica dados.
- Não consulta nem altera as planilhas após a importação. O gatilho antigo do Apps Script pode ser desativado no Google; se continuar ativo, modifica apenas as planilhas antigas, sem interferir neste site.

O GitHub pode atrasar execuções agendadas e desabilitar agendamentos em repositórios públicos sem atividade por 60 dias. A data de atualização aparece no rodapé. Documentação: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule

## Publicação

Repositório: `gabrieldelvaje/bi_music_garming_race`. Em Settings → Pages → Build and deployment, use **GitHub Actions**. A branch de produção é `main`.

O workflow executa testes, gera o site e publica com as ações oficiais do GitHub Pages. As permissões necessárias estão declaradas nele. Não é necessário instalar pacotes, fornecer chaves ou manter um computador ligado.

## Telas e regras

- **Last Week Recap:** minutos da semana anterior, campeão, comparação com duas semanas atrás, gêneros, histórico semanal e rankings.
- **This Week Partial:** total, líder, projeção, gêneros, últimos sete dias encerrados ontem e rankings.
- **Deep Dive:** filtros por semana, gênero, artista e ouvinte; foto do ouvinte líder histórico; participação dos artistas e semanas no topo.
- Fundos e fotos originais; em celular, os painéis se reorganizam verticalmente.
- Semanas de segunda a domingo com **ontem** como referência, conforme `dm_calendar`. Na segunda-feira, a parcial ainda se refere à semana encerrada no domingo.
- Deep Dive exclui hoje. Projeção do vencedor usa dados até ontem. Projeção de minutos considera até hoje, limitada às datas disponíveis.
- Rankings densos: 1, 1, 2 em caso de empate. Vitórias semanais contam os empatados no primeiro lugar com minutos positivos.
- As exclusões de interação `NoFilter` vêm do relatório original (`src/report.json`). Por isso certos filtros afetam apenas alguns visuais. Ctrl/Cmd + clique permite selecionar vários elementos em gráficos e tabelas.
- As abas têm links próprios: `#last`, `#this`, `#deep`.

Os visuais são reimplementações em HTML/CSS/SVG, sem incorporar o Power BI. A renderização de gráficos e tipografia pode variar em relação ao motor do Power BI.

## Arquivos

- `data/history.json`: histórico persistente e dimensões.
- `src/model.mjs`: datas, rankings, totais e vitórias.
- `src/app.mjs`: interface e filtros.
- `public/assets/`: fundos e fotos locais.
- `scripts/daily.mjs`: sorteio diário idempotente.
- `scripts/build.mjs`: validação e geração de `dist/`.
- `scripts/import.mjs` e `scripts/assets.mjs`: ferramentas da migração inicial; dependem das pastas originais externas. **Não executar a importação novamente em produção**, pois ela substitui o histórico.

## Testes

`npm test` confere os limites do sorteio, repetição de datas, fuso, viradas de semana e ano, empates, vitórias e integridade do histórico. A prévia foi conferida em navegador desktop e mobile, com as três abas e filtros de semana, gênero, artista e ouvinte.
