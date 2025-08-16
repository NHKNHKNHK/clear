pipeline {
    agent any

    environment {
        // Gitee仓库配置
        GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
        GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
        BRANCH = 'master'
        NODE_VERSION = '20'
        NVM_DIR = "${env.HOME}/.nvm"
        // 添加构建产物目录变量
        BUILD_OUTPUT_DIR = "${env.WORKSPACE}/.vitepress/dist"
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "设置Node.js环境 (v${env.NODE_VERSION})"
                    sh '''#!/bin/bash
                        # 安装nvm（如果尚未安装）
                        if [ ! -d "$NVM_DIR" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        fi
                        
                        # 确保nvm脚本可执行
                        [ -s "$NVM_DIR/nvm.sh" ] && chmod +x "$NVM_DIR/nvm.sh"
                        
                        # 加载nvm环境
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        
                        # 安装并使用Node.js
                        nvm install ${NODE_VERSION} || true
                        nvm use ${NODE_VERSION}
                        
                        # 全局安装pnpm
                        npm install -g pnpm
                        
                        # 验证安装
                        echo "Node.js版本: $(node -v)"
                        echo "npm版本: $(npm -v)"
                        echo "pnpm版本: $(pnpm -v)"
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

        stage('Install Dependencies') {
            steps {
                script {
                    echo '安装项目依赖...'
                    sh '''#!/bin/bash
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        pnpm install
                    '''
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo '构建VitePress项目...'
                    sh '''#!/bin/bash
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        pnpm run docs:build
                        
                        # 验证构建产物
                        echo "构建产物路径: ${env.BUILD_OUTPUT_DIR}"
                        ls -la "${env.BUILD_OUTPUT_DIR}"
                    '''
                }
            }
        }

    }
    
    post {
        success {
            echo 'VitePress项目构建部署成功！'
            script {
                sh '''#!/bin/bash
                    echo "验证部署目录内容:"
                    ls -la "${BUILD_OUTPUT_DIR}"
                    echo "部署完成！"
                '''
            }
        }
        failure {
            echo '构建失败！'

        }
    }
}