// jenkins流水线

pipeline {
    agent any

    environment {
            // Gitee仓库配置
            GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
            GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
            BRANCH = 'master'

            // Node.js配置
            NODE_VERSION = '16'  // 推荐使用Node 16或18
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "设置Node.js环境 (v${env.NODE_VERSION})"
                    // 使用nvm或n来管理Node版本
                    bat '''
                        @echo off
                        rem 安装nvm-windows
                        curl -L -o nvm-setup.exe https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe
                        start /wait nvm-setup.exe /S
                        set NVM_HOME="%ProgramFiles%\nvm"
                        set PATH="%NVM_HOME%;%PATH%"
                        nvm install %NODE_VERSION%
                        nvm use %NODE_VERSION%
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
                    sh 'npm run docs:build'  // 使用npm执行构建命令
                }
            }
        }

        // 阶段5：部署
        stage('Deploy') {
            steps {
                script {
                    echo '部署静态文件...'
                    // 这里提供几种常见的部署方式示例

                    // 选项1：使用rsync部署到远程服务器（请替换实际用户、服务器和路径）
                    sh '''
                        # 删除旧版本文件
                        rm -rf /www/wwwroot/clear-blog/*
                        # 复制新版本构建产物
                        cp -r ./docs/.vitepress/dist/* /www/wwwroot/clear-blog/
                    '''

                    // 选项2：使用SSH部署
                    // sshPublisher(
                    //     publishers: [
                    //         sshPublisherDesc(
                    //             configName: 'your-ssh-server',
                    //             transfers: [
                    //                 sshTransfer(
                    //                     sourceFiles: 'dist/**',
                    //                     removePrefix: 'dist',
                    //                     remoteDirectory: '/var/www/html'
                    //                 )
                    //             ]
                    //         )
                    //     ]
                    // )

                    // 选项3：存档构建产物供后续使用
                    archiveArtifacts artifacts: 'dist/**', fingerprint: true

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