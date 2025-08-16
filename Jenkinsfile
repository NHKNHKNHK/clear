// jenkins流水线

pipeline {
    agent any

    environment {
            // Gitee仓库配置
            GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
            GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
            BRANCH = 'master'

            // Node.js配置
            NODE_VERSION = '20'  // 使用系统已有Node.js 20环境
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "设置Node.js环境 (v${env.NODE_VERSION})"
                    // 使用nvm或n来管理Node版本
                    sh '''
                        # 安装nvm
                        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        # 加载nvm环境
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && ./ "$NVM_DIR/nvm.sh"
                        # 安装Node.js 20
                        nvm install 20
                        # 使用Node.js 20
                        nvm use 20
                        # 检查Node.js和npm版本
                        node -v
                        npm -v
                    '''
                }
            }
        }
        stage('Checkout') {
            steps {
                script {
                    echo "从Gitee仓库拉取代码: ${env.GITEE_REPO}"
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "${env.BRANCH}"]],
                        userRemoteConfigs: [[
                            url: "${env.GITEE_REPO}",
                            credentialsId: "${env.GITEE_CREDENTIALS_ID}"
                        ]]
                    ])
                }
            }
        }

        // 阶段3：安装依赖
        stage('Install Dependencies') {
            steps {
                script {
                    echo '安装项目依赖...'
                    sh 'pnpm install'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    echo '构建VitePress项目...'
                    sh 'pnpm run docs:build'  // 使用pnpm执行构建命令
                }
            }
        }

        // 阶段5：部署
        stage('Deploy') {
            steps {
                script {
                    echo '部署静态文件...'
                    sh 'rm -rf /www/wwwroot/clear-blog/*'
                    sh 'ls'
                    sh 'cp -r .vitepress/dist/* /www/wwwroot/clear-blog/'
                    echo '部署完成！'
                }
            }
        }
    }
    post {
        success {
            echo 'VitePress项目构建部署成功！'
            // 可以添加成功通知
        }
        failure {
            echo '构建失败！'
            // 可以添加失败通知
        }
    }
}