pipeline {
    agent any

    environment {
        // Gitee仓库配置
        GITEE_REPO = 'https://gitee.com/ninghongkang/easy-interview'
        GITEE_CREDENTIALS_ID = 'your-gitee-credentials-id'
        BRANCH = 'master'
        NODE_VERSION = '20'
        NVM_DIR = "${env.HOME}/.nvm"
        // 添加部署目标目录变量
        DEPLOY_DIR = '/www/wwwroot/clear-blog'
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
                    // 确保nvm环境已加载
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
                    // 确保nvm环境已加载
                    sh '''#!/bin/bash
                        [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                        pnpm run docs:build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo '部署静态文件...'
                    sh '''#!/bin/bash
                        # 确保目标目录存在
                        mkdir -p "${DEPLOY_DIR}"
                        
                        # 清理目录
                        rm -rf "${DEPLOY_DIR}"/*
                        
                        # 复制构建产物
                        cp -r .vitepress/dist/* "${DEPLOY_DIR}"/
                        
                        # 修复权限（如果不需要sudo）
                        chown -R $(whoami):$(whoami) "${DEPLOY_DIR}" || true
                        chmod -R 755 "${DEPLOY_DIR}" || true
                        
                        echo '部署完成！'
                    '''
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