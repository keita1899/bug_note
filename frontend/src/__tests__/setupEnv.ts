import { loadEnvConfig } from '@next/env'

const setupEnv = async (): Promise<void> => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}

export default setupEnv
