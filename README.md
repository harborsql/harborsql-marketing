# HarborSQL Marketing Site

Static marketing website for HarborSQL.

Open `index.html` in a browser to view the landing page. Open `benchmarks.html`
for the benchmark page.

## Vercel

Deploy this repository as the `harborsql.com` Vercel project. It is a static
site with no build command.

`vercel.json` enables clean URLs and redirects `/docs` traffic to
`https://docs.harborsql.com`.

Deploy `../harborsql-docs` as a separate Vercel project for
`docs.harborsql.com`.

Logo assets live in `logo.svg` and `logos/`. Open `logo-showcase.html` to review
the six design variants, primary wordmark, and 1024px PNG export.

The benchmark numbers are drawn from sibling repository docs and artifacts:

- `../harborsql/README.md`
- `../harborsql-bench/results/harborsql/i3.2xlarge/v0.1.2/manifest.json`
- `../harborsql-bench/results/harborsql/i3.2xlarge/v0.1.2/clickbench/optimized.json`
- `../harborsql-bench/results/databricks-sql-warehouse/2xs/v2026.10/clickbench/databricks-2xs-aws-ec2-t3.small-clickbench-20260510T152626Z.json`
- `../harborsql-bench/docs/benchmark-instance-costs.md`
- `../harborsql-bench/docs/benchmark-cost-analysis.md`
