node {
  def nodeHome = tool 'node22'
  env.PATH = "${nodeHome}/bin:${env.PATH}"

  stage('SCM') {
    checkout scm
  }
  stage('Install dependencies') {
    sh '''
      pnpm install
    '''
  }
  stage('Test with coverage') {
    sh '''
      export BUN_INSTALL="$HOME/.bun"
      export PATH="$BUN_INSTALL/bin:$PATH"
      pnpm test
    '''
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScanner';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}