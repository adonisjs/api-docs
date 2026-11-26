/**
 * Clones each package of "packages.json" into "packages/<name>" at the git
 * tag of its latest version on npm, and installs its dependencies. TypeDoc
 * then builds one website from all of them.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const names = JSON.parse(readFileSync('packages.json', 'utf8'))
rmSync('packages', { recursive: true, force: true })

for (const name of names) {
  const response = await fetch(`https://registry.npmjs.org/${name.replace('/', '%2f')}/latest`)
  if (!response.ok) throw new Error(`Cannot read ${name} from npm: ${response.status}`)
  const { version, repository } = await response.json()

  /**
   * npm can give the repository as an SSH URL. The build machine has no SSH
   * key, so always clone over HTTPS.
   */
  const slug = repository.url.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/)?.[1]
  if (!slug) throw new Error(`Cannot find the GitHub repository of ${name} in "${repository.url}"`)
  const repo = `https://github.com/${slug}`
  const tag = `v${version}`
  const dir = join('packages', name.split('/')[1])

  console.log(`${name}: ${repo} at ${tag}`)
  execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', tag, repo, dir], { stdio: 'inherit' })
  execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--silent'], { cwd: dir, stdio: 'inherit' })

  /**
   * The "typedoc.json" of a package can give a wrong "name" or a branch that
   * does not exist in "gitRevision". Use the name on npm, and link the
   * sources to the tag that was built.
   */
  const configPath = join(dir, 'typedoc.json')
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  config.name = name
  config.gitRevision = tag
  writeFileSync(configPath, JSON.stringify(config, null, 2))
}
