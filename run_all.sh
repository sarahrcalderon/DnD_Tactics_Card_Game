echo "========================================="
echo "   D&D TACTICS CARD GAME"
echo "========================================="
echo ""
echo " Iniciando todos os serviços..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

BACKEND_DIR="$PROJECT_ROOT/backend"
LAUNCHER_DIR="$PROJECT_ROOT/launcher"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
VENV_DIR="$PROJECT_ROOT/venv"

print_status() { echo -e "${BLUE}${NC} $1"; }
print_success() { echo -e "${GREEN}${NC} $1"; }
print_error() { echo -e "${RED}${NC} $1"; }
print_warning() { echo -e "${YELLOW}${NC} $1"; }

print_title() {
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check_dependencies() {
    print_title " VERIFICANDO DEPENDÊNCIAS"
    
    if command -v python &> /dev/null; then
        print_success "Python encontrado: $(python --version 2>&1)"
    else
        print_error "Python não encontrado!"
        exit 1
    fi
    
    if command -v node &> /dev/null; then
        print_success "Node.js encontrado: $(node --version)"
    else
        print_error "Node.js não encontrado!"
        exit 1
    fi
    
    if command -v npm &> /dev/null; then
        print_success "npm encontrado: $(npm --version)"
    else
        print_error "npm não encontrado!"
        exit 1
    fi
}

activate_venv() {
    print_title " ATIVANDO AMBIENTE VIRTUAL"
    
    if [ -d "$VENV_DIR" ]; then
        print_status "VenV encontrado em: $VENV_DIR"
        
        cd "$PROJECT_ROOT"
        
        if [ -f "$VENV_DIR/Scripts/activate" ]; then
            source "$VENV_DIR/Scripts/activate" 2>/dev/null
            if [ -n "$VIRTUAL_ENV" ]; then
                print_success "Ambiente virtual ativado: $VIRTUAL_ENV"
            else
                print_warning "Falha ao ativar venv. Tentando recriar..."
                rm -rf "$VENV_DIR"
                python -m venv "$VENV_DIR"
                source "$VENV_DIR/Scripts/activate" 2>/dev/null
                print_success "VenV recriado e ativado!"
            fi
        else
            print_warning "Arquivo de ativação não encontrado. Criando novo venv..."
            rm -rf "$VENV_DIR"
            python -m venv "$VENV_DIR"
            source "$VENV_DIR/Scripts/activate" 2>/dev/null
            print_success "VenV criado e ativado!"
        fi
    else
        print_warning "Ambiente virtual não encontrado. Criando..."
        python -m venv "$VENV_DIR"
        source "$VENV_DIR/Scripts/activate" 2>/dev/null
        print_success "VenV criado e ativado!"
    fi
    
    cd "$PROJECT_ROOT"
}

install_backend_deps() {
    print_title " INSTALANDO DEPENDÊNCIAS DO BACKEND"
    
    cd "$BACKEND_DIR"
    
    print_status "Instalando pygame..."
    pip install pygame --force-reinstall -q
    
    if [ -f "requirements.txt" ]; then
        print_status "Instalando dependências do requirements.txt..."
        pip install -r requirements.txt -q
        print_success "Dependências do backend instaladas!"
    else
        print_warning "requirements.txt não encontrado. Instalando dependências padrão..."
        pip install fastapi uvicorn websockets python-dotenv -q
        print_success "Dependências instaladas!"
    fi
}

install_launcher_deps() {
    print_title " INSTALANDO DEPENDÊNCIAS DO LAUNCHER"
    
    cd "$LAUNCHER_DIR"
    
    if [ -f "package.json" ]; then
        print_status "Instalando dependências do launcher..."
        npm install --silent
        
        if ! grep -q '"dev"' package.json; then
            print_warning "Script 'dev' não encontrado. Adicionando..."
            node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json','utf8')); pkg.scripts=pkg.scripts||{}; pkg.scripts.dev='vite'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));" 2>/dev/null || echo "⚠️ Node não encontrado, adicione manualmente: \"dev\": \"vite\""
            print_success "Script 'dev' adicionado!"
        fi
        
        print_success "Dependências do launcher instaladas!"
    else
        print_error "package.json não encontrado em: $LAUNCHER_DIR"
        exit 1
    fi
}

install_frontend_deps() {
    if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
        print_title " INSTALANDO DEPENDÊNCIAS DO FRONTEND"
        cd "$FRONTEND_DIR"
        print_status "Instalando dependências do frontend..."
        npm install --silent
        print_success "Dependências do frontend instaladas!"
    fi
}

start_services() {
    print_title " INICIANDO SERVIÇOS"
    
    # ============================================================
    # BACKEND API (FastAPI)
    # ============================================================
    
    print_status "Iniciando backend API (FastAPI)..."
    cd "$BACKEND_DIR"
    
    # Verifica se o uvicorn está instalado
    python -c "import uvicorn" 2>/dev/null
    if [ $? -ne 0 ]; then
        print_warning "Uvicorn não encontrado. Instalando..."
        pip install uvicorn -q
    fi
    
    # Inicia a API FastAPI
    uvicorn api.server:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    print_success "Backend API iniciado (PID: $BACKEND_PID) - http://localhost:8000"
    sleep 3
    
    
    print_status "▶ Iniciando launcher (React/Vite)..."
    cd "$LAUNCHER_DIR"
    
    if ! grep -q '"dev"' package.json; then
        print_warning "Script 'dev' não encontrado. Adicionando..."
        node -e "const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json','utf8')); pkg.scripts=pkg.scripts||{}; pkg.scripts.dev='vite'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));" 2>/dev/null
        print_success "Script 'dev' adicionado!"
    fi
    
    npm run dev &
    LAUNCHER_PID=$!
    print_success "Launcher iniciado (PID: $LAUNCHER_PID) - http://localhost:3000"
    

    # print_status " Pygame Launcher disponível em: python main.py"
    
    
    if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
        print_status " Iniciando frontend (React/Vite)..."
        cd "$FRONTEND_DIR"
        
        if ! grep -q '"dev"' package.json; then
            print_warning "Script 'dev' não encontrado no frontend. Pulando..."
        else
            npm run dev &
            FRONTEND_PID=$!
            print_success "Frontend iniciado (PID: $FRONTEND_PID) - http://localhost:3001"
        fi
    else
        print_warning "Frontend não encontrado - pulando..."
    fi
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   TODOS OS SERVIÇOS INICIADOS!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN} URLs:${NC}"
    echo -e "   ${YELLOW}Backend API:${NC}  http://localhost:8000"
    echo -e "   ${YELLOW}Launcher:${NC}     http://localhost:3000"
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "   ${YELLOW}Frontend:${NC}     http://localhost:3001"
    fi
    echo ""
    echo -e "${CYAN} Comandos manuais:${NC}"
    echo -e "   ${YELLOW}Backend API:${NC}  cd backend && uvicorn api.server:app --reload"
    echo -e "   ${YELLOW}Pygame:${NC}       cd backend && python main.py"
    echo -e "  ${YELLOW}Launcher:${NC}     cd launcher && npm run dev"
    echo ""
    echo -e "${RED}  Pressione CTRL+C para parar todos os serviços${NC}"
    echo ""
    
    if [ -n "$FRONTEND_PID" ]; then
        wait $BACKEND_PID $LAUNCHER_PID $FRONTEND_PID
    else
        wait $BACKEND_PID $LAUNCHER_PID
    fi
}

cleanup() {
    echo ""
    echo -e "${YELLOW}Parando todos os serviços...${NC}"
    
    kill $BACKEND_PID 2>/dev/null && echo -e "  ${GREEN}✅ Backend API parado${NC}"
    kill $LAUNCHER_PID 2>/dev/null && echo -e "  ${GREEN}✅ Launcher parado${NC}"
    [ -n "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null && echo -e "  ${GREEN}✅ Frontend parado${NC}"
    
    deactivate 2>/dev/null
    echo -e "${GREEN} Todos os serviços parados!${NC}"
    exit 0
}

main() {
    trap cleanup SIGINT SIGTERM
    
    clear
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                          ║${NC}"
    echo -e "${PURPLE}║           D&D TACTICS CARD GAME                          ║${NC}"
    echo -e "${PURPLE}║                                                          ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_dependencies
    activate_venv
    install_backend_deps
    install_launcher_deps
    install_frontend_deps
    start_services
}

main