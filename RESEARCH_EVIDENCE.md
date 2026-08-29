# Evidence log for Martin's Research Field Guide

Checked: August 29, 2026

This log records the public evidence behind the guide. It separates three kinds of evidence:

- A **field report** shows that a person says they used a workflow.
- A **public project** shows that code, instructions, or artifacts can be inspected.
- A **research result** would show that the workflow improves learning or research quality under a credible evaluation.

Most evidence available today is in the first two categories. The guide does not present an anecdote, star count, or polished demo as proof of research validity.

## How the cases were selected

We searched Reddit, X, and GitHub for combinations of Codex with research, papers, Zotero, RStudio, experiments, qualitative coding, literature review, citations, Obsidian, and reproducibility. We prioritized records that included at least two of the following:

1. A named task rather than a general opinion.
2. A visible sequence of actions.
3. A durable artifact such as a repository, notebook, evidence table, or progress log.
4. A limitation, failure, or human correction.
5. A public project that makes the workflow inspectable.

Short social posts were kept only when they contributed a specific, transferable workflow. Builder posts are labeled as creator reports. GitHub activity is a maintenance snapshot, not a quality score.

## Field reports used in the guide

| Record | What is directly supported | Why it matters | Important limit |
|---|---|---|---|
| [Get It builder report on Reddit](https://www.reddit.com/r/LLMDevs/comments/1u0kod6/opensource_desktop_app_using_codex_cli_as_the_llm/) and [public repository](https://github.com/beltromatti/get-it) | A student team built a Codex CLI study app for dense PDFs with concept extraction, source links, flashcards, quizzes, and Feynman-style practice. | It is a concrete example of Codex turning documents into inspectable learning artifacts. | The builders report on their own project. The repository confirms the workflow, not its learning effect. |
| [Graduate researcher using agents in RStudio](https://www.reddit.com/r/RStudio/comments/1rus9vj/i_gave_claude_code_codex_shared_access_to_a/) | A graduate researcher gave Codex and Claude Code a shared R environment and a known experimental dataset, required exploratory analysis and diagnostics, and compared their work with prior findings. | The report includes a consequential failure: one analysis needed a human correction for multiple comparisons, after which a claimed significant result became null. | One field test cannot establish comparative model performance or generalize to other analyses. |
| [zotero-use creator report](https://www.reddit.com/r/zotero/comments/1tl3mo5/zotero_skill_for_codex_and_other_agents/) and [public repository](https://github.com/drguptavivek/zotero-use) | The creator describes building the skill around an 8 GB Zotero library and using it in two papers. The repository documents source retrieval, evidence review, and live Zotero citation fields in manuscripts. | It shows how a reference manager can remain the source of truth while Codex works with the library. | It is a creator report. Begin with read-only access and verify every citation. |
| [ATA builder report](https://www.reddit.com/r/codex/comments/1rem9ai/we_forked_codex_cli_and_turned_it_into_a_full/) and [public repository](https://github.com/Agents2AgentsAI/ata) | A robotics and machine-learning team describes connecting Codex to Semantic Scholar, arXiv, OpenAlex, citation graphs, Zotero notes, paper comparison, and evolving research documents. | It demonstrates an end-to-end literature workspace instead of a single prompt. | It is self-promotional and does not independently evaluate research quality. |
| [Codex CLI Research Mode report](https://www.reddit.com/r/OpenAI/comments/1nkeifi/codexcli_research_mode/) | A user added long-run support, context continuation, notifications, and `PROGRESS.md`, then ran data checks and multiple model experiments for eight hours. | It shows why durable logs and resumable work matter for experiments. | The target metric was not reached, and open-ended metric chasing can encourage overfitting without a fixed test plan. |
| [Niels Rogge's X report](https://x.com/NielsRogge/status/2041556496320700626), [primary write-up](https://huggingface.co/blog/nielsr/ocr-papers-jobs), and [arxiv-ocr repository](https://github.com/NielsRogge/arxiv-ocr) | Rogge reports using Codex Desktop and a reusable skill to create, benchmark, monitor, and repair an OCR pipeline for about 30,000 arXiv papers. The pipeline and resulting corpus are public. | It is a rare large-scale, reproducible example of Codex supporting source acquisition and corpus preparation. | The run cost roughly $850 and used GPUs. OCR output still requires checks for lost figures, equations, tables, and page fidelity. |
| [Axton Liu's X report](https://x.com/AxtonLiu/status/2038753399865544778) and [ai-pair repository](https://github.com/axtonliu/ai-pair) | Liu reports giving the same article to three model roles. Codex reviewed the logic chain paragraph by paragraph while other roles focused on argument and editorial quality. | It demonstrates a narrow, inspectable role for Codex in a multi-pass writing review. | Model agreement is not independent evidence. The experimental project warns that an agent may imitate a reviewer instead of invoking the intended tool. |
| [Open Scholar Skill](https://github.com/joshzyj/open-scholar-skill) | The project documents systematic review, qualitative coding, inter-coder reliability, claim-faithfulness review, and replication packages. It includes an education example involving thematic coding of parent interviews about school choice. | It is the strongest public education and social-science fit found in this search. | The project began with Claude-oriented workflows, has a noncommercial academic license, and still requires ethics and method review when used through Codex. |

## Additional reports checked

These informed the cautions and stage map but are not all featured as cards:

- [Direct-source search with a methodology and QA harness](https://www.reddit.com/r/codex/comments/1sqk7xj/comment/oh8r9ar/) and its [follow-up](https://www.reddit.com/r/codex/comments/1sqk7xj/comment/ohf1r4p/). The team describes direct-source APIs, domain criteria, filtering, comparison, cross-validation, verified-source requirements, Skills, MCP, and RAG. The proprietary harness limits reproducibility.
- [Discrete research subagents](https://www.reddit.com/r/codex/comments/1sqk7xj/comment/ohaa01a/). A user describes separate roles for web scraping, intake, and cataloging. There is no public implementation or evaluation.
- [LLM for Zotero](https://www.reddit.com/r/zotero/comments/1tokym3/i_built_a_plugin_to_allow_you_to_use_codex_claude/) and its [repository](https://github.com/yilewang/llm-for-zotero). It supports Codex app-server access inside Zotero, library questions, notes, figures, tagging, and custom skills. User comments report regular use, but setup reports are mixed.
- [Bioinformatics Skill Graph](https://www.reddit.com/r/genomics/comments/1skwl5l/we_created_an_opensource_knowledge_graph_of/) and its [repository](https://github.com/variomeanalytics/bioinformatics-agent-skills). A domain specialist describes method selection from literature-linked procedures. Community comments raise questions about polish and validation.
- [Reddit customer-research skill](https://www.reddit.com/r/AI_Agents/comments/1viq7y9/i_replaced_a_fairly_complex_reddit_research_agent/) and its [repository](https://github.com/haseebeqx/reddit-pain-research-skill). It is a concrete qualitative discovery pipeline with URL verification, deduplication, clustering, structured artifacts, and human approval. It is market research, so academic transfer requires documented sampling and platform-bias limits.
- [Biomedical research interruption](https://www.reddit.com/r/codex/comments/1ujwsmo/codex_has_become_unusable_for_biomedical_research/). A biomedical researcher reports safety refusals interrupting bioinformatics work. It is an anecdotal negative case, but it supports having a fallback plan.

## Public projects mapped to research stages

| Stage | Project | Inspectable contribution | Main caution |
|---|---|---|---|
| Frame | [ARS-Codex](https://github.com/Imbad0202/academic-research-skills-codex) | Socratic narrowing, question convergence, protocol and human checkpoints. | Noncommercial license. A workflow suite does not choose the research purpose for you. |
| Frame and qualitative analysis | [Open Scholar Skill](https://github.com/joshzyj/open-scholar-skill) | Social-science question framing, coding, reliability, verification, and replication workflows. | Use selected skills with Codex rather than installing competing top-level suites at once. Review license and data safety. |
| Discover | [GPT Researcher](https://github.com/assafelovic/gpt-researcher) | Planner, subquestions, web source gathering, source-tracked reports, and a Codex plugin plus MCP skill. | Web discovery does not prove systematic database coverage. |
| Discover and synthesize | [ATA](https://github.com/Agents2AgentsAI/ata) | Academic indexes, citation graphs, paper comparison, Zotero annotations, knowledge cards, and evolving documents. | Small builder-led project. Inspect maintenance and permissions before use. |
| Organize | [Zotero MCP](https://github.com/cookjohn/zotero-mcp) | Library, collection, metadata, annotation, full-text, and semantic search tools. | Start read-only. Hosted embeddings may send text outside the local machine. |
| Organize and write | [zotero-use](https://github.com/drguptavivek/zotero-use) | Retrieval from Zotero plus manuscript work with live citation fields. | Verify source-to-sentence support, not only citation formatting. |
| Read | [Microsoft MarkItDown](https://github.com/microsoft/markitdown) | Converts PDFs, Office files, images, HTML, and other formats into LLM-friendly Markdown. | It is optimized for text access, not faithful page rendering. Check tables, columns, and locators. |
| Read and synthesize | [PaperQA2](https://github.com/Future-House/paper-qa) | Searches a document set, gathers passages, and returns cited answers. | Use it after screening a corpus. Retrieval can miss relevant passages. |
| Analyze | [OpenAI Data Analytics plugin](https://github.com/openai/plugins/tree/main/plugins/data-analytics) | Notebook, data-quality, validation, visualization, and reporting instructions. | Business-oriented examples need adaptation to academic method and ethics. |
| Analyze | [Jupyter MCP Server](https://github.com/datalayer/jupyter-mcp-server) | Reads, edits, and executes notebook cells while preserving code and outputs. | It can execute code and shell actions. Limit access and never expose private participant data casually. |
| Challenge | [ARS-Codex](https://github.com/Imbad0202/academic-research-skills-codex) and [Open Scholar Skill](https://github.com/joshzyj/open-scholar-skill) | Simulated review, claim checks, code review, citation review, and reproducibility checks. | A simulated reviewer is not an independent scholar, statistician, or ethics board. |
| Write and share | [Quarto CLI](https://github.com/quarto-dev/quarto-cli) and [Quarto Actions](https://github.com/quarto-dev/quarto-actions) | Keeps prose, citations, code, tables, and figures in one reproducible source and can render it automatically. | Pin dependencies and exclude private data, credentials, and licensed source files before publishing. |

## A reproducible folder contract

```text
research-project/
├── protocol/          question, inclusion rules, search plan
├── search/            dated queries and database exports
├── library/           Zotero export and source manifest
├── extraction/        page-aware source notes
├── evidence/          evidence matrix and screening decisions
├── analysis/          notebooks, scripts, codebooks, diagnostics
├── manuscript/        report source and bibliography
├── outputs/           rendered report, tables, figures
└── research-log.md    decisions, failures, changes, open questions
```

A search-agent report belongs in the candidate-source stage. It is not the final evidence base. Every synthesis sentence should trace to one or more accepted evidence rows, and every analysis claim should trace to a preserved output.

## Limits of this scan

- Social platforms favor unusual, polished, or promotional stories. Quiet failures and ordinary use are less visible.
- Identity, dates, and claims in community posts were not independently audited beyond the linked public record.
- X pages were less consistently accessible than Reddit and GitHub. The featured X cases were retained only when an indexed post could be corroborated with a public repository, write-up, or output artifact.
- Repository stars and recent commits are rough maintenance signals. They do not measure accuracy, safety, pedagogy, or methodological quality.
- Projects can change after this snapshot. Read the current README, license, issues, data flow, permissions, and release history before installing anything.
- Education research may involve students, children, interviews, school records, or protected data. Institutional policy, consent, ethics review, and applicable law take priority over convenience.
