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
  stage('Setup env') {
    sh '''
      cp .env.example .env
      echo SKIP_ENV_VALIDATION=1 >> .env
    '''
  stage('Test with coverage') {
    sh '''
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